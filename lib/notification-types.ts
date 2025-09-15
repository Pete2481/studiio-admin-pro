// Notification Types and Categories
export const NOTIFICATION_TYPES = {
  BOOKING: 'booking',
  GALLERY: 'gallery',
  INVOICE: 'invoice',
  SYSTEM: 'system',
  REMINDER: 'reminder',
  PAYMENT: 'payment',
  ASSIGNMENT: 'assignment',
  SCHEDULE: 'schedule',
  CLIENT: 'client',
  PHOTOGRAPHER: 'photographer',
  EDITOR: 'editor',
  ADMIN: 'admin',
} as const;

export const NOTIFICATION_CATEGORIES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  URGENT: 'urgent',
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const NOTIFICATION_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  ARCHIVED: 'archived',
} as const;

// Notification type configurations
export const NOTIFICATION_TYPE_CONFIG = {
  [NOTIFICATION_TYPES.BOOKING]: {
    label: 'Booking',
    icon: '📅',
    color: 'blue',
    description: 'Booking-related notifications',
  },
  [NOTIFICATION_TYPES.GALLERY]: {
    label: 'Gallery',
    icon: '🖼️',
    color: 'purple',
    description: 'Gallery-related notifications',
  },
  [NOTIFICATION_TYPES.INVOICE]: {
    label: 'Invoice',
    icon: '💰',
    color: 'green',
    description: 'Invoice and payment notifications',
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    label: 'System',
    icon: '⚙️',
    color: 'gray',
    description: 'System notifications',
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    label: 'Reminder',
    icon: '⏰',
    color: 'yellow',
    description: 'Reminder notifications',
  },
  [NOTIFICATION_TYPES.PAYMENT]: {
    label: 'Payment',
    icon: '💳',
    color: 'green',
    description: 'Payment-related notifications',
  },
  [NOTIFICATION_TYPES.ASSIGNMENT]: {
    label: 'Assignment',
    icon: '👤',
    color: 'indigo',
    description: 'Assignment notifications',
  },
  [NOTIFICATION_TYPES.SCHEDULE]: {
    label: 'Schedule',
    icon: '📋',
    color: 'blue',
    description: 'Schedule-related notifications',
  },
  [NOTIFICATION_TYPES.CLIENT]: {
    label: 'Client',
    icon: '🏢',
    color: 'teal',
    description: 'Client-related notifications',
  },
  [NOTIFICATION_TYPES.PHOTOGRAPHER]: {
    label: 'Photographer',
    icon: '📸',
    color: 'pink',
    description: 'Photographer-related notifications',
  },
  [NOTIFICATION_TYPES.EDITOR]: {
    label: 'Editor',
    icon: '✏️',
    color: 'orange',
    description: 'Editor-related notifications',
  },
  [NOTIFICATION_TYPES.ADMIN]: {
    label: 'Admin',
    icon: '👨‍💼',
    color: 'red',
    description: 'Administrative notifications',
  },
} as const;

