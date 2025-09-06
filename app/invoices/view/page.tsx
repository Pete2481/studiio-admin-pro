"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Plus, Search, Eye, Edit, ChevronLeft, ChevronRight, ChevronDown, Settings, Mail, Clock } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  customer: string;
  tags: string[];
  status: "UNPAID" | "PAID" | "PARTIALLY_PAID";
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-00956",
    amount: 459.30,
    date: "12-08-19",
    customer: "Pixinvent PVT. LTD",
    tags: ["Technology"],
    status: "UNPAID"
  },
  {
    id: "2",
    invoiceNumber: "INV-00349",
    amount: 125.00,
    date: "08-08-19",
    customer: "Volkswagen",
    tags: ["Car"],
    status: "PAID"
  },
  {
    id: "3",
    invoiceNumber: "INV-00452",
    amount: 90.00,
    date: "28-07-19",
    customer: "Alphabet",
    tags: ["Electronic"],
    status: "PARTIALLY_PAID"
  },
  {
    id: "4",
    invoiceNumber: "INV-00567",
    amount: 750.00,
    date: "15-08-19",
    customer: "Microsoft",
    tags: ["Technology", "Software"],
    status: "PAID"
  },
  {
    id: "5",
    invoiceNumber: "INV-00678",
    amount: 320.50,
    date: "22-08-19",
    customer: "Apple Inc",
    tags: ["Technology", "Mobile"],
    status: "UNPAID"
  },
  {
    id: "6",
    invoiceNumber: "INV-00789",
    amount: 180.00,
    date: "05-09-19",
    customer: "Tesla",
    tags: ["Car", "Electric"],
    status: "PAID"
  },
  {
    id: "7",
    invoiceNumber: "INV-00890",
    amount: 420.75,
    date: "12-09-19",
    customer: "Amazon",
    tags: ["Technology", "E-commerce"],
    status: "PARTIALLY_PAID"
  },
  {
    id: "8",
    invoiceNumber: "INV-00901",
    amount: 95.25,
    date: "18-09-19",
    customer: "Netflix",
    tags: ["Entertainment"],
    status: "PAID"
  },
  {
    id: "9",
    invoiceNumber: "INV-00912",
    amount: 650.00,
    date: "25-09-19",
    customer: "Google",
    tags: ["Technology", "Search"],
    status: "UNPAID"
  },
  {
    id: "10",
    invoiceNumber: "INV-00923",
    amount: 280.00,
    date: "02-10-19",
    customer: "Facebook",
    tags: ["Technology", "Social"],
    status: "PAID"
  },
  {
    id: "11",
    invoiceNumber: "INV-00934",
    amount: 150.00,
    date: "09-10-19",
    customer: "Twitter",
    tags: ["Technology", "Social"],
    status: "UNPAID"
  },
  {
    id: "12",
    invoiceNumber: "INV-00945",
    amount: 380.50,
    date: "16-10-19",
    customer: "LinkedIn",
    tags: ["Technology", "Professional"],
    status: "PAID"
  }
];

export default function ViewInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(currentInvoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
    }
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-500 text-white";
      case "UNPAID":
        return "bg-red-500 text-white";
      case "PARTIALLY_PAID":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: Invoice["status"]) => {
    switch (status) {
      case "PAID":
        return "PAID";
      case "UNPAID":
        return "UNPAID";
      case "PARTIALLY_PAID":
        return "Partially Paid";
      default:
        return status;
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-68 min-h-screen bg-[#ebfbf2]">
        {/* Top Header Bar */}
        <div className="bg-blue-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">INVOICE LIST</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Settings size={16} />
              <span className="text-sm">Settings</span>
              <ChevronDown size={12} />
            </div>
            <Mail size={16} className="text-gray-600" />
            <Clock size={16} className="text-gray-600" />
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="px-6 py-2 bg-white border-b border-gray-200">
          <div className="text-sm text-gray-600">
            HOME / INVOICE / INVOICE LIST
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2">
                  <Plus size={16} />
                  Create Invoice
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                    </select>
                    <span className="text-sm text-gray-700">entries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Search:</span>
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.length === currentInvoices.length && currentInvoices.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Invoice#
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            {tag}
                            {index < invoice.tags.length - 1 && <span className="mx-1">,</span>}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
