'use client';

import { useState, useEffect } from 'react';
import { Search, Download, DollarSign, Calendar, User, CheckCircle } from 'lucide-react';

interface Allocation {
  id: string;
  amountCents: number;
  approvedAt: Date;
  payment: {
    id: string;
    bankReference: string;
    paidAt: Date;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
    client?: {
      name: string;
    };
  };
  approver?: {
    name: string;
  };
}

export default function AllocatedTab() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const loadAllocatedPayments = async () => {
    try {
      const response = await fetch('/api/reconcile/suggestions?status=ALLOCATED');
      if (response.ok) {
        const data = await response.json();
        // For now, we'll use a simplified structure since we don't have the full allocation data
        // In a real implementation, you'd have a separate endpoint for allocations
        setAllocations([]);
      }
    } catch (error) {
      console.error('Failed to load allocated payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllocatedPayments();
  }, []);

  const filteredAllocations = allocations.filter(allocation =>
    allocation.payment.bankReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    allocation.invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    allocation.invoice.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportAllocations = () => {
    const csvContent = [
      ['Date', 'Payment Reference', 'Invoice Number', 'Client', 'Amount', 'Approved By', 'Approved At'],
      ...filteredAllocations.map(allocation => [
        formatDate(allocation.payment.paidAt),
        allocation.payment.bankReference,
        allocation.invoice.invoiceNumber,
        allocation.invoice.client?.name || 'No client',
        formatAmount(allocation.amountCents),
        allocation.approver?.name || 'Unknown',
        formatDate(allocation.approvedAt),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allocations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading allocation history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Allocation History ({allocations.length})
          </h3>
          <p className="text-sm text-gray-600">
            View all approved payment allocations
          </p>
        </div>
        <button
          onClick={exportAllocations}
          disabled={allocations.length === 0}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search allocations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Allocations Table */}
      {allocations.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No allocations yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Approved allocations will appear here
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAllocations.map((allocation) => (
              <li key={allocation.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {allocation.payment.bankReference}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatAmount(allocation.amountCents)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(allocation.payment.paidAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {allocation.invoice.invoiceNumber}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {allocation.invoice.client?.name || 'No client'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Approved by {allocation.approver?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(allocation.approvedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      {allocations.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Allocations:</span>
              <span className="ml-2 font-medium">{filteredAllocations.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <span className="ml-2 font-medium">
                {formatAmount(filteredAllocations.reduce((sum, alloc) => sum + alloc.amountCents, 0))}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Date Range:</span>
              <span className="ml-2 font-medium">
                {allocations.length > 0 ? (
                  `${formatDate(allocations[allocations.length - 1].approvedAt)} - ${formatDate(allocations[0].approvedAt)}`
                ) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















