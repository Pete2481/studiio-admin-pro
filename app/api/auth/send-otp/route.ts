import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { emailService } from '@/lib/email-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('Send OTP API called');
    const { email } = await request.json();
    console.log('Email received:', email);

    if (!email) {
      console.log('No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);
    
    // OTP expires in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log('OTP expires:', otpExpires);

    // Find or create user
    console.log('Looking for user with email:', email.toLowerCase());
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    console.log('User found:', user ? 'YES' : 'NO');

    if (!user) {
      // Create new user if doesn't exist
      console.log('Creating new user');
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: otp,
          otpExpires: otpExpires
        }
      });
      console.log('User created:', user.id);
    } else {
      // Update existing user with new OTP
      console.log('Updating existing user');
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: otp,
          otpExpires: otpExpires
        }
      });
      console.log('User updated:', user.id);
    }

    // Get tenant information for email sending
    const tenantUser = await prisma.userTenant.findFirst({
      where: { userId: user.id },
      include: { tenant: true }
    });

    let emailSent = false;
    if (tenantUser) {
      // Try to send email via tenant's SMTP settings
      emailSent = await emailService.sendOtpEmail(
        tenantUser.tenant.id,
        email,
        otp,
        tenantUser.tenant.name
      );
    }

    // Fallback to console log if email sending fails
    if (!emailSent) {
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: emailSent ? 'OTP sent to your email' : 'OTP generated (check console for testing)',
      // Remove this in production - only for testing
      otp: otp
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
