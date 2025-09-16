"use client";

import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import { Edit, Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Copy, Eye, BarChart3, DollarSign, Users, TrendingUp as TrendingUpIcon, Images, Calendar, FileText, Bell, X as XIcon } from "lucide-react";

interface Gallery {
  id: string;
  title: string;
  propertyAddress: string;
  companyName: string;
  image: string;
}

interface Booking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  agent: string;
  address: string;
  comment: string;
  services: string;
  status: "New Request" | "Confirmed" | "Completed" | "Cancelled";
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
  },
  {
    id: "9",
    title: "Garden Villa",
    propertyAddress: "567 Botanical Gardens",
    companyName: "Green Spaces",
    image: "https://mediadrive.com.au/images/bg/9.jpg"
  },
  {
    id: "10",
    title: "Historic Mansion",
    propertyAddress: "890 Heritage Lane",
    companyName: "Classic Properties",
    image: "https://mediadrive.com.au/images/bg/10.jpg"
  },
  {
    id: "11",
    title: "Modern Townhouse",
    propertyAddress: "123 Contemporary St",
    companyName: "Modern Living",
    image: "https://mediadrive.com.au/images/bg/11.jpg"
  },
  {
    id: "12",
    title: "Seaside Cottage",
    propertyAddress: "456 Ocean Drive",
    companyName: "Beach Homes",
    image: "https://mediadrive.com.au/images/bg/12.jpg"
  }
];

function mockRecentBookings(): Booking[] {
  const seed: Booking[] = [
    {
      id: "1",
      bookingDate: "03/09/2025",
      bookingTime: "12:00 PM - 01:00 PM",
      agent: "Dodds Real Estate (Michael Dodds)",
      address: "48 Tinderbox Rd, Talofa NSW, Australia",
      comment: "",
      services: "Premium Package, Video Package",
      status: "New Request",
    },
    {
      id: "2",
      bookingDate: "04/09/2025",
      bookingTime: "10:30 AM - 11:30 AM",
      agent: "Harcourts",
      address: "101 Riverside Drive, West Ballina NSW, Australia",
      comment: "Agent will meet at the property. (has a pool)",
      services: "Studio Package",
      status: "New Request",
    },
    {
      id: "3",
      bookingDate: "29/08/2025",
      bookingTime: "02:00 PM - 03:00 PM",
      agent: "Raine & Horne-Ballina / Alstonville",
      address: "10 Denbes Crescent, East Lismore NSW, Australia",
      comment: "The owners may be at property, please complete photos, floorplan & aerial",
      services: "Studio Photography (Rental)",
      status: "New Request",
    },
  ];

  const agents = [
    "Sotheby's",
    "Ray White",
    "LJ Hooker",
    "First National",
    "McGrath",
    "Century 21",
    "Belle Property",
    "Atlas",
  ];
  const services = [
    "Essential Shoot",
    "Premium Shoot",
    "Video",
    "Drone",
    "Floor Plan",
    "Virtual Tour",
  ];
  const addresses = [
    "1126 Pottsville Road",
    "45 Ocean View Drive, Byron Bay",
    "10 Denbes Crescent, East Lismore",
    "7 Beach Street, Lennox Head",
    "23 Mountain Road, Bangalow",
    "12 River Road, Ballina",
  ];
  const statuses: Booking["status"][] = [
    "New Request",
    "Confirmed",
    "Completed",
    "Cancelled",
  ];

  const more: Booking[] = Array.from({ length: 27 }, (_, i) => {
    const day = i + 1;
    const d = new Date();
    d.setDate(d.getDate() - day);
    const bookingDate = d.toLocaleDateString("en-AU");
    const startHour = 8 + (i % 7); // 08:00 .. 14:00
    const endHour = startHour + 1;
    const to12 = (h: number) => {
      const suffix = h >= 12 ? "PM" : "AM";
      const hr = ((h + 11) % 12) + 1;
      return `${String(hr).padStart(2, "0")}:00 ${suffix}`;
    };
    return {
      id: String(i + 4),
      bookingDate,
      bookingTime: `${to12(startHour)} - ${to12(endHour)}`,
      agent: agents[i % agents.length],
      address: addresses[i % addresses.length],
      comment: ["", "Drone + Interiors", "Key under mat", "Owner on site"][i % 4],
      services: `${services[i % services.length]}${i % 3 === 0 ? ", Video" : ""}`,
      status: statuses[i % statuses.length],
    } as Booking;
  });

  return [...seed, ...more];
}

