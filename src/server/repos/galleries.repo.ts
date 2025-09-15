import { BaseRepository } from "./base.repo";
import { 
  CreateGalleryData, 
  AddAssetData,
  PaginationParams 
} from "./types";
import { generateToken } from "@/lib/utils";

export class GalleriesRepository extends BaseRepository {
  async create(
    tenantId: string,
    createdBy: string,
    data: CreateGalleryData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const publicId = generateToken(16);
      
      const gallery = await this.prisma.gallery.create({
        data: {
          ...data,
          publicId,
          tenantId,
          createdBy,
        },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      });

      await this.auditLog(
        createdBy,
        tenantId,
        "gallery.created",
        "gallery",
        gallery.id,
        data
      );

      return gallery;
    });
  }

  async getById(galleryId: string, tenantId: string) {
    return this.withTenantGuard(tenantId, async () => {
      return this.prisma.gallery.findFirst({
        where: {
          id: galleryId,
          tenantId,
        },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          booking: {
            include: {
              client: true,
            },
          },
        },
      });
    });
  }

  async getByPublicId(publicId: string) {
    return this.prisma.gallery.findFirst({
      where: {
        publicId,
        isPublic: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        booking: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  async update(
    galleryId: string,
    tenantId: string,
    updatedBy: string,
    data: Partial<CreateGalleryData>
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const existing = await this.prisma.gallery.findFirst({
        where: { id: galleryId, tenantId },
      });

      if (!existing) {
        throw new Error(`Gallery ${galleryId} not found`);
      }

      const gallery = await this.prisma.gallery.update({
        where: { id: galleryId },
        data,
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      });

      await this.auditLog(
        updatedBy,
        tenantId,
        "gallery.updated",
        "gallery",
        galleryId,
        { before: existing, after: data }
      );

      return gallery;
    });
  }

  async addAsset(
    galleryId: string,
    tenantId: string,
    addedBy: string,
    data: AddAssetData
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const gallery = await this.prisma.gallery.findFirst({
        where: { id: galleryId, tenantId },
      });

      if (!gallery) {
        throw new Error(`Gallery ${galleryId} not found`);
      }

      const asset = await this.prisma.galleryImage.create({
        data: {
          ...data,
          galleryId,
        },
      });

      await this.auditLog(
        addedBy,
        tenantId,
        "gallery.asset_added",
        "gallery_image",
        asset.id,
        data
      );

      return asset;
    });
  }

  async removeAsset(
    assetId: string,
    tenantId: string,
    removedBy: string
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const asset = await this.prisma.galleryImage.findFirst({
        where: { id: assetId },
        include: { gallery: true },
      });

      if (!asset || asset.gallery.tenantId !== tenantId) {
        throw new Error(`Asset ${assetId} not found`);
      }

      await this.prisma.galleryImage.delete({
        where: { id: assetId },
      });

      await this.auditLog(
        removedBy,
        tenantId,
        "gallery.asset_removed",
        "gallery_image",
        assetId,
        asset
      );

      return { success: true };
    });
  }

  async extendExpiry(
    galleryId: string,
    tenantId: string,
    extendedBy: string,
    newExpiry: Date
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const gallery = await this.prisma.gallery.findFirst({
        where: { id: galleryId, tenantId },
      });

      if (!gallery) {
        throw new Error(`Gallery ${galleryId} not found`);
      }

      const updatedGallery = await this.prisma.gallery.update({
        where: { id: galleryId },
        data: { expiresAt: newExpiry },
      });

      await this.auditLog(
        extendedBy,
        tenantId,
        "gallery.expiry_extended",
        "gallery",
        galleryId,
        { oldExpiry: gallery.expiresAt, newExpiry }
      );

      return updatedGallery;
    });
  }

  async list(
    tenantId: string,
    params: PaginationParams = {}
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const { page = 1, limit = 20, search } = params;
      const skip = (page - 1) * limit;

      const where: any = { tenantId };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const [galleries, total] = await Promise.all([
        this.prisma.gallery.findMany({
          where,
          include: {
            _count: {
              select: {
                images: true,
              },
            },
            booking: {
              include: {
                client: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        this.prisma.gallery.count({ where }),
      ]);

      return {
        data: galleries,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    });
  }

  async delete(
    galleryId: string,
    tenantId: string,
    deletedBy: string
  ) {
    return this.withTenantGuard(tenantId, async () => {
      const gallery = await this.prisma.gallery.findFirst({
        where: { id: galleryId, tenantId },
        include: { images: true },
      });

      if (!gallery) {
        throw new Error(`Gallery ${galleryId} not found`);
      }

      await this.prisma.gallery.delete({
        where: { id: galleryId },
      });

      await this.auditLog(
        deletedBy,
        tenantId,
        "gallery.deleted",
        "gallery",
        galleryId,
        gallery
      );

      return { success: true };
    });
  }
}


















