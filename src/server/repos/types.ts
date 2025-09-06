import { z } from "zod";

// Common result type for server actions
export type ActionResult<T = any> = {
  ok: boolean;
  data?: T;
  error?: string;
};

// Pagination types
export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Common filters
export type DateRange = {
  from: Date;
  to: Date;
};

// Booking types
export const BookingStatusSchema = z.enum([
  "TENTATIVE",
  "CONFIRMED", 
  "PENCILED",
  "CANCELLED",
  "REQUEST"
]);

export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const CreateBookingSchema = z.object({
  title: z.string().min(1),
  start: z.date(),
  end: z.date(),
  clientId: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  durationM: z.number().min(1).default(60),
});

export type CreateBookingData = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingSchema = CreateBookingSchema.partial().extend({
  status: BookingStatusSchema.optional(),
});

export type UpdateBookingData = z.infer<typeof UpdateBookingSchema>;

// Client types
export const CreateClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  companyId: z.string().optional(),
  address: z.string().optional(),
});

export type CreateClientData = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = CreateClientSchema.partial();

export type UpdateClientData = z.infer<typeof UpdateClientSchema>;

// Gallery types
export const CreateGallerySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  expiresAt: z.date().optional(),
  accessPolicy: z.string().optional(),
  bookingId: z.string().optional(),
});

export type CreateGalleryData = z.infer<typeof CreateGallerySchema>;

export const AddAssetSchema = z.object({
  storageUrl: z.string().url(),
  type: z.enum(["image", "video", "document"]),
  version: z.string().optional(),
  watermark: z.boolean().default(false),
  alt: z.string().optional(),
  order: z.number().default(0),
});

export type AddAssetData = z.infer<typeof AddAssetSchema>;

// Invoice types
export const InvoiceStatusSchema = z.enum([
  "DRAFT",
  "SENT", 
  "PAID",
  "OVERDUE",
  "CANCELLED"
]);

export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const CreateInvoiceSchema = z.object({
  amountCents: z.number().min(1),
  dueDate: z.date().optional(),
  clientId: z.string().optional(),
});

export type CreateInvoiceData = z.infer<typeof CreateInvoiceSchema>;

// Assignment types
export const AssignmentRoleSchema = z.enum(["PHOTOGRAPHER", "EDITOR"]);
export type AssignmentRole = z.infer<typeof AssignmentRoleSchema>;

export const AssignUserSchema = z.object({
  userId: z.string(),
  role: AssignmentRoleSchema,
});

export type AssignUserData = z.infer<typeof AssignUserSchema>;

// Company types
export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  invoiceEmails: z.string().optional(), // JSON string
  password: z.string().optional(),
  logoUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  propertiesCount: z.number().default(0),
  clientsCount: z.number().default(0),
  salesVolume: z.string().optional(),
  permissions: z.string().optional(), // JSON string
  sendWelcomeEmail: z.boolean().default(false),
});

export type CreateCompanyData = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = CreateCompanySchema.partial();

export type UpdateCompanyData = z.infer<typeof UpdateCompanySchema>;

// Agent types
export const CreateAgentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  profileImage: z.string().url().optional(),
  role: z.string().min(1),
});

export type CreateAgentData = z.infer<typeof CreateAgentSchema>;

export const UpdateAgentSchema = CreateAgentSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateAgentData = z.infer<typeof UpdateAgentSchema>;

// Service types
export const CreateServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().default("📸"),
  price: z.number().min(0),
  durationMinutes: z.number().min(1).default(60),
  isActive: z.boolean().default(true),
  imageQuotaEnabled: z.boolean().default(false),
  imageQuota: z.number().min(0).default(0),
  displayPrice: z.boolean().default(true),
  favorite: z.boolean().default(false),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export type CreateServiceData = z.infer<typeof CreateServiceSchema>;

export const UpdateServiceSchema = CreateServiceSchema.partial();

export type UpdateServiceData = z.infer<typeof UpdateServiceSchema>;
