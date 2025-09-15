import { NextRequest, NextResponse } from "next/server";
import { blockoutRepo } from "@/src/server/repos/blockout.repo";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await params;
    const updatedBlockout = await blockoutRepo.update(id, body);
    return NextResponse.json({ success: true, blockout: updatedBlockout });
  } catch (error) {
    console.error("Error updating blockout:", error);
    return NextResponse.json({ success: false, error: "Failed to update blockout" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await blockoutRepo.delete(id);
    return NextResponse.json({ success: true, deletedCount: 1 });
  } catch (error) {
    console.error("Error deleting blockout:", error);
    return NextResponse.json({ success: false, error: "Failed to delete blockout" }, { status: 500 });
  }
}
