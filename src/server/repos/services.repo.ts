import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './base.repo';
import { CreateServiceSchema, UpdateServiceSchema, ActionResult } from './types';

export class ServicesRepository extends BaseRepository {
  constructor() {
    super();
  }

  async create(tenantId: string, data: any, createdBy: string): Promise<ActionResult> {
    try {
      const validatedData = CreateServiceSchema.parse(data);
      
      const service = await this.prisma.service.create({
        data: {
          ...validatedData,
          tenantId,
          createdBy,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.auditLog(createdBy, tenantId, 'service.created', 'service', service.id, {
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
      });

      return { ok: true, data: service };
    } catch (error) {
      console.error('Failed to create service:', error);
      return { ok: false, error: 'Failed to create service' };
    }
  }

  async update(tenantId: string, serviceId: string, data: any, updatedBy: string): Promise<ActionResult> {
    try {
      const validatedData = UpdateServiceSchema.parse(data);
      
      const existingService = await this.prisma.service.findFirst({
        where: { id: serviceId, tenantId },
      });

      if (!existingService) {
        return { ok: false, error: 'Service not found' };
      }

      const service = await this.prisma.service.update({
        where: { id: serviceId },
        data: validatedData,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.auditLog(updatedBy, tenantId, 'service.updated', 'service', service.id, {
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
      });

      return { ok: true, data: service };
    } catch (error) {
      console.error('Failed to update service:', error);
      return { ok: false, error: 'Failed to update service' };
    }
  }

  async delete(tenantId: string, serviceId: string, deletedBy: string): Promise<ActionResult> {
    try {
      const existingService = await this.prisma.service.findFirst({
        where: { id: serviceId, tenantId },
      });

      if (!existingService) {
        return { ok: false, error: 'Service not found' };
      }

      await this.prisma.service.delete({
        where: { id: serviceId },
      });

      await this.auditLog(deletedBy, tenantId, 'service.deleted', 'service', serviceId, {
        name: existingService.name,
      });

      return { ok: true };
    } catch (error) {
      console.error('Failed to delete service:', error);
      return { ok: false, error: 'Failed to delete service' };
    }
  }

  async getById(tenantId: string, serviceId: string) {
    try {
      const service = await this.prisma.service.findFirst({
        where: { id: serviceId, tenantId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return service;
    } catch (error) {
      console.error('Failed to get service:', error);
      return null;
    }
  }

  async list(tenantId: string, options?: {
    isActive?: boolean;
    favorite?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const { isActive, favorite, search, page = 1, limit = 50 } = options || {};
      
      const where: any = { tenantId };
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      
      if (favorite !== undefined) {
        where.favorite = favorite;
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [services, total] = await Promise.all([
        this.prisma.service.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.service.count({ where }),
      ]);

      return {
        services,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Failed to list services:', error);
      return { services: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } };
    }
  }

  async toggleFavorite(tenantId: string, serviceId: string, updatedBy: string): Promise<ActionResult> {
    try {
      const existingService = await this.prisma.service.findFirst({
        where: { id: serviceId, tenantId },
      });

      if (!existingService) {
        return { ok: false, error: 'Service not found' };
      }

      const service = await this.prisma.service.update({
        where: { id: serviceId },
        data: { favorite: !existingService.favorite },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.auditLog(updatedBy, tenantId, 'service.favorite_toggled', 'service', service.id, {
        favorite: service.favorite,
      });

      return { ok: true, data: service };
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return { ok: false, error: 'Failed to toggle favorite' };
    }
  }

  async getFavorites(tenantId: string) {
    try {
      const services = await this.prisma.service.findMany({
        where: { 
          tenantId,
          favorite: true,
          isActive: true,
        },
        orderBy: { name: 'asc' },
      });

      return services;
    } catch (error) {
      console.error('Failed to get favorite services:', error);
      return [];
    }
  }
}









