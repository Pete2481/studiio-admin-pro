"use client";
import { useState, useCallback, useEffect } from "react";
import {
  createAgent,
  updateAgent,
  deleteAgent,
  getAgentsByCompany,
  getAllAgents,
  getAgent,
  getAgentStats
} from "@/src/server/actions/agents.actions";

export type Agent = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profileImage: string | null;
  role: string;
  isActive: boolean;
  companyId: string;
  tenantId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string | null;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
};

export function useCreateAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (tenantId: string, companyId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createAgent(tenantId, companyId, data);
      if (!result.ok) {
        setError(result.error || "Failed to create agent");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create agent";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useUpdateAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (tenantId: string, agentId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateAgent(tenantId, agentId, data);
      if (!result.ok) {
        setError(result.error || "Failed to update agent");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update agent";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useDeleteAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (tenantId: string, agentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deleteAgent(tenantId, agentId);
      if (!result.ok) {
        setError(result.error || "Failed to delete agent");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete agent";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

export function useAgentsByCompany() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (tenantId: string, companyId: string, options?: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAgentsByCompany(tenantId, companyId, options);
      if (result.ok && result.data) {
        setAgents(result.data.agents);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || "Failed to fetch agents");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agents";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, agents, pagination, isLoading, error };
}

export function useAllAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
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
      const result = await getAllAgents(tenantId, options);
      if (result.ok && result.data) {
        setAgents(result.data.agents);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || "Failed to fetch all agents");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch all agents";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, agents, pagination, isLoading, error };
}

export function useAgent(tenantId: string, agentId: string) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getAgent(tenantId, agentId);
        if (result.ok && result.data) {
          setAgent(result.data);
        } else {
          setError(result.error || "Failed to fetch agent");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (tenantId && agentId) {
      fetchAgent();
    }
  }, [tenantId, agentId]);

  return { data: agent, isLoading, error };
}

export function useAgentStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAgentStats(tenantId);
      if (result.ok && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || "Failed to fetch agent stats");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agent stats";
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, stats, isLoading, error };
}

// Utility functions
export function convertDbAgentToUI(dbAgent: any): Agent {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    email: dbAgent.email,
    phone: dbAgent.phone,
    profileImage: dbAgent.profileImage,
    role: dbAgent.role,
    isActive: dbAgent.isActive,
    companyId: dbAgent.companyId,
    tenantId: dbAgent.tenantId,
    createdBy: dbAgent.createdBy,
    createdAt: dbAgent.createdAt,
    updatedAt: dbAgent.updatedAt,
    creator: dbAgent.creator,
    company: dbAgent.company,
  };
}
