"use client";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Users, UserCog, Settings, BookOpenText, Briefcase, Images, CreditCard, LogOut, ChevronDown, Building, UserCheck, Eye, Plus, Wrench, Menu, X, ChevronRight, BarChart3, FileText, MessageSquare, Mail } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState, createContext, useContext } from "react";

// Create context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: true, // Start collapsed by default
  setIsCollapsed: () => {},
});

// Hook to use sidebar context
export const useSidebar = () => useContext(SidebarContext);

type NavItem = {
  href: Route;
  label: string;
  icon: any;
  submenu?: Array<{ href: Route; label: string; icon: any }>;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
        { 
        href: "/galleries", 
        label: "Galleries", 
        icon: Images,
        submenu: [
          { href: "/galleries", label: "All Galleries", icon: Images },
          { href: "/gallery", label: "Gallery View", icon: Images },
          { href: "/gallery-demo", label: "Cloud Gallery Demo", icon: Images },
          { href: "/completed", label: "Completed", icon: Eye },
        ]
      },
  { href: "/bookings", label: "Bookings", icon: BookOpenText },
  { href: "/requests", label: "Requests", icon: MessageSquare },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { 
    href: "/clients", 
    label: "Clients", 
    icon: Users,
    submenu: [
      { href: "/clients/companies", label: "Companies", icon: Building },
      { href: "/clients/agents", label: "Agents", icon: UserCheck },
    ]
  },
  { 
    href: "/invoices", 
    label: "Invoice", 
    icon: CreditCard,
    submenu: [
      { href: "/invoices/view", label: "View Invoice", icon: Eye },
      { href: "/invoices/add", label: "Add Invoice", icon: Plus },
      { href: "/admin/invoicing/reconcile", label: "Reconciliation", icon: FileText },
    ]
  },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/photographers", label: "Photographers", icon: UserCog },
  { href: "/editors", label: "Editors", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar(){
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
  const [isHovered, setIsHovered] = useState(false);

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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

  // Determine if sidebar should be expanded (hovered or manually expanded)
  const isExpanded = isHovered || !isCollapsed;

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
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
            isExpanded ? "lg:w-68" : "lg:w-16" // Expand to 272px when hovered or manually expanded
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link href="/calendar" className="flex items-center gap-2 font-semibold" onClick={closeMobileMenu}>
              <div className="h-8 w-8 rounded-xl bg-[var(--accent)] flex-shrink-0" />
              <span className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Studiio Admin</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCollapse}
                className="hidden lg:block p-1 hover:bg-gray-100 rounded transition-colors"
                title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
              >
                <ChevronRight size={16} className={clsx("transition-transform duration-300", isCollapsed ? "rotate-180" : "")} />
              </button>
              <button
                onClick={closeMobileMenu}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
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
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm my-1 transition-all duration-300",
                        active
                          ? "bg-[var(--accent)] text-black border border-[var(--border)]"
                          : "text-slate-700 hover:bg-[var(--accent-hover)]"
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
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm my-1 transition-all duration-300",
                        active
                          ? "bg-[var(--accent)] text-black border border-[var(--border)]"
                          : "text-slate-700 hover:bg-[var(--accent-hover)]"
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
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                              subActive
                                ? "bg-[var(--accent)] text-black"
                                : "text-slate-600 hover:bg-[var(--accent-hover)]"
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
            <button className={clsx("w-full btn flex items-center justify-center gap-2 transition-all duration-300", isExpanded ? "justify-start" : "justify-center")}>
              <LogOut size={16} className="flex-shrink-0"/>
              <span className={clsx("transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>Logout</span>
            </button>
          </div>
        </aside>
      </>
    </SidebarContext.Provider>
  );
}
