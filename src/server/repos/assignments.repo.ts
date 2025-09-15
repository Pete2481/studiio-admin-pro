import { BaseRepository } from "./base.repo";
import { 
  AssignUserData,
  AssignmentRole
} from "./types";

export class AssignmentsRepository extends BaseRepository {
  async assignUser(
    bookingId: string,
    tenantId: string,
    assignedBy: string,
    data: AssignUserData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      // Verify booking exists and belongs to tenant
      const booking = await this.prisma.booking.findFirst({
        where: { id: bookingId, tenantId },
      });

      if (!booking) {
        throw new Error(`Booking ${bookingId} not found`);
      }

      // Verify user exists and has access to tenant
      const userTenant = await this.prisma.userTenant.findFirst({
        where: { 
          userId: data.userId, 
          tenantId,
          isActive: true 
        },
      });

      if (!userTenant) {
        throw new Error(`User ${data.userId} not found or not active in tenant`);
      }

      // Check if assignment already exists
      const existingAssignment = await this.prisma.assignment.findFirst({
        where: {
          bookingId,
          userId: data.userId,
          role: data.role,
        },
      });

      if (existingAssignment) {
        throw new Error(`User ${data.userId} is already assigned as ${data.role} to this booking`);
      }

      const assignment = await this.prisma.assignment.create({
        data: {
          bookingId,
          userId: data.userId,
          role: data.role,
          assignedBy,
        },
        include: {
          user: true,
        },
      });

      await this.auditLog(
        assignedBy,
        tenantId,
        "assignment.created",
        "assignment",
        assignment.id,
        data
      );

      return assignment;
    });
  }

  async unassignUser(
    bookingId: string,
    userId: string,
    role: AssignmentRole,
    tenantId: string,
    unassignedBy: string
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const assignment = await this.prisma.assignment.findFirst({
        where: {
          bookingId,
          userId,
          role,
        },
        include: {
          booking: true,
        },
      });

      if (!assignment || assignment.booking.tenantId !== tenantId) {
        throw new Error(`Assignment not found`);
      }

      await this.prisma.assignment.delete({
        where: { id: assignment.id },
      });

      await this.auditLog(
        unassignedBy,
        tenantId,
        "assignment.removed",
        "assignment",
        assignment.id,
        { userId, role, bookingId }
      );

      return { success: true };
    });
  }

  async getByBooking(bookingId: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.assignment.findMany({
        where: {
          bookingId,
          booking: {
            tenantId,
          },
        },
        include: {
          user: true,
        },
        orderBy: { assignedAt: "asc" },
      });
    });
  }

  async getByUser(userId: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.assignment.findMany({
        where: {
          userId,
          booking: {
            tenantId,
          },
        },
        include: {
          booking: {
            include: {
              client: true,
            },
          },
        },
        orderBy: { assignedAt: "desc" },
      });
    });
  }

  async getTeamByRole(tenantId: string, role: AssignmentRole) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.userTenant.findMany({
        where: {
          tenantId,
          role,
          isActive: true,
        },
        include: {
          user: true,
        },
        orderBy: { joinedAt: "asc" },
      });
    });
  }

  async getTeamStats(tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      const [photographers, editors, totalAssignments] = await Promise.all([
        this.prisma.userTenant.count({
          where: {
            tenantId,
            role: "PHOTOGRAPHER",
            isActive: true,
          },
        }),
        this.prisma.userTenant.count({
          where: {
            tenantId,
            role: "EDITOR",
            isActive: true,
          },
        }),
        this.prisma.assignment.count({
          where: {
            booking: {
              tenantId,
            },
          },
        }),
      ]);

      return {
        photographers,
        editors,
        totalAssignments,
      };
    });
  }
}


















