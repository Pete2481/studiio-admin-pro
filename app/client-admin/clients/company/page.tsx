"use client";

import { useClientAdmin } from "@/components/ClientAdminProvider";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";
import { Building, Mail, Phone, MapPin, Users, Calendar, Edit } from "lucide-react";

export default function ClientCompanyPage() {
  const { currentClient } = useClientAdmin();

  if (!currentClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientSidebar />
        <Topbar 
          title="Company Info"
          showImportExport={false}
          showAdminToggle={true}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Client Selected</h1>
            <p className="text-gray-600">
              Please select a client from the dropdown to view company information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar 
        title="Company Info"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentClient.name}</h1>
              <p className="text-gray-600 mt-1">Company Profile & Information</p>
            </div>
            <button className="btn flex items-center gap-2">
              <Edit size={16} />
              Edit Company
            </button>
          </div>
        </div>

        {/* Company Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={20} />
                Company Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <p className="text-gray-900">{currentClient.name}</p>
                </div>
                {currentClient.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Company</label>
                    <p className="text-gray-900">{currentClient.company.name}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                  <p className="text-gray-900 capitalize">{(currentClient as any).type || currentClient.role?.toLowerCase() || 'Client'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail size={20} />
                Contact Information
              </h2>
              <div className="space-y-4">
                {currentClient.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{currentClient.email}</p>
                    </div>
                  </div>
                )}
                {currentClient.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{currentClient.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Client ID</span>
                  <span className="text-sm font-mono text-gray-900">{currentClient.id}</span>
                </div>
                {currentClient.tenantId && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tenant ID</span>
                    <span className="text-sm font-mono text-gray-900">{currentClient.tenantId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn text-left">
                  View Bookings
                </button>
                <button className="w-full btn text-left">
                  View Invoices
                </button>
                <button className="w-full btn text-left">
                  View Galleries
                </button>
                <button className="w-full btn text-left">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

