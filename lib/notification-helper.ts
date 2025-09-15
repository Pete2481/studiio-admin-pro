import { createNotificationFromTemplate, NOTIFICATION_TEMPLATES } from './notification-types';

/**
 * Helper functions for creating notifications throughout the application
 */

export interface CreateNotificationOptions {
  tenantId: string;
  clientId?: string;
  userId?: string;
  createdBy?: string;
  bookingId?: string;
  galleryId?: string;
  invoiceId?: string;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: Date;
  additionalData?: any;
}

/**
 * Create a notification using a template
 */
export async function createNotificationFromTemplateHelper(
  templateKey: keyof typeof NOTIFICATION_TEMPLATES,
  variables: Record<string, string>,
  options: CreateNotificationOptions
) {
  const notificationData = createNotificationFromTemplate(templateKey, variables, options.additionalData);
  
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...notificationData,
      ...options,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create notification');
  }

  return response.json();
}

/**
 * Create a custom notification
 */
export async function createCustomNotification(
  title: string,
  message: string,
  type: string,
  category: string,
  options: CreateNotificationOptions & {
    priority?: string;
  }
) {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      message,
      type,
      category,
      priority: options.priority || 'normal',
      ...options,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create notification');
  }

  return response.json();
}

/**
 * Common notification creation functions
 */

export async function notifyBookingCreated(
  clientName: string,
  bookingDate: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'BOOKING_CREATED',
    { clientName, date: bookingDate },
    options
  );
}

export async function notifyBookingConfirmed(
  clientName: string,
  bookingDate: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'BOOKING_CONFIRMED',
    { clientName, date: bookingDate },
    options
  );
}

export async function notifyBookingCancelled(
  clientName: string,
  bookingDate: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'BOOKING_CANCELLED',
    { clientName, date: bookingDate },
    options
  );
}

export async function notifyGalleryReady(
  clientName: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'GALLERY_READY',
    { clientName },
    options
  );
}

export async function notifyInvoiceSent(
  invoiceNumber: string,
  clientName: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'INVOICE_SENT',
    { invoiceNumber, clientName },
    options
  );
}

export async function notifyPaymentReceived(
  amount: string,
  clientName: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'PAYMENT_RECEIVED',
    { amount, clientName },
    options
  );
}

export async function notifyPaymentOverdue(
  invoiceNumber: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'PAYMENT_OVERDUE',
    { invoiceNumber },
    options
  );
}

export async function notifyAssignmentCreated(
  bookingTitle: string,
  date: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'ASSIGNMENT_CREATED',
    { bookingTitle, date },
    options
  );
}

export async function notifyUpcomingBooking(
  bookingTitle: string,
  date: string,
  options: CreateNotificationOptions
) {
  return createNotificationFromTemplateHelper(
    'REMINDER_UPCOMING',
    { bookingTitle, date },
    options
  );
}

/**
 * Utility function to format currency
 */
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}

/**
 * Utility function to format date
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Utility function to format date and time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}


