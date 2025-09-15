import { PrismaClient, Booking } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBookingData {
  title: string;
  start: Date;
  end: Date;
  status?: string;
  clientId?: string;
  agentId?: string;
  photographerId?: string;
  address?: string;
  notes?: string;
  durationM?: number;
  services?: string; // JSON string of service IDs
  tenantId: string;
  createdBy: string;
}

export interface UpdateBookingData {
  title?: string;
  start?: Date;
  end?: Date;
  status?: string;
  clientId?: string;
  agentId?: string;
  photographerId?: string;
  address?: string;
  notes?: string;
  durationM?: number;
  services?: string; // JSON string of service IDs
}

export class BookingRepository {
  async create(data: CreateBookingData): Promise<Booking> {
    return await prisma.booking.create({
      data: {
        title: data.title,
        start: data.start,
        end: data.end,
        status: data.status || 'TENTATIVE',
        clientId: data.clientId,
        agentId: data.agentId,
        photographerId: data.photographerId,
        address: data.address,
        notes: data.notes,
        durationM: data.durationM || 60,
        services: data.services,
        tenantId: data.tenantId,
        createdBy: data.createdBy,
      },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
    });
  }

  async findById(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
    });
  }

  async findByTenant(tenantId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { tenantId },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
      orderBy: { start: 'asc' },
    });
  }

  async findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: {
        tenantId,
        start: {
          gte: startDate,
        },
        end: {
          lte: endDate,
        },
      },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
      orderBy: { start: 'asc' },
    });
  }

  async update(id: string, data: UpdateBookingData): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data,
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
    });
  }

  async delete(id: string): Promise<Booking> {
    return await prisma.booking.delete({
      where: { id },
    });
  }

  async deleteByTenant(tenantId: string): Promise<{ count: number }> {
    return await prisma.booking.deleteMany({
      where: { tenantId },
    });
  }

  async findByClient(clientId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { clientId },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
      orderBy: { start: 'asc' },
    });
  }

  async findByAgent(agentId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { agentId },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
      orderBy: { start: 'asc' },
    });
  }

  async findByPhotographer(photographerId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { photographerId },
      include: {
        client: true,
        agent: true,
        photographer: true,
      },
      orderBy: { start: 'asc' },
    });
  }
}

export const bookingRepo = new BookingRepository();
