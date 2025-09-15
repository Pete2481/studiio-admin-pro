"use client";
import { useEffect, useState } from 'react';

type Notification = {
  type: string;
  message: string;
  bookingId?: string;
  clientName?: string;
};

export default function AdminNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/sse');
    
    eventSource.onmessage = (event) => {
      try {
        const data: Notification = JSON.parse(event.data);
        
        if (data.type === 'new_booking') {
          setNotification(data);
          setIsVisible(true);
          
          // Auto-hide after 6 seconds
          setTimeout(() => {
            setIsVisible(false);
          }, 6000);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };
    
    return () => {
      eventSource.close();
    };
  }, []);

  if (!isVisible || !notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-3">
        <div className="text-lg">
          📅
        </div>
        <div>
          <div className="font-semibold">{notification.message}</div>
          <div className="text-sm opacity-90">
            {notification.clientName && `Client: ${notification.clientName}`}
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}
