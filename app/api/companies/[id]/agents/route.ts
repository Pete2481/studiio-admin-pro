import { NextResponse } from 'next/server';
import { companyRepo } from '@/src/server/repos/company.repo';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const agents = await companyRepo.getAgentsByCompany(id);

    return NextResponse.json({ 
      ok: true, 
      data: { 
        agents, 
        total: agents.length 
      } 
    });
  } catch (error) {
    console.error('Failed to get company agents:', error);
    return NextResponse.json({ ok: false, error: 'Failed to get company agents' }, { status: 500 });
  }
}
