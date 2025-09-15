"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export default function MediaDriveGalleryDemoPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Cloud Gallery Demo"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Cloud Gallery Demo - Media Drive
          </h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cloud Gallery Demo</h2>
              <p className="text-gray-600">Demo cloud gallery functionality for Media Drive</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}

