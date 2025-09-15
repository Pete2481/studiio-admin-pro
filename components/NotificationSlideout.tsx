"use client";

import { useState, useEffect } from "react";
import { X, Calendar, User, Clock, MapPin, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  type: 'NEW_BOOKING_REQUEST' | 'BOOKING_UPDATE_REQUEST' | 'BOOKING_CANCELLED';
  title: string;
  message: string;
  bookingId?: string;
  clientId?: string;
  data?: any;
  timestamp: string;
}

interface NotificationSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
}

export default function NotificationSlideout({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead 
}: NotificationSlideoutProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log("🔔 NotificationSlideout: Component rendered with notifications:", notifications);
    console.log("🔔 NotificationSlideout: Number of notifications:", notifications.length);
  }, [notifications]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_BOOKING_REQUEST':
        return <Calendar className="h-5 w-5 text-teal-600" />;
      case 'BOOKING_UPDATE_REQUEST':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'BOOKING_CANCELLED':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'NEW_BOOKING_REQUEST':
        return 'border-l-teal-500 bg-teal-50';
      case 'BOOKING_UPDATE_REQUEST':
        return 'border-l-blue-500 bg-blue-50';
      case 'BOOKING_CANCELLED':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white/90 backdrop-blur-md shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/90 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">{notifications.length} new notifications</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50/50 backdrop-blur-sm rounded-lg mx-4">
              <Calendar className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border-l-4 ${getNotificationColor(notification.type)} hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] backdrop-blur-sm`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      {/* Booking Details */}
                      {notification.data?.booking && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(notification.data.booking.start).toLocaleDateString()} at{' '}
                              {new Date(notification.data.booking.start).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          {notification.data.booking.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{notification.data.booking.address}</span>
                            </div>
                          )}
                          {notification.data.requestedBy && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              <span>Requested by {notification.data.requestedBy}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
            <button
              onClick={() => {
                notifications.forEach(n => onMarkAsRead(n.id));
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
}





