import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus, deleteBookingStatus } from "@/src/server/actions/booking-status.actions";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { tenantId, ...data } = body;
    const { id } = await params;

    if (!tenantId) {
      return NextResponse.json({ ok: false, error: "Tenant ID is required" }, { status: 400 });
    }

    const result = await updateBookingStatus(tenantId, id, data);
    
    if (result.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API Error - PUT booking status:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { tenantId } = body;
    const { id } = await params;

    if (!tenantId) {
      return NextResponse.json({ ok: false, error: "Tenant ID is required" }, { status: 400 });
    }

    const result = await deleteBookingStatus(tenantId, id);
    
    if (result.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API Error - DELETE booking status:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
