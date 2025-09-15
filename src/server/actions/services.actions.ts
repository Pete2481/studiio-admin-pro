"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, hasRole } from "@/lib/auth-helpers";
import { ServicesRepository } from "@/src/server/repos/services.repo";
import { CreateServiceSchema, UpdateServiceSchema, ActionResult } from "@/src/server/repos/types";
import { prisma } from "@/lib/prisma";

const servicesRepo = new ServicesRepository();

export async function createService(tenantSlug: string, data: any): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to create services
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

    const result = await servicesRepo.create(tenant.id, data, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/services`);
      revalidatePath(`/services`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to create service:", error);
    return { ok: false, error: "Failed to create service" };
  }
}

export async function updateService(tenantSlug: string, serviceId: string, data: any): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to update services
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

    const result = await servicesRepo.update(tenant.id, serviceId, data, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/services`);
      revalidatePath(`/services`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to update service:", error);
    return { ok: false, error: "Failed to update service" };
  }
}

export async function deleteService(tenantSlug: string, serviceId: string): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to delete services
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

    const result = await servicesRepo.delete(tenant.id, serviceId, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/services`);
      revalidatePath(`/services`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to delete service:", error);
    return { ok: false, error: "Failed to delete service" };
  }
}

export async function toggleServiceFavorite(tenantSlug: string, serviceId: string): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can toggle favorites
    // if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "MASTER_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    const result = await servicesRepo.toggleFavorite(tenant.id, serviceId, "cmfddbqg4000012snce1yz7a4");
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/services`);
      revalidatePath(`/services`);
      revalidatePath(`/calendar`); // Revalidate calendar for quick booking updates
    }
    
    return result;
  } catch (error) {
    console.error("Failed to toggle service favorite:", error);
    return { ok: false, error: "Failed to toggle favorite" };
  }
}

export async function getServices(tenantSlug: string, options?: {
  isActive?: boolean;
  favorite?: boolean;
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

    // // Any authenticated user can view services
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

    const result = await servicesRepo.list(tenant.id, options);
    return { ok: true, data: result };
  } catch (error) {
    console.error("Failed to get services:", error);
    return { ok: false, error: "Failed to get services" };
  }
}

export async function getService(tenantId: string, serviceId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { ok: false, error: "Unauthorized" };
    }

    // Any authenticated user can view services
    if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"])) {
      return { ok: false, error: "Insufficient permissions" };
    }

    const service = await servicesRepo.getById(tenantId, serviceId);
    if (!service) {
      return { ok: false, error: "Service not found" };
    }

    return { ok: true, data: service };
  } catch (error) {
    console.error("Failed to get service:", error);
    return { ok: false, error: "Failed to get service" };
  }
}

export async function getFavoriteServices(tenantId: string) {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can view favorite services
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN", "PHOTOGRAPHER", "EDITOR", "CLIENT"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    const services = await servicesRepo.getFavorites(tenantId);
    return { ok: true, data: services };
  } catch (error) {
    console.error("Failed to get favorite services:", error);
    return { ok: false, error: "Failed to get favorite services" };
  }
}
