"use client";
import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Search, Filter, Plus, MoreVertical, ChevronLeft, ChevronRight, Edit, Trash2, Copy, Eye, Heart, Lock, Unlock, Bell } from "lucide-react";

interface Collection {
  id: string;
  bannerImage: string;
  address: string;
  client: string;
  company: string;
  services: string;
  invoiceStatus: "Create Invoice" | "Paid" | "Pending";
  photographers: string;
  isLocked: boolean;
  notifyStatus: "Pending" | "Notified" | "Notify again";
  imageCount: number;
  createdOn: string;
  favorite: boolean;
}

const seedCollections: Collection[] = [
  {
    id: "3211",
    bannerImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=60&fit=crop",
    address: "1/16 Hackett Lane, Ballina NSW, Australia",
    client: "Harcourts",
    company: "Harcourts Northern Rivers",
    services: "Essential Package",
    invoiceStatus: "Create Invoice",
    photographers: "Pete Hogan",
    isLocked: false,
    notifyStatus: "Pending",
    imageCount: 36,
    createdOn: "29/08/2025 19:37 PM",
    favorite: false
  },
  {
    id: "3210",
    bannerImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=60&fit=crop",
    address: "17 Opal Crescent, Alstonville NSW, Australia",
    client: "Raine & Horne-Ballina / Alstonville",
    company: "Raine & Horne Ballina / Alstonville",
    services: "Aerial Drone Photography",
    invoiceStatus: "Create Invoice",
    photographers: "Aidan Cartwright",
    isLocked: false,
    notifyStatus: "Notify again",
    imageCount: 11,
    createdOn: "29/08/2025 19:19 PM",
    favorite: false
  },
  {
    id: "3209",
    bannerImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=60&fit=crop",
    address: "9 Francis Avenue, Wollongbar NSW, Australia",
    client: "Raine & Horne-Ballina / Alstonville",
    company: "Raine & Horne Ballina / Alstonville",
    services: "Floor Plan",
    invoiceStatus: "Create Invoice",
    photographers: "Aidan Cartwright",
    isLocked: false,
    notifyStatus: "Notify again",
    imageCount: 1,
    createdOn: "29/08/2025 18:50 PM",
    favorite: false
  },
  {
    id: "3208",
    bannerImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=60&fit=crop",
    address: "50 Barrys Road, Modanville NSW, Australia",
    client: "Jodie Mitchell",
    company: "Jodie Mitchell Properties",
    services: "Rental Package",
    invoiceStatus: "Create Invoice",
    photographers: "Aidan Cartwright",
    isLocked: false,
    notifyStatus: "Notify again",
    imageCount: 21,
    createdOn: "29/08/2025 18:48 PM",
    favorite: false
  },
  {
    id: "3207",
    bannerImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=100&h=60&fit=crop",
    address: "23 Mountain Road, Bangalow NSW, Australia",
    client: "McGrath",
    company: "McGrath Byron Bay",
    services: "Premium Package",
    invoiceStatus: "Create Invoice",
    photographers: "Sarah Johnson",
    isLocked: true,
    notifyStatus: "Notified",
    imageCount: 45,
    createdOn: "29/08/2025 18:30 PM",
    favorite: true
  },
  {
    id: "3206",
    bannerImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=100&h=60&fit=crop",
    address: "7 Beach Street, Lennox Head NSW, Australia",
    client: "First National",
    company: "First National Real Estate",
    services: "Essential Package",
    invoiceStatus: "Paid",
    photographers: "Tom Wilson",
    isLocked: false,
    notifyStatus: "Notified",
    imageCount: 28,
    createdOn: "29/08/2025 18:15 PM",
    favorite: false
  }
];

export default function CompletedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>(() => {
    if (typeof window === "undefined") return seedCollections;
    try {
      const raw = localStorage.getItem("studiio.completed.v1");
      return raw ? (JSON.parse(raw) as Collection[]) : seedCollections;
    } catch {
      return seedCollections;
    }
  });

  useEffect(() => {
    localStorage.setItem("studiio.completed.v1", JSON.stringify(collections));
  }, [collections]);

  // Filter collections based on search
  const filteredCollections = collections.filter(collection => {
    const searchLower = searchQuery.toLowerCase();
    return (
      collection.id.toLowerCase().includes(searchLower) ||
      collection.address.toLowerCase().includes(searchLower) ||
      collection.client.toLowerCase().includes(searchLower) ||
      collection.company.toLowerCase().includes(searchLower) ||
      collection.services.toLowerCase().includes(searchLower) ||
      collection.photographers.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCollections.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCollections = filteredCollections.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedCollections.length === currentCollections.length) {
      setSelectedCollections([]);
    } else {
      setSelectedCollections(currentCollections.map(collection => collection.id));
    }
  };

  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleMenuToggle = (collectionId: string) => {
    setOpenMenuId(openMenuId === collectionId ? null : collectionId);
  };

  const handleToggleLock = (collectionId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, isLocked: !collection.isLocked }
        : collection
    ));
  };

  const handleToggleFavorite = (collectionId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, favorite: !collection.favorite }
        : collection
    ));
  };

  const handleCreateInvoice = (collectionId: string) => {
    // Navigate to invoice creation page
    window.location.href = `/invoices/add?collection=${collectionId}`;
  };

  const handleNotify = (collectionId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, notifyStatus: "Notified" }
        : collection
    ));
  };

  const getInvoiceButtonClass = (status: string) => {
    switch (status) {
      case "Create Invoice":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "Paid":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      default:
        return "bg-red-500 hover:bg-red-600 text-white";
    }
  };

  const getNotifyButtonClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-800";
      case "Notified":
        return "bg-green-100 text-green-800";
      case "Notify again":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">COLLECTION LIST</h1>
            <div className="text-sm text-gray-600 mt-1">HOME / COLLECTION LIST</div>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <Plus size={16} />
            Add Gallery
          </button>
        </div>

        {/* Search and Pagination Control */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
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
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">Entries</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCollections.length === currentCollections.length && currentCollections.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Banner Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Services</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Photographers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Unlock/Lock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Notify</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Image Counts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Created On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCollections.map((collection, index) => (
                  <tr key={collection.id} className={index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection.id)}
                        onChange={() => handleSelectCollection(collection.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {collection.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={collection.bannerImage}
                        alt="Banner"
                        className="h-12 w-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.className = 'px-6 py-4 whitespace-nowrap h-12 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500';
                          e.currentTarget.parentElement!.textContent = 'No Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{collection.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{collection.client}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{collection.company}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{collection.services}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleCreateInvoice(collection.id)}
                        className={`px-3 py-1 rounded text-xs font-medium ${getInvoiceButtonClass(collection.invoiceStatus)}`}
                      >
                        {collection.invoiceStatus}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{collection.photographers}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleLock(collection.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          collection.isLocked ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            collection.isLocked ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleNotify(collection.id)}
                        className={`px-3 py-1 rounded text-xs font-medium ${getNotifyButtonClass(collection.notifyStatus)}`}
                      >
                        {collection.notifyStatus}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collection.imageCount} images
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collection.createdOn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFavorite(collection.id)}
                          className={`p-1 rounded transition-colors ${
                            collection.favorite 
                              ? 'text-red-500 hover:text-red-600 bg-red-50' 
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                          }`}
                          title={collection.favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart size={16} className={collection.favorite ? 'fill-current' : ''} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCollections.length)} of {filteredCollections.length} entries
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

