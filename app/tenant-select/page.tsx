"use client";

import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useRouter } from "next/navigation";
import { Building, Users, Shield } from "lucide-react";

export default function TenantSelectPage() {
  const { data: session, status } = useSession();
  const { availableTenants, switchTenant } = useTenant();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleTenantSelect = (tenantSlug: string) => {
    switchTenant(tenantSlug);
    router.push(`/t/${tenantSlug}/admin`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Select Tenant
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose which organization you'd like to access
          </p>
        </div>

        <div className="space-y-4">
          {availableTenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => handleTenantSelect(tenant.slug)}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Building className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {tenant.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Role: {tenant.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Access</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need access to another organization? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}









