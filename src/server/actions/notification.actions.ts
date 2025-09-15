import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CreateNotificationData {
  title: string;
  message: string;
  type: string;
  category: string;
  priority?: string;
  bookingId?: string;
  galleryId?: string;
  invoiceId?: string;
  clientId?: string;
  userId?: string;
  data?: any;
  actionUrl?: string;
  actionText?: string;
  tenantId: string;
  createdBy?: string;
  expiresAt?: Date;
}

export interface UpdateNotificationData {
  title?: string;
  message?: string;
  type?: string;
  category?: string;
  priority?: string;
  status?: string;
  isRead?: boolean;
  isArchived?: boolean;
  data?: any;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: Date;
}

export interface NotificationFilters {
  tenantId: string;
  clientId?: string;
  userId?: string;
  type?: string;
  category?: string;
  priority?: string;
  status?: string;
  isRead?: boolean;
  isArchived?: boolean;
  bookingId?: string;
  galleryId?: string;
  invoiceId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        category: data.category,
        priority: data.priority || 'normal',
        bookingId: data.bookingId,
        galleryId: data.galleryId,
        invoiceId: data.invoiceId,
        clientId: data.clientId,
        userId: data.userId,
        data: data.data ? JSON.stringify(data.data) : null,
        actionUrl: data.actionUrl,
        actionText: data.actionText,
        tenantId: data.tenantId,
        createdBy: data.createdBy,
        expiresAt: data.expiresAt,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
            status: true,
          },
        },
        gallery: {
          select: {
            id: true,
            title: true,
            publicId: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            amountCents: true,
            status: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath('/client-admin/notifications');
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function getNotifications(filters: NotificationFilters) {
  try {
    const where: any = {
      tenantId: filters.tenantId,
    };

    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;
    if (filters.priority) where.priority = filters.priority;
    if (filters.status) where.status = filters.status;
    if (filters.isRead !== undefined) where.isRead = filters.isRead;
    if (filters.isArchived !== undefined) where.isArchived = filters.isArchived;
    if (filters.bookingId) where.bookingId = filters.bookingId;
    if (filters.galleryId) where.galleryId = filters.galleryId;
    if (filters.invoiceId) where.invoiceId = filters.invoiceId;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { message: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
            status: true,
          },
        },
        gallery: {
          select: {
            id: true,
            title: true,
            publicId: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            amountCents: true,
            status: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });

    const total = await prisma.notification.count({ where });

    return { success: true, data: { notifications, total } };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function getNotificationById(id: string) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
            status: true,
          },
        },
        gallery: {
          select: {
            id: true,
            title: true,
            publicId: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            amountCents: true,
            status: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    return { success: true, data: notification };
  } catch (error) {
    console.error('Error fetching notification:', error);
    return { success: false, error: 'Failed to fetch notification' };
  }
}

export async function updateNotification(id: string, data: UpdateNotificationData) {
  try {
    const updateData: any = { ...data };
    
    if (data.isRead && !data.isRead) {
      updateData.readAt = null;
    } else if (data.isRead) {
      updateData.readAt = new Date();
    }

    if (data.isArchived && !data.isArchived) {
      updateData.archivedAt = null;
    } else if (data.isArchived) {
      updateData.archivedAt = new Date();
    }

    if (data.data) {
      updateData.data = JSON.stringify(data.data);
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        booking: {
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
            status: true,
          },
        },
        gallery: {
          select: {
            id: true,
            title: true,
            publicId: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            amountCents: true,
            status: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath('/client-admin/notifications');
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error updating notification:', error);
    return { success: false, error: 'Failed to update notification' };
  }
}

export async function deleteNotification(id: string) {
  try {
    await prisma.notification.delete({
      where: { id },
    });

    revalidatePath('/client-admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'read',
      },
    });

    revalidatePath('/client-admin/notifications');
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsAsRead(tenantId: string, clientId?: string) {
  try {
    const where: any = { tenantId, isRead: false };
    if (clientId) where.clientId = clientId;

    await prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'read',
      },
    });

    revalidatePath('/client-admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark all notifications as read' };
  }
}

export async function archiveNotification(id: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        status: 'archived',
      },
    });

    revalidatePath('/client-admin/notifications');
    return { success: true, data: notification };
  } catch (error) {
    console.error('Error archiving notification:', error);
    return { success: false, error: 'Failed to archive notification' };
  }
}

export async function getNotificationStats(tenantId: string, clientId?: string) {
  try {
    const where: any = { tenantId };
    if (clientId) where.clientId = clientId;

    const [total, unread, byType, byCategory, byPriority] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { ...where, isRead: false } }),
      prisma.notification.groupBy({
        by: ['type'],
        where,
        _count: { type: true },
      }),
      prisma.notification.groupBy({
        by: ['category'],
        where,
        _count: { category: true },
      }),
      prisma.notification.groupBy({
        by: ['priority'],
        where,
        _count: { priority: true },
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        unread,
        byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: item._count.type }), {}),
        byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item.category]: item._count.category }), {}),
        byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item.priority]: item._count.priority }), {}),
      },
    };
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    return { success: false, error: 'Failed to fetch notification stats' };
  }
}



