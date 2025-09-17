import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const tenantId = searchParams.get('tenantId');

    if (!clientId || !tenantId) {
      return NextResponse.json(
        { error: 'Client ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    // Fetch invoices for the specific client within the tenant
    const invoices = await prisma.invoice.findMany({
      where: {
        clientId: clientId,
        tenantId: tenantId
      },
      include: {
        client: true,
        booking: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert amountCents to amount for easier frontend handling
    const invoicesWithAmount = invoices.map(invoice => ({
      ...invoice,
      amount: invoice.amountCents / 100
    }));

    return NextResponse.json({
      success: true,
      invoices: invoicesWithAmount
    });

  } catch (error) {
    console.error('Error fetching client invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
