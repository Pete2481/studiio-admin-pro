import { useState, useCallback } from "react";

// Hook for getting booking statuses
export function useBookingStatuses() {
  const [isLoading, setIsLoading] = useState(false);
  const [statuses, setStatuses] = useState<any[]>([]);

  const fetch = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    try {
      console.log('Fetching booking statuses for tenant:', tenantId);
      
      const response = await globalThis.fetch(`/api/booking-statuses?tenant=${tenantId}`);
      const result = await response.json();
      
      if (result.ok) {
        setStatuses(result.data || []);
        return { ok: true, data: result.data };
      } else {
        console.error('Failed to fetch booking statuses:', result.error);
        setStatuses([]);
        return { ok: false, error: result.error };
      }
    } catch (error) {
      console.error("Failed to fetch booking statuses:", error);
      setStatuses([]);
      return { ok: false, error: "Failed to fetch booking statuses" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (tenantId: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('Creating booking status:', { tenantId, data });
      
      const response = await globalThis.fetch(`/api/booking-statuses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId, ...data }),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        // Refresh the list
        await fetch(tenantId);
        return { ok: true, data: result.data };
      } else {
        console.error('Failed to create booking status:', result.error);
        return { ok: false, error: result.error };
      }
    } catch (error) {
      console.error("Failed to create booking status:", error);
      return { ok: false, error: "Failed to create booking status" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (tenantId: string, statusId: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('Updating booking status:', { tenantId, statusId, data });
      
      const response = await globalThis.fetch(`/api/booking-statuses/${statusId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId, ...data }),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        // Refresh the list
        await fetch(tenantId);
        return { ok: true, data: result.data };
      } else {
        console.error('Failed to update booking status:', result.error);
        return { ok: false, error: result.error };
      }
    } catch (error) {
      console.error("Failed to update booking status:", error);
      return { ok: false, error: "Failed to update booking status" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback(async (tenantId: string, statusId: string) => {
    setIsLoading(true);
    try {
      console.log('Deleting booking status:', { tenantId, statusId });
      
      const response = await globalThis.fetch(`/api/booking-statuses/${statusId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId }),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        // Refresh the list
        await fetch(tenantId);
        return { ok: true, data: result.data };
      } else {
        console.error('Failed to delete booking status:', result.error);
        return { ok: false, error: result.error };
      }
    } catch (error) {
      console.error("Failed to delete booking status:", error);
      return { ok: false, error: "Failed to delete booking status" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    fetch, 
    create, 
    update, 
    remove, 
    statuses, 
    isLoading 
  };
}
