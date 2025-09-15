import { NextResponse } from 'next/server';
import { companyRepo } from '@/src/server/repos/company.repo';
import { TenantsRepository } from '@/src/server/repos/tenant.repo';

const tenantsRepo = new TenantsRepository();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant');

    if (!tenantSlug) {
      return NextResponse.json({ ok: false, error: 'Tenant slug is required' }, { status: 400 });
    }

    const tenant = await tenantsRepo.findBySlug(tenantSlug);

    if (!tenant) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 404 });
    }

    const companies = await companyRepo.findByTenant(tenant.id);

    return NextResponse.json({ 
      ok: true, 
      data: { 
        companies, 
        total: companies.length, 
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug } 
      } 
    });
  } catch (error) {
    console.error('Failed to get companies:', error);
    return NextResponse.json({ ok: false, error: 'Failed to get companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantSlug, ...companyData } = body;

    if (!tenantSlug) {
      return NextResponse.json({ ok: false, error: 'Tenant slug is required' }, { status: 400 });
    }

    const tenant = await tenantsRepo.findBySlug(tenantSlug);

    if (!tenant) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 404 });
    }

    const company = await companyRepo.create({
      ...companyData,
      tenantId: tenant.id,
    });

    return NextResponse.json({ ok: true, data: company });
  } catch (error) {
    console.error('Failed to create company:', error);
    return NextResponse.json({ ok: false, error: 'Failed to create company' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get('tenant');

    if (!tenantSlug) {
      return NextResponse.json({ ok: false, error: 'Tenant slug is required' }, { status: 400 });
    }

    const tenant = await tenantsRepo.findBySlug(tenantSlug);

    if (!tenant) {
      return NextResponse.json({ ok: false, error: 'Tenant not found' }, { status: 404 });
    }

    const result = await companyRepo.deleteByTenant(tenant.id);

    return NextResponse.json({ ok: true, data: { deleted: result.count } });
  } catch (error) {
    console.error('Failed to delete companies:', error);
    return NextResponse.json({ ok: false, error: 'Failed to delete companies' }, { status: 500 });
  }
}
