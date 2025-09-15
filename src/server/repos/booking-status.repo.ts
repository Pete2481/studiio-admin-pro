import { prisma } from "@/lib/prisma";
import { BaseRepository } from "./base.repo";

export interface CreateBookingStatusData {
  name: string;
  color?: string;
  isDefault?: boolean;
  isActive?: boolean;
  order?: number;
}

export interface UpdateBookingStatusData {
  name?: string;
  color?: string;
  isDefault?: boolean;
  isActive?: boolean;
  order?: number;
}

export class BookingStatusRepository extends BaseRepository {
  
  async list(tenantId: string) {
    try {
      const statuses = await prisma.bookingStatus.findMany({
        where: { 
          tenantId,
          isActive: true 
        },
        orderBy: [
          { isDefault: 'desc' },
          { order: 'asc' },
          { name: 'asc' }
        ]
      });
      
      return { ok: true, data: statuses };
    } catch (error) {
      console.error("Failed to list booking statuses:", error);
      return { ok: false, error: "Failed to list booking statuses" };
    }
  }

  async create(tenantId: string, data: CreateBookingStatusData, actorUserId: string) {
    try {
      // Check if status name already exists for this tenant
      const existing = await prisma.bookingStatus.findFirst({
        where: { 
          tenantId,
          name: data.name,
          isActive: true 
        }
      });

      if (existing) {
        return { ok: false, error: "Status with this name already exists" };
      }

      const status = await prisma.bookingStatus.create({
        data: {
          ...data,
          tenantId,
          createdBy: actorUserId
        }
      });

      // Create audit log
      await this.auditLog(tenantId, actorUserId, "booking_status.created", "booking_status", status.id, {
        name: status.name,
        color: status.color,
        isDefault: status.isDefault
      });

      return { ok: true, data: status };
    } catch (error) {
      console.error("Failed to create booking status:", error);
      return { ok: false, error: "Failed to create booking status" };
    }
  }

  async update(tenantId: string, statusId: string, data: UpdateBookingStatusData, actorUserId: string) {
    try {
      const existing = await prisma.bookingStatus.findFirst({
        where: { 
          id: statusId,
          tenantId,
          isActive: true 
        }
      });

      if (!existing) {
        return { ok: false, error: "Booking status not found" };
      }

      // Check if new name conflicts with existing status (excluding current one)
      if (data.name && data.name !== existing.name) {
        const nameConflict = await prisma.bookingStatus.findFirst({
          where: { 
            tenantId,
            name: data.name,
            isActive: true,
            id: { not: statusId }
          }
        });

        if (nameConflict) {
          return { ok: false, error: "Status with this name already exists" };
        }
      }

      const status = await prisma.bookingStatus.update({
        where: { id: statusId },
        data
      });

      // Create audit log
      await this.auditLog(tenantId, actorUserId, "booking_status.updated", "booking_status", statusId, {
        name: status.name,
        color: status.color,
        isDefault: status.isDefault
      });

      return { ok: true, data: status };
    } catch (error) {
      console.error("Failed to update booking status:", error);
      return { ok: false, error: "Failed to update booking status" };
    }
  }

  async delete(tenantId: string, statusId: string, actorUserId: string) {
    try {
      const existing = await prisma.bookingStatus.findFirst({
        where: { 
          id: statusId,
          tenantId,
          isActive: true 
        }
      });

      if (!existing) {
        return { ok: false, error: "Booking status not found" };
      }

      // Check if this status is being used by any bookings
      const bookingsUsingStatus = await prisma.booking.count({
        where: { 
          tenantId,
          status: existing.name
        }
      });

      if (bookingsUsingStatus > 0) {
        return { ok: false, error: `Cannot delete status "${existing.name}" - it is being used by ${bookingsUsingStatus} booking(s)` };
      }

      // Soft delete by setting isActive to false
      const status = await prisma.bookingStatus.update({
        where: { id: statusId },
        data: { isActive: false }
      });

      // Create audit log
      await this.auditLog(tenantId, actorUserId, "booking_status.deleted", "booking_status", statusId, {
        name: status.name
      });

      return { ok: true, data: status };
    } catch (error) {
      console.error("Failed to delete booking status:", error);
      return { ok: false, error: "Failed to delete booking status" };
    }
  }

  async seedDefaultStatuses(tenantId: string, actorUserId: string) {
    try {
      const defaultStatuses = [
        { name: "Tentative", color: "#F59E0B", isDefault: true, order: 1 },
        { name: "Confirmed", color: "#10B981", isDefault: true, order: 2 },
        { name: "Penciled", color: "#8B5CF6", isDefault: true, order: 3 },
        { name: "Cancelled", color: "#EF4444", isDefault: true, order: 4 },
        { name: "Request", color: "#3B82F6", isDefault: true, order: 5 }
      ];

      const createdStatuses = [];
      
      for (const statusData of defaultStatuses) {
        // Check if status already exists
        const existing = await prisma.bookingStatus.findFirst({
          where: { 
            tenantId,
            name: statusData.name,
            isActive: true 
          }
        });

        if (!existing) {
          const status = await prisma.bookingStatus.create({
            data: {
              ...statusData,
              tenantId,
              createdBy: actorUserId
            }
          });
          createdStatuses.push(status);
        }
      }

      return { ok: true, data: createdStatuses };
    } catch (error) {
      console.error("Failed to seed default statuses:", error);
      return { ok: false, error: "Failed to seed default statuses" };
    }
  }
}
