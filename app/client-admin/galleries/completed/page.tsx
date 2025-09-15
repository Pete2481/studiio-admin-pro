"use client";

import { useClientAdmin } from "@/components/ClientAdminProvider";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";

export default function ClientCompletedGalleriesPage() {
  const { currentClient } = useClientAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar 
        title="Completed Galleries"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Completed Galleries</h1>
          <p className="text-gray-600 mb-6">
            This is a placeholder page for completed galleries functionality.
          </p>
          <p className="text-sm text-gray-500">
            Current Client: {currentClient?.name || 'No client selected'}
          </p>
        </div>
      </div>
    </div>
  );
}







