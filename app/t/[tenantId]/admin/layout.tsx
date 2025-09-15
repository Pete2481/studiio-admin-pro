"use client";
import AdminNotification from "@/components/AdminNotification";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNotification />
      {children}
    </>
  );
}
