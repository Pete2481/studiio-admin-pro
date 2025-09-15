import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        company: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookings: {
          include: {
            client: true,
          },
          orderBy: {
            start: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, profileImage, role, isActive } = body;

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        profileImage,
        role,
        isActive,
      },
      include: {
        company: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if agent has any bookings
    const bookingsCount = await prisma.booking.count({
      where: { agentId: id },
    });

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete agent with existing bookings. Please reassign or cancel bookings first.' },
        { status: 400 }
      );
    }

    await prisma.agent.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
