import { PrismaClient, Company } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyRepository {
  async findByTenant(tenantId: string): Promise<Company[]> {
    return await prisma.company.findMany({
      where: { tenantId },
      include: {
        agents: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Company | null> {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        agents: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async create(data: {
    name: string;
    type?: string;
    phone?: string;
    email?: string;
    invoiceEmails?: string;
    password?: string;
    logoUrl?: string;
    isActive?: boolean;
    propertiesCount?: number;
    clientsCount?: number;
    salesVolume?: string;
    permissions?: string;
    sendWelcomeEmail?: boolean;
    tenantId: string;
    createdBy: string;
  }): Promise<Company> {
    return await prisma.company.create({
      data,
      include: {
        agents: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Partial<Company>): Promise<Company> {
    return await prisma.company.update({
      where: { id },
      data,
      include: {
        agents: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Company> {
    return await prisma.company.delete({
      where: { id },
    });
  }

  async deleteByTenant(tenantId: string): Promise<{ count: number }> {
    return await prisma.company.deleteMany({
      where: { tenantId },
    });
  }

  async getAgentsByCompany(companyId: string) {
    return await prisma.agent.findMany({
      where: { companyId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const companyRepo = new CompanyRepository();
