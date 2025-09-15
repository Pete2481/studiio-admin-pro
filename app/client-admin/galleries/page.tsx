"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Grid3X3, List, Eye, Copy } from "lucide-react";
import ClientPageLayout from "@/components/ClientPageLayout";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";

interface Gallery {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  agent: string;
  tags: string[];
  itemCount?: number;
}

// Mock gallery data - in a real app this would come from an API
const mockGalleries: Gallery[] = [
  {
    id: "1",
    title: "ESSENTIAL PACKAGE",
    subtitle: "ESSENTIAL PACKAGE",
    image: "https://mediadrive.com.au/images/bg/1.jpg",
    agent: "John Smith",
    tags: ["Photography"],
    itemCount: 1
  },
  {
    id: "2",
    title: "Urban Loft Space",
    subtitle: "Urban Loft Space",
    image: "https://mediadrive.com.au/images/bg/2.jpg",
    agent: "Sarah Johnson",
    tags: ["Photography", "Drone"]
  },
  {
    id: "3",
    title: "Country Estate",
    subtitle: "567 Rural Route 1, Premium Consulting Group",
    image: "https://mediadrive.com.au/images/bg/3.jpg",
    agent: "Mike Wilson",
    tags: ["Photography", "Virtual Tour"]
  },
  {
    id: "4",
    title: "Modern Office Complex",
    subtitle: "890 Business Park, Elite Financial Services",
    image: "https://mediadrive.com.au/images/bg/4.jpg",
    agent: "Lisa Brown",
    tags: ["Photography", "Floor Plans"]
  },
  {
    id: "5",
    title: "Luxury Penthouse",
    subtitle: "123 Skyline Drive, Premium Real Estate",
    image: "https://mediadrive.com.au/images/bg/5.jpg",
    agent: "David Lee",
    tags: ["Photography", "Videography", "Drone"]
  },
  {
    id: "6",
    title: "Waterfront Condo",
    subtitle: "789 Harbor View, Coastal Properties",
    image: "https://mediadrive.com.au/images/bg/6.jpg",
    agent: "Emma Davis",
    tags: ["Photography", "Virtual Tour"]
  },
  {
    id: "7",
    title: "Mountain Retreat",
    subtitle: "456 Alpine Way, Nature Homes",
    image: "https://mediadrive.com.au/images/bg/7.jpg",
    agent: "Tom Anderson",
    tags: ["Photography", "Drone"]
  },
  {
    id: "8",
    title: "City Center Apartment",
    subtitle: "321 Downtown Ave, Urban Living",
    image: "https://mediadrive.com.au/images/bg/8.jpg",
    agent: "Rachel Green",
    tags: ["Photography", "Floor Plans"]
  },
  {
    id: "9",
    title: "Beachfront Villa",
    subtitle: "456 Coastal Highway, Exclusive Events Ltd",
    image: "https://mediadrive.com.au/images/bg/9.jpg",
    agent: "Alex Martinez",
    tags: ["Photography", "Drone", "Virtual Tour"]
  },
  {
    id: "10",
    title: "Historic Mansion",
    subtitle: "789 Heritage Lane, Classic Properties",
    image: "https://mediadrive.com.au/images/bg/10.jpg",
    agent: "Sophie Chen",
    tags: ["Photography", "Floor Plans", "Videography"]
  },
  {
    id: "11",
    title: "Modern Studio",
    subtitle: "321 Creative District, Urban Spaces",
    image: "https://mediadrive.com.au/images/bg/11.jpg",
    agent: "James Wilson",
    tags: ["Photography", "Virtual Tour"]
  },
  {
    id: "12",
    title: "Luxury Condo",
    subtitle: "654 High Rise Blvd, Skyline Properties",
    image: "https://mediadrive.com.au/images/bg/12.jpg",
    agent: "Maria Rodriguez",
    tags: ["Photography", "Drone", "Floor Plans"]
  }
];

