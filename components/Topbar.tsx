"use client";
import { Plus, Upload, Download, Building, Users, ChevronDown } from "lucide-react";
import { useTenant } from "./TenantProvider";
import { useClientAdmin } from "./ClientAdminProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Topbar({ 
  title = "Calendar", 
  onNew, 
  onExport, 
  showImportExport = true,
  showAdminToggle = true,
  showNotifications = false
}: { 
  title?: string; 
  onNew?: () => void; 
  onExport?: () => void; 
  showImportExport?: boolean;
  showAdminToggle?: boolean;
  showNotifications?: boolean;
}) {
  const { currentTenant, availableTenants, switchTenant } = useTenant();
  const { currentClient, availableClients, switchClient, isClientAdminMode, toggleClientAdminMode } = useClientAdmin();
  const router = useRouter();
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const handleAdminModeToggle = () => {
    toggleClientAdminMode();
    if (isClientAdminMode) {
      // Switching to tenant admin mode
      router.push(`/t/${currentTenant?.slug}/admin`);
    } else {
      // Switching to client admin mode
      router.push(`/client-admin`);
    }
  };

  const handleTenantSelect = (tenantSlug: string) => {
    switchTenant(tenantSlug);
    setShowTenantDropdown(false);
    if (!isClientAdminMode) {
      router.push(`/t/${tenantSlug}/admin`);
    }
  };

  const handleClientSelect = (clientId: string) => {
    switchClient(clientId);
    setShowClientDropdown(false);
    if (isClientAdminMode) {
      router.push(`/client-admin`);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-[var(--card)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="container flex items-center justify-between h-14">
        <div className="font-semibold">{title}</div>
        
        <div className="flex items-center gap-4">

          {/* Admin Mode Toggle */}
          {showAdminToggle && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdminModeToggle}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isClientAdminMode
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-teal-100 text-teal-700 border border-teal-200'
                }`}
              >
                {isClientAdminMode ? (
                  <>
                    <Users className="inline mr-1" size={14} />
                    Client Admin
                  </>
                ) : (
                  <>
                    <Building className="inline mr-1" size={14} />
                    Media Drive Admin
                  </>
                )}
              </button>

              {/* Client Selector - Always show when in client admin mode */}
              {isClientAdminMode && (
                <div className="relative">
                  <button
                    onClick={() => setShowClientDropdown(!showClientDropdown)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                  >
                    <span>{currentClient?.name || 'Select Client'}</span>
                    <ChevronDown size={14} />
                  </button>
                  {showClientDropdown && (
                    <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      {availableClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleClientSelect(client.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                        >
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-gray-500">
                            {client.company?.name || 'Independent'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Import/Export Actions */}
          {showImportExport && onNew && onExport && (
            <div className="flex items-center gap-2">
              <button onClick={onNew} className="btn"><Plus className="inline mr-1" size={16}/>New Booking</button>
              <label className="btn cursor-pointer">
                <Upload className="inline mr-1" size={16}/> Import .ics
                <input type="file" accept=".ics,text/calendar" className="hidden" id="ics-input" />
              </label>
              <button onClick={onExport} className="btn"><Download className="inline mr-1" size={16}/>Export .ics</button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
