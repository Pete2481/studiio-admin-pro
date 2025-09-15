import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    // Parse CSV data from request body
    const { services } = await request.json();

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: 'Invalid services data' }, { status: 400 });
    }

    // No duplicate checking - create all services

    // Validate and process services
    const results = {
      created: [] as any[],
      skipped: [] as any[],
      errors: [] as { service: string; error: string }[]
    };

    for (const service of services) {
      try {
        // Validate required fields
        if (!service.name || !service.description || !service.price) {
          results.errors.push({
            service: service.name || 'Unknown',
            error: 'Missing required fields (name, description, price)'
          });
          continue;
        }

        // No duplicate checking - create all services

        // Validate price is a number
        const price = parseFloat(service.price);
        if (isNaN(price) || price < 0) {
          results.errors.push({
            service: service.name,
            error: 'Invalid price format'
          });
          continue;
        }

        // Create service with defaults
        const newService = await prisma.service.create({
          data: {
            name: service.name.trim(),
            description: service.description.trim(),
            price: price,
            icon: '📸', // Default camera icon
            status: 'Active', // Default status
            durationMinutes: 60, // Default duration
            favorite: false, // Default not favorite
            imageQuotaEnabled: false, // Default quota off
            imageQuota: 0, // Default quota empty
            displayPrice: false, // Default display price off
            isActive: true, // Default active
            tenantId: tenant.id,
            createdBy: 'cmfkr33hf000013jn92d7t29y', // Master Admin
          }
        });

        results.created.push({
          id: newService.id,
          name: newService.name
        });

        // No duplicate checking within batch

      } catch (error) {
        results.errors.push({
          service: service.name || 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: services.length,
        created: results.created.length,
        skipped: results.skipped.length,
        errors: results.errors.length
      }
    });

  } catch (error) {
    console.error('Bulk service creation error:', error);
    return NextResponse.json({
      error: 'Failed to create services',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
