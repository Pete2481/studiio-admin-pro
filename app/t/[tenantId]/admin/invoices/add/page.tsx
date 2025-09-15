"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default function MediaDriveAddInvoicePage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Add Invoice"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Add Invoice - Media Drive
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add New Invoice</h2>
              <p className="text-gray-600">Create a new invoice for Media Drive</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}

