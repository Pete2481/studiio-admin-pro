"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useAllAgents } from "@/src/client/api/agents";

export type AgentOption = { id: string; name: string; company?: string; avatar?: string };

const fallbackAgents: AgentOption[] = [];

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
  
  // Use the real agents from database
  const { agents: dbAgents, isLoading, error, fetch } = useAllAgents();

  // Convert database agents to the format expected by the component
  const agents: AgentOption[] = useMemo(() => {
    return dbAgents.map(agent => ({
      id: agent.id,
      name: agent.name,
      company: agent.company?.name || "Unknown Company",
      avatar: agent.profileImage || "👤"
    }));
  }, [dbAgents]);

  // Load agents when component mounts
  useEffect(() => {
    fetch("studiio-pro", { isActive: true });
  }, [fetch]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = useMemo(() => agents.filter((a) => value.includes(a.id)), [agents, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((a) =>
      [a.name, a.company].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [agents, query]);

  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  function remove(id: string) {
    onChange(value.filter((v) => v !== id));
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
                <button
                  type="button"
                  className="ml-1 text-teal-600 hover:text-teal-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(a.id);
                  }}
                  aria-label={`Remove ${a.name}`}
                >
                  <X size={12} />
                </button>
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
              </div>
            )}
            {filtered.map((a) => {
              const checked = value.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(a.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start gap-3 transition-colors ${checked ? "bg-teal-50 border-l-2 border-teal-500" : ""}`}
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
                    <span className="block text-sm font-medium text-gray-900 truncate">{a.name}</span>
                    <span className="block text-xs text-gray-500 truncate">{a.company || "No company"}</span>
                  </span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-colors ${checked ? "bg-teal-500 border-teal-500" : "border-gray-300"}`}>
                    {checked && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
