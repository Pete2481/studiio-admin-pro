"use client";

import { SessionProvider } from "next-auth/react";
import { TenantProvider } from "@/components/TenantProvider";
import { ClientAdminProvider } from "@/components/ClientAdminProvider";
import { NotificationProvider } from "@/components/NotificationProvider";

// Mock session for development
const mockSession = {
  user: {
    id: "cmfddbqga000112sn0dpwceni",
    name: "Master Admin",
    email: "admin@businessmediadrive.com",
    image: null,
    tenants: [
      {
        id: "cmfkr33ls000113jn88rtdaih",
        name: "Business Media Drive",
        slug: "business-media-drive",
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
        <ClientAdminProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ClientAdminProvider>
      </TenantProvider>
    </SessionProvider>
  );
}
