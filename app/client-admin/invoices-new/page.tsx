"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTenant } from "@/components/TenantProvider";
import { useClientAdmin } from "@/components/ClientAdminProvider";
import ClientPageLayout from "@/components/ClientPageLayout";
import { FileText, Download, Eye, AlertCircle, Calendar, DollarSign, Clock } from "lucide-react";

interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  clientId: string;
  bookingId?: string;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
  };
  booking?: {
    id: string;
    title: string;
    start: string;
  };
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
}

export default function ClientInvoicesPage() {
  const { data: session } = useSession();
  const { currentTenant } = useTenant();
  const { currentClient, availableClients, switchClient } = useClientAdmin();
  
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch client-specific invoices
  const fetchInvoices = async () => {
    if (!currentClient?.id || !currentTenant?.id) {
      setInvoices([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/client/invoices?clientId=${currentClient.id}&tenantId=${currentTenant.id}`);
      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setError(data.error || 'Failed to fetch invoices');
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch invoices when client or tenant changes
  useEffect(() => {
    fetchInvoices();
  }, [currentClient?.id, currentTenant?.id]);

  if (!currentClient) {
    return (
      <ClientPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Client Selected</h3>
            <p className="text-gray-500">Please select a client to view their invoices.</p>
          </div>
        </div>
      </ClientPageLayout>
    );
  }

  // Calculate totals
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status.toLowerCase() === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices
    .filter(invoice => invoice.status.toLowerCase() === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <ClientPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">
              Invoices for {currentClient.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={currentClient.id}
              onChange={(e) => switchClient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        {!isLoading && !error && invoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(pendingAmount)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Invoices</p>
                  <p className="text-2xl font-semibold text-gray-900">{invoices.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Invoices List */}
        {!isLoading && !error && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
                <p className="text-gray-500">
                  {currentClient.name} doesn't have any invoices yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {invoice.invoiceNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(invoice.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.booking ? (
                            <div>
                              <div className="text-sm text-gray-900">{invoice.booking.title}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(invoice.booking.start).toLocaleDateString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No booking</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusLabel(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ClientPageLayout>
  );
}
