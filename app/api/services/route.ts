import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || 'business-media-drive';

    // Get the tenant ID from the slug
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Get all services for this tenant
    const services = await prisma.service.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the data to match the expected format
    const transformedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      icon: service.icon || '📸',
      price: service.price,
      durationMinutes: service.durationMinutes,
      isActive: service.isActive,
      imageQuotaEnabled: service.imageQuotaEnabled,
      imageQuota: service.imageQuota,
      displayPrice: service.displayPrice,
      favorite: service.favorite,
      status: service.status,
      createdAt: service.createdAt,
    }));

    await prisma.$disconnect();

    return NextResponse.json({ 
      ok: true, 
      data: transformedServices 
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





