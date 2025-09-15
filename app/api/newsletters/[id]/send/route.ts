import { NextRequest, NextResponse } from 'next/server';
import { markNewsletterAsSent } from '@/src/server/actions/newsletter.actions';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await markNewsletterAsSent(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/newsletters/[id]/send:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
