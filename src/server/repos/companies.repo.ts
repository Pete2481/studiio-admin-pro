import { prisma } from '@/lib/prisma';

export class CompaniesRepository {

  async create(tenantId: string, data: any, createdBy: string) {
    try {
      const company = await prisma.company.create({
        data: {
          ...data,
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

      // await this.auditLog(createdBy, tenantId, 'company.created', 'company', company.id, {
      //   name: company.name,
      //   type: company.type,
      // });

      return { ok: true, data: company };
    } catch (error) {
      console.error('Failed to create company:', error);
      return { ok: false, error: 'Failed to create company' };
    }
  }

  async update(tenantId: string, companyId: string, data: any, updatedBy: string) {
    try {
      const existingCompany = await prisma.company.findFirst({
        where: { id: companyId, tenantId },
      });

      if (!existingCompany) {
        return { ok: false, error: 'Company not found' };
      }

      const company = await prisma.company.update({
        where: { id: companyId },
        data,
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

      // await this.auditLog(updatedBy, tenantId, 'company.updated', 'company', company.id, {
      //   name: company.name,
      //   type: company.type,
      // });

      return { ok: true, data: company };
    } catch (error) {
      console.error('Failed to update company:', error);
      return { ok: false, error: 'Failed to update company' };
    }
  }

  async delete(tenantId: string, companyId: string, deletedBy: string) {
    try {
      const existingCompany = await prisma.company.findFirst({
        where: { id: companyId, tenantId },
      });

      if (!existingCompany) {
        return { ok: false, error: 'Company not found' };
      }

      await prisma.company.delete({
        where: { id: companyId },
      });

      // await this.auditLog(deletedBy, tenantId, 'company.deleted', 'company', companyId, {
      //   name: existingCompany.name,
      // });

      return { ok: true };
    } catch (error) {
      console.error('Failed to delete company:', error);
      return { ok: false, error: 'Failed to delete company' };
    }
  }

  async getById(tenantId: string, companyId: string) {
    try {
      const company = await prisma.company.findFirst({
        where: { id: companyId, tenantId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          clients: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return company;
    } catch (error) {
      console.error('Failed to get company:', error);
      return null;
    }
  }

  async list(tenantId: string, options?: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        isActive = true,
        search = '',
        page = 1,
        limit = 50,
      } = options || {};

      const where: any = {
        tenantId,
      };

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                clients: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.company.count({ where }),
      ]);

      return {
        companies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Failed to list companies:', error);
      return { companies: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } };
    }
  }

  async getStats(tenantId: string) {
    try {
      const [totalCompanies, activeCompanies, totalClients] = await Promise.all([
        prisma.company.count({ where: { tenantId } }),
        prisma.company.count({ where: { tenantId, isActive: true } }),
        prisma.client.count({ where: { tenantId } }),
      ]);

      return {
        totalCompanies,
        activeCompanies,
        totalClients,
      };
    } catch (error) {
      console.error('Failed to get company stats:', error);
      return { totalCompanies: 0, activeCompanies: 0, totalClients: 0 };
    }
  }
}
