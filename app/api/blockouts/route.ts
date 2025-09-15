import { NextRequest, NextResponse } from "next/server";
import { blockoutRepo } from "@/src/server/repos/blockout.repo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Tenant ID is required" }, { status: 400 });
    }

    const blockouts = await blockoutRepo.findByTenant(tenantId);
    return NextResponse.json({ success: true, blockouts });
  } catch (error) {
    console.error("Error fetching blockouts:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blockouts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBlockout = await blockoutRepo.create(body);
    return NextResponse.json({ success: true, blockout: newBlockout });
  } catch (error) {
    console.error("Error creating blockout:", error);
    return NextResponse.json({ success: false, error: "Failed to create blockout" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Tenant ID is required" }, { status: 400 });
    }

    const result = await blockoutRepo.deleteByTenant(tenantId);
    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error("Error clearing blockouts:", error);
    return NextResponse.json({ success: false, error: "Failed to clear blockouts" }, { status: 500 });
  }
}
