import { PrismaClient, Blockout } from '@prisma/client/edge';
import {withAccelerate} from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate())

export interface CreateBlockoutData {
  title: string;
  start: Date;
  end: Date;
  type?: string;
  notes?: string;
  isAllDay?: boolean;
  tenantId: string;
  createdBy: string;
}

export interface UpdateBlockoutData {
  title?: string;
  start?: Date;
  end?: Date;
  type?: string;
  notes?: string;
  isAllDay?: boolean;
}

export class BlockoutRepository {
  async create(data: CreateBlockoutData): Promise<Blockout> {
    return await prisma.blockout.create({
      data: {
        title: data.title,
        start: data.start,
        end: data.end,
        type: data.type || 'blockout',
        notes: data.notes,
        isAllDay: data.isAllDay || false,
        tenantId: data.tenantId,
        createdBy: data.createdBy,
      },
    });
  }

  async findById(id: string): Promise<Blockout | null> {
    return await prisma.blockout.findUnique({
      where: { id },
    });
  }

  async findByTenant(tenantId: string): Promise<Blockout[]> {
    return await prisma.blockout.findMany({
      where: { tenantId },
      orderBy: { start: 'asc' },
    });
  }

  async update(id: string, data: UpdateBlockoutData): Promise<Blockout> {
    return await prisma.blockout.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Blockout> {
    return await prisma.blockout.delete({
      where: { id },
    });
  }

  async deleteByTenant(tenantId: string): Promise<{ count: number }> {
    return await prisma.blockout.deleteMany({
      where: { tenantId },
    });
  }
}

export const blockoutRepo = new BlockoutRepository();
