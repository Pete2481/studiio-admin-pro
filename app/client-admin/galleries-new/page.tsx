"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import ClientPageLayout from "@/components/ClientPageLayout";
import { Images, Eye, Download, Share, AlertCircle, Calendar, User } from "lucide-react";

interface ClientGallery {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  isPublic: boolean;
  expiresAt?: string;
  accessPolicy?: string;
  bookingId?: string;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    title: string;
    start: string;
    client?: {
      id: string;
      name: string;
    };
  };
  images: Array<{
    id: string;
    galleryId: string;
    storageUrl: string;
    type: string;
    filename: string;
    size: number;
    createdAt: string;
  }>;
}

export default function ClientGalleriesPage() {
  const { data: session } = useSession();
  const { currentTenant } = useTenant();
  const { currentClient, availableClients, switchClient } = useClientAdmin();
  
  const [galleries, setGalleries] = useState<ClientGallery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch client-specific galleries
  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/client/galleries");
      const data = await response.json();

      if (data.success) {
        setGalleries(data.galleries);
      } else {
        setError(data.error || 'Failed to fetch galleries');
        setGalleries([]);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setError('Failed to fetch galleries');
      setGalleries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch galleries on component mount
  useEffect(() => {
    fetchGalleries();
  }, []);

  if (!currentClient) {
    return (
      <ClientPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Client Selected</h3>
            <p className="text-gray-500">Please select a client to view their galleries.</p>
          </div>
        </div>
      </ClientPageLayout>
    );
  }

  return (
    <ClientPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Galleries</h1>
            <p className="text-gray-600">
              Photo galleries for {currentClient.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={currentClient.id}
              onChange={(e) => switchClient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Galleries Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Images className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Galleries Found</h3>
                <p className="text-gray-500">
                  {currentClient.name} doesn't have any galleries yet.
                </p>
              </div>
            ) : (
              galleries.map((gallery) => (
                <div key={gallery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Gallery Preview */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {gallery.images.length > 0 ? (
                      <img
                        src={gallery.images[0].storageUrl}
                        alt={gallery.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <Images className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Gallery Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {gallery.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        gallery.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gallery.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    
                    {gallery.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                    
                    {/* Gallery Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Images className="h-4 w-4" />
                        <span>{gallery.images.length} images</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Booking Info */}
                    {gallery.booking && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>From: {gallery.booking.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(gallery.booking.start).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ClientPageLayout>
  );
}
