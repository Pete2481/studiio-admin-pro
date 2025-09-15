import { NextResponse } from 'next/server';
import { companyRepo } from '@/src/server/repos/company.repo';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const company = await companyRepo.findById(id);

    if (!company) {
      return NextResponse.json({ ok: false, error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: company });
  } catch (error) {
    console.error('Failed to get company:', error);
    return NextResponse.json({ ok: false, error: 'Failed to get company' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await params;
    const company = await companyRepo.update(id, body);

    return NextResponse.json({ ok: true, data: company });
  } catch (error) {
    console.error('Failed to update company:', error);
    return NextResponse.json({ ok: false, error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const company = await companyRepo.delete(id);

    return NextResponse.json({ ok: true, data: company });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return NextResponse.json({ ok: false, error: 'Failed to delete company' }, { status: 500 });
  }
}
