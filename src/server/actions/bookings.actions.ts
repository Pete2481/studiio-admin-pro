"use server";
import { revalidatePath } from "next/cache";
import { getCurrentUser, hasRole } from "@/lib/auth-helpers";
import { JobsRepository } from "@/src/server/repos/jobs.repo";
import { AssignmentsRepository } from "@/src/server/repos/assignments.repo";
import { CreateBookingSchema, UpdateBookingSchema, AssignUserSchema, ActionResult } from "@/src/server/repos/types";

const jobsRepo = new JobsRepository();
const assignmentsRepo = new AssignmentsRepository();

export async function createBooking(tenantId: string, data: any): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, error: "Unauthorized" };
    }
    
    const validatedData = CreateBookingSchema.parse(data);
    
    // Check if user has permission to create bookings
    const canCreate = await hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);
    if (!canCreate) {
      return { ok: false, error: "Insufficient permissions to create bookings" };
    }

    const booking = await jobsRepo.create(tenantId, user.id, validatedData);
    revalidatePath(`/t/${tenantId}/bookings`);
    revalidatePath(`/t/${tenantId}/calendar`);
    
    return { ok: true, data: booking };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create booking" };
  }
}

export async function updateBooking(tenantId: string, bookingId: string, data: any): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, error: "Unauthorized" };
    }
    
    const validatedData = UpdateBookingSchema.parse(data);
    
    // Check if user has permission to update bookings
    const canUpdate = await hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);
    if (!canUpdate) {
      return { ok: false, error: "Insufficient permissions to update bookings" };
    }

    const booking = await jobsRepo.update(bookingId, tenantId, user.id, validatedData);
    revalidatePath(`/t/${tenantId}/bookings`);
    revalidatePath(`/t/${tenantId}/calendar`);
    
    return { ok: true, data: booking };
  } catch (error) {
    console.error("Failed to update booking:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update booking" };
  }
}

export async function cancelBooking(tenantId: string, bookingId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, error: "Unauthorized" };
    }
    
    // Check if user has permission to cancel bookings
    const canCancel = await hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);
    if (!canCancel) {
      return { ok: false, error: "Insufficient permissions to cancel bookings" };
    }

    const booking = await jobsRepo.cancel(bookingId, tenantId, user.id);
    revalidatePath(`/t/${tenantId}/bookings`);
    revalidatePath(`/t/${tenantId}/calendar`);
    
    return { ok: true, data: booking };
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Failed to cancel booking" };
  }
}

export async function assignUser(tenantId: string, bookingId: string, data: any): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    const validatedData = AssignUserSchema.parse(data);
    
    // Check if user has permission to assign users
    const canAssign = await hasRole(user.id, tenantId, ["SUB_ADMIN"]);
    if (!canAssign) {
      return { ok: false, error: "Insufficient permissions to assign users" };
    }

    const assignment = await assignmentsRepo.assignUser(bookingId, tenantId, user.id, validatedData);
    revalidatePath(`/t/${tenantId}/bookings`);
    revalidatePath(`/t/${tenantId}/calendar`);
    
    return { ok: true, data: assignment };
  } catch (error) {
    console.error("Failed to assign user:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Failed to assign user" };
  }
}

export async function unassignUser(tenantId: string, bookingId: string, userId: string, role: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has permission to unassign users
    const canUnassign = await hasRole(user.id, tenantId, ["SUB_ADMIN"]);
    if (!canUnassign) {
      return { ok: false, error: "Insufficient permissions to unassign users" };
    }

    await assignmentsRepo.unassignUser(bookingId, userId, role as any, tenantId, user.id);
    revalidatePath(`/t/${tenantId}/bookings`);
    revalidatePath(`/t/${tenantId}/calendar`);
    
    return { ok: true };
  } catch (error) {
    console.error("Failed to unassign user:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Failed to unassign user" };
  }
}

export async function getBookingsByRange(tenantId: string, from: Date, to: Date, opts?: { assigneeUserId?: string; status?: ("CONFIRMED" | "TENTATIVE" | "PENCILED" | "CANCELLED" | "REQUEST")[]; }) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to this tenant
    const hasAccess = await hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"]);
    if (!hasAccess) {
      return null;
    }

    const bookings = await jobsRepo.listByRange(tenantId, { from, to }, opts);
    return bookings;
  } catch (error) {
    console.error("Failed to get bookings by range:", error);
    return null;
  }
}

export async function getBooking(tenantId: string, bookingId: string) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to this tenant
    const hasAccess = await hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"]);
    if (!hasAccess) {
      return null;
    }

    const booking = await jobsRepo.getById(bookingId, tenantId);
    return booking;
  } catch (error) {
    console.error("Failed to get booking:", error);
    return null;
  }
}
