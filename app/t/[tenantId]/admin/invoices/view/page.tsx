"use client";

import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Edit, Trash2, Send, Download, Bell } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  client: string;
  address: string;
  amount: number;
  status: "Pending" | "Paid" | "Overdue";
  currency: string;
}

export default function MediaDriveViewInvoicesPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const invoices: Invoice[] = [
    { id: "6229", date: "12/09/2025", client: "Hinterland Property (Rez)", address: "47 Brownell Drive, Byron Bay NSW, Australia", amount: 350, status: "Pending", currency: "A$" },
    { id: "6228", date: "11/09/2025", client: "Drift & Stay (Anna)", address: "9 Cedar Street, Evans Head NSW, Australia", amount: 100, status: "Pending", currency: "A$" },
    { id: "6227", date: "10/09/2025", client: "Belle-Lennox Head (Braden Walters)", address: "104 Old Bangalow Rd, Tintenbar NSW, Australia", amount: 0, status: "Pending", currency: "A$" },
    { id: "6226", date: "11/09/2025", client: "Katrina Beohm", address: "26 James Street, Girards Hill NSW, Australia", amount: 425, status: "Pending", currency: "A$" },
    { id: "6225", date: "19/08/2025", client: "Raine & Horne- Lismore (Brett)", address: "4 Lennox Street, Lennox Head NSW, Australia", amount: 1100, status: "Pending", currency: "A$" },
    { id: "6224", date: "19/08/2025", client: "Sotheby's Byron Bay", address: "1/1 Heath Street, Evans Head NSW, Australia", amount: 350, status: "Pending", currency: "A$" },
    { id: "6223", date: "19/08/2025", client: "Hinterland Property (Rez)", address: "99 Tweed Street, North Lismore NSW, Australia", amount: 725, status: "Pending", currency: "A$" },
    { id: "6222", date: "19/08/2025", client: "Drift & Stay (Anna)", address: "176 Wilson Street, South Lismore NSW, Australia", amount: 725, status: "Pending", currency: "A$" },
    { id: "6221", date: "19/08/2025", client: "Belle-Lennox Head (Braden Walters)", address: "28 Coolamon Scenic Drive, Coorabell NSW, Australia", amount: 225, status: "Pending", currency: "A$" },
    { id: "6220", date: "19/08/2025", client: "Katrina Beohm", address: "73 Bashforths Lane, Brunswick Heads NSW, Australia", amount: 550, status: "Pending", currency: "A$" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Invoice No", "Date", "Client", "Address", "Amount", "Status"],
      ...invoices.map(invoice => [
        invoice.id,
        invoice.date,
        invoice.client,
        invoice.address,
        `${invoice.currency} ${invoice.amount}`,
        invoice.status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(invoices.length / entriesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar 
        title="Media Drive - Invoice List"
        showImportExport={false}
        showAdminToggle={true}
      />
      
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE LIST</h1>
            <div className="text-sm text-gray-600">
              <span className="text-gray-500">HOME</span> / <span className="text-gray-900">INVOICES</span>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Show</label>
                  <select 
                    value={entriesPerPage} 
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value={10}>10 Entries</option>
                    <option value={25}>25 Entries</option>
                    <option value={50}>50 Entries</option>
                    <option value={100}>100 Entries</option>
                  </select>
                </div>
                
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="">-- Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-48"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleDownloadCSV}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                >
                  <Download size={16} />
                  Download CSV
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
                  Create Invoice
                </button>
              </div>
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
                    <th className="px-6 py-4 text-left text-sm font-medium">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice, index) => (
                    <tr key={invoice.id} className={`${index % 2 === 0 ? 'bg-teal-50' : 'bg-teal-100'} hover:bg-teal-200 transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={invoice.client}>{invoice.client}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={invoice.address}>{invoice.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.currency} {invoice.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            Send Reminder
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                          <button className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                            Paid
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Send">
                            <Send size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Download">
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing 1 to {entriesPerPage} of {invoices.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                disabled={currentPage === 1}
              >
                First
              </button>
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                disabled={currentPage === 1}
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
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}
