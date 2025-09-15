"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useAllAgents } from "@/src/client/api/agents";
import { useTenant } from "./TenantProvider";
import { useClientAdmin } from "./ClientAdminProvider";

export type AgentOption = { id: string; name: string; company?: string; avatar?: string };

const fallbackAgents: AgentOption[] = [
  { id: "agent1", name: "John Smith", company: "Real Estate Co" },
  { id: "agent2", name: "Jane Doe", company: "Property Group" },
  { id: "agent3", name: "Mike Johnson", company: "Luxury Homes" }
];

type Props = {
  value: string[];
  onChange: (agentIds: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiAgentDropdown({ value, onChange, placeholder = "Select Agents...", className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { currentTenant } = useTenant();
  const { currentClient } = useClientAdmin();
  
  // Use ALL agents from database for the tenant
  const { agents: dbAgents, isLoading, fetch } = useAllAgents();

  // Convert database agents to the format expected by the component
  const agents: AgentOption[] = useMemo(() => {
    return dbAgents.map(agent => ({
      id: agent.id,
      name: agent.name,
      company: (agent.company as any)?.name || "Unknown Company",
      avatar: (agent as any).profileImage || "👤"
    }));
  }, [dbAgents]);

  // Load ALL agents when component mounts or when tenant changes
  useEffect(() => {
    if (currentTenant?.slug) {
      console.log(`Fetching ALL agents for tenant: ${currentTenant.slug}`);
      fetch(currentTenant.slug);
    }
  }, [currentTenant?.slug, fetch]);

  // Debug logging
  useEffect(() => {
    console.log('MultiAgentDropdown: State update:', {
      currentTenant: currentTenant?.slug,
      agents: agents.length,
      isLoading
    });
  }, [currentTenant, agents, isLoading]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = useMemo(() => {
    const result = agents.filter((a) => value.includes(a.id));
    console.log('MultiAgentDropdown: selected calculation', {
      agentsLength: agents.length,
      value,
      selectedLength: result.length,
      selected: result.map(a => ({ id: a.id, name: a.name }))
    });
    return result;
  }, [agents, value]);
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      console.log('MultiAgentDropdown: filtered (no query)', { agentsLength: agents.length });
      return agents;
    }
    const result = agents.filter((a) =>
      [a.name, a.company].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
    console.log('MultiAgentDropdown: filtered (with query)', { query: q, resultLength: result.length });
    return result;
  }, [agents, query]);

  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }


  return (
    <div className={`relative ${className || ""}`} ref={ref}>
      <div
        className={`w-full px-3 py-2 border rounded-lg bg-white cursor-pointer focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-colors ${isOpen ? "border-teal-500" : "border-gray-300"}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        {selected.length === 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{placeholder}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {selected.map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs">
                <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center select-none overflow-hidden">
                  {a.avatar && a.avatar.startsWith('http') ? (
                    <img 
                      src={a.avatar} 
                      alt={a.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.textContent = '👤';
                      }}
                    />
                  ) : (
                    <span className="text-xs">{a.avatar || "👤"}</span>
                  )}
                </span>
                <span className="truncate max-w-[140px]">{a.name}</span>
                <span className="ml-1 text-teal-600">
                  ✓
                </span>
              </span>
            ))}
            <span className="ml-auto text-gray-400"><ChevronDown size={16} /></span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="px-3 py-6 text-sm text-gray-500 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span>Loading agents...</span>
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="px-3 py-6 text-sm text-gray-500 text-center">
                <div className="text-gray-400 mb-2">👥</div>
                <div>No agents found</div>
                {query && <div className="text-xs text-gray-400 mt-1">Try a different search term</div>}
                <div className="text-xs text-gray-400 mt-1">Debug: filtered.length = {filtered.length}, agents.length = {agents.length}</div>
              </div>
            )}
            {filtered.map((a) => {
              const isSelected = value.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(a.id);
                  }}
                  className={`w-full text-left px-3 py-3 flex items-start gap-3 transition-all duration-200 ${
                    isSelected 
                      ? "bg-green-100 border-2 border-green-500 rounded-lg shadow-sm" 
                      : "hover:bg-gray-50 border-2 border-transparent rounded-lg"
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0 select-none overflow-hidden">
                    {a.avatar && a.avatar.startsWith('http') ? (
                      <img 
                        src={a.avatar} 
                        alt={a.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.textContent = '👤';
                        }}
                      />
                    ) : (
                      <span>{a.avatar || "👤"}</span>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium truncate ${isSelected ? "text-green-800" : "text-gray-900"}`}>{a.name}</span>
                    <span className={`block text-xs truncate ${isSelected ? "text-green-600" : "text-gray-500"}`}>{a.company || "No company"}</span>
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
