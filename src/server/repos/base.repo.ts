import { PrismaClient } from "@prisma/client";

export class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  protected async withTenantGuard<T>(
    tenantId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    // Verify tenant exists and is active
    const tenant = await this.prisma.tenant.findFirst({
      where: { id: tenantId, isActive: true },
    });

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found or inactive`);
    }

    return operation();
  }

  protected async auditLog(
    actorUserId: string,
    tenantId: string,
    action: string,
    entity: string,
    entityId: string,
    diff?: any
  ) {
    await this.prisma.auditLog.create({
      data: {
        actorUserId,
        tenantId,
        action,
        entity,
        entityId,
        diff: diff ? JSON.stringify(diff) : null,
      },
    });
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

















