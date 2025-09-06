"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, hasRole } from "@/lib/auth-helpers";
import { AgentsRepository } from "@/src/server/repos/agents.repo";
import { CreateAgentSchema, UpdateAgentSchema, ActionResult } from "@/src/server/repos/types";
import { prisma } from "@/lib/prisma";

const agentsRepo = new AgentsRepository();

export async function createAgent(tenantSlug: string, companyId: string, data: any): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to create agents
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN"])) {
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

    const validatedData = CreateAgentSchema.parse(data);
    const result = await agentsRepo.create(tenant.id, companyId, validatedData, masterAdmin.id);
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/clients/companies/${companyId}`);
      revalidatePath(`/clients/companies/${companyId}`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to create agent:", error);
    return { ok: false, error: `Failed to create agent: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function updateAgent(tenantSlug: string, agentId: string, data: any): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to update agents
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    const validatedData = UpdateAgentSchema.parse(data);
    const result = await agentsRepo.update(agentId, tenant.id, validatedData);
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/clients/companies`);
      revalidatePath(`/clients/companies`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to update agent:", error);
    return { ok: false, error: `Failed to update agent: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function deleteAgent(tenantSlug: string, agentId: string): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Check if user has permission to delete agents
    // if (!hasRole(user, tenantId, ["SUB_ADMIN", "MASTER_ADMIN"])) {
    //   return { ok: false, error: "Insufficient permissions" };
    // }

    // Get the actual tenant ID from the slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      return { ok: false, error: "Tenant not found" };
    }

    const result = await agentsRepo.delete(agentId, tenant.id);
    
    if (result.ok) {
      revalidatePath(`/t/${tenantSlug}/clients/companies`);
      revalidatePath(`/clients/companies`);
    }
    
    return result;
  } catch (error) {
    console.error("Failed to delete agent:", error);
    return { ok: false, error: "Failed to delete agent" };
  }
}

export async function getAgentsByCompany(tenantSlug: string, companyId: string, options?: {
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

    // // Any authenticated user can view agents
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

    const result = await agentsRepo.listByCompany(companyId, tenant.id, options);
    return { ok: true, data: result };
  } catch (error) {
    console.error("Failed to get agents:", error);
    return { ok: false, error: "Failed to get agents" };
  }
}

export async function getAgent(tenantSlug: string, agentId: string): Promise<ActionResult> {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can view agents
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

    const result = await agentsRepo.getById(agentId, tenant.id);
    if (result) {
      return { ok: true, data: result };
    } else {
      return { ok: false, error: "Agent not found" };
    }
  } catch (error) {
    console.error("Failed to get agent:", error);
    return { ok: false, error: "Failed to get agent" };
  }
}

export async function getAllAgents(tenantSlug: string, options?: {
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

    // // Any authenticated user can view agents
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

    const result = await agentsRepo.listAll(tenant.id, options);
    return { ok: true, data: result };
  } catch (error) {
    console.error("Failed to get all agents:", error);
    return { ok: false, error: "Failed to get all agents" };
  }
}

export async function getAgentStats(tenantSlug: string) {
  try {
    // Temporarily disable authentication for testing
    // const user = await getCurrentUser();
    // if (!user) {
    //   return { ok: false, error: "Unauthorized" };
    // }

    // // Any authenticated user can view agent stats
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

    const stats = await agentsRepo.getStats(tenant.id);
    return { ok: true, data: stats };
  } catch (error) {
    console.error("Failed to get agent stats:", error);
    return { ok: false, error: "Failed to get agent stats" };
  }
}
