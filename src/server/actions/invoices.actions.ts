"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireTenantRole } from "@/lib/auth-helpers";
import { InvoicesRepository } from "../repos/invoices.repo";
import { 
  CreateInvoiceSchema,
  InvoiceStatusSchema,
  ActionResult 
} from "../repos/types";

const invoicesRepo = new InvoicesRepository();

export async function createInvoice(
  tenantId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    // Parse and validate input
    const validatedData = CreateInvoiceSchema.parse(data);

    const invoice = await invoicesRepo.create(tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/invoices`);

    return {
      ok: true,
      data: invoice,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create invoice",
    };
  }
}

export async function updateInvoiceStatus(
  tenantId: string,
  invoiceId: string,
  status: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    // Parse and validate status
    const validatedStatus = InvoiceStatusSchema.parse(status);

    const invoice = await invoicesRepo.updateStatus(invoiceId, tenantId, user.id, validatedStatus);

    revalidatePath(`/t/${tenantId}/invoices`);
    revalidatePath(`/t/${tenantId}/invoices/${invoiceId}`);

    return {
      ok: true,
      data: invoice,
    };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update invoice status",
    };
  }
}

export async function updateInvoice(
  tenantId: string,
  invoiceId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    // Parse and validate input
    const validatedData = CreateInvoiceSchema.partial().parse(data);

    const invoice = await invoicesRepo.update(invoiceId, tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/invoices`);
    revalidatePath(`/t/${tenantId}/invoices/${invoiceId}`);

    return {
      ok: true,
      data: invoice,
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update invoice",
    };
  }
}

export async function getInvoices(
  tenantId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ("SENT" | "CANCELLED" | "PAID" | "DRAFT" | "OVERDUE")[];
    clientId?: string;
  }
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const invoices = await invoicesRepo.list(tenantId, params);

    return {
      ok: true,
      data: invoices,
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch invoices",
    };
  }
}

export async function getInvoice(
  tenantId: string,
  invoiceId: string
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const invoice = await invoicesRepo.getById(invoiceId, tenantId);

    if (!invoice) {
      return {
        ok: false,
        error: "Invoice not found",
      };
    }

    return {
      ok: true,
      data: invoice,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch invoice",
    };
  }
}

export async function getInvoiceStats(tenantId: string) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const stats = await invoicesRepo.getStats(tenantId);

    return {
      ok: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching invoice stats:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch invoice stats",
    };
  }
}

export async function deleteInvoice(
  tenantId: string,
  invoiceId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    const result = await invoicesRepo.delete(invoiceId, tenantId, user.id);

    revalidatePath(`/t/${tenantId}/invoices`);

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete invoice",
    };
  }
}

// Public invoice access for payment (no authentication required)
export async function getPublicInvoice(invoiceId: string) {
  try {
    // For public access, we need to find the invoice without tenant context
    // This is a simplified version - in production you might want to use a public ID
    const invoice = await invoicesRepo.getById(invoiceId, ""); // This won't work as-is

    if (!invoice) {
      return {
        ok: false,
        error: "Invoice not found",
      };
    }

    return {
      ok: true,
      data: invoice,
    };
  } catch (error) {
    console.error("Error fetching public invoice:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch invoice",
    };
  }
}





