import { NextRequest, NextResponse } from 'next/server';
import { addContentBlock } from '@/src/server/actions/newsletter.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsletterId, type, content, positionX, positionY, width, height, order, metadata } = body;

    if (!newsletterId || !type || !content || positionX === undefined || positionY === undefined || width === undefined || height === undefined || order === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await addContentBlock({
      newsletterId,
      type,
      content,
      positionX,
      positionY,
      width,
      height,
      order,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/newsletters/content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
