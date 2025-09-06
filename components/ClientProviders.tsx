"use client";

import { SessionProvider } from "next-auth/react";
import { TenantProvider } from "@/components/TenantProvider";

// Mock session for development
const mockSession = {
  user: {
    id: "1",
    name: "Demo User",
    email: "demo@studiio.com",
    image: null,
    tenants: [
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
    ],
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={mockSession}>
      <TenantProvider>
        {children}
      </TenantProvider>
    </SessionProvider>
  );
}
