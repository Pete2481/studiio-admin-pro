import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AgentsRepository {

  async create(tenantId: string, companyId: string, data: {
    name: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    role: string;
  }, createdBy: string) {
    try {
      const agent = await prisma.agent.create({
        data: {
          ...data,
          tenantId,
          companyId,
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
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { ok: true, data: agent };
    } catch (error) {
      console.error('Failed to create agent:', error);
      return { ok: false, error: 'Failed to create agent' };
    }
  }

  async update(agentId: string, tenantId: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    role?: string;
    isActive?: boolean;
  }) {
    try {
      const agent = await prisma.agent.update({
        where: { id: agentId, tenantId },
        data,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { ok: true, data: agent };
    } catch (error) {
      console.error('Failed to update agent:', error);
      return { ok: false, error: 'Failed to update agent' };
    }
  }

  async delete(agentId: string, tenantId: string) {
    try {
      await prisma.agent.delete({
        where: { id: agentId, tenantId },
      });

      return { ok: true };
    } catch (error) {
      console.error('Failed to delete agent:', error);
      return { ok: false, error: 'Failed to delete agent' };
    }
  }

  async getById(agentId: string, tenantId: string) {
    try {
      const agent = await prisma.agent.findFirst({
        where: { id: agentId, tenantId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return agent;
    } catch (error) {
      console.error('Failed to get agent:', error);
      return null;
    }
  }

  async listByCompany(companyId: string, tenantId: string, options?: {
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
        companyId,
        tenantId,
      };

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { role: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [agents, total] = await Promise.all([
        prisma.agent.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.agent.count({ where }),
      ]);

      return {
        agents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Failed to list agents:', error);
      return { agents: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } };
    }
  }

  async listAll(tenantId: string, options?: {
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
        limit = 100,
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
          { email: { contains: search, mode: 'insensitive' } },
          { role: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [agents, total] = await Promise.all([
        prisma.agent.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { name: 'asc' },
          skip,
          take: limit,
        }),
        prisma.agent.count({ where }),
      ]);

      return {
        agents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Failed to list all agents:', error);
      return { agents: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 } };
    }
  }

  async getStats(tenantId: string) {
    try {
      const [totalAgents, activeAgents, totalCompanies] = await Promise.all([
        prisma.agent.count({ where: { tenantId } }),
        prisma.agent.count({ where: { tenantId, isActive: true } }),
        prisma.company.count({ where: { tenantId } }),
      ]);

      return {
        totalAgents,
        activeAgents,
        totalCompanies,
      };
    } catch (error) {
      console.error('Failed to get agent stats:', error);
      return { totalAgents: 0, activeAgents: 0, totalCompanies: 0 };
    }
  }
}