function loadSharedBookings(): Booking[] {
  try {
    const raw = localStorage.getItem("studiio.events.v2");
    if (raw) {
      const items = JSON.parse(raw) as any[];
      // map Calendar Booking to Dashboard Booking row format
      return (items || []).map((e) => ({
        id: e.id,
        bookingDate: new Date(e.start).toLocaleDateString("en-AU"),
        bookingTime: `${new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(e.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        agent: e.client || "-",
        address: e.address || "-",
        comment: e.notes || "",
        services: Array.isArray(e.services) ? e.services.join(", ") : "",
        status: (e.status === "CONFIRMED" ? "Confirmed" : e.status === "TENTATIVE" ? "New Request" : e.status === "CANCELLED" ? "Cancelled" : "Completed") as Booking["status"],
      })) as Booking[];
    }
  } catch {}
  return mockRecentBookings();
}

let recentBookings: Booking[] = [];

export default function SubAdminDashboard() {
  const { data: session, status } = useSession();
  const { currentTenant } = useTenant();
  const params = useParams();
  const [rows, setRows] = useState<Booking[]>([]);


  useEffect(() => {
    const ensure = () => {
      const loaded = loadSharedBookings();
      setRows(loaded);
    };
    ensure();
    const onUpdate = () => ensure();
    window.addEventListener("storage", onUpdate);
    window.addEventListener("studiio:eventsUpdated", onUpdate as any);
    return () => {
      window.removeEventListener("storage", onUpdate);
      window.removeEventListener("studiio:eventsUpdated", onUpdate as any);
    };
  }, []);


  const [galleryScrollPosition, setGalleryScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollGalleries = (direction: 'left' | 'right') => {
    const container = document.getElementById('galleries-container');
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
    const container = document.getElementById('galleries-container');
    if (container) {
      updateScrollButtons(container);
    }
  };

  // Initialize scroll buttons on mount
  useEffect(() => {
    const container = document.getElementById('galleries-container');
    if (container) {
      updateScrollButtons(container);
    }
    
    // Add resize listener
    const handleResize = () => {
      const container = document.getElementById('galleries-container');
      if (container) {
        updateScrollButtons(container);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "New Request":
        return "bg-red-100 text-red-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditBooking = (bookingId: string) => {
    console.log("Edit booking:", bookingId);
  };

  const handleDeleteBooking = (bookingId: string) => {
    console.log("Delete booking:", bookingId);
  };

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

  // Development mode - bypass authentication
  // if (status === "loading") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
  //     </div>
  //   );
  // }

  // if (!session) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
  //         <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Admin Dashboard"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Media Drive - Admin Dashboard
          </h1>



          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* Total Galleries */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Galleries</p>
                  <p className="text-2xl font-bold text-gray-900">500</p>
                  <div className="flex items-center mt-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">↑ 11.3%</span>
                  </div>
                </div>
                <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Images className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pending Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <div className="flex items-center mt-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">↑ 11.3%</span>
                  </div>
                </div>
                <div className="w-16 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Edit Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Edit Requests</p>
                  <p className="text-2xl font-bold text-gray-900">39</p>
                  <div className="flex items-center mt-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">↑ 11.3%</span>
                  </div>
                </div>
                <div className="w-16 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Galleries Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Galleries</h2>
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
                  id="galleries-container"
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
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleCopyURL(gallery.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
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

          {/* Recent Bookings Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Photographer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((booking, index) => (
                    <tr key={booking.id} className={index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.bookingDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.bookingTime}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{booking.agent}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{booking.address}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{booking.comment}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">{booking.services}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditBooking(booking.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Row - Charts and Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sales Distribution</h3>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>Europe</option>
                </select>
              </div>
              <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 via-red-400 to-purple-400 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-sm">230,900 Sales</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                      <span>France: 4268 Sales</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
                      <span>Italy: 3978 Sales</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
                      <span>Spain: 3454 Sales</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-400 rounded mr-2"></div>
                      <span>Germany: 3298 Sales</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Sales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall Sales</h3>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>Europe</option>
                </select>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded mr-2"></div>
                  <span className="text-sm">Germany</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                  <span className="text-sm">France</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                  <span className="text-sm">Portugal</span>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                      <div className="w-4 bg-purple-400 rounded" style={{ height: `${20 + Math.random() * 40}px` }}></div>
                      <div className="w-4 bg-blue-400 rounded" style={{ height: `${20 + Math.random() * 40}px` }}></div>
                      <div className="w-4 bg-green-400 rounded" style={{ height: `${20 + Math.random() * 40}px` }}></div>
                    </div>
                    <span className="text-xs text-gray-600">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Money Widget */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Money</h3>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-green-600">$50,000</p>
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-purple-200 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">48% Saved</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-600 rounded mr-2"></div>
                    <span className="text-sm">Total Spent</span>
                  </div>
                  <span className="text-sm font-medium">$28,570</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-200 rounded mr-2"></div>
                    <span className="text-sm">Money Saved</span>
                  </div>
                  <span className="text-sm font-medium">$21,430</span>
                </div>
              </div>
              <button className="w-full text-blue-600 text-sm font-medium hover:text-blue-700">
                View Full Report
              </button>
            </div>

            {/* Net Income */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Net Income</h3>
                  <p className="text-sm text-gray-600">Avg. $5,309</p>
                </div>
                <div className="flex gap-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Monthly</option>
                  </select>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Last Year</option>
                  </select>
                </div>
              </div>
              <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                  <div key={month} className="flex flex-col items-center">
                    <div className="w-6 bg-purple-600 rounded mb-2" style={{ height: `${30 + Math.random() * 60}px` }}></div>
                    <div className="w-6 bg-purple-200 rounded" style={{ height: `${10 + Math.random() * 30}px` }}></div>
                    <span className="text-xs text-gray-600 mt-2">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}











