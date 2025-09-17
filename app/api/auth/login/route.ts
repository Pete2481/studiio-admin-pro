import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp, tenantId } = await request.json();

    if (!email || !otp || !tenantId) {
      return NextResponse.json(
        { error: "Email, OTP, and tenant ID are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userTenants: {
          where: { tenantId },
          include: {
            tenant: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or OTP" },
        { status: 401 }
      );
    }

    // Check if user has access to the specified tenant
    if (user.userTenants.length === 0) {
      return NextResponse.json(
        { error: "You don't have access to this account" },
        { status: 403 }
      );
    }

    const tenantUser = user.userTenants[0];

    // Verify OTP
    if (!user.password || user.password !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 401 }
      );
    }

    // Check if OTP has expired
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 401 }
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

    // Create JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        tenantId: tenantUser.tenant.id,
        role: tenantUser.role,
        tenantSlug: tenantUser.tenant.slug
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      tenant: {
        id: tenantUser.tenant.id,
        name: tenantUser.tenant.name,
        slug: tenantUser.tenant.slug
      },
      role: tenantUser.role
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
