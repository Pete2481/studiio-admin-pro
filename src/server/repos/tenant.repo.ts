import { PrismaClient, Tenant } from '@prisma/client';

const prisma = new PrismaClient();

export class TenantsRepository {
  async findBySlug(slug: string): Promise<Tenant | null> {
    return await prisma.tenant.findUnique({
      where: { slug },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return await prisma.tenant.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Tenant[]> {
    return await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    domain?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    isActive?: boolean;
  }): Promise<Tenant> {
    return await prisma.tenant.create({
      data,
    });
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    return await prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Tenant> {
    return await prisma.tenant.delete({
      where: { id },
    });
  }
}

export const tenantsRepo = new TenantsRepository();
