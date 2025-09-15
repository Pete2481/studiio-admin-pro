"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
// import { usePhotographers } from "@/src/client/api/photographers";
// import { useTenant } from "./TenantProvider";

export type PhotographerOption = { id: string; name: string; role?: string; avatar?: string };

type Props = {
  value: string[];
  onChange: (photographerIds: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiPhotographerDropdown({ value, onChange, placeholder = "Select Photographers...", className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  // const { currentTenant } = useTenant();
  const currentTenant = { id: "demo-tenant" };
  
  
  // Use the real photographers from database
  // const { photographers: dbPhotographers, isLoading, error, fetch } = usePhotographers();
  const dbPhotographers = [
    { id: "photog1", name: "Alex Wilson", role: "Lead Photographer" },
    { id: "photog2", name: "Sarah Chen", role: "Senior Photographer" },
    { id: "photog3", name: "Mike Davis", role: "Creative Director" }
  ];
  const isLoading = false;
  const error = null;
  const fetch = () => {};

  // Convert database photographers to the format expected by the component
  const photographers: PhotographerOption[] = useMemo(() => {
    return dbPhotographers.map(photographer => ({
      id: photographer.id,
      name: photographer.name,
      role: photographer.role,
      avatar: undefined
    }));
  }, [dbPhotographers]);

  // Load photographers when component mounts
  useEffect(() => {
    if (currentTenant) {
      console.log(`Mock fetch called with tenant: ${currentTenant.id}`);
    }
  }, [currentTenant]);


  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = useMemo(() => photographers.filter((p) => value.includes(p.id)), [photographers, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return photographers;
    return photographers.filter((p) =>
      [p.name, p.role].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [photographers, query]);

  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }


  return (
    <div className={`relative ${className || ""}`} ref={ref}>
      <div
        className={`w-full px-3 py-2 border rounded-lg bg-white cursor-pointer focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent ${isOpen ? "border-teal-500" : "border-gray-300"}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        {selected.length === 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{placeholder}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {selected.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs font-medium">
                <span className="select-none">
                  {p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('/uploads/')) ? (
                    <img src={p.avatar} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    p.avatar || "📸"
                  )}
                </span>
                <span className="truncate max-w-[140px]">{p.name}</span>
                <span className="ml-1 text-green-600">
                  ✓
                </span>
              </span>
            ))}
            <span className="ml-auto text-gray-400"><ChevronDown size={16} /></span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photographers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="px-3 py-6 text-sm text-gray-500 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                <span>Loading photographers...</span>
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="px-3 py-6 text-sm text-gray-500 text-center">
                <div className="text-gray-400 mb-2">📸</div>
                <div>No photographers found</div>
                {query && <div className="text-xs text-gray-400 mt-1">Try a different search term</div>}
              </div>
            )}
            {filtered.map((p) => {
              const isSelected = value.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(p.id);
                  }}
                  className={`w-full text-left px-3 py-3 flex items-start gap-3 transition-all duration-200 ${
                    isSelected 
                      ? "bg-green-100 border-2 border-green-500 rounded-lg shadow-sm" 
                      : "hover:bg-gray-50 border-2 border-transparent rounded-lg"
                  }`}
                >
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0 select-none">
                    {p.avatar && (p.avatar.startsWith('http') || p.avatar.startsWith('/uploads/')) ? (
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      p.avatar || "📸"
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium truncate ${isSelected ? "text-green-800" : "text-gray-900"}`}>{p.name}</span>
                    <span className={`block text-xs truncate ${isSelected ? "text-green-600" : "text-gray-500"}`}>{p.role || "Photographer"}</span>
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
