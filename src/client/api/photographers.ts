"use client";

import React, { useState, useCallback } from "react";

// Hook for creating photographers
export function useCreatePhotographer() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('Creating photographer:', { tenantId, data });
      return { ok: true, data: { id: 'temp-' + Date.now(), ...data } };
    } catch (error) {
      console.error("Failed to create photographer:", error);
      return { ok: false, error: "Failed to create photographer" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for updating photographers
export function useUpdatePhotographer() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, photographerId: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('Updating photographer:', { tenantId, photographerId, data });
      return { ok: true, data: { id: photographerId, ...data } };
    } catch (error) {
      console.error("Failed to update photographer:", error);
      return { ok: false, error: "Failed to update photographer" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for deleting photographers
export function useDeletePhotographer() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, photographerId: string) => {
    setIsLoading(true);
    try {
      console.log('Deleting photographer:', { tenantId, photographerId });
      return { ok: true };
    } catch (error) {
      console.error("Failed to delete photographer:", error);
      return { ok: false, error: "Failed to delete photographer" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for getting photographers
export function usePhotographers() {
  const [isLoading, setIsLoading] = useState(false);
  const [photographers, setPhotographers] = useState<any[]>([]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching photographers');
      setPhotographers([]);
      return { ok: true, data: [] };
    } catch (error) {
      console.error("Failed to fetch photographers:", error);
      return { ok: false, error: "Failed to fetch photographers" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, photographers, isLoading };
}
