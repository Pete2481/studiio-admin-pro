"use client";
import { useState, useCallback, useEffect } from "react";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  getCompanyStats
} from "@/src/server/actions/companies.actions";

export type Company = {
  id: string;
  name: string;
  type: string | null;
  phone: string | null;
  email: string | null;
  invoiceEmails: string | null;
  password: string | null;
  logoUrl: string | null;
  isActive: boolean;
  propertiesCount: number;
  clientsCount: number;
  salesVolume: string | null;
  permissions: string | null;
  sendWelcomeEmail: boolean;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string | null;
    email: string;
  };
  clients?: Array<{
    id: string;
    name: string;
    email: string | null;
  }>;
  _count?: {
    clients: number;
  };
};

export function useCreateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (tenantId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createCompany(tenantId, data);
      if (!result.ok) {
        setError(result.error || "Failed to create company");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create company";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useUpdateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (tenantId: string, companyId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateCompany(tenantId, companyId, data);
      if (!result.ok) {
        setError(result.error || "Failed to update company");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update company";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useDeleteCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (tenantId: string, companyId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteCompany(tenantId, companyId);
      if (!result.ok) {
        setError(result.error || "Failed to delete company");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete company";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (tenantId: string, options?: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getCompanies(tenantId, options);
      if (result.ok && result.data) {
        setCompanies(result.data.companies);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || "Failed to fetch companies");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch companies";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, companies, pagination, isLoading, error };
}

export function useCompany(tenantId: string, companyId: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getCompany(tenantId, companyId);
        if (result.ok && result.data) {
          setCompany(result.data);
        } else {
          setError(result.error || "Failed to fetch company");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch company";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (tenantId && companyId) {
      fetchCompany();
    }
  }, [tenantId, companyId]);

  return { data: company, isLoading, error };
}

export function useCompanyStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getCompanyStats(tenantId);
      if (result.ok && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || "Failed to fetch company stats");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch company stats";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, stats, isLoading, error };
}

// Utility functions
export function convertDbCompanyToUI(dbCompany: any): Company {
  return {
    id: dbCompany.id,
    name: dbCompany.name,
    type: dbCompany.type,
    phone: dbCompany.phone,
    email: dbCompany.email,
    invoiceEmails: dbCompany.invoiceEmails,
    password: dbCompany.password,
    logoUrl: dbCompany.logoUrl,
    isActive: dbCompany.isActive,
    propertiesCount: dbCompany.propertiesCount,
    clientsCount: dbCompany.clientsCount,
    salesVolume: dbCompany.salesVolume,
    permissions: dbCompany.permissions,
    sendWelcomeEmail: dbCompany.sendWelcomeEmail,
    tenantId: dbCompany.tenantId,
    createdBy: dbCompany.createdBy,
    createdAt: dbCompany.createdAt,
    updatedAt: dbCompany.updatedAt,
    creator: dbCompany.creator,
    clients: dbCompany.clients,
    _count: dbCompany._count,
  };
}

export function convertUICompanyToDB(uiCompany: Partial<Company>): any {
  return {
    name: uiCompany.name,
    type: uiCompany.type,
    phone: uiCompany.phone,
    email: uiCompany.email,
    invoiceEmails: uiCompany.invoiceEmails,
    password: uiCompany.password,
    logoUrl: uiCompany.logoUrl,
    isActive: uiCompany.isActive,
    propertiesCount: uiCompany.propertiesCount,
    clientsCount: uiCompany.clientsCount,
    salesVolume: uiCompany.salesVolume,
    permissions: uiCompany.permissions,
    sendWelcomeEmail: uiCompany.sendWelcomeEmail,
  };
}
