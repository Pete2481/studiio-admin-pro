import { NextRequest, NextResponse } from "next/server";
import { getBookingStatuses, createBookingStatus } from "@/src/server/actions/booking-status.actions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant = searchParams.get("tenant");

    if (!tenant) {
      return NextResponse.json({ ok: false, error: "Tenant parameter is required" }, { status: 400 });
    }

    const result = await getBookingStatuses(tenant);
    
    if (result.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API Error - GET booking statuses:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, ...data } = body;

    if (!tenantId) {
      return NextResponse.json({ ok: false, error: "Tenant ID is required" }, { status: 400 });
    }

    if (!data.name) {
      return NextResponse.json({ ok: false, error: "Status name is required" }, { status: 400 });
    }

    const result = await createBookingStatus(tenantId, data);
    
    if (result.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API Error - POST booking status:", error);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
