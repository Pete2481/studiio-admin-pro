"use client";

import { useEffect, useState } from "react";
import { Bell, X, Calendar, User, Clock, MapPin, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Booking } from "@/lib/types";

export interface NotificationData {
  id: string;
  type: 'booking' | 'system' | 'alert' | 'info';
  title: string;
  message?: string;
  data?: any;
  timestamp: Date;
  autoHide?: boolean;
  duration?: number;
}

interface NotificationSystemProps {
  showTestButton?: boolean;
}

export default function NotificationSystem({ showTestButton = true }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleNewBookingRequest = (event: CustomEvent) => {
      console.log("🔔 NotificationSystem: Received booking event", event.detail);
      
      try {
        const { booking, source } = event.detail || {};
        
        if (!booking || !source) {
          console.warn("🔔 NotificationSystem: Invalid event data", event.detail);
          return;
        }
        
        if (source === "client-admin") {
          const notification: NotificationData = {
            id: crypto.randomUUID(),
            type: 'booking',
            title: 'New Booking Request',
            message: `New booking from ${booking.client || 'Client'}`,
            data: { booking, source },
            timestamp: new Date(),
            autoHide: true,
            duration: 8000
          };
          
          addNotification(notification);
        }
      } catch (error) {
        console.error("🔔 NotificationSystem: Error handling booking event", error);
      }
    };

    const handleSystemAlert = (event: CustomEvent) => {
      console.log("🔔 NotificationSystem: Received system alert", event.detail);
      
      const notification: NotificationData = {
        id: crypto.randomUUID(),
        type: 'system',
        title: 'System Alert',
        message: event.detail?.message || 'System notification',
        data: event.detail,
        timestamp: new Date(),
        autoHide: true,
        duration: 5000
      };
      
      addNotification(notification);
    };

    const handleInfoNotification = (event: CustomEvent) => {
      console.log("🔔 NotificationSystem: Received info notification", event.detail);
      
      const notification: NotificationData = {
        id: crypto.randomUUID(),
        type: 'info',
        title: event.detail?.title || 'Information',
        message: event.detail?.message || 'Info notification',
        data: event.detail,
        timestamp: new Date(),
        autoHide: true,
        duration: 6000
      };
      
      addNotification(notification);
    };

    console.log("🔔 NotificationSystem: Setting up event listeners");
    
    window.addEventListener("studiio:newBookingRequest", handleNewBookingRequest as EventListener);
    window.addEventListener("studiio:systemAlert", handleSystemAlert as EventListener);
    window.addEventListener("studiio:infoNotification", handleInfoNotification as EventListener);
    
    return () => {
      console.log("🔔 NotificationSystem: Cleaning up event listeners");
      window.removeEventListener("studiio:newBookingRequest", handleNewBookingRequest as EventListener);
      window.removeEventListener("studiio:systemAlert", handleSystemAlert as EventListener);
      window.removeEventListener("studiio:infoNotification", handleInfoNotification as EventListener);
    };
  }, []);

  const addNotification = (notification: NotificationData) => {
    setNotifications(prev => [notification, ...prev]);
    setIsVisible(true);
    
    if (notification.autoHide && notification.duration) {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, notification.duration);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      if (updated.length === 0) {
        setIsVisible(false);
      }
      return updated;
    });
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
  };

  const testNotification = () => {
    const testNotification: NotificationData = {
      id: crypto.randomUUID(),
      type: 'booking',
      title: 'Test Booking Request',
      message: 'This is a test notification',
      data: {
        booking: {
          id: "test-" + Date.now(),
          title: "Test Photography Session",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 3600000).toISOString(),
          status: "TENTATIVE",
          client: "Test Client",
          address: "123 Test Street",
          photographer: "Test Photographer",
          agent: "Test Agent"
        },
        source: "client-admin"
      },
      timestamp: new Date(),
      autoHide: true,
      duration: 8000
    };
    
    addNotification(testNotification);
  };

  const testSystemAlert = () => {
    const testAlert: NotificationData = {
      id: crypto.randomUUID(),
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance in 30 minutes',
      timestamp: new Date(),
      autoHide: true,
      duration: 5000
    };
    
    addNotification(testAlert);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100';
      case 'system':
        return 'bg-orange-100';
      case 'alert':
        return 'bg-red-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Always show test buttons if enabled, even when no notifications
  if (!showTestButton && (!isVisible || notifications.length === 0)) {
    return null;
  }

  const latestNotification = notifications.length > 0 ? notifications[0] : null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Test Buttons - Always show when enabled */}
      {showTestButton && (
        <div className="mb-2 flex gap-2">
          <button
            onClick={testNotification}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test Booking
          </button>
          <button
            onClick={testSystemAlert}
            className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
          >
            Test Alert
          </button>
        </div>
      )}

      {/* Notification Container - Only show if there are notifications */}
      {latestNotification && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${getIconBg(latestNotification.type)}`}>
                {getIcon(latestNotification.type)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{latestNotification.title}</h3>
                <p className="text-xs text-gray-500">{latestNotification.message}</p>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(latestNotification.id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

        {/* Booking Details (for booking notifications) */}
        {latestNotification.type === 'booking' && latestNotification.data?.booking && (
          <div className="space-y-2">
            {latestNotification.data.booking.title && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-900">{latestNotification.data.booking.title}</span>
              </div>
            )}
            
            {latestNotification.data.booking.client && (
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {Array.isArray(latestNotification.data.booking.client) 
                    ? latestNotification.data.booking.client.join(", ")
                    : latestNotification.data.booking.client
                  }
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700">
                {new Date(latestNotification.data.booking.start).toLocaleDateString()} at{" "}
                {new Date(latestNotification.data.booking.start).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>

            {latestNotification.data.booking.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700 truncate">{latestNotification.data.booking.address}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                latestNotification.data.booking.status === "TENTATIVE" ? "bg-red-500" :
                latestNotification.data.booking.status === "CONFIRMED" ? "bg-green-500" :
                "bg-gray-500"
              }`}></div>
              <span className="text-sm text-gray-700">
                Status: {latestNotification.data.booking.status}
              </span>
            </div>
          </div>
        )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            {latestNotification.type === 'booking' && (
              <button
                onClick={() => window.location.href = "/calendar"}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View Calendar
              </button>
            )}
            
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
