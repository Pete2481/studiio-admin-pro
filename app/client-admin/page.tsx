"use client";

import { useClientAdmin } from "@/components/ClientAdminProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";
import { 
  Calendar, 
  Images, 
  CreditCard, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit,
  Copy,
  AlertCircle,
  Bell,
  FileText,
  DollarSign
} from "lucide-react";

interface ClientDashboardStats {
  totalBookings: number;
  totalGalleries: number;
  totalInvoices: number;
  pendingBookings: number;
  completedBookings: number;
  totalSpent: number;
}

interface Gallery {
  id: string;
  title: string;
  propertyAddress: string;
  companyName: string;
  image: string;
}

interface Booking {
  id: string;
  title: string;
  time: string;
  status: "Pending" | "Completed" | "Cancelled";
  icon: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "gallery" | "invoice" | "system";
  category: "info" | "warning" | "success" | "error";
  priority: "low" | "normal" | "high" | "urgent";
  status: "new" | "normal";
  isRead: boolean;
  createdAt: string;
  createdBy: string;
  icon: any;
}

const recentGalleries: Gallery[] = [
  {
    id: "1",
    title: "Beachfront Villa",
    propertyAddress: "456 Coastal Highway",
    companyName: "Exclusive Events Ltd",
    image: "https://mediadrive.com.au/images/bg/1.jpg"
  },
  {
    id: "2",
    title: "Urban Loft Space",
    propertyAddress: "321 Industrial Blvd",
    companyName: "Luxury Travel Agency",
    image: "https://mediadrive.com.au/images/bg/2.jpg"
  },
  {
    id: "3",
    title: "Country Estate",
    propertyAddress: "567 Rural Route 1",
    companyName: "Premium Consulting Group",
    image: "https://mediadrive.com.au/images/bg/3.jpg"
  },
  {
    id: "4",
    title: "Modern Office Complex",
    propertyAddress: "890 Business Park",
    companyName: "Elite Financial Services",
    image: "https://mediadrive.com.au/images/bg/4.jpg"
  },
  {
    id: "5",
    title: "Luxury Penthouse",
    propertyAddress: "123 Skyline Drive",
    companyName: "Premium Real Estate",
    image: "https://mediadrive.com.au/images/bg/5.jpg"
  },
  {
    id: "6",
    title: "Waterfront Condo",
    propertyAddress: "789 Harbor View",
    companyName: "Coastal Properties",
    image: "https://mediadrive.com.au/images/bg/6.jpg"
  },
  {
    id: "7",
    title: "Mountain Retreat",
    propertyAddress: "456 Alpine Way",
    companyName: "Nature Homes",
    image: "https://mediadrive.com.au/images/bg/7.jpg"
  },
  {
    id: "8",
    title: "City Center Apartment",
    propertyAddress: "321 Downtown Ave",
    companyName: "Urban Living",
    image: "https://mediadrive.com.au/images/bg/8.jpg"
  }
];

const recentNotifications: Notification[] = [
  {
    id: "1",
    title: "New Booking Created",
    message: "A new booking has been created for your property shoot on December 15th, 2024.",
    type: "booking",
    category: "info",
    priority: "normal",
    status: "normal",
    isRead: false,
    createdAt: "7h ago",
    createdBy: "Master Admin",
    icon: Calendar
  },
  {
    id: "2",
    title: "Gallery Ready for Review",
    message: "Your property gallery is ready for review. 45 high-resolution images are available.",
    type: "gallery",
    category: "success",
    priority: "normal",
    status: "new",
    isRead: false,
    createdAt: "1d ago",
    createdBy: "Master Admin",
    icon: Images
  },
  {
    id: "3",
    title: "Gallery Ready for Review",
    message: "Your property gallery is ready for review. 45 high-resolution images are available.",
    type: "gallery",
    category: "success",
    priority: "normal",
    status: "new",
    isRead: false,
    createdAt: "1d ago",
    createdBy: "Master Admin",
    icon: Images
  },
  {
    id: "4",
    title: "Invoice #INV-2024-001 Sent",
    message: "Your invoice for the property photography service has been sent. Amount: $1,250.00",
    type: "invoice",
    category: "info",
    priority: "normal",
    status: "new",
    isRead: false,
    createdAt: "2d ago",
    createdBy: "Master Admin",
    icon: DollarSign
  }
];

