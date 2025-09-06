import { NextRequest, NextResponse } from 'next/server';
import { getClientsByTenant } from '@/src/server/actions/newsletter.actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const result = await getClientsByTenant(tenantId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/newsletters/clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
