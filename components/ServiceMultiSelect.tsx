"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Service } from "@/components/ServiceModal";
import { ChevronDown, Search, X } from "lucide-react";
import { useTenant } from "./TenantProvider";
import { useServices } from "@/src/client/api/services";

type Props = {
  value: string[];
  onChange: (serviceIds: string[]) => void;
  placeholder?: string;
  className?: string;
};

const fallbackServices: Service[] = [
  { id: "svc-1", name: "Professional Photography", description: "High-quality real estate photography", icon: "📸", status: "Active", cost: "$150", date: new Date().toDateString(), durationMinutes: 60 },
  { id: "svc-2", name: "Virtual Tour Creation", description: "360° virtual tour", icon: "🎥", status: "Active", cost: "$200", date: new Date().toDateString(), durationMinutes: 90 },
  { id: "svc-3", name: "Drone Photography", description: "Aerial photos & video", icon: "🚁", status: "Active", cost: "$300", date: new Date().toDateString(), durationMinutes: 45 },
  { id: "svc-4", name: "3D Floor Plans", description: "Interactive floor plans", icon: "🏠", status: "Active", cost: "$250", date: new Date().toDateString(), durationMinutes: 60 }
];

function loadServices(): Service[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("studiio.services.v1");
    if (!raw) return fallbackServices;
    const parsed = JSON.parse(raw) as Service[];
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackServices;
    return parsed;
  } catch {
    return fallbackServices;
  }
}

export default function ServiceMultiSelect({ value, onChange, placeholder = "Select Services...", className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { currentTenant } = useTenant();
  
  
  // Use the real services from database
  const { services: dbServices, loading: isLoading, error, refreshServices: fetch } = useServices(currentTenant?.slug || 'business-media-drive');

  // Convert database services to the format expected by the component
  const services: Service[] = useMemo(() => {
    return dbServices.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description || "",
      icon: service.icon || "📸",
      status: service.status || "Active",
      cost: `$${service.price}`,
      date: new Date(service.createdAt).toDateString(),
      durationMinutes: service.durationMinutes || 60,
      favorite: service.favorite || false
    }));
  }, [dbServices]);



  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = useMemo(() => services.filter((s) => value.includes(s.id)), [services, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      [s.name, s.description, s.cost].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [services, query]);

  function toggle(id: string) {
    const newValue = value.includes(id) 
      ? value.filter((v) => v !== id)
      : [...value, id];
    
    onChange(newValue);
  }


  return (
    <div key="service-multi-select" className={`relative ${className || ""}`} ref={ref}>
      {/* Selected Services Display */}
      {selected.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-2">
            {selected.map((s) => (
              <div 
                key={s.id} 
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#e9f9f0] border border-[#b7e7cc] rounded-lg"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {s.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Service Search and Selection */}
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b7e7cc] focus:border-transparent text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="max-h-48 overflow-y-auto">
              {isLoading && (
                <div className="px-3 py-6 text-sm text-gray-500 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#b7e7cc] border-t-transparent rounded-full animate-spin mr-3"></div>
                  <span>Loading services...</span>
                </div>
              )}
              {!isLoading && filtered.length === 0 && (
                <div className="px-3 py-6 text-sm text-gray-500 text-center">
                  <div className="text-gray-400 mb-2">📸</div>
                  <div>No services found</div>
                  {query && <div className="text-xs text-gray-400 mt-1">Try a different search term</div>}
                </div>
              )}
              {filtered.map((s) => {
                const isSelected = value.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(s.id);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#e9f9f0] focus:outline-none focus:bg-[#e9f9f0] flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{s.name}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-[#b7e7cc] rounded-full flex items-center justify-center">
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
    </div>
  );
}


