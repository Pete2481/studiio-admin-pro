"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export type AgentOption = { id: string; name: string; company?: string; avatar?: string };

const fallbackAgents: AgentOption[] = [];

function loadAgents(): AgentOption[] {
  if (typeof window === "undefined") return fallbackAgents;
  try {
    const raw = localStorage.getItem("studiio.agents.v1");
    if (!raw) return fallbackAgents;
    const parsed = JSON.parse(raw) as AgentOption[];
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackAgents;
    return parsed;
  } catch {
    return fallbackAgents;
  }
}

export default function AgentDropdown({ value, onChange, placeholder = "Select Agent..." }: { value?: string; onChange: (agentId: string) => void; placeholder?: string; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setAgents(loadAgents()), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = useMemo(() => agents.find((a) => a.id === value), [agents, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((a) => [a.name, a.company].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [agents, query]);

  return (
    <div className="relative" ref={ref}>
      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer" onClick={() => setIsOpen((o) => !o)}>
        <div className="flex items-center justify-between">
          {selected ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm select-none">{selected.avatar || "👤"}</div>
              <span className="text-gray-900">{selected.name}{selected.company ? ` (${selected.company})` : ""}</span>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((a) => (
              <button key={a.id} type="button" onClick={() => { onChange(a.id); setIsOpen(false); setQuery(""); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm select-none">{a.avatar || "👤"}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-gray-900 truncate">{a.name}</span>
                  {a.company && <span className="block text-xs text-gray-500 truncate">{a.company}</span>}
                </span>
              </button>
            ))}
            {filtered.length === 0 && <div className="px-3 py-3 text-sm text-gray-500">No agents</div>}
          </div>
        </div>
      )}
    </div>
  );
}




