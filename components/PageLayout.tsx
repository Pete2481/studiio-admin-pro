"use client";
import clsx from "clsx";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div
      className={clsx(
        "min-h-screen pt-16 lg:pt-0 transition-all duration-300",
        // Use 64px margin (lg:ml-16) since sidebar is always collapsed by default
        "lg:ml-16",
        // Mobile margin
        "ml-0",
        className
      )}
    >
      {children}
    </div>
  );
}
