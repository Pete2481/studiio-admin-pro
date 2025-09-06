"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Camera, ChevronDown, X } from "lucide-react";

interface Photographer {
  id: string;
  name: string;
  avatar: string;
  specialty?: string;
}

interface PhotographerDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
}

// Sample photographers data - in a real app, this would come from an API or database
const samplePhotographers: Photographer[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialty: "Real Estate Photography"
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    specialty: "Drone Photography"
  },
  {
    id: "3",
    name: "Mike Wilson", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    specialty: "Virtual Tours"
  },
  {
    id: "4",
    name: "Lisa Brown",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
    specialty: "Interior Photography"
  },
  {
    id: "5",
    name: "David Lee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    specialty: "Aerial Photography"
  },
  {
    id: "6",
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    specialty: "Event Photography"
  },
  {
    id: "7",
    name: "Tom Anderson",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    specialty: "Commercial Photography"
  },
  {
    id: "8",
    name: "Rachel Green",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    specialty: "Portrait Photography"
  }
];

export default function PhotographerDropdown({ 
  value, 
  onChange, 
  placeholder = "Select photographers...",
  className = "",
  multiple = true
}: PhotographerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photographers, setPhotographers] = useState<Photographer[]>(samplePhotographers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotographers, setSelectedPhotographers] = useState<Photographer[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set selected photographers when value changes
  useEffect(() => {
    if (value && value.length > 0) {
      const selected = photographers.filter(p => value.includes(p.id));
      setSelectedPhotographers(selected);
    } else {
      setSelectedPhotographers([]);
    }
  }, [value, photographers]);

  // Filter photographers based on search query
  const filteredPhotographers = photographers.filter((photographer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      photographer.name.toLowerCase().includes(searchLower) ||
      (photographer.specialty && photographer.specialty.toLowerCase().includes(searchLower))
    );
  });

  // Handle photographer selection
  const handlePhotographerSelect = (photographer: Photographer) => {
    if (multiple) {
      const isSelected = selectedPhotographers.some(p => p.id === photographer.id);
      let newSelected: Photographer[];
      
      if (isSelected) {
        // Remove if already selected
        newSelected = selectedPhotographers.filter(p => p.id !== photographer.id);
      } else {
        // Add if not selected
        newSelected = [...selectedPhotographers, photographer];
      }
      
      setSelectedPhotographers(newSelected);
      onChange(newSelected.map(p => p.id));
    } else {
      // Single selection
      setSelectedPhotographers([photographer]);
      onChange([photographer.id]);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  // Remove selected photographer
  const removePhotographer = (photographerId: string) => {
    const newSelected = selectedPhotographers.filter(p => p.id !== photographerId);
    setSelectedPhotographers(newSelected);
    onChange(newSelected.map(p => p.id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-white min-h-[42px]"
      >
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {selectedPhotographers.length > 0 ? (
            selectedPhotographers.map((photographer) => (
              <div
                key={photographer.id}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                <img
                  src={photographer.avatar}
                  alt={photographer.name}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span>{photographer.name}</span>
                {multiple && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhotographer(photographer.id);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search photographers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Photographers List */}
          <div className="max-h-64 overflow-auto">
            {filteredPhotographers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No photographers found matching your search.' : 'No photographers available.'}
              </div>
            ) : (
              filteredPhotographers.map((photographer) => {
                const isSelected = selectedPhotographers.some(p => p.id === photographer.id);
                return (
                  <button
                    key={photographer.id}
                    type="button"
                    onClick={() => handlePhotographerSelect(photographer)}
                    className={`w-full p-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                      isSelected ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <img
                        src={photographer.avatar}
                        alt={photographer.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      
                      {/* Info */}
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 text-sm">
                          {photographer.name}
                        </div>
                        {photographer.specialty && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Camera size={12} />
                            {photographer.specialty}
                          </div>
                        )}
                      </div>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
