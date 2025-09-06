"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Calendar, MapPin, ChevronDown } from "lucide-react";
import { Booking } from "@/lib/types";

interface BookingDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function BookingDropdown({ 
  value, 
  onChange, 
  placeholder = "Select a recent booking...",
  className = ""
}: BookingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent bookings from localStorage
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("studiio.events.v2");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents) as Booking[];
        // Filter out blockouts and only show confirmed/penciled bookings
        const validBookings = parsedEvents.filter(
          (event) => 
            event.status === "CONFIRMED" || 
            event.status === "PENCILED" ||
            event.status === "TENTATIVE"
        );
        // Sort by most recent first
        const sortedBookings = validBookings.sort((a, b) => 
          new Date(b.start).getTime() - new Date(a.start).getTime()
        );
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    }
  }, []);

  // Set selected booking when value changes
  useEffect(() => {
    if (value) {
      const booking = bookings.find(b => b.id === value);
      setSelectedBooking(booking || null);
    } else {
      setSelectedBooking(null);
    }
  }, [value, bookings]);

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.title.toLowerCase().includes(searchLower) ||
      (booking.address && booking.address.toLowerCase().includes(searchLower)) ||
      (booking.client && Array.isArray(booking.client) && 
       booking.client.some(client => client.toLowerCase().includes(searchLower)))
    );
  });

  // Handle booking selection
  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
    onChange(booking.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between bg-white"
      >
        <span className={selectedBooking ? 'text-gray-900' : 'text-gray-500'}>
          {selectedBooking ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedBooking.title}</span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={12} />
                {selectedBooking.address || 'No address'}
              </span>
            </div>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search bookings by title, address, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Bookings List */}
          <div className="max-h-64 overflow-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No bookings found matching your search.' : 'No recent bookings available.'}
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => handleBookingSelect(booking)}
                  className="w-full p-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex flex-col items-start space-y-1">
                    {/* Booking Title */}
                    <div className="font-medium text-gray-900 text-sm">
                      {booking.title}
                    </div>
                    
                    {/* Address */}
                    {booking.address && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin size={12} />
                        <span className="truncate max-w-48">{booking.address}</span>
                      </div>
                    )}
                    
                    {/* Date and Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{formatDate(booking.start)}</span>
                      <span>•</span>
                      <span>{formatTime(booking.start)} - {formatTime(booking.end)}</span>
                    </div>
                    
                    {/* Client and Status */}
                    <div className="flex items-center gap-2 text-xs">
                      {booking.client && Array.isArray(booking.client) && (
                        <span className="text-gray-600">
                          Client: {booking.client.join(', ')}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENCILED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
