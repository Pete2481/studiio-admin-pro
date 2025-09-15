"use client";

import Topbar from "@/components/Topbar";
import ClientSidebar from "@/components/ClientSidebar";
import { ChevronDown, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  address: string;
  amount: number;
  status: "Pending" | "Paid" | "Overdue";
  currency: string;
}

export default function ClientInvoicePage() {
  // Mock invoice data matching the design
  const invoices: Invoice[] = [
    {
      id: "6226",
      date: "11/09/2025",
      address: "26 James Street, Girards Hill NSW, Australia",
      amount: 425,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "6150",
      date: "19/08/2025",
      address: "River Street, Ballina NSW, Australia",
      amount: 855,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "6127",
      date: "13/08/2025",
      address: "34 Clarice Street, East Lismore NSW, Australia",
      amount: 630,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "6059",
      date: "15/07/2025",
      address: "12 Main Street, Lismore NSW, Australia",
      amount: 550,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "6037",
      date: "08/07/2025",
      address: "45 High Street, Byron Bay NSW, Australia",
      amount: 720,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "6017",
      date: "03/07/2025",
      address: "78 Ocean Drive, Lennox Head NSW, Australia",
      amount: 480,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "5963",
      date: "15/06/2025",
      address: "23 Beach Road, Mullumbimby NSW, Australia",
      amount: 650,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "5925",
      date: "26/05/2025",
      address: "56 Park Avenue, Bangalow NSW, Australia",
      amount: 380,
      status: "Pending",
      currency: "A$"
    },
    {
      id: "5907",
      date: "19/05/2025",
      address: "89 Garden Street, Nimbin NSW, Australia",
      amount: 520,
      status: "Paid",
      currency: "A$"
    },
    {
      id: "5860",
      date: "30/04/2025",
      address: "34 Valley Road, Kyogle NSW, Australia",
      amount: 450,
      status: "Paid",
      currency: "A$"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500 text-white";
      case "Pending":
        return "bg-red-500 text-white";
      case "Overdue":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Invoice No", "Date", "Address", "Amount", "Status"],
      ...invoices.map(invoice => [
        invoice.id,
        invoice.date,
        invoice.address,
        `${invoice.currency} ${invoice.amount}`,
        invoice.status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSidebar />
      <Topbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE LIST</h1>
          <nav className="text-sm text-gray-500">
            <span>HOME</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">INVOICES</span>
          </nav>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Show Entries Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value={10}>10 Entries</option>
                  <option value={25}>25 Entries</option>
                  <option value={50}>50 Entries</option>
                  <option value={100}>100 Entries</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Select Status</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="">-- Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Download CSV */}
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">Invoice No</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`${index % 2 === 0 ? 'bg-teal-50' : 'bg-teal-100'} hover:bg-teal-200 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={invoice.address}>
                        {invoice.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.currency} {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                          title="Download Invoice"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to 10 of 10 entries
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                First
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              
              {/* Page Numbers */}
              <button className="px-3 py-1 text-sm border rounded bg-teal-600 text-white border-teal-600">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                4
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                5
              </button>
              
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}