export default function ClientAdminPage() {
  const { currentClient, availableClients, switchClient } = useClientAdmin();
  const router = useRouter();
  const [stats, setStats] = useState<ClientDashboardStats>({
    totalBookings: 0,
    totalGalleries: 0,
    totalInvoices: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });

  // Gallery scroll state
  const [galleryScrollPosition, setGalleryScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Banner and logo state (read-only from business admin)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Mock data for demo
  useEffect(() => {
    if (currentClient) {
      setStats({
        totalBookings: 12,
        totalGalleries: 8,
        totalInvoices: 6,
        pendingBookings: 2,
        completedBookings: 10,
        totalSpent: 15420,
      });
    }
  }, [currentClient]);

  // Load banner, logo, and company data from localStorage (synced from business admin)
  useEffect(() => {
    if (currentClient) {
      try {
        // Use the client ID to load the banner, logo, and company data
        const savedBanner = localStorage.getItem(`studiio.company.banner.${currentClient.id}`);
        const savedLogo = localStorage.getItem(`studiio.company.logo.${currentClient.id}`);
        const savedCompanyData = localStorage.getItem(`studiio.company.data.${currentClient.id}`);
        
        if (savedBanner) setBannerUrl(savedBanner);
        if (savedLogo) setLogoUrl(savedLogo);
        
        // Update the client name and company info if we have saved data
        if (savedCompanyData) {
          const companyData = JSON.parse(savedCompanyData);
          // Update the current client with the latest data
          currentClient.name = companyData.name || currentClient.name;
          currentClient.company = {
            id: currentClient.id,
            name: companyData.company || currentClient.company?.name || 'Independent'
          };
        }
      } catch (error) {
        console.error('Failed to load banner/logo/company data:', error);
      }
    }
  }, [currentClient]);

  const handleClientSelect = (clientId: string) => {
    switchClient(clientId);
  };

  // Gallery scroll functions
  const scrollGalleries = (direction: 'left' | 'right') => {
    const container = document.getElementById('client-galleries-container');
    if (container) {
      const cardWidth = 320; // 80 (w-80) + 16 (gap-4) = 336px, but using 320 for smoother scroll
      const visibleCards = Math.floor(container.clientWidth / cardWidth);
      const scrollAmount = cardWidth * visibleCards;
      
      const newPosition = direction === 'left' 
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollAmount);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      // Update scroll position state
      setTimeout(() => {
        setGalleryScrollPosition(container.scrollLeft);
        updateScrollButtons(container);
      }, 300);
    }
  };

  const updateScrollButtons = (container: HTMLElement) => {
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  };

  // Update scroll buttons on mount and resize
  const handleContainerScroll = () => {
    const container = document.getElementById('client-galleries-container');
    if (container) {
      updateScrollButtons(container);
    }
  };

  // Initialize scroll buttons on mount
  useEffect(() => {
    const container = document.getElementById('client-galleries-container');
    if (container) {
      updateScrollButtons(container);
    }
    
    // Add resize listener
    const handleResize = () => {
      const container = document.getElementById('client-galleries-container');
      if (container) {
        updateScrollButtons(container);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gallery handlers
  const handleEditGallery = (galleryId: string) => {
    console.log("Edit gallery:", galleryId);
  };

  const handleCopyURL = (galleryId: string) => {
    const url = `${window.location.origin}/galleries/${galleryId}`;
    navigator.clipboard.writeText(url);
    console.log("URL copied:", url);
  };

  const handleViewGallery = async (galleryId: string) => {
    const galleryUrl = "https://mediadrive.studiio.au/view-gallery/147-mount-warning-road-mount-warning-nsw-australia";
    
    try {
      await navigator.clipboard.writeText(galleryUrl);
      console.log("Gallery URL copied to clipboard:", galleryUrl);
      window.open(galleryUrl, '_blank');
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err);
      window.open(galleryUrl, '_blank');
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      {/* Topbar with Admin Toggle */}
      <Topbar 
        title={`${currentClient?.name || 'Client'} - Client Dashboard`}
        showImportExport={false}
        showAdminToggle={true}
      />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentClient?.name || 'Select a Client'} - Client Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Company: {currentClient?.company?.name || 'Independent'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentClient?.name || 'Client User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Selection */}
        {!currentClient && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">{client.name}</h4>
                  {client.company && (
                    <p className="text-sm text-gray-600 mt-1">{client.company.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{client.email}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Company Profile Header */}
        {currentClient && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* Banner */}
            <div
              className="h-80 rounded-t-lg relative"
              style={
                bannerUrl
                  ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { backgroundImage: "linear-gradient(to right, #2dd4bf, #f9a8d4, #fdba74)" }
              }
            >
              {!bannerUrl && (
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-pink-300/20 to-orange-300/20" />
              )}
              {/* Reduced fade height so more of the banner image is visible down to the red line area */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 relative">
              {/* Profile Picture */}
              <div className="flex justify-center -mt-20 mb-4">
                <div className="h-32 w-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>🏢</span>
                  )}
                </div>
              </div>

              {/* Company Name and Category */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentClient.name}</h1>
                <p className="text-lg text-gray-600">{currentClient.company?.name || 'Independent'}</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-600">Properties</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2,847</div>
                    <div className="text-sm text-gray-600">Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">$1.2B</div>
                    <div className="text-sm text-gray-600">Sales Volume</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {currentClient && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Request Booking
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Galleries
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                  <Download className="h-4 w-4 mr-2" />
                  Special Request
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Invoices
                </button>
              </div>
            </div>

            {/* Recent Galleries Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Galleries</h2>
                  <button
                    onClick={() => router.push('/client-admin/galleries')}
                    className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    See all
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative">
                  {/* Scroll Buttons */}
                  <button
                    onClick={() => scrollGalleries('left')}
                    disabled={!canScrollLeft}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-all duration-200 ${
                      canScrollLeft ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button
                    onClick={() => scrollGalleries('right')}
                    disabled={!canScrollRight}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-all duration-200 ${
                      canScrollRight ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Galleries Container */}
                  <div 
                    id="client-galleries-container"
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={handleContainerScroll}
                    onLoad={handleContainerScroll}
                  >
                    {recentGalleries.map((gallery) => (
                      <div key={gallery.id} className="flex-shrink-0 w-64 sm:w-72 md:w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Gallery Image */}
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img 
                            src={gallery.image} 
                            alt={gallery.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.className = 'h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl';
                              e.currentTarget.parentElement!.textContent = '🏠';
                            }}
                          />
                        </div>
                        
                        {/* Gallery Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{gallery.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{gallery.propertyAddress}</p>
                          <p className="text-sm text-gray-500 mb-3">{gallery.companyName}</p>
                          
                          {/* Action Icons */}
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditGallery(gallery.id)}
                              className="p-1.5 text-gray-400 rounded-full transition-colors"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#e9f9f0';
                                e.currentTarget.style.backgroundColor = '#e9f9f0';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#9ca3af';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleCopyURL(gallery.id)}
                              className="p-1.5 text-gray-400 rounded-full transition-colors"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#e9f9f0';
                                e.currentTarget.style.backgroundColor = '#e9f9f0';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#9ca3af';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              title="Copy URL"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => handleViewGallery(gallery.id)}
                              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                              title="View Gallery"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Notifications Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                  <button
                    onClick={() => router.push('/client-admin/notifications')}
                    className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    See more
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentNotifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div key={notification.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-white rounded-lg border border-gray-200">
                            <IconComponent className="h-5 w-5" style={{ color: '#e9f9f0' }} />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              {notification.status === "new" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#e9f9f0', color: '#166534' }}>
                                  New
                                </span>
                              )}
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {notification.priority === "normal" ? "Normal" : notification.priority}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="capitalize">{notification.type}</span>
                              <span className="capitalize">{notification.category}</span>
                              <span>{notification.createdAt}</span>
                              <span>by {notification.createdBy}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <button className="px-3 py-1 text-xs font-medium text-white rounded transition-colors" style={{ backgroundColor: '#e9f9f0' }}>
                            {notification.type === "booking" ? "View Booking" : 
                             notification.type === "gallery" ? "View Gallery" : 
                             notification.type === "invoice" ? "View Invoice" : "View Details"}
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                            Mark Read
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                            Archive
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
