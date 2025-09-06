"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, hasRole } from "@/lib/auth-helpers";
import { CompaniesRepository } from "@/src/server/repos/companies.repo";
import { CreateCompanySchema, UpdateCompanySchema, ActionResult } from "@/src/server/repos/types";
import { prisma } from "@/lib/prisma";

const companiesRepo = new CompaniesRepository();

export async function createCompany(tenantSlug: string, data: any): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to create companies
    // if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "MASTER_ADMIN"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    // Get the master admin user
    const masterAdmin = await prisma.user.findUnique({
      where: { email: 'admin@studiio.com' }
    });

    if (!masterAdmin) {
      return { ok: false, error: "Admin user not found" };
    }

    const validatedData = CreateCompanySchema.parse(data);
    const result = await companiesRepo.create(tenant.id, validatedData, masterAdmin.id);
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/clients/companies`);
      revalidatePath(`/clients/companies`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to create company:", error);
    return { ok: false, error: "Failed to create company" };
  }
}

export async function updateCompany(tenantSlug: string, companyId: string, data: any): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to update companies
    // if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "MASTER_ADMIN"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    // Get the master admin user
    const masterAdmin = await prisma.user.findUnique({
      where: { email: 'admin@studiio.com' }
    });

    if (!masterAdmin) {
      return { ok: false, error: "Admin user not found" };
    }

    const validatedData = UpdateCompanySchema.parse(data);
    const result = await companiesRepo.update(tenant.id, companyId, validatedData, masterAdmin.id);
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/clients/companies`);
      revalidatePath(`/clients/companies`);
      revalidatePath(`/clients/companies/${companyId}/edit`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to update company:", error);
    return { ok: false, error: "Failed to update company" };
  }
}

export async function deleteCompany(tenantSlug: string, companyId: string): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to delete companies
    // if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "MASTER_ADMIN"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    // Get the master admin user
    const masterAdmin = await prisma.user.findUnique({
      where: { email: 'admin@studiio.com' }
    });

    if (!masterAdmin) {
      return { ok: false, error: "Admin user not found" };
    }

    const result = await companiesRepo.delete(tenant.id, companyId, masterAdmin.id);
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/clients/companies`);
      revalidatePath(`/clients/companies`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to delete company:", error);
    return { ok: false, error: "Failed to delete company" };
  }
}

export async function getCompanies(tenantSlug: string, options?: {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can view companies
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    const result = await companiesRepo.list(tenant.id, options);
    return { ok: true, data: result };
  } catch (error) {
    console.error("Failed to get companies:", error);
    return { ok: false, error: "Failed to get companies" };
  }
}

export async function getCompany(tenantSlug: string, companyId: string): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can view companies
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    const result = await companiesRepo.getById(tenant.id, companyId);
    if (result) {
      return { ok: true, data: result };
    } else {
      return { ok: false, error: "Company not found" };
    }
  } catch (error) {
    console.error("Failed to get company:", error);
    return { ok: false, error: "Failed to get company" };
  }
}

export async function getCompanyStats(tenantId: string) {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can view company stats
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    const stats = await companiesRepo.getStats(tenantId);
    return { ok: true, data: stats };
  } catch (error) {
    console.error("Failed to get company stats:", error);
    return { ok: false, error: "Failed to get company stats" };
  }
}
