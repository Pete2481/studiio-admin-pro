"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import ClientPageLayout from "@/components/ClientPageLayout";
import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";
import { Calendar, Clock, MapPin, User, Building2, AlertCircle } from "lucide-react";

interface ClientBooking {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  clientId: string;
  address?: string;
  notes?: string;
  durationM: number;
  services?: string;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
  };
  agent?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
  };
  gallery?: {
    id: string;
    title: string;
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case "TENTATIVE":
      return "bg-red-100 text-red-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PENCILED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "TENTATIVE":
      return "Tentative";
    case "CONFIRMED":
      return "Confirmed";
    case "PENCILED":
      return "Penciled";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function ClientBookingsPage() {
  const { data: session } = useSession();
  const { currentTenant } = useTenant();
  const { currentClient, availableClients, switchClient } = useClientAdmin();
  
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch client-specific bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/client/bookings");
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.error || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  if (!currentClient) {
    return (
      <ClientPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Client Selected</h3>
            <p className="text-gray-500">Please select a client to view their bookings.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600">
              Bookings for {currentClient.name}
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

        {/* Bookings List */}
        {!isLoading && !error && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
                <p className="text-gray-500">
                  {currentClient.name} doesn't have any bookings yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {booking.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.start).toLocaleDateString()} at {new Date(booking.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{booking.durationM} minutes</span>
                          </div>
                          
                          {booking.address && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.address}</span>
                            </div>
                          )}
                          
                          {booking.agent && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{booking.agent.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                        )}
                        
                        {booking.gallery && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                              <Building2 className="h-4 w-4" />
                              <span>Gallery: {booking.gallery.title}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ClientPageLayout>
  );
}
