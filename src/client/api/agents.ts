import { useState, useCallback } from "react";

// Hook for getting agents by company
export function useAgentsByCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);

  const fetch = useCallback(async (tenantId: string, companyId: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    try {
      console.log('Fetching agents by company:', { tenantId, companyId });
      
      const response: Response = await globalThis.fetch(`/api/agents/company?tenant=${tenantId}&company=${companyId}`);
      const result: any = await response.json();
      
      if (result.ok && result.data) {
        setAgents(result.data.agents || []);
        return { ok: true, data: result.data };
      } else {
        console.error('Failed to fetch agents by company:', result.error);
        setAgents([]);
        return { ok: false, error: result.error || 'No data received' };
      }
    } catch (error) {
      console.error("Failed to fetch agents by company:", error);
      setAgents([]);
      return { ok: false, error: "Failed to fetch agents by company" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, agents, isLoading };
}

// Hook for getting all agents
export function useAgents() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);

  const fetch = useCallback(async (): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    try {
      console.log('Fetching agents');
      setAgents([]);
      return { ok: true, data: [] };
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      return { ok: false, error: "Failed to fetch agents" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, agents, isLoading };
}

// Hook for getting all agents across all companies
export function useAllAgents() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (tenantSlug: string): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching all agents for tenant:', tenantSlug);
      
      const response = await globalThis.fetch(`/api/agents/all?tenant=${tenantSlug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.ok && result.data) {
        setAgents(result.data.agents || []);
        console.log(`✅ Loaded ${result.data.agents?.length || 0} agents from database`);
        return { ok: true, data: result.data };
      } else {
        console.error('❌ Failed to fetch all agents:', result.error);
        setAgents([]);
        setError(result.error || 'Failed to fetch agents');
        return { ok: false, error: result.error || 'No data received' };
      }
    } catch (error) {
      console.error("❌ Error fetching all agents:", error);
      setAgents([]);
      setError("Failed to fetch agents");
      return { ok: false, error: "Failed to fetch agents" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetch, agents, isLoading, error };
}

// Hook for creating an agent
export function useCreateAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (agentData: Partial<Agent>): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔧 Creating agent:', agentData);
      
      const response = await globalThis.fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Agent created successfully');
        return { ok: true, data: result.data };
      } else {
        setError(result.error || 'Failed to create agent');
        return { ok: false, error: result.error || 'Failed to create agent' };
      }
    } catch (error) {
      console.error("❌ Error creating agent:", error);
      setError("Failed to create agent");
      return { ok: false, error: "Failed to create agent" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

// Hook for updating an agent
export function useUpdateAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (agentId: string, agentData: Partial<Agent>): Promise<{ok: boolean; data?: any; error?: string}> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔧 Updating agent:', agentId, agentData);
      
      const response = await globalThis.fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Agent updated successfully');
        return { ok: true, data: result.data };
      } else {
        setError(result.error || 'Failed to update agent');
        return { ok: false, error: result.error || 'Failed to update agent' };
      }
    } catch (error) {
      console.error("❌ Error updating agent:", error);
      setError("Failed to update agent");
      return { ok: false, error: "Failed to update agent" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
}

// Agent type definition
export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  companyId: string;
  company?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}