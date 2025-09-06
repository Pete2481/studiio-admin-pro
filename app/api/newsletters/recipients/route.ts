import { NextRequest, NextResponse } from 'next/server';
import { addRecipients } from '@/src/server/actions/newsletter.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const recipients = body.recipients || body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Recipients array is required' }, { status: 400 });
    }

    // Validate each recipient
    for (const recipient of recipients) {
      if (!recipient.newsletterId || (!recipient.clientId && !recipient.email)) {
        return NextResponse.json({ error: 'Invalid recipient data' }, { status: 400 });
      }
    }

    const result = await addRecipients(recipients);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/newsletters/recipients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
