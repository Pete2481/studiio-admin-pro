import { NextRequest, NextResponse } from "next/server";
import { bookingRepo } from "@/src/server/repos/booking.repo";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await params;
    const updatedBooking = await bookingRepo.update(id, body);
    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await bookingRepo.delete(id);
    return NextResponse.json({ success: true, deletedCount: 1 });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ success: false, error: "Failed to delete booking" }, { status: 500 });
  }
}
