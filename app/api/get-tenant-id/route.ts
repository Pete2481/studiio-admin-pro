import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'business-media-drive';

    console.log('Looking for tenant with slug:', slug);

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    console.log('Found tenant:', tenant);

    return NextResponse.json({
      success: true,
      tenant,
      message: 'Tenant retrieved'
    });
  } catch (error) {
    console.error('Error getting tenant:', error);
    return NextResponse.json(
        // @ts-ignore
      { error: 'Failed to get tenant', details: error.message },
      { status: 500 }
    );
  }
}
