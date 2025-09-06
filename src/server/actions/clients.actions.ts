"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireTenantRole } from "@/lib/auth-helpers";
import { ClientsRepository } from "../repos/clients.repo";
import { 
  CreateClientSchema, 
  UpdateClientSchema,
  ActionResult 
} from "../repos/types";

const clientsRepo = new ClientsRepository();

export async function createClient(
  tenantId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    // Parse and validate input
    const validatedData = CreateClientSchema.parse(data);

    const client = await clientsRepo.create(tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/clients`);

    return {
      ok: true,
      data: client,
    };
  } catch (error) {
    console.error("Error creating client:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create client",
    };
  }
}

export async function updateClient(
  tenantId: string,
  clientId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    // Parse and validate input
    const validatedData = UpdateClientSchema.parse(data);

    const client = await clientsRepo.update(clientId, tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/clients`);
    revalidatePath(`/t/${tenantId}/clients/${clientId}`);

    return {
      ok: true,
      data: client,
    };
  } catch (error) {
    console.error("Error updating client:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update client",
    };
  }
}

export async function deleteClient(
  tenantId: string,
  clientId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    const client = await clientsRepo.softDelete(clientId, tenantId, user.id);

    revalidatePath(`/t/${tenantId}/clients`);

    return {
      ok: true,
      data: client,
    };
  } catch (error) {
    console.error("Error deleting client:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}

export async function restoreClient(
  tenantId: string,
  clientId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    const client = await clientsRepo.restore(clientId, tenantId, user.id);

    revalidatePath(`/t/${tenantId}/clients`);

    return {
      ok: true,
      data: client,
    };
  } catch (error) {
    console.error("Error restoring client:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to restore client",
    };
  }
}

export async function getClients(
  tenantId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  }
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const clients = await clientsRepo.list(tenantId, params);

    return {
      ok: true,
      data: clients,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch clients",
    };
  }
}

export async function getClient(
  tenantId: string,
  clientId: string
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const client = await clientsRepo.getById(clientId, tenantId);

    if (!client) {
      return {
        ok: false,
        error: "Client not found",
      };
    }

    return {
      ok: true,
      data: client,
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch client",
    };
  }
}

export async function searchClients(
  tenantId: string,
  query: string,
  limit: number = 10
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const clients = await clientsRepo.search(tenantId, query, limit);

    return {
      ok: true,
      data: clients,
    };
  } catch (error) {
    console.error("Error searching clients:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to search clients",
    };
  }
}





