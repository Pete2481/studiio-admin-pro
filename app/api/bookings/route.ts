import { NextRequest, NextResponse } from "next/server";
import { bookingRepo } from "@/src/server/repos/booking.repo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Tenant ID is required" }, { status: 400 });
    }

    const bookings = await bookingRepo.findByTenant(tenantId);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use the correct Master Admin user ID that exists in the database
    const bookingData = {
      ...body,
      createdBy: 'cmfkr33hf000013jn92d7t29y' // Master Admin user ID
    };
    
    const newBooking = await bookingRepo.create(bookingData);
    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    if (!tenantId) {
      return NextResponse.json({ success: false, error: "Tenant ID is required" }, { status: 400 });
    }

    const result = await bookingRepo.deleteByTenant(tenantId);
    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error("Error clearing bookings:", error);
    return NextResponse.json({ success: false, error: "Failed to clear bookings" }, { status: 500 });
  }
}
