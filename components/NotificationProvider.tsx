"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface Notification {
  id: string;
  type: 'NEW_BOOKING_REQUEST' | 'BOOKING_UPDATE_REQUEST' | 'BOOKING_CANCELLED';
  title: string;
  message: string;
  bookingId?: string;
  clientId?: string;
  data?: any;
  timestamp: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('studiio.notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    console.log("🔔 NotificationProvider: Adding notification:", notificationData.title);
    
    const newNotification: Notification = {
      ...notificationData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log("🔔 NotificationProvider: Total notifications:", updated.length);
      return updated;
    });

    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(notificationData.title, {
        body: notificationData.message,
        icon: '/favicon.ico',
        tag: newNotification.id,
      });
    }
  }, []);

  // Listen for new booking requests
  useEffect(() => {
    const handleNewBookingRequest = (event: CustomEvent) => {
      console.log("🔔 NotificationProvider: Received booking request event", event.detail);
      const { booking, source } = event.detail || {};
      
      if (source === "client-admin" && booking) {
        console.log("🔔 NotificationProvider: Creating notification for booking:", booking.title || 'Untitled');
        
        const notificationData = {
          type: 'NEW_BOOKING_REQUEST' as const,
          title: 'New Booking Request',
          message: `New booking request: ${booking.title || 'Untitled Booking'}`,
          bookingId: booking.id,
          data: { booking, source }
        };
        
        // Use setTimeout to ensure this happens outside the event handler cycle
        setTimeout(() => {
          addNotification(notificationData);
          console.log("🔔 NotificationProvider: Notification added successfully");
        }, 0);
      }
    };

    window.addEventListener('studiio:newBookingRequest', handleNewBookingRequest as EventListener);
    
    return () => {
      window.removeEventListener('studiio:newBookingRequest', handleNewBookingRequest as EventListener);
    };
  }, [addNotification]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studiio.notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
