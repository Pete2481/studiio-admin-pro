"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default function MediaDriveGalleryViewPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Gallery View"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Gallery View - Media Drive
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Gallery View</h2>
              <p className="text-gray-600">View and manage gallery details for Media Drive</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}


