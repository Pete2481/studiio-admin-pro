"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  switchTenant: (tenantSlug: string) => void;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  // Temporarily remove session dependency to test
  // const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  // Mock tenants for development (remove this in production)
  const mockTenants = [
    {
      id: "cmfkr33ls000113jn88rtdaih",
      name: "Business Media Drive",
      slug: "business-media-drive",
      role: "MASTER_ADMIN",
    },
  ];

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(mockTenants[0]); // Use business-media-drive as default
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>(mockTenants);

  // Sync with URL parameter
  useEffect(() => {
    const tenantFromPath = extractTenantFromPath(pathname);
    if (tenantFromPath) {
      const tenant = availableTenants.find(t => t.slug === tenantFromPath);
      if (tenant && tenant.slug !== currentTenant?.slug) {
        setCurrentTenant(tenant);
      }
    }
  }, [pathname, availableTenants, currentTenant?.slug]);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging removed to prevent unnecessary re-renders

  // Extract tenant from URL path
  const extractTenantFromPath = (path: string): string | null => {
    const match = path.match(/^\/t\/([^\/]+)/);
    return match ? match[1] : null;
  };

  // Tenant data is now set immediately in useState above

  const switchTenant = useCallback((tenantSlug: string) => {
    const tenant = availableTenants.find(t => t.slug === tenantSlug);
    if (tenant) {
      setCurrentTenant(tenant);
      
      // If we're on a tenant route, update the URL
      if (pathname.startsWith("/t/")) {
        const newPath = pathname.replace(/^\/t\/[^\/]+/, `/t/${tenantSlug}`);
        router.push(newPath as any);
      } else {
        router.push(`/t/${tenantSlug}` as any);
      }
    }
  }, [availableTenants, pathname, router]);

  const value: TenantContextType = useMemo(() => ({
    currentTenant,
    availableTenants,
    switchTenant,
    isLoading: isLoading,
  }), [currentTenant, availableTenants, isLoading]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
