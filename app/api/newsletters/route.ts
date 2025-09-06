import { NextRequest, NextResponse } from 'next/server';
import { getNewslettersByTenant, createNewsletter } from '@/src/server/actions/newsletter.actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const result = await getNewslettersByTenant(tenantId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/newsletters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subject, tenantId, createdBy } = body;

    if (!title || !subject || !tenantId || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createNewsletter({
      title,
      subject,
      tenantId,
      createdBy,
    });

    if (!result.success) {
      console.error('Newsletter creation failed:', result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log('Newsletter created successfully:', result.data);
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/newsletters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
