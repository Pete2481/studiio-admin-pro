"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export type PhotographerOption = { id: string; name: string; role?: string; avatar?: string };

const fallbackPhotographers: PhotographerOption[] = [
  { id: "photo-1", name: "Will Phillips", role: "Luxury Property Specialist", avatar: "🤖" },
  { id: "photo-2", name: "Sarah Johnson", role: "Marketing Director", avatar: "👧" },
  { id: "photo-3", name: "Mike Davis", role: "Senior Photographer", avatar: "🧁" },
  { id: "photo-4", name: "Lisa Wilson", role: "Property Specialist", avatar: "👷‍♀️" },
  { id: "photo-5", name: "Alex Chen", role: "Drone Specialist", avatar: "🚁" },
  { id: "photo-6", name: "Emma Rodriguez", role: "Virtual Tour Expert", avatar: "🎥" }
];

function loadPhotographers(): PhotographerOption[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("studiio.photographers.v1");
    if (!raw) return fallbackPhotographers;
    const parsed = JSON.parse(raw) as PhotographerOption[];
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackPhotographers;
    return parsed;
  } catch {
    return fallbackPhotographers;
  }
}

type Props = {
  value: string[];
  onChange: (photographerIds: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiPhotographerDropdown({ value, onChange, placeholder = "Select Photographers...", className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [photographers, setPhotographers] = useState<PhotographerOption[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPhotographers(loadPhotographers());
  }, []);

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
            {selected.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs">
                <span className="select-none">{p.avatar || "📸"}</span>
                <span className="truncate max-w-[140px]">{p.name}</span>
                <button
                  type="button"
                  className="ml-1 text-teal-600 hover:text-teal-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(p.id);
                  }}
                  aria-label={`Remove ${p.name}`}
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
                placeholder="Search photographers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-500">No photographers found</div>
            )}
            {filtered.map((p) => {
              const checked = value.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start gap-3 ${checked ? "bg-teal-50" : ""}`}
                >
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0 select-none">{p.avatar || "📸"}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-900 truncate">{p.name}</span>
                    <span className="block text-xs text-gray-500 truncate">{p.role || "Photographer"}</span>
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
