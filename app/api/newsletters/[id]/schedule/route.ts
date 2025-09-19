import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { scheduledFor } = body;

    if (!scheduledFor) {
      return NextResponse.json(
        { success: false, error: 'Scheduled date is required' },
        { status: 400 }
      );
    }

    // Update the newsletter with the scheduled date
    const updatedNewsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        scheduledFor: new Date(scheduledFor),
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json({ success: true, data: updatedNewsletter });
  } catch (error) {
    console.error('Error scheduling newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule newsletter' },
      { status: 500 }
    );
  }
}
