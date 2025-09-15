"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { BookingStatusRepository } from "@/src/server/repos/booking-status.repo";

const bookingStatusRepo = new BookingStatusRepository();

export async function getBookingStatuses(tenantId: string) {
  try {
    // Convert tenant slug to tenant ID if needed
    let actualTenantId = tenantId;
    
    // Check if tenantId is a slug (contains hyphens) or an actual ID
    if (tenantId.includes('-')) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantId },
        select: { id: true }
      });
      
      if (!tenant) {
        return { ok: false, error: "Tenant not found" };
      }
      
      actualTenantId = tenant.id;
    }

    const result = await bookingStatusRepo.list(actualTenantId);
    
    if (result.ok && (!result.data || result.data.length === 0)) {
      // Seed default statuses if none exist
      await bookingStatusRepo.seedDefaultStatuses(actualTenantId, "cmfddbqg4000012snce1yz7a4");
      // Try again after seeding
      return await bookingStatusRepo.list(actualTenantId);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to get booking statuses:", error);
    return { ok: false, error: "Failed to get booking statuses" };
  }
}

export async function createBookingStatus(tenantId: string, data: any) {
  try {
    // Convert tenant slug to tenant ID if needed
    let actualTenantId = tenantId;
    
    if (tenantId.includes('-')) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantId },
        select: { id: true }
      });
      
      if (!tenant) {
        return { ok: false, error: "Tenant not found" };
      }
      
      actualTenantId = tenant.id;
    }

    const result = await bookingStatusRepo.create(actualTenantId, data, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantId}/admin/bookings`);
      revalidatePath(`/client-admin/bookings`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to create booking status:", error);
    return { ok: false, error: "Failed to create booking status" };
  }
}

export async function updateBookingStatus(tenantId: string, statusId: string, data: any) {
  try {
    // Convert tenant slug to tenant ID if needed
    let actualTenantId = tenantId;
    
    if (tenantId.includes('-')) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantId },
        select: { id: true }
      });
      
      if (!tenant) {
        return { ok: false, error: "Tenant not found" };
      }
      
      actualTenantId = tenant.id;
    }

    const result = await bookingStatusRepo.update(actualTenantId, statusId, data, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantId}/admin/bookings`);
      revalidatePath(`/client-admin/bookings`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return { ok: false, error: "Failed to update booking status" };
  }
}

export async function deleteBookingStatus(tenantId: string, statusId: string) {
  try {
    // Convert tenant slug to tenant ID if needed
    let actualTenantId = tenantId;
    
    if (tenantId.includes('-')) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantId },
        select: { id: true }
      });
      
      if (!tenant) {
        return { ok: false, error: "Tenant not found" };
      }
      
      actualTenantId = tenant.id;
    }

    const result = await bookingStatusRepo.delete(actualTenantId, statusId, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantId}/admin/bookings`);
      revalidatePath(`/client-admin/bookings`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to delete booking status:", error);
    return { ok: false, error: "Failed to delete booking status" };
  }
}
