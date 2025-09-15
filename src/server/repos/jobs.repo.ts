import { BaseRepository } from "./base.repo";
import { 
  CreateBookingData, 
  UpdateBookingData, 
  BookingStatus,
  DateRange,
  PaginationParams 
} from "./types";

export class JobsRepository extends BaseRepository {
  async create(
    tenantId: string,
    createdBy: string,
    data: CreateBookingData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const booking = await this.prisma.booking.create({
        data: {
          ...data,
          tenantId,
          createdBy,
        },
        include: {
          client: true,
          assignments: {
            include: {
              user: true,
            },
          },
        },
      });

      await this.auditLog(
        createdBy,
        tenantId,
        "job.created",
        "job",
        booking.id,
        data
      );

      return booking;
    });
  }

  async listByRange(
    tenantId: string,
    range: DateRange,
    opts?: {
      assigneeUserId?: string;
      status?: BookingStatus[];
    }
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const where: any = {
        tenantId,
        start: {
          gte: range.from,
          lte: range.to,
        },
      };

      if (opts?.status?.length) {
        where.status = { in: opts.status };
      }

      if (opts?.assigneeUserId) {
        where.assignments = {
          some: {
            userId: opts.assigneeUserId,
          },
        };
      }

      return this.prisma.booking.findMany({
        where,
        include: {
          client: true,
          assignments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { start: "asc" },
      });
    });
  }

  async getById(bookingId: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.booking.findFirst({
        where: {
          id: bookingId,
          tenantId,
        },
        include: {
          client: true,
          assignments: {
            include: {
              user: true,
            },
          },
          galleries: true,
        },
      });
    });
  }

  async update(
    bookingId: string,
    tenantId: string,
    updatedBy: string,
    data: UpdateBookingData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const existing = await this.prisma.booking.findFirst({
        where: { id: bookingId, tenantId },
      });

      if (!existing) {
        throw new Error(`Booking ${bookingId} not found`);
      }

      const booking = await this.prisma.booking.update({
        where: { id: bookingId },
        data,
        include: {
          client: true,
          assignments: {
            include: {
              user: true,
            },
          },
        },
      });

      await this.auditLog(
        updatedBy,
        tenantId,
        "job.updated",
        "job",
        bookingId,
        { before: existing, after: data }
      );

      return booking;
    });
  }

  async setStatus(
    bookingId: string,
    tenantId: string,
    updatedBy: string,
    status: BookingStatus
  ) {
    return this.update(bookingId, tenantId, updatedBy, { status });
  }

  async cancel(
    bookingId: string,
    tenantId: string,
    cancelledBy: string
  ) {
    return this.setStatus(bookingId, tenantId, cancelledBy, "CANCELLED");
  }

  async list(
    tenantId: string,
    params: PaginationParams = {}
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const { page = 1, limit = 20, search } = params;
      const skip = (page - 1) * limit;

      const where: any = { tenantId };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      const [bookings, total] = await Promise.all([
        this.prisma.booking.findMany({
          where,
          include: {
            client: true,
            assignments: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { start: "desc" },
          skip,
          take: limit,
        }),
        this.prisma.booking.count({ where }),
      ]);

      return {
        data: bookings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    });
  }

  async delete(bookingId: string, tenantId: string, deletedBy: string) {
    return this.withTenantGuard(tenantId, async () => {
      const booking = await this.prisma.booking.findFirst({
        where: { id: bookingId, tenantId },
      });

      if (!booking) {
        throw new Error(`Booking ${bookingId} not found`);
      }

      await this.prisma.booking.delete({
        where: { id: bookingId },
      });

      await this.auditLog(
        deletedBy,
        tenantId,
        "job.deleted",
        "job",
        bookingId,
        booking
      );

      return { success: true };
    });
  }
}

















