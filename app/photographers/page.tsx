"use client";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Search, Filter, Plus, Edit, Phone, Mail, Trash2 } from "lucide-react";
import PhotographerModal, { type Photographer } from "@/components/PhotographerModal";

// Mock data for photographers
const seedPhotographers: Photographer[] = [
  {
    id: "1",
    name: "Will Phillips",
    location: "Georgia",
    role: "Luxury Property Specialist",
    company: "Studiio Pro",
    avatar: "👨‍🦱",
    email: "will.phillips@example.com",
    phone: "+1 555 123 4567",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "2",
    name: "Sarah Johnson",
    location: "California",
    role: "Marketing Director",
    company: "Studiio Pro",
    avatar: "👩‍🦱",
    email: "sarah.johnson@example.com",
    phone: "+1 555 234 5678",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "3",
    name: "Mike Davis",
    location: "Texas",
    role: "Senior Photographer",
    company: "Studiio Pro",
    avatar: "🤖",
    email: "mike.davis@example.com",
    phone: "+1 555 345 6789",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "4",
    name: "Lisa Wilson",
    location: "Florida",
    role: "Property Specialist",
    company: "Studiio Pro",
    avatar: "👷‍♀️",
    email: "lisa.wilson@example.com",
    phone: "+1 555 456 7890",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "5",
    name: "David Brown",
    location: "New York",
    role: "Creative Director",
    company: "Studiio Pro",
    avatar: "🎉",
    email: "david.brown@example.com",
    phone: "+1 555 567 8901",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "6",
    name: "Emma Taylor",
    location: "Washington",
    role: "Aerial Specialist",
    company: "Studiio Pro",
    avatar: "👨‍✈️",
    email: "emma.taylor@example.com",
    phone: "+1 555 678 9012",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "7",
    name: "Robert Miller",
    location: "Oregon",
    role: "Studio Manager",
    company: "Studiio Pro",
    avatar: "😞",
    email: "robert.miller@example.com",
    phone: "+1 555 789 0123",
    status: "Inactive",
    permissions: {
      viewCalendar: false,
      viewBlankedBookings: false,
      viewAllBookings: false,
      viewInvoice: false,
      deleteGallery: false,
      viewAllGallery: false,
      viewService: false,
      addGalleries: false,
      viewClients: false
    }
  },
  {
    id: "8",
    name: "Jennifer Lee",
    location: "Colorado",
    role: "Financial Manager",
    company: "Studiio Pro",
    avatar: "👩‍💼",
    email: "jennifer.lee@example.com",
    phone: "+1 555 890 1234",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "9",
    name: "Thomas Anderson",
    location: "Nevada",
    role: "Operations Manager",
    company: "Studiio Pro",
    avatar: "🛍️",
    email: "thomas.anderson@example.com",
    phone: "+1 555 901 2345",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "10",
    name: "Amanda White",
    location: "Arizona",
    role: "IT Specialist",
    company: "Studiio Pro",
    avatar: "💻",
    email: "amanda.white@example.com",
    phone: "+1 555 012 3456",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "11",
    name: "Christopher Garcia",
    location: "New Mexico",
    role: "Lead Photographer",
    company: "Studiio Pro",
    avatar: "📷",
    email: "christopher.garcia@example.com",
    phone: "+1 555 123 4567",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  },
  {
    id: "12",
    name: "Maria Rodriguez",
    location: "Utah",
    role: "Hospitality Specialist",
    company: "Studiio Pro",
    avatar: "🏨",
    email: "maria.rodriguez@example.com",
    phone: "+1 555 234 5678",
    status: "Active",
    permissions: {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewAllBookings: true,
      viewInvoice: true,
      deleteGallery: true,
      viewAllGallery: true,
      viewService: true,
      addGalleries: true,
      viewClients: true
    }
  }
];

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>(seedPhotographers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhotographer, setEditingPhotographer] = useState<Photographer | undefined>(undefined);

  const filteredPhotographers = photographers.filter((photographer) => {
    const matchesSearch = photographer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (photographer.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         photographer.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || photographer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddPhotographer = () => {
    setEditingPhotographer(undefined);
    setIsModalOpen(true);
  };

  const handleEditPhotographer = (photographer: Photographer) => {
    setEditingPhotographer(photographer);
    setIsModalOpen(true);
  };

  const handleSavePhotographer = (photographer: Photographer) => {
    if (editingPhotographer) {
      setPhotographers(photographers.map(p => p.id === photographer.id ? photographer : p));
    } else {
      setPhotographers([...photographers, { ...photographer, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
    setEditingPhotographer(undefined);
  };

  const handleDeletePhotographer = (id: string) => {
    setPhotographers(photographers.filter(p => p.id !== id));
  };

  const handleEmail = (photographer: Photographer) => {
    window.open(`mailto:${photographer.email}`, '_blank');
  };

  const handleCall = (photographer: Photographer) => {
    window.open(`tel:${photographer.phone}`, '_blank');
  };

  return (
    <PageLayout className="bg-white">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-900">Photographers {photographers.length}</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search Photographers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleAddPhotographer}
                  className="px-4 py-2 bg-[#ebfbf2] text-gray-800 rounded-lg hover:bg-[#d4f7e4] font-medium transition-colors"
                >
                  Add Photographer
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300">
                  <Filter size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Photographer Cards Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotographers.map((photographer) => (
                <div key={photographer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
                  {/* Edit Icon - Top Right */}
                  <button
                    onClick={() => handleEditPhotographer(photographer)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit size={16} />
                  </button>

                  {/* Profile Picture and Info */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                        {photographer.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{photographer.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{photographer.location && `${photographer.name} (${photographer.location})`}</p>
                      <p className="text-xs text-gray-500 truncate">{photographer.role}</p>
                    </div>
                  </div>

                  {/* Action Icons - Bottom */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEmail(photographer)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Email"
                      >
                        <Mail size={14} />
                      </button>
                      <button
                        onClick={() => handleCall(photographer)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Call"
                      >
                        <Phone size={14} />
                      </button>
                      <button
                        onClick={() => handleEditPhotographer(photographer)}
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePhotographer(photographer.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PhotographerModal
        open={isModalOpen}
        initial={editingPhotographer}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPhotographer(undefined);
        }}
        onSave={handleSavePhotographer}
        onDelete={editingPhotographer ? () => handleDeletePhotographer(editingPhotographer.id) : undefined}
      />
    </PageLayout>
  );
}
