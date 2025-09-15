export interface Booking {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  clientId: string;
  photographerId?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  clientId: string;
  photographerId?: string;
  location?: string;
  notes?: string;
}

export type UserRole = 'admin' | 'photographer' | 'client' | 'agent' | 'SUB_ADMIN';
