"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useTenant } from './TenantProvider';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyId?: string;
  company?: {
    id: string;
    name: string;
  };
  tenantId: string;
  role: string; // CLIENT role for client admin access
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    bookings: number;
    invoices: number;
  };
}

interface ClientAdminContextType {
  currentClient: Client | null;
  availableClients: Client[];
  switchClient: (clientId: string) => void;
  isLoading: boolean;
  isClientAdminMode: boolean;
  toggleClientAdminMode: () => void;
  refreshClients: () => Promise<void>;
}

const ClientAdminContext = createContext<ClientAdminContextType | undefined>(undefined);

export function ClientAdminProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { currentTenant } = useTenant();
  
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientAdminMode, setIsClientAdminMode] = useState(false);
  const [clientAuth, setClientAuth] = useState<any>(null);

  // Fetch clients from database
  const fetchClients = useCallback(async () => {
    if (!currentTenant?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/client/list?tenantId=${currentTenant.id}`);
      const data = await response.json();

      if (data.success) {
        const clients = data.clients.map((client: any) => ({
          ...client,
          role: "CLIENT" // All clients have CLIENT role
        }));
        
        setAvailableClients(clients);
        
        // Set first client as default if no current client
        if (!currentClient && clients.length > 0) {
          setCurrentClient(clients[0]);
        }
      } else {
        console.error('Failed to fetch clients:', data.error);
        setAvailableClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setAvailableClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentTenant?.id, currentClient]);

  // Check client authentication
  const checkClientAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/client-me');
      if (response.ok) {
        const data = await response.json();
        setClientAuth(data);
        setIsClientAdminMode(true);
      } else {
        setClientAuth(null);
        setIsClientAdminMode(false);
      }
    } catch (error) {
      console.error('Error checking client auth:', error);
      setClientAuth(null);
      setIsClientAdminMode(false);
    }
  }, []);

  // Load clients when tenant changes
  useEffect(() => {
    fetchClients();
    checkClientAuth();
  }, [fetchClients, checkClientAuth]);

  // Refresh clients function
  const refreshClients = useCallback(async () => {
    await fetchClients();
  }, [fetchClients]);

  const switchClient = useCallback((clientId: string) => {
    const client = availableClients.find(c => c.id === clientId);
    if (client) {
      setCurrentClient(client);
    }
  }, [availableClients]);

  const toggleClientAdminMode = useCallback(() => {
    setIsClientAdminMode(!isClientAdminMode);
  }, [isClientAdminMode]);

  const value: ClientAdminContextType = useMemo(() => ({
    currentClient,
    availableClients,
    switchClient,
    isLoading: status === "loading" || isLoading,
    isClientAdminMode,
    toggleClientAdminMode,
    refreshClients,
  }), [currentClient, availableClients, switchClient, status, isLoading, isClientAdminMode, toggleClientAdminMode, refreshClients]);

  return (
    <ClientAdminContext.Provider value={value}>
      {children}
    </ClientAdminContext.Provider>
  );
}

export function useClientAdmin() {
  const context = useContext(ClientAdminContext);
  if (context === undefined) {
    throw new Error('useClientAdmin must be used within a ClientAdminProvider');
  }
  return context;
}
