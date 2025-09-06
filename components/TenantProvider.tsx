"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract tenant from URL path
  const extractTenantFromPath = (path: string): string | null => {
    const match = path.match(/^\/t\/([^\/]+)/);
    return match ? match[1] : null;
  };

  // Set current tenant based on URL or first available tenant
  useEffect(() => {
    if (status === "loading") return;

    // Mock tenants for development (remove this in production)
    const mockTenants = [
      {
        id: "1",
        name: "Studiio Pro",
        slug: "studiio-pro",
        role: "SUB_ADMIN",
      },
      {
        id: "2",
        name: "Photo Studio",
        slug: "photo-studio",
        role: "MASTER_ADMIN",
      },
    ];

    if (!session?.user?.tenants || session.user.tenants.length === 0) {
      // Use mock tenants for development
      setAvailableTenants(mockTenants);
      setCurrentTenant(mockTenants[0]);
      setIsLoading(false);
      return;
    }

    const tenants = session.user.tenants;
    setAvailableTenants(tenants);

    // Check if current path has a tenant
    const pathTenantSlug = extractTenantFromPath(pathname);
    
    if (pathTenantSlug) {
      // Find tenant in user's tenants
      const tenant = tenants.find(t => t.slug === pathTenantSlug);
      if (tenant) {
        setCurrentTenant(tenant);
      } else {
        // User doesn't have access to this tenant, redirect to first available
        router.push(`/t/${tenants[0].slug}` as any);
      }
    } else {
      // No tenant in path, set to first available tenant
      setCurrentTenant(tenants[0]);
    }

    setIsLoading(false);
  }, [session, status, pathname, router]);

  const switchTenant = (tenantSlug: string) => {
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
  };

  const value: TenantContextType = {
    currentTenant,
    availableTenants,
    switchTenant,
    isLoading: status === "loading" || isLoading,
  };

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
