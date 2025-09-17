import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, to } = await request.json();
    console.log('Test SMTP API called with:', { tenantId, to });

    if (!tenantId || !to) {
      return NextResponse.json(
        { error: 'Tenant ID and recipient email are required' },
        { status: 400 }
      );
    }

    // Get tenant name for the email
    const tenantName = tenantId.replace(/-/g, ' ').split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Use the emailService to send a test email
    console.log('Attempting to send test email...');
    const success = await emailService.sendTestEmail(tenantId, to, tenantName);
    console.log('Test email result:', success);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email. Please check your SMTP settings.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error testing SMTP:', error);
    return NextResponse.json(
      { error: 'Failed to test SMTP settings' },
      { status: 500 }
    );
  }
}
