"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X, Plus, Trash2 } from "lucide-react";
import { useBookingStatuses } from "@/src/client/api/booking-status";
import { useTenant } from "./TenantProvider";
import { useClientAdmin } from "./ClientAdminProvider";

interface StatusOption {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showManagement?: boolean; // Whether to show add/remove buttons
}

export default function StatusDropdown({ 
  value, 
  onChange, 
  placeholder = "Select Status...", 
  className = "",
  showManagement = false 
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { currentTenant } = useTenant();
  const { currentClient } = useClientAdmin();
  
  const { statuses, isLoading, fetch, create, remove } = useBookingStatuses();

  // Determine the tenant to use - prioritize currentTenant, fallback to client's tenantId
  const tenantToUse = currentTenant?.slug || currentClient?.tenantId;

  // Load statuses when component mounts
  useEffect(() => {
    if (tenantToUse) {
      console.log('StatusDropdown: Fetching statuses for tenant:', tenantToUse);
      fetch(tenantToUse);
    }
  }, [tenantToUse, fetch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setNewStatusName("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter statuses based on search query
  const filteredStatuses = useMemo(() => {
    if (!query) return statuses;
    return statuses.filter((status: StatusOption) =>
      status.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [statuses, query]);

  // Get selected status
  const selectedStatus = statuses.find((s: StatusOption) => s.name === value);

  const handleAddStatus = async () => {
    if (!newStatusName.trim() || !tenantToUse) return;
    
    const result = await create(tenantToUse, {
      name: newStatusName.trim(),
      color: "#6B7280" // Default gray color
    });
    
    if (result.ok) {
      setNewStatusName("");
      setIsAdding(false);
      setIsOpen(false); // Close dropdown too
      onChange(newStatusName.trim());
    } else {
      alert(result.error || "Failed to add status");
    }
  };

  const handleRemoveStatus = async (statusId: string, statusName: string) => {
    if (!tenantToUse) return;
    
    const confirmed = confirm(`Are you sure you want to delete the status "${statusName}"?`);
    if (!confirmed) return;
    
    const result = await remove(tenantToUse, statusId);
    
    if (!result.ok) {
      alert(result.error || "Failed to remove status");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddStatus();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewStatusName("");
    }
  };

  return (
    <>
      {/* Add Status Modal */}
      {isAdding && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setIsAdding(false);
            setNewStatusName("");
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Status</h3>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewStatusName("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <input
                type="text"
                placeholder="Enter Status"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                autoFocus
              />
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewStatusName("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleAddStatus}
                disabled={!newStatusName.trim()}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Status
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`relative ${className}`} ref={ref}>
      {/* Main dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedStatus && (
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedStatus.color }}
            />
          )}
          <span className={selectedStatus ? "text-gray-900" : "text-gray-500"}>
            {selectedStatus ? selectedStatus.name : placeholder}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search statuses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                autoFocus
              />
            </div>
          </div>

          {/* Status options */}
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-gray-500">Loading...</div>
            ) : filteredStatuses.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                {query ? "No statuses found" : "No statuses available"}
              </div>
            ) : (
              filteredStatuses.map((status: StatusOption) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    onChange(status.name);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-gray-900">{status.name}</span>
                    {status.isDefault && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  
                  {/* Remove button (only for non-default statuses and when management is enabled) */}
                  {showManagement && !status.isDefault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStatus(status.id, status.name);
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Remove status"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add new status section */}
          {showManagement && (
            <div className="border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(true);
                  setIsOpen(false); // Close dropdown when opening modal
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <Plus className="w-4 h-4" />
                Add Status
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}
