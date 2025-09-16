import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = searchParams.get("tenant");

    if (!tenantSlug) {
      return NextResponse.json(
        { ok: false, error: "Tenant slug is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching all agents for tenant: ${tenantSlug}`);

    // Get the tenant by slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return NextResponse.json(
        { ok: false, error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Get all agents for this tenant with their company and client information
    const agents = await prisma.agent.findMany({
      where: {
        tenantId: tenant.id
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            clients: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { company: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    console.log(`✅ Found ${agents.length} agents in database`);

    return NextResponse.json({
      ok: true,
      data: {
        agents: agents,
        total: agents.length,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug
        }
      }
    });

  } catch (error) {
    console.error("❌ Error fetching all agents:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch agents" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
