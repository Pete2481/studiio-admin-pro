"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default function MediaDriveReconcileInvoicesPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Invoice Reconciliation"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Invoice Reconciliation - Media Drive
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Reconciliation</h2>
              <p className="text-gray-600">Match payments with invoices for Media Drive</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}


