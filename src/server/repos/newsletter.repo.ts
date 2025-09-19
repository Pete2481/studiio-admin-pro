import { PrismaClient } from '@prisma/client/edge';
import {withAccelerate} from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate())

export interface CreateNewsletterData {
  title: string;
  subject: string;
  tenantId: string;
  createdBy: string;
}

export interface CreateContentBlockData {
  newsletterId: string;
  type: 'text' | 'image' | 'heading' | 'button' | 'divider';
  content: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  order: number;
  metadata?: string;
}

export interface CreateRecipientData {
  newsletterId: string;
  clientId?: string;
  email: string; // Required if no clientId is provided
}

export class NewsletterRepo {

  async createNewsletter(data: CreateNewsletterData) {
    return prisma.newsletter.create({
      data,
      include: {
        content: true,
        recipients: true,
      },
    });
  }

  async getNewsletterById(id: string) {
    return prisma.newsletter.findUnique({
      where: { id },
      include: {
        content: {
          orderBy: { order: 'asc' },
        },
        recipients: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  async updateNewsletter(id: string, data: Partial<CreateNewsletterData>) {
    return prisma.newsletter.update({
      where: { id },
      data,
      include: {
        content: true,
        recipients: true,
      },
    });
  }

  async deleteNewsletter(id: string) {
    return prisma.newsletter.delete({
      where: { id },
    });
  }

  async addContentBlock(data: CreateContentBlockData) {
    return prisma.newsletterContent.create({
      data,
    });
  }

  async updateContentBlock(id: string, data: Partial<CreateContentBlockData>) {
    return prisma.newsletterContent.update({
      where: { id },
      data,
    });
  }

  async deleteContentBlock(id: string) {
    return prisma.newsletterContent.delete({
      where: { id },
    });
  }

  async addRecipients(data: CreateRecipientData[]) {
    return prisma.newsletterRecipient.createMany({
      data,
    });
  }

  async getNewslettersByTenant(tenantId: string) {
    return prisma.newsletter.findMany({
      where: { tenantId },
      include: {
        content: {
          orderBy: { order: 'asc' },
        },
        recipients: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClientsByTenant(tenantId: string) {
    return prisma.client.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      include: {
        company: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async markNewsletterAsSent(id: string) {
    return prisma.newsletter.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });
  }
}
