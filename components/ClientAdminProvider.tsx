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
}

interface ClientAdminContextType {
  currentClient: Client | null;
  availableClients: Client[];
  switchClient: (clientId: string) => void;
  isLoading: boolean;
  isClientAdminMode: boolean;
  toggleClientAdminMode: () => void;
}

const ClientAdminContext = createContext<ClientAdminContextType | undefined>(undefined);

export function ClientAdminProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  // Temporarily hardcode tenant data to test
  const currentTenant = { id: "cmfkr33ls000113jn88rtdaih", name: "Business Media Drive", slug: "business-media-drive" };
  // Mock client for testing - using real company from database
  const mockClient = {
    id: "company-business-1",
    name: "Business Media Drive",
    email: "info@businessmedia.com.au",
    phone: "+61 2 6685 1234",
    companyId: "company-business-1",
    company: {
      id: "company-business-1",
      name: "Business Media Drive"
    },
    tenantId: "business-media-drive",
    role: "CLIENT",
    type: "client",
    isActive: true,
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  };
  
  const [currentClient, setCurrentClient] = useState<Client | null>(mockClient);
  const [availableClients, setAvailableClients] = useState<Client[]>([mockClient]);
  const [isLoading, setIsLoading] = useState(false); // Set to false to test
  const [isClientAdminMode, setIsClientAdminMode] = useState(false);

  // Debug logging removed to prevent infinite re-renders

  // Mock clients for development - using real companies from database
  const mockClients: Client[] = useMemo(() => [
    {
      id: "company-belle",
      name: "Belle-Lennox Head",
      email: "info@bellelennox.com.au",
      phone: "+61 2 6685 1234",
      companyId: "company-belle",
      company: {
        id: "company-belle",
        name: "Belle-Lennox Head"
      },
      tenantId: "business-media-drive",
      role: "CLIENT"
    },
    {
      id: "company-sothebys",
      name: "Sothebys Byron Bay",
      email: "info@sothebys.com.au",
      phone: "+61 2 6685 5678",
      companyId: "company-sothebys",
      company: {
        id: "company-sothebys",
        name: "Sothebys Byron Bay"
      },
      tenantId: "business-media-drive",
      role: "CLIENT"
    },
    {
      id: "company-hinterland",
      name: "Hinterland Property",
      email: "info@hinterlandproperty.com.au",
      phone: "+61 2 6685 9012",
      companyId: "company-hinterland",
      company: {
        id: "company-hinterland",
        name: "Hinterland Property"
      },
      tenantId: "business-media-drive",
      role: "CLIENT"
    },
    {
      id: "company-drift",
      name: "Drift & Stay",
      email: "info@driftandstay.com.au",
      phone: "+61 2 6685 3456",
      companyId: "company-drift",
      company: {
        id: "company-drift",
        name: "Drift & Stay"
      },
      tenantId: "business-media-drive",
      role: "CLIENT"
    }
  ], []); // Empty dependency array since this is static data

  useEffect(() => {
    // Load dynamic client data from localStorage
    const loadDynamicClients = () => {
      const dynamicClients = mockClients.map(client => {
        try {
          // Load company data from localStorage
          const savedData = localStorage.getItem(`studiio.company.data.${client.id}`);
          if (savedData) {
            const companyData = JSON.parse(savedData);
            return {
              ...client,
              name: companyData.name || client.name,
              email: companyData.email || client.email,
              phone: companyData.phone || client.phone,
              company: {
                id: client.id,
                name: companyData.company || client.company?.name || 'Independent'
              }
            };
          }
        } catch (error) {
          console.error(`Failed to load data for client ${client.id}:`, error);
        }
        return client; // Return original client if no saved data
      });
      
      // console.log('ClientAdminProvider: Loaded dynamic clients:', dynamicClients); // Removed to prevent console spam
      setAvailableClients(dynamicClients);
      setCurrentClient(dynamicClients[0]); // Set first client as default
      setIsLoading(false);
    };

    loadDynamicClients();

    // Listen for localStorage changes to refresh client data
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('studiio.company.data.')) {
        // console.log('ClientAdminProvider: Company data changed, refreshing...'); // Removed to prevent console spam
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          const dynamicClients = mockClients.map(client => {
            try {
              const savedData = localStorage.getItem(`studiio.company.data.${client.id}`);
              if (savedData) {
                const companyData = JSON.parse(savedData);
                return {
                  ...client,
                  name: companyData.name || client.name,
                  email: companyData.email || client.email,
                  phone: companyData.phone || client.phone,
                  company: {
                    id: client.id,
                    name: companyData.company || client.company?.name || 'Independent'
                  }
                };
              }
            } catch (error) {
              console.error(`Failed to load data for client ${client.id}:`, error);
            }
            return client;
          });
          
          setAvailableClients(dynamicClients);
          
          // Update current client if it exists
          setCurrentClient(prevClient => {
            if (prevClient) {
              const updatedCurrentClient = dynamicClients.find(c => c.id === prevClient.id);
              return updatedCurrentClient || prevClient;
            }
            return prevClient;
          });
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      // console.log('ClientAdminProvider: Custom storage change detected, refreshing...'); // Removed to prevent console spam
      setTimeout(() => {
        const dynamicClients = mockClients.map(client => {
          try {
            const savedData = localStorage.getItem(`studiio.company.data.${client.id}`);
            if (savedData) {
              const companyData = JSON.parse(savedData);
              return {
                ...client,
                name: companyData.name || client.name,
                email: companyData.email || client.email,
                phone: companyData.phone || client.phone,
                company: {
                  id: client.id,
                  name: companyData.company || client.company?.name || 'Independent'
                }
              };
            }
          } catch (error) {
            console.error(`Failed to load data for client ${client.id}:`, error);
          }
          return client;
        });
        
        setAvailableClients(dynamicClients);
        
        // Update current client if it exists
        setCurrentClient(prevClient => {
          if (prevClient) {
            const updatedCurrentClient = dynamicClients.find(c => c.id === prevClient.id);
            return updatedCurrentClient || prevClient;
          }
          return prevClient;
        });
      }, 100);
    };

    window.addEventListener('companyDataUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('companyDataUpdated', handleCustomStorageChange);
    };
  }, [mockClients]); // Remove currentClient?.id to prevent infinite loop

  const switchClient = useCallback((clientId: string) => {
    const client = availableClients.find(c => c.id === clientId);
    if (client) {
      setCurrentClient(client);
    }
  }, [availableClients]);

  // Function to refresh client data from localStorage
  const refreshClientData = useCallback(() => {
    const dynamicClients = mockClients.map(client => {
      try {
        const savedData = localStorage.getItem(`studiio.company.data.${client.id}`);
        if (savedData) {
          const companyData = JSON.parse(savedData);
          return {
            ...client,
            name: companyData.name || client.name,
            email: companyData.email || client.email,
            phone: companyData.phone || client.phone,
            company: {
              id: client.id,
              name: companyData.company || client.company?.name || 'Independent'
            }
          };
        }
      } catch (error) {
        console.error(`Failed to load data for client ${client.id}:`, error);
      }
      return client;
    });
    
    setAvailableClients(dynamicClients);
    
    // Update current client if it exists
    setCurrentClient(prevClient => {
      if (prevClient) {
        const updatedCurrentClient = dynamicClients.find(c => c.id === prevClient.id);
        return updatedCurrentClient || prevClient;
      }
      return prevClient;
    });
  }, [mockClients]); // Remove currentClient?.id to prevent infinite loop

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
  }), [currentClient, availableClients, switchClient, status, isLoading, isClientAdminMode, toggleClientAdminMode]);

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
