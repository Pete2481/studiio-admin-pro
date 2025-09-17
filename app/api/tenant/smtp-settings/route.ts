import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// SMTP Settings Type
interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromEmail: string;
  active: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Get tenant settings
    const tenantSettings = await prisma.tenantSettings.findUnique({
      where: { tenantId }
    });

    let smtpSettings: SmtpSettings | null = null;
    if (tenantSettings?.smtpSettings) {
      smtpSettings = JSON.parse(tenantSettings.smtpSettings);
    }

    return NextResponse.json({
      success: true,
      smtpSettings
    });

  } catch (error) {
    console.error('Error fetching SMTP settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMTP settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId, smtpSettings } = await request.json();
    console.log('SMTP Settings API called with:', { tenantId, smtpSettings });

    if (!tenantId || !smtpSettings) {
      return NextResponse.json(
        { error: 'Tenant ID and SMTP settings are required' },
        { status: 400 }
      );
    }

    // Validate SMTP settings
    if (!smtpSettings.host || !smtpSettings.port || !smtpSettings.fromEmail) {
      return NextResponse.json(
        { error: 'host, port, and fromEmail are required' },
        { status: 400 }
      );
    }
    
    if (!smtpSettings.auth || !smtpSettings.auth.user || !smtpSettings.auth.pass) {
      return NextResponse.json(
        { error: 'auth.user and auth.pass are required' },
        { status: 400 }
      );
    }

    // Upsert tenant settings
    console.log('Attempting to upsert tenant settings...');
    const tenantSettings = await prisma.tenantSettings.upsert({
      where: { tenantId },
      update: {
        smtpSettings: JSON.stringify(smtpSettings)
      },
      create: {
        tenantId,
        smtpSettings: JSON.stringify(smtpSettings)
      }
    });
    console.log('Tenant settings upserted successfully:', tenantSettings);

    return NextResponse.json({
      success: true,
      message: 'SMTP settings saved successfully',
      smtpSettings: JSON.parse(tenantSettings.smtpSettings || '{}')
    });

  } catch (error) {
    console.error('Error saving SMTP settings:', error);
    return NextResponse.json(
      { error: 'Failed to save SMTP settings' },
      { status: 500 }
    );
  }
}