export const NOTIFICATION_CATEGORY_CONFIG = {
  [NOTIFICATION_CATEGORIES.INFO]: {
    label: 'Information',
    icon: 'ℹ️',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  [NOTIFICATION_CATEGORIES.WARNING]: {
    label: 'Warning',
    icon: '⚠️',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  [NOTIFICATION_CATEGORIES.ERROR]: {
    label: 'Error',
    icon: '❌',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  [NOTIFICATION_CATEGORIES.SUCCESS]: {
    label: 'Success',
    icon: '✅',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  [NOTIFICATION_CATEGORIES.URGENT]: {
    label: 'Urgent',
    icon: '🚨',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-900',
    borderColor: 'border-red-300',
  },
} as const;

export const NOTIFICATION_PRIORITY_CONFIG = {
  [NOTIFICATION_PRIORITIES.LOW]: {
    label: 'Low',
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
  },
  [NOTIFICATION_PRIORITIES.NORMAL]: {
    label: 'Normal',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  [NOTIFICATION_PRIORITIES.HIGH]: {
    label: 'High',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  [NOTIFICATION_PRIORITIES.URGENT]: {
    label: 'Urgent',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
  },
} as const;

// Common notification templates
export const NOTIFICATION_TEMPLATES = {
  BOOKING_CREATED: {
    type: NOTIFICATION_TYPES.BOOKING,
    category: NOTIFICATION_CATEGORIES.INFO,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'New Booking Created',
    message: 'A new booking has been created for {clientName} on {date}',
  },
  BOOKING_CONFIRMED: {
    type: NOTIFICATION_TYPES.BOOKING,
    category: NOTIFICATION_CATEGORIES.SUCCESS,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'Booking Confirmed',
    message: 'Booking for {clientName} has been confirmed for {date}',
  },
  BOOKING_CANCELLED: {
    type: NOTIFICATION_TYPES.BOOKING,
    category: NOTIFICATION_CATEGORIES.WARNING,
    priority: NOTIFICATION_PRIORITIES.HIGH,
    title: 'Booking Cancelled',
    message: 'Booking for {clientName} on {date} has been cancelled',
  },
  GALLERY_READY: {
    type: NOTIFICATION_TYPES.GALLERY,
    category: NOTIFICATION_CATEGORIES.SUCCESS,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'Gallery Ready',
    message: 'Gallery for {clientName} is ready for review',
  },
  INVOICE_SENT: {
    type: NOTIFICATION_TYPES.INVOICE,
    category: NOTIFICATION_CATEGORIES.INFO,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'Invoice Sent',
    message: 'Invoice #{invoiceNumber} has been sent to {clientName}',
  },
  PAYMENT_RECEIVED: {
    type: NOTIFICATION_TYPES.PAYMENT,
    category: NOTIFICATION_CATEGORIES.SUCCESS,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'Payment Received',
    message: 'Payment of ${amount} received from {clientName}',
  },
  PAYMENT_OVERDUE: {
    type: NOTIFICATION_TYPES.PAYMENT,
    category: NOTIFICATION_CATEGORIES.WARNING,
    priority: NOTIFICATION_PRIORITIES.HIGH,
    title: 'Payment Overdue',
    message: 'Payment for invoice #{invoiceNumber} is overdue',
  },
  ASSIGNMENT_CREATED: {
    type: NOTIFICATION_TYPES.ASSIGNMENT,
    category: NOTIFICATION_CATEGORIES.INFO,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'New Assignment',
    message: 'You have been assigned to {bookingTitle} on {date}',
  },
  REMINDER_UPCOMING: {
    type: NOTIFICATION_TYPES.REMINDER,
    category: NOTIFICATION_CATEGORIES.INFO,
    priority: NOTIFICATION_PRIORITIES.NORMAL,
    title: 'Upcoming Booking',
    message: 'Reminder: {bookingTitle} is scheduled for {date}',
  },
} as const;

// Helper functions
export function getNotificationTypeConfig(type: string) {
  return NOTIFICATION_TYPE_CONFIG[type as keyof typeof NOTIFICATION_TYPE_CONFIG] || {
    label: type,
    icon: '📄',
    color: 'gray',
    description: 'Notification',
  };
}

export function getNotificationCategoryConfig(category: string) {
  return NOTIFICATION_CATEGORY_CONFIG[category as keyof typeof NOTIFICATION_CATEGORY_CONFIG] || {
    label: category,
    icon: 'ℹ️',
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
  };
}

export function getNotificationPriorityConfig(priority: string) {
  return NOTIFICATION_PRIORITY_CONFIG[priority as keyof typeof NOTIFICATION_PRIORITY_CONFIG] || {
    label: priority,
    color: 'gray',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
  };
}

export function formatNotificationMessage(template: string, variables: Record<string, string>): string {
  let message = template;
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return message;
}

export function createNotificationFromTemplate(
  templateKey: keyof typeof NOTIFICATION_TEMPLATES,
  variables: Record<string, string>,
  additionalData?: any
) {
  const template = NOTIFICATION_TEMPLATES[templateKey];
  return {
    type: template.type,
    category: template.category,
    priority: template.priority,
    title: formatNotificationMessage(template.title, variables),
    message: formatNotificationMessage(template.message, variables),
    data: additionalData,
  };
}



