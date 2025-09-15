"use client";

import React, { useState, useCallback } from "react";

// Hook for creating clients
export function useCreateClient() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('Creating client:', { tenantId, data });
      return { ok: true, data: { id: 'temp-' + Date.now(), ...data } };
    } catch (error) {
      console.error("Failed to create client:", error);
      return { ok: false, error: "Failed to create client" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for updating clients
export function useUpdateClient() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, clientId: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('Updating client:', { tenantId, clientId, data });
      return { ok: true, data: { id: clientId, ...data } };
    } catch (error) {
      console.error("Failed to update client:", error);
      return { ok: false, error: "Failed to update client" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for deleting clients
export function useDeleteClient() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (tenantId: string, clientId: string) => {
    setIsLoading(true);
    try {
      console.log('Deleting client:', { tenantId, clientId });
      return { ok: true };
    } catch (error) {
      console.error("Failed to delete client:", error);
      return { ok: false, error: "Failed to delete client" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading };
}

// Hook for getting clients
export function useClients() {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Fetching clients');
      setClients([]);
      return { ok: true, data: [] };
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      return { ok: false, error: "Failed to fetch clients" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, clients, isLoading };
}
