"use server";

import { blockoutRepo, CreateBlockoutData, UpdateBlockoutData } from "@/src/server/repos/blockout.repo";
import { revalidatePath } from "next/cache";

export async function createBlockout(data: CreateBlockoutData) {
  try {
    const blockout = await blockoutRepo.create(data);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    return { success: true, blockout };
  } catch (error) {
    console.error("Error creating blockout:", error);
    return { success: false, error: "Failed to create blockout" };
  }
}

export async function getBlockoutsByTenant(tenantId: string) {
  try {
    const blockouts = await blockoutRepo.findByTenant(tenantId);
    return { success: true, blockouts };
  } catch (error) {
    console.error("Error fetching blockouts:", error);
    return { success: false, error: "Failed to fetch blockouts", blockouts: [] };
  }
}

export async function updateBlockout(id: string, data: UpdateBlockoutData) {
  try {
    const blockout = await blockoutRepo.update(id, data);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    return { success: true, blockout };
  } catch (error) {
    console.error("Error updating blockout:", error);
    return { success: false, error: "Failed to update blockout" };
  }
}

export async function deleteBlockout(id: string) {
  try {
    const blockout = await blockoutRepo.delete(id);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    return { success: true, blockout };
  } catch (error) {
    console.error("Error deleting blockout:", error);
    return { success: false, error: "Failed to delete blockout" };
  }
}

export async function clearAllBlockouts(tenantId: string) {
  try {
    const result = await blockoutRepo.deleteByTenant(tenantId);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("Error clearing blockouts:", error);
    return { success: false, error: "Failed to clear blockouts" };
  }
}
