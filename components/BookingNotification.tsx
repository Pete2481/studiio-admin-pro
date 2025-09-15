"use client";

import { useEffect, useState } from "react";
import { Bell, X, Calendar, User, Clock, MapPin } from "lucide-react";
import { Booking } from "@/lib/types";

interface NotificationData {
  booking: Booking;
  source: string;
  timestamp: Date;
  id: string;
}

export default function BookingNotification() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleNewBookingRequest = (event: CustomEvent) => {
      console.log("🔔 BookingNotification: Received event", event.detail);
      
      try {
        const { booking, source } = event.detail || {};
        
        if (!booking || !source) {
          console.warn("🔔 BookingNotification: Invalid event data", event.detail);
          return;
        }
        
        // Only show notifications for new bookings from client admin
        if (source === "client-admin") {
          console.log("🔔 BookingNotification: Creating notification for client admin booking", booking);
          const notification: NotificationData = {
            booking,
            source,
            timestamp: new Date(),
            id: crypto.randomUUID()
          };
          
          setNotifications(prev => [notification, ...prev]);
          setIsVisible(true);
          
          // Auto-hide after 8 seconds
          setTimeout(() => {
            setIsVisible(false);
          }, 8000);
        } else {
          console.log("🔔 BookingNotification: Ignoring event from source:", source);
        }
      } catch (error) {
        console.error("🔔 BookingNotification: Error handling event", error);
      }
    };

    console.log("🔔 BookingNotification: Setting up event listener");
    
    // Add the event listener
    window.addEventListener("studiio:newBookingRequest", handleNewBookingRequest as EventListener);
    
    // Also listen for the regular eventsUpdated event as a fallback
    const handleEventsUpdated = () => {
      console.log("🔔 BookingNotification: Events updated - checking for new bookings");
      // This is a fallback mechanism - you could implement additional logic here
    };
    
    window.addEventListener("studiio:eventsUpdated", handleEventsUpdated);
    
    return () => {
      console.log("🔔 BookingNotification: Cleaning up event listeners");
      window.removeEventListener("studiio:newBookingRequest", handleNewBookingRequest as EventListener);
      window.removeEventListener("studiio:eventsUpdated", handleEventsUpdated);
    };
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
  };

  // Test function to manually trigger a notification
  const testNotification = () => {
    const testBooking: Booking = {
      id: "test-" + Date.now(),
      title: "Test Booking Request",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      status: "TENTATIVE",
      client: ["Test Client"],
      address: "123 Test Street",
      photographer: ["Test Photographer"],
      notes: "This is a test notification"
    };

    const notification: NotificationData = {
      booking: testBooking,
      source: "client-admin",
      timestamp: new Date(),
      id: crypto.randomUUID()
    };
    
    setNotifications(prev => [notification, ...prev]);
    setIsVisible(true);
    
    setTimeout(() => {
      setIsVisible(false);
    }, 8000);
  };

  // Always show test button for debugging
  const showTestButton = true; // Set to false in production
  
  if (showTestButton) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={testNotification}
          className="mb-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Notification
        </button>
        {isVisible && notifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2 max-w-sm">
            {/* ... existing notification content ... */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">New Booking Request</h3>
                  <p className="text-xs text-gray-500">From Client Admin</p>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notifications[0].id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2">
              {notifications[0].booking.title && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-900">{notifications[0].booking.title}</span>
                </div>
              )}
              
              {notifications[0].booking.client && (
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {Array.isArray(notifications[0].booking.client) 
                      ? notifications[0].booking.client.join(", ")
                      : notifications[0].booking.client
                    }
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {new Date(notifications[0].booking.start).toLocaleDateString()} at{" "}
                  {new Date(notifications[0].booking.start).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {notifications[0].booking.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-700 truncate">{notifications[0].booking.address}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  notifications[0].booking.status === "TENTATIVE" ? "bg-red-500" :
                  notifications[0].booking.status === "CONFIRMED" ? "bg-green-500" :
                  "bg-gray-500"
                }`}></div>
                <span className="text-sm text-gray-700">
                  Status: {notifications[0].booking.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => window.location.href = "/calendar"}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View Calendar
              </button>
              
              {notifications.length > 1 && (
                <button
                  onClick={dismissAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Dismiss All ({notifications.length})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[0];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Notification Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">New Booking Request</h3>
              <p className="text-xs text-gray-500">From Client Admin</p>
            </div>
          </div>
          <button
            onClick={() => dismissNotification(latestNotification.id)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Booking Details */}
        <div className="space-y-2">
          {latestNotification.booking.title && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-900">{latestNotification.booking.title}</span>
            </div>
          )}
          
          {latestNotification.booking.client && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700">
                {Array.isArray(latestNotification.booking.client) 
                  ? latestNotification.booking.client.join(", ")
                  : latestNotification.booking.client
                }
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-700">
              {new Date(latestNotification.booking.start).toLocaleDateString()} at{" "}
              {new Date(latestNotification.booking.start).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          {latestNotification.booking.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700 truncate">{latestNotification.booking.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              latestNotification.booking.status === "TENTATIVE" ? "bg-red-500" :
              latestNotification.booking.status === "CONFIRMED" ? "bg-green-500" :
              "bg-gray-500"
            }`}></div>
            <span className="text-sm text-gray-700">
              Status: {latestNotification.booking.status}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => window.location.href = "/calendar"}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View Calendar
          </button>
          
          {notifications.length > 1 && (
            <button
              onClick={dismissAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Dismiss All ({notifications.length})
            </button>
          )}
        </div>
      </div>

      {/* Additional Notifications */}
      {notifications.length > 1 && (
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
            +{notifications.length - 1} more
          </span>
        </div>
      )}
    </div>
  );
}
