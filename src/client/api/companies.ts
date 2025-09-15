import { useState, useCallback } from 'react';

export interface Company {
  id: string;
  name: string;
  type?: string;
  phone?: string;
  email?: string;
  invoiceEmails?: string;
  password?: string;
  logoUrl?: string;
  isActive: boolean;
  propertiesCount: number;
  clientsCount: number;
  salesVolume?: string;
  permissions?: string;
  sendWelcomeEmail: boolean;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  agents?: Agent[];
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  company?: {
    id: string;
    name: string;
  };
}

// Hook for getting all companies for a tenant
export function useCompanies() {
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (tenantSlug: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching companies for tenant:', tenantSlug);

      const response = await globalThis.fetch(`/api/companies?tenant=${tenantSlug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok && result.data) {
        setCompanies(result.data.companies || []);
        console.log(`✅ Loaded ${result.data.companies?.length || 0} companies from database`);
        return { ok: true, data: result.data };
      } else {
        console.error('❌ Failed to fetch companies:', result.error);
        setCompanies([]);
        setError(result.error || 'Failed to fetch companies');
        return { ok: false, error: result.error || 'No data received' };
      }
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      setCompanies([]);
      setError("Failed to fetch companies");
      return { ok: false, error: "Failed to fetch companies" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, companies, isLoading, error };
}

// Hook for getting a single company
export function useCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (companyId: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching company:', companyId);

      const response = await globalThis.fetch(`/api/companies/${companyId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok && result.data) {
        setCompany(result.data);
        console.log(`✅ Loaded company: ${result.data.name}`);
        return { ok: true, data: result.data };
      } else {
        console.error('❌ Failed to fetch company:', result.error);
        setCompany(null);
        setError(result.error || 'Failed to fetch company');
        return { ok: false, error: result.error || 'No data received' };
      }
    } catch (error) {
      console.error("❌ Error fetching company:", error);
      setCompany(null);
      setError("Failed to fetch company");
      return { ok: false, error: "Failed to fetch company" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, company, isLoading, error };
}

// Hook for creating a company
export function useCreateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (companyData: Partial<Company>, tenantSlug: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔧 Creating company:', companyData);

      const response = await globalThis.fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...companyData,
          tenantSlug,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok) {
        console.log('✅ Company created successfully');
        return { ok: true, data: result.data };
      } else {
        setError(result.error || 'Failed to create company');
        return { ok: false, error: result.error || 'Failed to create company' };
      }
    } catch (error) {
      console.error("❌ Error creating company:", error);
      setError("Failed to create company");
      return { ok: false, error: "Failed to create company" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

// Hook for updating a company
export function useUpdateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (companyId: string, companyData: Partial<Company>): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔧 Updating company:', companyId, companyData);

      const response = await globalThis.fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok) {
        console.log('✅ Company updated successfully');
        return { ok: true, data: result.data };
      } else {
        setError(result.error || 'Failed to update company');
        return { ok: false, error: result.error || 'Failed to update company' };
      }
    } catch (error) {
      console.error("❌ Error updating company:", error);
      setError("Failed to update company");
      return { ok: false, error: "Failed to update company" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

// Hook for deleting a company
export function useDeleteCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (companyId: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🗑️ Deleting company:', companyId);

      const response = await globalThis.fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok) {
        console.log('✅ Company deleted successfully');
        return { ok: true, data: result.data };
      } else {
        setError(result.error || 'Failed to delete company');
        return { ok: false, error: result.error || 'Failed to delete company' };
      }
    } catch (error) {
      console.error("❌ Error deleting company:", error);
      setError("Failed to delete company");
      return { ok: false, error: "Failed to delete company" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

// Hook for getting company agents
export function useCompanyAgents() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (companyId: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching agents for company:', companyId);

      const response = await globalThis.fetch(`/api/companies/${companyId}/agents`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.ok && result.data) {
        setAgents(result.data.agents || []);
        console.log(`✅ Loaded ${result.data.agents?.length || 0} agents for company`);
        return { ok: true, data: result.data };
      } else {
        console.error('❌ Failed to fetch company agents:', result.error);
        setAgents([]);
        setError(result.error || 'Failed to fetch company agents');
        return { ok: false, error: result.error || 'No data received' };
      }
    } catch (error) {
      console.error("❌ Error fetching company agents:", error);
      setAgents([]);
      setError("Failed to fetch company agents");
      return { ok: false, error: "Failed to fetch company agents" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, agents, isLoading, error };
}