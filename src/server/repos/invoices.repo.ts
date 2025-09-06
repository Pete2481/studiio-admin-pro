import { BaseRepository } from "./base.repo";
import { 
  CreateInvoiceData, 
  InvoiceStatus,
  PaginationParams 
} from "./types";

export class InvoicesRepository extends BaseRepository {
  async create(
    tenantId: string,
    createdBy: string,
    data: CreateInvoiceData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      // Generate invoice number
      const lastInvoice = await this.prisma.invoice.findFirst({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });

      const invoiceNumber = lastInvoice 
        ? `INV-${String(parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1).padStart(3, '0')}`
        : 'INV-001';

      const invoice = await this.prisma.invoice.create({
        data: {
          ...data,
          invoiceNumber,
          tenantId,
          createdBy,
        },
        include: {
          client: true,
        },
      });

      await this.auditLog(
        createdBy,
        tenantId,
        "invoice.created",
        "invoice",
        invoice.id,
        data
      );

      return invoice;
    });
  }

  async getById(invoiceId: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          tenantId,
        },
        include: {
          client: true,
        },
      });
    });
  }

  async getByInvoiceNumber(invoiceNumber: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.invoice.findFirst({
        where: {
          invoiceNumber,
          tenantId,
        },
        include: {
          client: true,
        },
      });
    });
  }

  async updateStatus(
    invoiceId: string,
    tenantId: string,
    updatedBy: string,
    status: InvoiceStatus
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const existing = await this.prisma.invoice.findFirst({
        where: { id: invoiceId, tenantId },
      });

      if (!existing) {
        throw new Error(`Invoice ${invoiceId} not found`);
      }

      const invoice = await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
        include: {
          client: true,
        },
      });

      await this.auditLog(
        updatedBy,
        tenantId,
        "invoice.status_updated",
        "invoice",
        invoiceId,
        { oldStatus: existing.status, newStatus: status }
      );

      return invoice;
    });
  }

  async update(
    invoiceId: string,
    tenantId: string,
    updatedBy: string,
    data: Partial<CreateInvoiceData>
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const existing = await this.prisma.invoice.findFirst({
        where: { id: invoiceId, tenantId },
      });

      if (!existing) {
        throw new Error(`Invoice ${invoiceId} not found`);
      }

      const invoice = await this.prisma.invoice.update({
        where: { id: invoiceId },
        data,
        include: {
          client: true,
        },
      });

      await this.auditLog(
        updatedBy,
        tenantId,
        "invoice.updated",
        "invoice",
        invoiceId,
        { before: existing, after: data }
      );

      return invoice;
    });
  }

  async list(
    tenantId: string,
    params: PaginationParams & {
      status?: InvoiceStatus[];
      clientId?: string;
    } = {}
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const { page = 1, limit = 20, search, status, clientId } = params;
      const skip = (page - 1) * limit;

      const where: any = { tenantId };

      if (search) {
        where.OR = [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      if (status?.length) {
        where.status = { in: status };
      }

      if (clientId) {
        where.clientId = clientId;
      }

      const [invoices, total] = await Promise.all([
        this.prisma.invoice.findMany({
          where,
          include: {
            client: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        this.prisma.invoice.count({ where }),
      ]);

      return {
        data: invoices,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    });
  }

  async getStats(tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      const [total, paid, pending, overdue] = await Promise.all([
        this.prisma.invoice.count({ where: { tenantId } }),
        this.prisma.invoice.count({ 
          where: { tenantId, status: "PAID" } 
        }),
        this.prisma.invoice.count({ 
          where: { tenantId, status: { in: ["DRAFT", "SENT"] } } 
        }),
        this.prisma.invoice.count({ 
          where: { tenantId, status: "OVERDUE" } 
        }),
      ]);

      const totalAmount = await this.prisma.invoice.aggregate({
        where: { tenantId },
        _sum: { amountCents: true },
      });

      return {
        total,
        paid,
        pending,
        overdue,
        totalAmountCents: totalAmount._sum.amountCents || 0,
      };
    });
  }

  async delete(
    invoiceId: string,
    tenantId: string,
    deletedBy: string
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const invoice = await this.prisma.invoice.findFirst({
        where: { id: invoiceId, tenantId },
      });

      if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
      }

      await this.prisma.invoice.delete({
        where: { id: invoiceId },
      });

      await this.auditLog(
        deletedBy,
        tenantId,
        "invoice.deleted",
        "invoice",
        invoiceId,
        invoice
      );

      return { success: true };
    });
  }
}









