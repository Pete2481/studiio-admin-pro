"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Users, UserCog, Settings, BookOpenText, Briefcase, Images, CreditCard, LogOut, ChevronDown, Building, UserCheck, Eye, Plus, Wrench, Menu, X, ChevronRight, BarChart3, FileText, MessageSquare, Mail, Bell } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState, createContext, useContext } from "react";

// Create context for sidebar state
const ClientSidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: true, // Start collapsed by default
  setIsCollapsed: () => {},
});

// Hook to use sidebar context
export const useClientSidebar = () => useContext(ClientSidebarContext);

type NavItem = {
  href: Route;
  label: string;
  icon: any;
  submenu?: Array<{ href: Route; label: string; icon: any }>;
};

const clientItems: NavItem[] = [
  { href: "/client-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client-admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/client-admin/galleries", label: "Galleries", icon: Images },
  { href: "/client-admin/requests", label: "Requests", icon: MessageSquare },
  { href: "/client-admin/notifications", label: "Notifications", icon: Bell },
  { href: "/client-admin/invoice", label: "Invoices", icon: CreditCard },
  { href: "/client-admin/clients/company", label: "Company", icon: Building },
  { href: "/client-admin/settings", label: "Settings", icon: Settings },
];

export default function ClientSidebar(){
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
  const [isHovered, setIsHovered] = useState(false);

  // Auto-collapse sidebar when not hovering (with delay)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!isHovered && !isCollapsed) {
      timeoutId = setTimeout(() => {
        setIsCollapsed(true);
      }, 1000); // Collapse after 1 second of not hovering
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovered, isCollapsed]);

  const toggleMenu = (href: string) => {
    setExpandedMenus(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = () => {
    closeMobileMenu();
    // Also collapse the sidebar on mobile after navigation
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsCollapsed(true);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // If manually expanding, don't auto-collapse immediately
    if (isCollapsed) {
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 100);
    }
  };

  // Determine if sidebar should be expanded (hovered or manually expanded)
  const isExpanded = isHovered || !isCollapsed;

  return (
    <ClientSidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
                <h1 className="text-lg font-semibold text-gray-900">Client Admin</h1>
              </div>
              <button
                onClick={toggleCollapse}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight 
                  size={16} 
                  className={clsx(
                    "transition-transform duration-300",
                    isExpanded ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2 flex-1 overflow-y-auto">
            {clientItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuExpanded = expandedMenus.includes(item.href);

              return (
                <div key={item.href}>
                  {hasSubmenu ? (
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.href)}
                      className={clsx(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm my-1 transition-all duration-300",
                        active
                          ? "bg-[var(--accent)] text-black border border-[var(--border)]"
                          : "text-slate-700 hover:bg-[var(--accent-hover)]"
                      )}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className={clsx("flex-1 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>{item.label}</span>
                      <ChevronDown 
                        size={16} 
                        className={clsx(
                          "transition-all duration-300",
                          isSubmenuExpanded ? "rotate-180" : "",
                          isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm my-1 transition-all duration-300",
                        active
                          ? "bg-[var(--accent)] text-black border border-[var(--border)]"
                          : "text-slate-700 hover:bg-[var(--accent-hover)]"
                      )}
                      onClick={handleNavigation}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className={clsx("flex-1 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>{item.label}</span>
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubmenu && isSubmenuExpanded && (
                    <div className={clsx("ml-6 mt-1 space-y-1 transition-all duration-300", isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden")}>
                      {item.submenu?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={clsx(
                              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all duration-300",
                              subActive
                                ? "bg-[var(--accent)] text-black"
                                : "text-slate-600 hover:bg-[var(--accent-hover)]"
                            )}
                            onClick={handleNavigation}
                          >
                            <SubIcon size={14} className="flex-shrink-0" />
                            <span className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-[var(--accent-hover)] rounded-xl transition-all duration-300">
              <LogOut size={18} className="flex-shrink-0" />
              <span className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className={clsx("hidden lg:block transition-all duration-300", isExpanded ? "w-64" : "w-16")} />
    </ClientSidebarContext.Provider>
  );
}
