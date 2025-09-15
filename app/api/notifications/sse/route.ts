import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Set up SSE headers
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    };

    const stream = new ReadableStream({
      start(controller) {
        let isClosed = false;
        
        // Send initial connection message
        controller.enqueue(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to admin notifications' })}\n\n`);
        
        // Set up polling for new bookings
        const pollNotifications = async () => {
          if (isClosed) return;
          
          try {
            // Check for new bookings (created in the last 10 seconds)
            const recentBookings = await prisma.booking.findMany({
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 10000) // Last 10 seconds
                }
              },
              include: {
                client: {
                  select: {
                    name: true
                  }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 1
            });
            
            if (recentBookings.length > 0 && !isClosed) {
              const latestBooking = recentBookings[0];
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'new_booking', 
                message: 'NEW BOOKING CREATED',
                bookingId: latestBooking.id,
                clientName: latestBooking.client?.name || 'Unknown Client'
              })}\n\n`);
            }
          } catch (error) {
            console.error('Error polling notifications:', error);
            if (!isClosed) {
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'error', 
                message: 'Notification system error' 
              })}\n\n`);
            }
          }
        };
        
        // Poll every 3 seconds for more responsive notifications
        const interval = setInterval(pollNotifications, 3000);
        
        // Initial poll
        pollNotifications();
        
        // Clean up on disconnect
        const cleanup = () => {
          isClosed = true;
          clearInterval(interval);
          try {
            controller.close();
          } catch (e) {
            // Controller might already be closed
          }
        };
        
        req.signal.addEventListener('abort', cleanup);
      }
    });

    return new Response(stream, { headers });
    
  } catch (error) {
    console.error('SSE setup error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
