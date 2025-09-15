"use client";

import { useState, useEffect, useCallback } from "react";

export interface Booking {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  clientId?: string;
  agentId?: string;
  photographerId?: string;
  address?: string;
  notes?: string;
  durationM: number;
  services?: string;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  agent?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  photographer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface CreateBookingData {
  title: string;
  start: Date;
  end: Date;
  status?: string;
  clientId?: string;
  agentId?: string;
  photographerId?: string;
  address?: string;
  notes?: string;
  durationM?: number;
  services?: string;
  tenantId: string;
  createdBy: string;
}

export interface UpdateBookingData {
  title?: string;
  start?: Date;
  end?: Date;
  status?: string;
  clientId?: string;
  agentId?: string;
  photographerId?: string;
  address?: string;
  notes?: string;
  durationM?: number;
  services?: string;
}

export function useBookings(tenantId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!tenantId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bookings?tenantId=${tenantId}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const bookingsWithDates = result.bookings.map((booking: any) => ({
          ...booking,
          start: new Date(booking.start),
          end: new Date(booking.end),
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt),
        }));
        setBookings(bookingsWithDates);
      } else {
        setError(result.error || "Failed to fetch bookings");
      }
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const fetchBookingsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    if (!tenantId) return { success: false, error: "No tenant ID" };
    
    try {
      const response = await fetch(`/api/bookings?tenantId=${tenantId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const bookingsWithDates = result.bookings.map((booking: any) => ({
          ...booking,
          start: new Date(booking.start),
          end: new Date(booking.end),
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt),
        }));
        return { success: true, bookings: bookingsWithDates };
      } else {
        return { success: false, error: result.error, bookings: [] };
      }
    } catch (err) {
      console.error("Error fetching bookings by date range:", err);
      return { success: false, error: "Failed to fetch bookings", bookings: [] };
    }
  }, [tenantId]);

  const addBooking = useCallback(async (data: CreateBookingData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const newBooking = {
          ...result.booking,
          start: new Date(result.booking.start),
          end: new Date(result.booking.end),
          createdAt: new Date(result.booking.createdAt),
          updatedAt: new Date(result.booking.updatedAt),
        };
        setBookings(prev => [...prev, newBooking]);
        return { success: true, booking: newBooking };
      } else {
        setError(result.error || "Failed to create booking");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to create booking";
      setError(errorMsg);
      console.error("Error creating booking:", err);
      return { success: false, error: errorMsg };
    }
  }, []);

  const updateBookingById = useCallback(async (id: string, data: UpdateBookingData) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const updatedBooking = {
          ...result.booking,
          start: new Date(result.booking.start),
          end: new Date(result.booking.end),
          createdAt: new Date(result.booking.createdAt),
          updatedAt: new Date(result.booking.updatedAt),
        };
        setBookings(prev => prev.map(booking => 
          booking.id === id ? updatedBooking : booking
        ));
        return { success: true, booking: updatedBooking };
      } else {
        setError(result.error || "Failed to update booking");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to update booking";
      setError(errorMsg);
      console.error("Error updating booking:", err);
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteBookingById = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setBookings(prev => prev.filter(booking => booking.id !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete booking");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to delete booking";
      setError(errorMsg);
      console.error("Error deleting booking:", err);
      return { success: false, error: errorMsg };
    }
  }, []);

  const clearAll = useCallback(async () => {
    if (!tenantId) return { success: false, error: "No tenant ID" };
    
    try {
      const response = await fetch(`/api/bookings?tenantId=${tenantId}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setBookings([]);
        return { success: true, deletedCount: result.deletedCount };
      } else {
        setError(result.error || "Failed to clear bookings");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to clear bookings";
      setError(errorMsg);
      console.error("Error clearing bookings:", err);
      return { success: false, error: errorMsg };
    }
  }, [tenantId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    addBooking,
    updateBooking: updateBookingById,
    deleteBooking: deleteBookingById,
    clearAll,
    fetchBookingsByDateRange,
    refetch: fetchBookings,
  };
}

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bookings/${id}`);
      const result = await response.json();
      if (result.success) {
        // Convert Date strings back to Date objects
        const bookingWithDates = {
          ...result.booking,
          start: new Date(result.booking.start),
          end: new Date(result.booking.end),
          createdAt: new Date(result.booking.createdAt),
          updatedAt: new Date(result.booking.updatedAt),
        };
        setBooking(bookingWithDates);
      } else {
        setError(result.error || "Failed to fetch booking");
      }
    } catch (err) {
      setError("Failed to fetch booking");
      console.error("Error fetching booking:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return {
    booking,
    loading,
    error,
    refetch: fetchBooking,
  };
}