export default function ClientGalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(8); // Start with 2 rows of 4
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Initialize galleries
  useEffect(() => {
    setGalleries(mockGalleries);
    setFilteredGalleries(mockGalleries.slice(0, 8));
  }, []);

  // Filter galleries based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGalleries(galleries.slice(0, displayedCount));
      setHasMore(displayedCount < galleries.length);
    } else {
      const filtered = galleries.filter(gallery =>
        gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gallery.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gallery.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gallery.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredGalleries(filtered);
      setHasMore(false);
    }
  }, [searchQuery, galleries, displayedCount]);

  // Load more galleries when scrolling
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const newCount = Math.min(displayedCount + 4, galleries.length);
      setDisplayedCount(newCount);
      setFilteredGalleries(galleries.slice(0, newCount));
      setHasMore(newCount < galleries.length);
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore, displayedCount, galleries]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, hasMore, isLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setDisplayedCount(8); // Reset to initial count when searching
  };

  const handleViewModeToggle = () => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  };

  const handleViewGallery = (galleryId: string) => {
    console.log("View gallery:", galleryId);
    // In a real app, this would navigate to the gallery view
  };

  const handleCopyGallery = (galleryId: string) => {
    console.log("Copy gallery:", galleryId);
    // In a real app, this would copy the gallery
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar 
        title="Client Galleries"
        showImportExport={false}
        showAdminToggle={false}
      />
      
      <ClientPageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar and View Toggle */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search galleries..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-[#e9f9f0]"
                  style={{ '--tw-ring-color': '#e9f9f0' } as React.CSSProperties}
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={viewMode === "grid" ? { backgroundColor: '#e9f9f0' } : {}}
                  title="Grid View"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={viewMode === "list" ? { backgroundColor: '#e9f9f0' } : {}}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Galleries Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGalleries.map((gallery) => (
                <div key={gallery.id} className="group">
                  <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                    {/* Gallery Image */}
                    <div className="relative overflow-hidden aspect-w-16 aspect-h-12 bg-gray-200">
                      <img
                        src={gallery.image}
                        alt={gallery.title}
                        className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Gallery+Image";
                        }}
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 ease-in-out"></div>
                    </div>

                    {/* Gallery Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                      {gallery.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {gallery.subtitle}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {gallery.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#e9f9f0', color: '#166534' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Agent */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-4 h-4 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        <span>{gallery.agent}</span>
                        {gallery.itemCount && (
                          <span className="ml-1 text-gray-400">• {gallery.itemCount}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons - Only View and Copy */}
                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewGallery(gallery.id)}
                        className="p-1.5 text-gray-400 rounded-full transition-colors"
                        style={{ 
                          '--hover-text-color': '#e9f9f0',
                          '--hover-bg-color': '#e9f9f0'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#e9f9f0';
                          e.currentTarget.style.backgroundColor = '#e9f9f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="View Gallery"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCopyGallery(gallery.id)}
                        className="p-1.5 text-gray-400 rounded-full transition-colors"
                        style={{ 
                          '--hover-text-color': '#e9f9f0',
                          '--hover-bg-color': '#e9f9f0'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#e9f9f0';
                          e.currentTarget.style.backgroundColor = '#e9f9f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Copy Gallery"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredGalleries.map((gallery) => (
                  <div key={gallery.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={gallery.image}
                          alt={gallery.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64?text=Gallery";
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {gallery.title}
                        </h3>
                        <p className="text-gray-600 text-xs mb-2">
                          {gallery.subtitle}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <div className="w-4 h-4 bg-gray-300 rounded-full mr-1 flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                            <span>{gallery.agent}</span>
                            {gallery.itemCount && (
                              <span className="ml-1 text-gray-400">• {gallery.itemCount}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {gallery.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#e9f9f0', color: '#166534' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewGallery(gallery.id)}
                          className="p-1.5 text-gray-400 rounded-full transition-colors"
                        style={{ 
                          '--hover-text-color': '#e9f9f0',
                          '--hover-bg-color': '#e9f9f0'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#e9f9f0';
                          e.currentTarget.style.backgroundColor = '#e9f9f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                          title="View Gallery"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCopyGallery(gallery.id)}
                          className="p-1.5 text-gray-400 rounded-full transition-colors"
                        style={{ 
                          '--hover-text-color': '#e9f9f0',
                          '--hover-bg-color': '#e9f9f0'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#e9f9f0';
                          e.currentTarget.style.backgroundColor = '#e9f9f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                          title="Copy Gallery"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#e9f9f0' }}></div>
            </div>
          )}

          {/* Load More Trigger */}
          {hasMore && !isLoading && (
            <div ref={loadMoreRef} className="h-10"></div>
          )}

          {/* No More Results */}
          {!hasMore && filteredGalleries.length > 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              {searchQuery ? "No more results found" : "All galleries loaded"}
            </div>
          )}

          {/* No Results */}
          {filteredGalleries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No galleries found</div>
              <div className="text-gray-400 text-sm">
                {searchQuery ? "Try adjusting your search terms" : "No galleries available"}
              </div>
            </div>
          )}
        </div>
      </ClientPageLayout>
    </div>
  );
}