import { PrismaClient } from '@prisma/client/edge';
import {withAccelerate} from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate())

export interface CreateImageData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  altText?: string;
  tenantId: string;
  uploadedBy: string;
}

export interface ImageData {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string;
  altText: string | null;
  tenantId: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ImageRepo {
  async createImage(data: CreateImageData): Promise<ImageData> {
    return await prisma.image.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        mimeType: data.mimeType,
        size: data.size,
        width: data.width,
        height: data.height,
        url: data.url,
        altText: data.altText,
        tenantId: data.tenantId,
        uploadedBy: data.uploadedBy,
      },
    });
  }

  async getImageById(id: string): Promise<ImageData | null> {
    return await prisma.image.findUnique({
      where: { id },
    });
  }

  async getImagesByTenant(tenantId: string): Promise<ImageData[]> {
    return await prisma.image.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getImagesByUser(userId: string): Promise<ImageData[]> {
    return await prisma.image.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateImage(id: string, data: Partial<CreateImageData>): Promise<ImageData> {
    return await prisma.image.update({
      where: { id },
      data,
    });
  }

  async deleteImage(id: string): Promise<ImageData> {
    return await prisma.image.delete({
      where: { id },
    });
  }

  async getImageUsageCount(imageId: string): Promise<number> {
    // Count how many times this image is used in newsletters
    const newsletterUsage = await prisma.newsletterContent.count({
      where: {
        type: 'image',
        content: { contains: imageId },
      },
    });

    return newsletterUsage;
  }
}
