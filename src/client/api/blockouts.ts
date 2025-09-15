"use client";

import { useState, useEffect, useCallback } from "react";

export interface Blockout {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  notes?: string;
  isAllDay: boolean;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlockoutData {
  title: string;
  start: Date;
  end: Date;
  type?: string;
  notes?: string;
  isAllDay?: boolean;
  tenantId: string;
  createdBy: string;
}

export interface UpdateBlockoutData {
  title?: string;
  start?: Date;
  end?: Date;
  type?: string;
  notes?: string;
  isAllDay?: boolean;
}

export function useBlockouts(tenantId: string) {
  const [blockouts, setBlockouts] = useState<Blockout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockouts = useCallback(async () => {
    if (!tenantId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/blockouts?tenantId=${tenantId}`);
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const blockoutsWithDates = result.blockouts.map((blockout: any) => ({
          ...blockout,
          start: new Date(blockout.start),
          end: new Date(blockout.end),
          createdAt: new Date(blockout.createdAt),
          updatedAt: new Date(blockout.updatedAt),
        }));
        setBlockouts(blockoutsWithDates);
      } else {
        setError(result.error || "Failed to fetch blockouts");
      }
    } catch (err) {
      setError("Failed to fetch blockouts");
      console.error("Error fetching blockouts:", err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const addBlockout = useCallback(async (data: CreateBlockoutData) => {
    try {
      const response = await fetch('/api/blockouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const newBlockout = {
          ...result.blockout,
          start: new Date(result.blockout.start),
          end: new Date(result.blockout.end),
          createdAt: new Date(result.blockout.createdAt),
          updatedAt: new Date(result.blockout.updatedAt),
        };
        setBlockouts(prev => [...prev, newBlockout]);
        return { success: true, blockout: newBlockout };
      } else {
        setError(result.error || "Failed to create blockout");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to create blockout";
      setError(errorMsg);
      console.error("Error creating blockout:", err);
      return { success: false, error: errorMsg };
    }
  }, []);

  const updateBlockoutById = useCallback(async (id: string, data: UpdateBlockoutData) => {
    try {
      const response = await fetch(`/api/blockouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        // Convert Date strings back to Date objects
        const updatedBlockout = {
          ...result.blockout,
          start: new Date(result.blockout.start),
          end: new Date(result.blockout.end),
          createdAt: new Date(result.blockout.createdAt),
          updatedAt: new Date(result.blockout.updatedAt),
        };
        setBlockouts(prev => prev.map(blockout => 
          blockout.id === id ? updatedBlockout : blockout
        ));
        return { success: true, blockout: updatedBlockout };
      } else {
        setError(result.error || "Failed to update blockout");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to update blockout";
      setError(errorMsg);
      console.error("Error updating blockout:", err);
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteBlockoutById = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/blockouts/${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setBlockouts(prev => prev.filter(blockout => blockout.id !== id));
        return { success: true };
      } else {
        setError(result.error || "Failed to delete blockout");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to delete blockout";
      setError(errorMsg);
      console.error("Error deleting blockout:", err);
      return { success: false, error: errorMsg };
    }
  }, []);

  const clearAll = useCallback(async () => {
    if (!tenantId) return { success: false, error: "No tenant ID" };
    
    try {
      const response = await fetch(`/api/blockouts?tenantId=${tenantId}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (result.success) {
        setBlockouts([]);
        return { success: true, deletedCount: result.deletedCount };
      } else {
        setError(result.error || "Failed to clear blockouts");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = "Failed to clear blockouts";
      setError(errorMsg);
      console.error("Error clearing blockouts:", err);
      return { success: false, error: errorMsg };
    }
  }, [tenantId]);

  useEffect(() => {
    fetchBlockouts();
  }, [fetchBlockouts]);

  return {
    blockouts,
    loading,
    error,
    addBlockout,
    updateBlockout: updateBlockoutById,
    deleteBlockout: deleteBlockoutById,
    clearAll,
    refetch: fetchBlockouts,
  };
}
