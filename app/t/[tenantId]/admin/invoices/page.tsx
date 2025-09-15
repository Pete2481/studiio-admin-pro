"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default function MediaDriveInvoicesPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Invoices"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Media Drive - Invoices
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Management</h2>
              <p className="text-gray-600 mb-6">Manage invoices for Media Drive Business admin</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <a 
                  href={`/t/${tenantId}/admin/invoices/view`}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
                >
                  <div className="text-blue-600 font-semibold">View Invoices</div>
                  <div className="text-sm text-blue-500 mt-1">Browse all invoices</div>
                </a>
                
                <a 
                  href={`/t/${tenantId}/admin/invoices/add`}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
                >
                  <div className="text-green-600 font-semibold">Add Invoice</div>
                  <div className="text-sm text-green-500 mt-1">Create new invoice</div>
                </a>
                
                <a 
                  href={`/t/${tenantId}/admin/invoices/reconcile`}
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
                >
                  <div className="text-purple-600 font-semibold">Reconciliation</div>
                  <div className="text-sm text-purple-500 mt-1">Match payments</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}


