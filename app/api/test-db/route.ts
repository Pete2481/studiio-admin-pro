import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test basic connection
    const tenant = await prisma.tenant.findUnique({
      where: { slug: "business-media-drive" }
    });
    
    if (!tenant) {
      return NextResponse.json({ 
        success: false, 
        error: "Tenant not found",
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlLength: process.env.DATABASE_URL?.length || 0
        }
      }, { status: 404 });
    }
    
    // Test agents
    const agents = await prisma.agent.findMany({
      where: { tenantId: tenant.id }
    });
    
    // Test bookings
    const bookings = await prisma.booking.findMany({
      where: { tenantId: tenant.id }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug
        },
        agents: agents.length,
        bookings: bookings.length,
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlLength: process.env.DATABASE_URL?.length || 0
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Database test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlLength: process.env.DATABASE_URL?.length || 0
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
