import { BaseRepository } from "./base.repo";
import { 
  CreateClientData, 
  UpdateClientData, 
  PaginationParams 
} from "./types";

export class ClientsRepository extends BaseRepository {
  async create(
    tenantId: string,
    createdBy: string,
    data: CreateClientData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const client = await this.prisma.client.create({
        data: {
          ...data,
          tenantId,
          createdBy,
        },
      });

      await this.auditLog(
        createdBy,
        tenantId,
        "client.created",
        "client",
        client.id,
        data
      );

      return client;
    });
  }

  async getById(clientId: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.client.findFirst({
        where: {
          id: clientId,
          tenantId,
          isActive: true,
        },
        include: {
          bookings: {
            orderBy: { start: "desc" },
            take: 10,
          },
          invoices: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });
    });
  }

  async update(
    clientId: string,
    tenantId: string,
    updatedBy: string,
    data: UpdateClientData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const existing = await this.prisma.client.findFirst({
        where: { id: clientId, tenantId },
      });

      if (!existing) {
        throw new Error(`Client ${clientId} not found`);
      }

      const client = await this.prisma.client.update({
        where: { id: clientId },
        data,
      });

      await this.auditLog(
        updatedBy,
        tenantId,
        "client.updated",
        "client",
        clientId,
        { before: existing, after: data }
      );

      return client;
    });
  }

  async list(
    tenantId: string,
    params: PaginationParams = {}
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const { page = 1, limit = 20, search } = params;
      const skip = (page - 1) * limit;

      const where: any = { 
        tenantId, 
        isActive: true 
      };

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
          { companyId: { contains: search } },
        ];
      }

      const [clients, total] = await Promise.all([
        this.prisma.client.findMany({
          where,
          include: {
            _count: {
              select: {
                bookings: true,
                invoices: true,
              },
            },
          },
          orderBy: { name: "asc" },
          skip,
          take: limit,
        }),
        this.prisma.client.count({ where }),
      ]);

      return {
        data: clients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    });
  }

  async search(
    tenantId: string,
    query: string,
    limit: number = 10
  ) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.client.findMany({
        where: {
          tenantId,
          isActive: true,
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { companyId: { contains: query } },
          ],
        },
        orderBy: { name: "asc" },
        take: limit,
      });
    });
  }

  async softDelete(
    clientId: string,
    tenantId: string,
    deletedBy: string
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, tenantId },
      });

      if (!client) {
        throw new Error(`Client ${clientId} not found`);
      }

      const updatedClient = await this.prisma.client.update({
        where: { id: clientId },
        data: { isActive: false },
      });

      await this.auditLog(
        deletedBy,
        tenantId,
        "client.deleted",
        "client",
        clientId,
        client
      );

      return updatedClient;
    });
  }

  async restore(
    clientId: string,
    tenantId: string,
    restoredBy: string
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, tenantId },
      });

      if (!client) {
        throw new Error(`Client ${clientId} not found`);
      }

      const updatedClient = await this.prisma.client.update({
        where: { id: clientId },
        data: { isActive: true },
      });

      await this.auditLog(
        restoredBy,
        tenantId,
        "client.restored",
        "client",
        clientId,
        client
      );

      return updatedClient;
    });
  }
}





