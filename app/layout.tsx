import "./globals.css";
import type { Metadata } from "next";
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
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
