"use client";

import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import { Building, Users, ArrowRight, Play } from "lucide-react";

export default function AdminDemoPage() {
  const { data: session, status } = useSession();
  const { currentTenant, availableTenants } = useTenant();
  const { currentClient, availableClients, isClientAdminMode } = useClientAdmin();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access the admin demo.</p>
        </div>
      </div>
    );
  }

  const handleAccessTenantAdmin = () => {
    router.push(`/t/${currentTenant?.slug}/admin`);
  };

  const handleAccessClientAdmin = () => {
    router.push(`/c/${currentClient?.id}/admin`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar with Admin Toggle */}
      <Topbar 
        title="Admin Demo - Switch Between Views"
        showImportExport={false}
        showAdminToggle={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Panel Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the tenant and client admin views to see how they interact with each other. 
            Use the toggle button in the top bar to switch between admin modes.
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-center mb-2">
                <Building className="h-5 w-5 text-teal-600 mr-2" />
                <h3 className="font-semibold text-teal-900">Tenant Admin Mode</h3>
              </div>
              <p className="text-sm text-teal-700 mb-2">
                Current Tenant: <span className="font-medium">{currentTenant?.name}</span>
              </p>
              <p className="text-sm text-teal-700">
                Role: <span className="font-medium">{currentTenant?.role}</span>
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Client Admin Mode</h3>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                Current Client: <span className="font-medium">{currentClient?.name}</span>
              </p>
              <p className="text-sm text-blue-700">
                Company: <span className="font-medium">{currentClient?.company?.name || 'Independent'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Tenant Admin Access */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-teal-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Tenant Admin Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Access the tenant admin panel to manage users, bookings, galleries, and system settings 
              for the entire tenant organization.
            </p>
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900">Available Tenants:</h4>
              {availableTenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{tenant.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({tenant.role})</span>
                  </div>
                  <span className="text-xs text-gray-400">{tenant.slug}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAccessTenantAdmin}
              className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Access Tenant Admin
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          {/* Client Admin Access */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Client Admin Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Access the client admin panel to view bookings, galleries, invoices, and manage 
              client-specific settings and preferences.
            </p>
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900">Available Clients:</h4>
              {availableClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{client.name}</span>
                    {client.company && (
                      <span className="text-sm text-gray-500 ml-2">({client.company.name})</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{client.id}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAccessClientAdmin}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Access Client Admin
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Test</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Use the Toggle Button</p>
                <p className="text-gray-600">Click the "Tenant Admin" or "Client Admin" button in the top bar to switch between admin modes.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Select Different Entities</p>
                <p className="text-gray-600">Use the dropdown menus to switch between different tenants or clients and see how the views change.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Compare Views</p>
                <p className="text-gray-600">Notice how the tenant admin shows system-wide data while client admin shows client-specific information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







