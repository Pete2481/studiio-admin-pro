"use client";
import { useClientSidebar } from "./ClientSidebar";
import clsx from "clsx";

interface ClientPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientPageLayout({ children, className = "" }: ClientPageLayoutProps) {
  const { isCollapsed } = useClientSidebar();

  return (
    <div
      className={clsx(
        "min-h-screen pt-16 lg:pt-0 transition-all duration-300",
        // When sidebar is collapsed, use smaller margin (64px = 16rem)
        isCollapsed ? "lg:ml-16" : "lg:ml-68",
        // Mobile margin
        "ml-0",
        className
      )}
    >
      {children}
    </div>
  );
}



