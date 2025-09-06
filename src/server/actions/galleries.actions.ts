"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, hasRole, requireTenantRole } from "@/lib/auth-helpers";
import { GalleriesRepository } from "@/src/server/repos/galleries.repo";
import { 
  CreateGallerySchema, 
  AddAssetSchema,
  ActionResult 
} from "@/src/server/repos/types";

const galleriesRepo = new GalleriesRepository();

export async function createGallery(
  tenantId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"])) {
      return { ok: false, error: "Insufficient permissions" };
    }

    // Parse and validate input
    const validatedData = CreateGallerySchema.parse(data);

    const gallery = await galleriesRepo.create(tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/galleries`);

    return {
      ok: true,
      data: gallery,
    };
  } catch (error) {
    console.error("Error creating gallery:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to create gallery",
    };
  }
}

export async function updateGallery(
  tenantId: string,
  galleryId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"])) {
      return { ok: false, error: "Insufficient permissions" };
    }

    // Parse and validate input
    const validatedData = CreateGallerySchema.partial().parse(data);

    const gallery = await galleriesRepo.update(galleryId, tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/galleries`);
    revalidatePath(`/t/${tenantId}/galleries/${galleryId}`);

    return {
      ok: true,
      data: gallery,
    };
  } catch (error) {
    console.error("Error updating gallery:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to update gallery",
    };
  }
}

export async function addAsset(
  tenantId: string,
  galleryId: string,
  data: any
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    if (!hasRole(user.id, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"])) {
      return { ok: false, error: "Insufficient permissions" };
    }

    // Parse and validate input
    const validatedData = AddAssetSchema.parse(data);

    const asset = await galleriesRepo.addAsset(galleryId, tenantId, user.id, validatedData);

    revalidatePath(`/t/${tenantId}/galleries/${galleryId}`);

    return {
      ok: true,
      data: asset,
    };
  } catch (error) {
    console.error("Error adding asset:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to add asset",
    };
  }
}

export async function removeAsset(
  tenantId: string,
  assetId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const result = await galleriesRepo.removeAsset(assetId, tenantId, user.id);

    revalidatePath(`/t/${tenantId}/galleries`);

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("Error removing asset:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to remove asset",
    };
  }
}

export async function extendExpiry(
  tenantId: string,
  galleryId: string,
  newExpiry: Date
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const gallery = await galleriesRepo.extendExpiry(galleryId, tenantId, user.id, newExpiry);

    revalidatePath(`/t/${tenantId}/galleries/${galleryId}`);

    return {
      ok: true,
      data: gallery,
    };
  } catch (error) {
    console.error("Error extending expiry:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to extend expiry",
    };
  }
}

export async function getGalleries(
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

    const galleries = await galleriesRepo.list(tenantId, params);

    return {
      ok: true,
      data: galleries,
    };
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch galleries",
    };
  }
}

export async function getGallery(
  tenantId: string,
  galleryId: string
) {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN", "PHOTOGRAPHER", "EDITOR"]);

    const gallery = await galleriesRepo.getById(galleryId, tenantId);

    if (!gallery) {
      return {
        ok: false,
        error: "Gallery not found",
      };
    }

    return {
      ok: true,
      data: gallery,
    };
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch gallery",
    };
  }
}

export async function deleteGallery(
  tenantId: string,
  galleryId: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    
    // Check if user has access to tenant
    await requireTenantRole(user, tenantId, ["SUB_ADMIN"]);

    const result = await galleriesRepo.delete(galleryId, tenantId, user.id);

    revalidatePath(`/t/${tenantId}/galleries`);

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to delete gallery",
    };
  }
}

// Public gallery access (no authentication required)
export async function getPublicGallery(publicId: string) {
  try {
    const gallery = await galleriesRepo.getByPublicId(publicId);

    if (!gallery) {
      return {
        ok: false,
        error: "Gallery not found or expired",
      };
    }

    return {
      ok: true,
      data: gallery,
    };
  } catch (error) {
    console.error("Error fetching public gallery:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to fetch gallery",
    };
  }
}
