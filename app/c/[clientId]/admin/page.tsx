"use client";

import { useSession } from "next-auth/react";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import { 
  Calendar, 
  Images, 
  CreditCard, 
  Settings, 
  Building,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download
} from "lucide-react";

interface ClientDashboardStats {
  totalBookings: number;
  totalGalleries: number;
  totalInvoices: number;
  pendingBookings: number;
  completedBookings: number;
  totalSpent: number;
}

export default function ClientAdminDashboard() {
  const { data: session, status } = useSession();
  const { currentClient } = useClientAdmin();
  const params = useParams();
  const [stats, setStats] = useState<ClientDashboardStats>({
    totalBookings: 0,
    totalGalleries: 0,
    totalInvoices: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });

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

  // Debug logging
  console.log('Client Admin - Session Status:', { status, session, currentClient });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // For development, allow access even without session if we have a current client
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!session && !isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access the client dashboard.</p>
        </div>
      </div>
    );
  }

  // If no session in development, show a warning but allow access
  if (!session && isDevelopment) {
    console.warn('No session found in development mode, allowing access anyway');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar with Admin Toggle */}
      <Topbar 
        title={`${currentClient?.name} - Client Dashboard`}
        showImportExport={false}
        showAdminToggle={true}
      />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentClient?.name} - Client Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Client: {params.clientId} | Company: {currentClient?.company?.name || 'Independent'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email || 'Demo User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Images className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Galleries</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalGalleries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Request Booking
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Eye className="h-4 w-4 mr-2" />
              View Galleries
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Download Images
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">
              <CreditCard className="h-4 w-4 mr-2" />
              View Invoices
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Property Photography</p>
                    <p className="text-xs text-gray-600">Today, 2:00 PM</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Wedding Photography</p>
                    <p className="text-xs text-gray-600">Yesterday, 3:30 PM</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product Photography</p>
                    <p className="text-xs text-gray-600">2 days ago, 10:00 AM</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Galleries</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Images className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Beachfront Villa</p>
                    <p className="text-xs text-gray-600">456 Coastal Highway</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Images className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Urban Loft Space</p>
                    <p className="text-xs text-gray-600">321 Industrial Blvd</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Images className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Country Estate</p>
                    <p className="text-xs text-gray-600">567 Rural Route 1</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
