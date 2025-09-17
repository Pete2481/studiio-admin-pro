import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const tenantId = searchParams.get('tenantId');

    if (!clientId || !tenantId) {
      return NextResponse.json(
        { error: 'Client ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    // Fetch client profile with company information
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        tenantId: tenantId
      },
      include: {
        company: true,
        tenant: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      client
    });

  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { clientId, tenantId, ...updateData } = await request.json();

    if (!clientId || !tenantId) {
      return NextResponse.json(
        { error: 'Client ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    // Update client profile
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        company: true,
        tenant: true
      }
    });

    return NextResponse.json({
      success: true,
      client: updatedClient
    });

  } catch (error) {
    console.error('Error updating client profile:', error);
    return NextResponse.json(
      { error: 'Failed to update client profile' },
      { status: 500 }
    );
  }
}
