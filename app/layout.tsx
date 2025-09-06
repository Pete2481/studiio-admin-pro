import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Studiio Admin",
  description: "Studiio Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Sidebar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
