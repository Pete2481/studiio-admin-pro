import { NextRequest, NextResponse } from 'next/server';
import { ServicesRepository } from '@/src/server/repos/services.repo';
import { prisma } from '@/lib/prisma';

const servicesRepo = new ServicesRepository();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || 'business-media-drive';

    // Get the tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const { id: serviceId } = await params;

    // Delete the service
    const result = await servicesRepo.delete(tenant.id, serviceId, 'cmfkr33hf000013jn92d7t29y');

    if (result.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Service deleted successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to delete service' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({
      error: 'Failed to delete service',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant') || 'business-media-drive';

    // Get the tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const { id: serviceId } = await params;
    const updateData = await request.json();

    // Update the service
    const result = await servicesRepo.update(tenant.id, serviceId, updateData, 'cmfkr33hf000013jn92d7t29y');

    if (result.ok) {
      return NextResponse.json({ 
        success: true, 
        data: result.data,
        message: 'Service updated successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to update service' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({
      error: 'Failed to update service',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
