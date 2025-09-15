'use client';

import React, { useState, useEffect } from 'react';
import { useBookings } from '@/src/client/api/bookings';
import { useClients } from '@/src/client/api/clients';
import { useAgents } from '@/src/client/api/agents';
import { usePhotographers } from '@/src/client/api/photographers';
import { useServices } from '@/src/client/api/services';
import { Booking, BookingFormData, UserRole } from '@/lib/types/booking';

export default function TestBookingPage() {
  const [tenantSlug] = useState('business-media-drive');
  const [userRole] = useState<UserRole>('SUB_ADMIN');
  const [currentClientId, setCurrentClientId] = useState<string>('');

  // Fetch data
  const { bookings, loading: bookingsLoading } = useBookings(tenantSlug);
  // TODO: Implement booking operations
  const createBooking = () => console.log('Create booking not implemented');
  const operationsLoading = false;
  const { clients, isLoading: clientsLoading } = useClients();
  const { agents, isLoading: agentsLoading } = useAgents();
  const { photographers, isLoading: photographersLoading } = usePhotographers();
  const { services, loading: servicesLoading } = useServices(tenantSlug);

  // Set first client as current client
  useEffect(() => {
    if (clients.length > 0 && !currentClientId) {
      setCurrentClientId(clients[0].id);
    }
  }, [clients, currentClientId]);

  const handleCreateTestBooking = async () => {
    try {
      const result = await createBooking();
      console.log('Test booking created:', result);
    } catch (error) {
      console.error('❌ Error creating booking:', error);
    }
  };

  if (bookingsLoading || clientsLoading || agentsLoading || photographersLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking System Test Page</h1>
        

        {/* Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Clients</h3>
            <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Agents</h3>
            <p className="text-2xl font-bold text-green-600">{agents.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Photographers</h3>
            <p className="text-2xl font-bold text-purple-600">{photographers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900">Services</h3>
            <p className="text-2xl font-bold text-orange-600">{services.length}</p>
          </div>
        </div>

        {/* Current Client Selection */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Client</h2>
          <select
            value={currentClientId}
            onChange={(e) => setCurrentClientId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Test Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleCreateTestBooking}
              disabled={operationsLoading || !currentClientId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {operationsLoading ? 'Creating...' : 'Create Test Booking'}
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found. Create a test booking above!</p>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.start).toLocaleString()} - {new Date(booking.end).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'TENTATIVE' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'REQUEST' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </p>
                      {booking.client && (
                        <p className="text-sm text-gray-600">Client: {booking.client.name}</p>
                      )}
                      {booking.agent && (
                        <p className="text-sm text-gray-600">Agent: {booking.agent.name}</p>
                      )}
                      {booking.photographer && (
                        <p className="text-sm text-gray-600">Photographer: {booking.photographer.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

