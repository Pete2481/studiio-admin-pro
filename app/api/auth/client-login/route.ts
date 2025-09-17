import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp, clientId } = await request.json();

    if (!email || !otp || !clientId) {
      return NextResponse.json(
        { error: 'Email, OTP, and Client ID are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userTenants: {
          where: { role: 'CLIENT' },
          include: {
            tenant: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or OTP' },
        { status: 401 }
      );
    }

    // Check if user has CLIENT role
    if (user.userTenants.length === 0) {
      return NextResponse.json(
        { error: 'You don\'t have client access' },
        { status: 403 }
      );
    }

    // Verify OTP
    if (!user.password || user.password !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 401 }
      );
    }

    // Check if OTP has expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 401 }
      );
    }

    // Verify the client exists and belongs to the user's tenant
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        tenantId: user.userTenants[0].tenantId
      },
      include: {
        company: true,
        tenant: true
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or access denied' },
        { status: 404 }
      );
    }

    // Clear OTP after successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: null,
        otpExpires: null
      }
    });

    // Create JWT token for client access
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        clientId: client.id,
        tenantId: client.tenantId,
        role: 'CLIENT',
        tenantSlug: client.tenant.slug
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company
      },
      tenant: {
        id: client.tenant.id,
        name: client.tenant.name,
        slug: client.tenant.slug
      },
      role: 'CLIENT'
    });

    response.cookies.set('client-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error during client login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
