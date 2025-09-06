"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Service } from "@/components/ServiceModal";
import { ChevronDown, Search, X } from "lucide-react";

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
  const [services, setServices] = useState<Service[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setServices(loadServices());
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
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
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  }

  function remove(id: string) {
    onChange(value.filter((v) => v !== id));
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
            {selected.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs">
                <span className="select-none">{s.icon}</span>
                <span className="truncate max-w-[140px]">{s.name}</span>
                <button
                  type="button"
                  className="ml-1 text-teal-600 hover:text-teal-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(s.id);
                  }}
                  aria-label={`Remove ${s.name}`}
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-500">No services</div>
            )}
            {filtered.map((s) => {
              const checked = value.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start gap-3 ${checked ? "bg-teal-50" : ""}`}
                >
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0 select-none">{s.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-900 truncate">{s.name}</span>
                    <span className="block text-xs text-gray-500 truncate">{s.description}</span>
                  </span>
                  <input type="checkbox" readOnly checked={checked} className="mt-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


