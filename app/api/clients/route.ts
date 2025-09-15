import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get('tenant'); // This is the tenant slug
    const tenantId = searchParams.get('tenantId'); // This is the tenant ID

    if (!tenant && !tenantId) {
      return NextResponse.json({ error: 'Tenant slug or ID is required' }, { status: 400 });
    }

    let whereClause: any = {};

    if (tenantId) {
      // If tenantId is provided, use it directly
      whereClause.tenantId = tenantId;
    } else if (tenant) {
      // If tenant slug is provided, find the tenant first
      const tenantRecord = await prisma.tenant.findUnique({
        where: { slug: tenant },
        select: { id: true }
      });

      if (!tenantRecord) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
      }

      whereClause.tenantId = tenantRecord.id;
    }

    // Fetch clients (customers) from the database
    const clients = await prisma.client.findMany({
      where: {
        ...whereClause,
        isActive: true, // Only active clients
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the data to match the expected format
    const transformedClients = clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      companyId: client.companyId,
      company: client.company,
      tenantId: client.tenantId,
      role: 'CLIENT', // All clients have CLIENT role
      type: 'client',
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));

    return NextResponse.json(transformedClients);

  } catch (error) {
    console.error('Error in GET /api/clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, companyId, tenantId, createdBy } = body;

    if (!name || !tenantId || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        companyId,
        tenantId,
        createdBy,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      companyId: client.companyId,
      company: client.company,
      tenantId: client.tenantId,
      role: 'CLIENT',
      type: 'client',
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



