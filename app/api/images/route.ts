import { NextRequest, NextResponse } from 'next/server';
import { getImagesByTenant, getImagesByUser } from '@/src/server/actions/image.actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const userId = searchParams.get('userId');

    if (!tenantId && !userId) {
      return NextResponse.json(
        { error: 'Either tenantId or userId is required' },
        { status: 400 }
      );
    }

    let images: any[] = [];
    if (tenantId) {
      images = await getImagesByTenant(tenantId);
    } else if (userId) {
      images = await getImagesByUser(userId);
    }

    return NextResponse.json({
      success: true,
      images,
      count: images?.length || 0,
    });

  } catch (error) {
    console.error('Error getting images:', error);
    return NextResponse.json(
      { error: 'Failed to get images' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/images/upload for uploads.' },
    { status: 405 }
  );
}
