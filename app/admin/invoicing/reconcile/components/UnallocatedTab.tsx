'use client';

import { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, User, Plus, X } from 'lucide-react';

interface UnallocatedTabProps {
  onAllocationUpdated: () => void;
}

interface Payment {
  id: string;
  amountCents: number;
  currency: string;
  paidAt: Date;
  bankReference: string;
  bankTxnId?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amountCents: number;
  status: string;
  client?: {
    name: string;
  };
}

export default function UnallocatedTab({ onAllocationUpdated }: UnallocatedTabProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [allocations, setAllocations] = useState<Array<{ invoiceId: string; amountCents: number }>>([]);
  const [processing, setProcessing] = useState(false);

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
    }).format(new Date(date));
  };

  const loadUnallocatedPayments = async () => {
    try {
      const response = await fetch('/api/reconcile/suggestions?status=UNALLOCATED');
      if (response.ok) {
        const data = await response.json();
        // Extract unique payments from suggestions
        const uniquePayments = data.suggestions.reduce((acc: Payment[], suggestion: any) => {
          const existing = acc.find(p => p.id === suggestion.payment.id);
          if (!existing) {
            acc.push(suggestion.payment);
          }
          return acc;
        }, []);
        setPayments(uniquePayments);
      }
    } catch (error) {
      console.error('Failed to load unallocated payments:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error('Failed to load invoices:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadUnallocatedPayments(), loadInvoices()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredPayments = payments.filter(payment =>
    payment.bankReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.bankTxnId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAllocation = () => {
    setAllocations([...allocations, { invoiceId: '', amountCents: 0 }]);
  };

  const handleRemoveAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const handleAllocationChange = (index: number, field: 'invoiceId' | 'amountCents', value: string | number) => {
    const newAllocations = [...allocations];
    newAllocations[index] = { ...newAllocations[index], [field]: value };
    setAllocations(newAllocations);
  };

  const getTotalAllocated = () => {
    return allocations.reduce((sum, alloc) => sum + alloc.amountCents, 0);
  };

  const getRemainingAmount = () => {
    if (!selectedPayment) return 0;
    return selectedPayment.amountCents - getTotalAllocated();
  };

  const handleAllocate = async () => {
    if (!selectedPayment) return;

    const validAllocations = allocations.filter(alloc => alloc.invoiceId && alloc.amountCents > 0);
    
    if (validAllocations.length === 0) {
      alert('Please add at least one allocation');
      return;
    }

    if (getTotalAllocated() > selectedPayment.amountCents) {
      alert('Total allocation amount cannot exceed payment amount');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/reconcile/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          allocations: validAllocations,
        }),
      });

      if (response.ok) {
        onAllocationUpdated();
        setSelectedPayment(null);
        setAllocations([]);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to allocate payment');
      }
    } catch (error) {
      console.error('Allocation error:', error);
      alert('Failed to allocate payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading unallocated payments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Unallocated Payments ({payments.length})
          </h3>
          <p className="text-sm text-gray-600">
            Manually allocate payments to invoices
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search payments or invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unallocated Payments */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Unallocated Payments</h4>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <li key={payment.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <div
                    onClick={() => {
                      setSelectedPayment(payment);
                      setAllocations([]);
                    }}
                    className={`flex items-center justify-between ${
                      selectedPayment?.id === payment.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {payment.bankReference}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatAmount(payment.amountCents)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(payment.paidAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Available Invoices */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Available Invoices</h4>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <li key={invoice.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {invoice.invoiceNumber}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {invoice.client?.name || 'No client'}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatAmount(invoice.amountCents)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Allocation Panel */}
      {selectedPayment && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Allocate Payment</h4>
            <button
              onClick={() => setSelectedPayment(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Payment Details</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Reference:</span>
                  <span className="ml-2 font-medium">{selectedPayment.bankReference}</span>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-2 font-medium">{formatAmount(selectedPayment.amountCents)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">{formatDate(selectedPayment.paidAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Remaining:</span>
                  <span className="ml-2 font-medium">{formatAmount(getRemainingAmount())}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900">Allocations</h5>
              <button
                onClick={handleAddAllocation}
                className="flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Allocation
              </button>
            </div>

            {allocations.map((allocation, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <select
                    value={allocation.invoiceId}
                    onChange={(e) => handleAllocationChange(index, 'invoiceId', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select invoice</option>
                    {invoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.client?.name || 'No client'} ({formatAmount(invoice.amountCents)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={allocation.amountCents / 100}
                    onChange={(e) => handleAllocationChange(index, 'amountCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => handleRemoveAllocation(index)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {allocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No allocations added yet</p>
                <p className="text-sm">Click "Add Allocation" to start</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocate}
                disabled={processing || getTotalAllocated() === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Allocating...' : 'Allocate Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















