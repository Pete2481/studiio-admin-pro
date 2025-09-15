"use client";

import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";

export default function ClientNotificationsPage() {
  // Hardcoded notifications for testing
  const notifications = [
    {
      id: "1",
      title: "New Booking Created",
      message: "A new booking has been created for your property shoot on December 15th, 2024.",
      type: "booking",
      category: "info",
      priority: "normal",
      status: "read",
      isRead: true,
      isArchived: false,
      createdAt: "2025-09-11T14:46:00.749Z",
      readAt: "2025-09-11T14:46:00.749Z",
      actionUrl: "/client-admin/bookings",
      actionText: "View Booking",
      creator: {
        id: "admin",
        name: "Master Admin",
        email: "admin@studiio.com"
      }
    },
    {
      id: "2",
      title: "Gallery Ready for Review",
      message: "Your property gallery is ready for review. 45 high-resolution images are available.",
      type: "gallery",
      category: "success",
      priority: "normal",
      status: "unread",
      isRead: false,
      isArchived: false,
      createdAt: "2025-09-10T20:46:00.752Z",
      actionUrl: "/client-admin/galleries",
      actionText: "View Gallery",
      creator: {
        id: "admin",
        name: "Master Admin",
        email: "admin@studiio.com"
      }
    },
    {
      id: "3",
      title: "Invoice #INV-2024-001 Sent",
      message: "Your invoice for the property photography service has been sent. Amount: $1,250.00",
      type: "invoice",
      category: "info",
      priority: "normal",
      status: "unread",
      isRead: false,
      isArchived: false,
      createdAt: "2025-09-09T02:35:38.104Z",
      actionUrl: "/client-admin/invoices",
      actionText: "View Invoice",
      creator: {
        id: "admin",
        name: "Master Admin",
        email: "admin@studiio.com"
      }
    },
    {
      id: "4",
      title: "Payment Received",
      message: "Payment of $1,250.00 has been received for invoice #INV-2024-001. Thank you!",
      type: "payment",
      category: "success",
      priority: "normal",
      status: "read",
      isRead: true,
      isArchived: false,
      createdAt: "2025-09-08T13:35:38.105Z",
      readAt: "2025-09-08T13:35:38.105Z",
      actionUrl: "/client-admin/invoices",
      actionText: "View Payment",
      creator: {
        id: "admin",
        name: "Master Admin",
        email: "admin@studiio.com"
      }
    },
    {
      id: "5",
      title: "Photographer Assignment",
      message: "Sarah Johnson has been assigned as your photographer for the upcoming session.",
      type: "assignment",
      category: "info",
      priority: "normal",
      status: "unread",
      isRead: false,
      isArchived: false,
      createdAt: "2025-09-06T00:35:38.107Z",
      actionUrl: "/client-admin/photographers",
      actionText: "View Profile",
      creator: {
        id: "admin",
        name: "Master Admin",
        email: "admin@studiio.com"
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Manage and review all notifications for Belle Property Group</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Notifications ({notifications.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(notification.category)}`}>
                        {notification.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Type: {notification.type}</span>
                      <span>Priority: {notification.priority}</span>
                      <span>Created: {formatDate(notification.createdAt)}</span>
                      {notification.creator && (
                        <span>By: {notification.creator.name}</span>
                      )}
                    </div>
                  </div>
                  {notification.actionUrl && notification.actionText && (
                    <div className="ml-4">
                      <a
                        href={notification.actionUrl}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        {notification.actionText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}