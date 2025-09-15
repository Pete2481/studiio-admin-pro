"use server";

import { bookingRepo, CreateBookingData, UpdateBookingData } from "@/src/server/repos/booking.repo";
import { revalidatePath } from "next/cache";

export async function createBooking(data: CreateBookingData) {
  try {
    const booking = await bookingRepo.create(data);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    revalidatePath("/bookings");
    return { success: true, booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function getBookingsByTenant(tenantId: string) {
  try {
    const bookings = await bookingRepo.findByTenant(tenantId);
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Failed to fetch bookings", bookings: [] };
  }
}

export async function getBookingsByDateRange(tenantId: string, startDate: Date, endDate: Date) {
  try {
    const bookings = await bookingRepo.findByDateRange(tenantId, startDate, endDate);
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings by date range:", error);
    return { success: false, error: "Failed to fetch bookings", bookings: [] };
  }
}

export async function getBookingById(id: string) {
  try {
    const booking = await bookingRepo.findById(id);
    if (!booking) {
      return { success: false, error: "Booking not found" };
    }
    return { success: true, booking };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { success: false, error: "Failed to fetch booking" };
  }
}

export async function updateBooking(id: string, data: UpdateBookingData) {
  try {
    const booking = await bookingRepo.update(id, data);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    revalidatePath("/bookings");
    return { success: true, booking };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: "Failed to update booking" };
  }
}

export async function deleteBooking(id: string) {
  try {
    const booking = await bookingRepo.delete(id);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    revalidatePath("/bookings");
    return { success: true, booking };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}

export async function clearAllBookings(tenantId: string) {
  try {
    const result = await bookingRepo.deleteByTenant(tenantId);
    revalidatePath("/calendar");
    revalidatePath("/client-admin/bookings");
    revalidatePath(`/t/[tenantId]/admin/calendar`);
    revalidatePath("/bookings");
    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("Error clearing bookings:", error);
    return { success: false, error: "Failed to clear bookings" };
  }
}

export async function getBookingsByClient(clientId: string) {
  try {
    const bookings = await bookingRepo.findByClient(clientId);
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings by client:", error);
    return { success: false, error: "Failed to fetch bookings", bookings: [] };
  }
}

export async function getBookingsByAgent(agentId: string) {
  try {
    const bookings = await bookingRepo.findByAgent(agentId);
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings by agent:", error);
    return { success: false, error: "Failed to fetch bookings", bookings: [] };
  }
}

export async function getBookingsByPhotographer(photographerId: string) {
  try {
    const bookings = await bookingRepo.findByPhotographer(photographerId);
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings by photographer:", error);
    return { success: false, error: "Failed to fetch bookings", bookings: [] };
  }
}
