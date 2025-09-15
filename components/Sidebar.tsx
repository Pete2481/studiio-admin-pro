"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Users, UserCog, Settings, BookOpenText, Briefcase, Images, CreditCard, LogOut, ChevronDown, Building, UserCheck, Eye, Plus, Wrench, Menu, X, ChevronRight, BarChart3, FileText, MessageSquare, Mail } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState, createContext, useContext } from "react";
import { useTenant } from "./TenantProvider";

// Create context for sidebar state
const SidebarContext = createContext<{
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}>({
  isHovered: false,
  setIsHovered: () => {},
});

// Hook to use sidebar context
export const useSidebar = () => useContext(SidebarContext);

type NavItem = {
  href: Route;
  label: string;
  icon: any;
  submenu?: Array<{ href: Route; label: string; icon: any }>;
};

// This will be created dynamically based on current tenant

export default function Sidebar(){
  const pathname = usePathname();
  const { currentTenant } = useTenant();
  // Create tenant-specific URLs
  const tenantPrefix = currentTenant ? `/t/${currentTenant.slug}/admin` : '/t/business-media-drive/admin';

  // Initialize expanded menus with a function to avoid infinite loops
  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    if (currentTenant?.slug) {
      return [
        `/t/${currentTenant.slug}/admin/clients`,
        `/t/${currentTenant.slug}/admin/invoices`,
        `/t/${currentTenant.slug}/admin/galleries`,
      ];
    }
    return [];
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const items: NavItem[] = [
    { href: `${tenantPrefix}` as Route, label: "Dashboard", icon: LayoutDashboard },
    { href: `${tenantPrefix}/calendar` as Route, label: "Calendar", icon: Calendar },
    { 
      href: `${tenantPrefix}/galleries` as Route, 
      label: "Galleries", 
      icon: Images,
      submenu: [
        { href: `${tenantPrefix}/galleries` as Route, label: "All Galleries", icon: Images },
        { href: `${tenantPrefix}/galleries/view` as Route, label: "Gallery View", icon: Images },
        { href: `${tenantPrefix}/galleries/demo` as Route, label: "Cloud Gallery Demo", icon: Images },
        { href: `${tenantPrefix}/galleries/completed` as Route, label: "Completed", icon: Eye },
      ]
    },
    { href: `${tenantPrefix}/bookings` as Route, label: "Bookings", icon: BookOpenText },
    { href: `${tenantPrefix}/requests` as Route, label: "Requests", icon: MessageSquare },
    { href: `${tenantPrefix}/newsletter` as Route, label: "Newsletter", icon: Mail },
    { 
      href: `${tenantPrefix}/clients` as Route, 
      label: "Clients", 
      icon: Users,
      submenu: [
        { href: `${tenantPrefix}/clients/companies` as Route, label: "Companies", icon: Building },
        { href: `${tenantPrefix}/clients/agents` as Route, label: "Agents", icon: UserCheck },
      ]
    },
    { 
      href: `${tenantPrefix}/invoices` as Route, 
      label: "Invoice", 
      icon: CreditCard,
      submenu: [
        { href: `${tenantPrefix}/invoices/view` as Route, label: "View Invoice", icon: Eye },
        { href: `${tenantPrefix}/invoices/add` as Route, label: "Add Invoice", icon: Plus },
        { href: `${tenantPrefix}/invoices/reconcile` as Route, label: "Reconciliation", icon: FileText },
      ]
    },
    { href: `${tenantPrefix}/services` as Route, label: "Services", icon: Wrench },
    { href: `${tenantPrefix}/reports` as Route, label: "Reports", icon: BarChart3 },
    { href: `${tenantPrefix}/photographers` as Route, label: "Photographers", icon: UserCog },
    { href: `${tenantPrefix}/editors` as Route, label: "Editors", icon: Briefcase },
    { href: `${tenantPrefix}/settings` as Route, label: "Settings", icon: Settings },
  ];

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


  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("studiio.pendingBookingsCount");
      setPendingCount(raw ? parseInt(raw) || 0 : 0);
    } catch {}
    const handler = () => {
      const raw = localStorage.getItem("studiio.pendingBookingsCount");
      setPendingCount(raw ? parseInt(raw) || 0 : 0);
    };
    window.addEventListener("studiio:pendingBookingsUpdated", handler);
    return () => window.removeEventListener("studiio:pendingBookingsUpdated", handler);
  }, []);

  // Determine if sidebar should be expanded (only when hovered - auto-collapse when not in use)
  const isExpanded = isHovered;

  return (
    <SidebarContext.Provider value={{ isHovered, setIsHovered }}>
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={clsx(
            "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out",
            "lg:w-16 lg:translate-x-0", // Default to 64px width (w-16)
            isMobileMenuOpen ? "w-80 translate-x-0" : "w-80 -translate-x-full lg:translate-x-0",
            isExpanded ? "lg:w-64" : "lg:w-16" // Expand to 256px when hovered or manually expanded
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link href={tenantPrefix as Route} className="flex items-center gap-2 font-semibold" onClick={closeMobileMenu}>
              <div className="h-8 w-8 rounded-xl bg-[#e9f9f0] flex-shrink-0" />
              <span className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Studiio Admin</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={closeMobileMenu}
                className="lg:hidden p-1 hover:bg-[#e9f9f0] rounded transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <nav className="p-2">
            {items.map((item) => {
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
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm my-1 transition-all duration-200 hover:scale-[1.02]",
                        active
                          ? "bg-[#e9f9f0] text-black border border-[#b7e7cc] shadow-sm"
                          : "text-slate-700 hover:bg-[#e9f9f0] hover:text-black"
                      )}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className={clsx("flex-1 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>{item.label}</span>
                      {item.href === "/bookings" && pendingCount > 0 && (
                        <span className={clsx("ml-2 inline-flex items-center justify-center rounded-full border border-red-500 text-red-600 text-[10px] font-semibold w-5 h-5 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0")}>
                          {pendingCount}
                        </span>
                      )}
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
                      onClick={closeMobileMenu}
                      className={clsx(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm my-1 transition-all duration-200 hover:scale-[1.02]",
                        active
                          ? "bg-[#e9f9f0] text-black border border-[#b7e7cc] shadow-sm"
                          : "text-slate-700 hover:bg-[#e9f9f0] hover:text-black"
                      )}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className={clsx("flex-1 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>{item.label}</span>
                      {item.href === "/bookings" && pendingCount > 0 && (
                        <span className={clsx("ml-2 inline-flex items-center justify-center rounded-full border border-red-500 text-red-600 text-[10px] font-semibold w-5 h-5 transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0")}>
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                  )}
                  
                  {hasSubmenu && isSubmenuExpanded && item.submenu && (
                    <div className={clsx("space-y-1 transition-all duration-300", isExpanded ? "ml-6" : "ml-0")}>
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={closeMobileMenu}
                            className={clsx(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:scale-[1.02]",
                              subActive
                                ? "bg-[#e9f9f0] text-black border border-[#b7e7cc] shadow-sm"
                                : "text-slate-600 hover:bg-[#e9f9f0] hover:text-black"
                            )}
                          >
                            <SubIcon size={16} className="flex-shrink-0" />
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
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
            <button className={clsx("w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:bg-[#e9f9f0] hover:text-black", isExpanded ? "justify-start" : "justify-center")}>
              <LogOut size={16} className="flex-shrink-0"/>
              <span className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Logout</span>
            </button>
          </div>
        </aside>
      </>
    </SidebarContext.Provider>
  );
}
