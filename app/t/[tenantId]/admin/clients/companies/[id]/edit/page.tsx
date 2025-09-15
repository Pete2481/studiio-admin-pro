"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Facebook, Twitter, Settings, Youtube, Plus, ArrowLeft, Edit, X, Phone, Mail, Trash2 } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  company: string;
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Will Phillips (Georgia)",
    role: "Senior Real Estate Agent",
    image: "👨‍💼",
    email: "georgia@sirbyronbay.com.au",
    phone: "0488508111",
    status: "Active",
    company: "Sotheby's Byron Bay",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Luxury Property Specialist",
    image: "👩‍💼",
    email: "sarah.johnson@luxuryproperty.com",
    phone: "0412345678",
    status: "Active",
    company: "Luxury Property Group",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "3",
    name: "Mike Davis",
    role: "Marketing Director",
    image: "👨‍💻",
    email: "mike.davis@elitemarketing.com",
    phone: "0423456789",
    status: "Inactive",
    company: "Elite Marketing Solutions",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "4",
    name: "Lisa Wilson",
    role: "Development Manager",
    image: "👩‍🏗️",
    email: "lisa.wilson@premiumdev.com",
    phone: "0434567890",
    status: "Active",
    company: "Premium Development Co",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "5",
    name: "David Brown",
    role: "Events Coordinator",
    image: "👨‍🎉",
    email: "david.brown@exclusiveevents.com",
    phone: "0445678901",
    status: "Active",
    company: "Exclusive Events Ltd",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "6",
    name: "Emma Taylor",
    role: "Travel Consultant",
    image: "👩‍✈️",
    email: "emma.taylor@luxurytravel.com",
    phone: "0456789012",
    status: "Inactive",
    company: "Luxury Travel Agency",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "7",
    name: "Robert Miller",
    role: "Senior Consultant",
    image: "👨‍💼",
    email: "robert.miller@premiumconsulting.com",
    phone: "0467890123",
    status: "Active",
    company: "Premium Consulting Group",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "8",
    name: "Jennifer Lee",
    role: "Financial Advisor",
    image: "👩‍💼",
    email: "jennifer.lee@elitefinancial.com",
    phone: "0478901234",
    status: "Active",
    company: "Elite Financial Services",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "9",
    name: "Thomas Anderson",
    role: "Retail Manager",
    image: "👨‍🛍️",
    email: "thomas.anderson@luxuryretail.com",
    phone: "0489012345",
    status: "Inactive",
    company: "Luxury Retail Chain",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "10",
    name: "Amanda White",
    role: "Tech Lead",
    image: "👩‍💻",
    email: "amanda.white@premiumtech.com",
    phone: "0490123456",
    status: "Active",
    company: "Premium Tech Solutions",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "11",
    name: "Christopher Garcia",
    role: "Creative Director",
    image: "👨‍🎨",
    email: "christopher.garcia@exclusivedesign.com",
    phone: "0491234567",
    status: "Active",
    company: "Exclusive Design Studio",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "12",
    name: "Maria Rodriguez",
    role: "Hospitality Manager",
    image: "👩‍🏨",
    email: "maria.rodriguez@luxuryhospitality.com",
    phone: "0492345678",
    status: "Active",
    company: "Luxury Hospitality Group",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "13",
    name: "Alex Thompson",
    role: "Sales Representative",
    image: "👨‍💼",
    email: "alex.thompson@premiumsales.com",
    phone: "0493456789",
    status: "Active",
    company: "Premium Sales Co",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "14",
    name: "Rachel Green",
    role: "Customer Success",
    image: "👩‍💼",
    email: "rachel.green@elitecustomer.com",
    phone: "0494567890",
    status: "Active",
    company: "Elite Customer Solutions",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "15",
    name: "James Wilson",
    role: "Operations Manager",
    image: "👨‍💼",
    email: "james.wilson@premiumops.com",
    phone: "0495678901",
    status: "Active",
    company: "Premium Operations",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "16",
    name: "Sophie Chen",
    role: "Product Manager",
    image: "👩‍💼",
    email: "sophie.chen@eliteproduct.com",
    phone: "0496789012",
    status: "Active",
    company: "Elite Product Solutions",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "17",
    name: "Michael Brown",
    role: "Business Analyst",
    image: "👨‍💼",
    email: "michael.brown@premiumanalytics.com",
    phone: "0497890123",
    status: "Active",
    company: "Premium Analytics",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "18",
    name: "Jessica Davis",
    role: "HR Specialist",
    image: "👩‍💼",
    email: "jessica.davis@elitehr.com",
    phone: "0498901234",
    status: "Active",
    company: "Elite HR Solutions",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "19",
    name: "Daniel Lee",
    role: "IT Support",
    image: "👨‍💻",
    email: "daniel.lee@premiumit.com",
    phone: "0499012345",
    status: "Active",
    company: "Premium IT Services",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  },
  {
    id: "20",
    name: "Emily Johnson",
    role: "Marketing Assistant",
    image: "👩‍💼",
    email: "emily.johnson@elitemarketing.com",
    phone: "0490123456",
    status: "Active",
    company: "Elite Marketing Group",
    social: { facebook: "#", instagram: "#", twitter: "#" }
  }
];

const mockCompanies = [
  "Sotheby's Byron Bay",
  "Luxury Property Group",
  "Elite Marketing Solutions",
  "Premium Development Co",
  "Exclusive Events Ltd",
  "Luxury Travel Agency",
  "Premium Consulting Group",
  "Elite Financial Services",
  "Luxury Retail Chain",
  "Premium Tech Solutions",
  "Exclusive Design Studio",
  "Luxury Hospitality Group"
];

export default function EditCompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [tempBanner, setTempBanner] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const modalInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get id from params
  useEffect(() => {
    params.then(({ id: paramId }) => {
      setId(paramId);
    });
  }, [params]);

  // Load saved banner for this company if present
  useEffect(()=>{
    if (!id) return;
    try {
      const saved = localStorage.getItem(`studiio.company.banner.${id}`);
      if (saved) setBannerUrl(saved);
    } catch {}
  },[id]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active" as "Active" | "Inactive",
    company: ""
  });

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      status: agent.status,
      company: agent.company
    });
    setIsAddingNew(false);
    setShowEditModal(true);
  };

  const handleAddAgent = () => {
    setEditingAgent(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      company: mockCompanies[0]
    });
    setIsAddingNew(true);
    setShowEditModal(true);
  };

  const handleCall = (agent: Agent) => {
    console.log("Call agent:", agent.phone);
  };

  const handleEmail = (agent: Agent) => {
    console.log("Email agent:", agent.email);
  };

  const handleDelete = (agent: Agent) => {
    console.log("Delete agent:", agent);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingAgent(null);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (isAddingNew) {
      // Handle adding new agent
      console.log("Adding new agent:", formData);
    } else {
      // Handle updating existing agent
      console.log("Updating agent:", editingAgent?.id, formData);
    }
    handleCloseModal();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-68 min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/clients/companies" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft size={16} />
                <span>Back to Companies</span>
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              Companies • Edit Company Profile
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          {/* Company Profile Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* Banner */}
            <div
              className="h-80 rounded-t-lg relative"
              style={
                bannerUrl
                  ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { backgroundImage: "linear-gradient(to right, #2dd4bf, #f9a8d4, #fdba74)" }
              }
            >
              {!bannerUrl && (
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-pink-300/20 to-orange-300/20" />
              )}
              {/* Reduced fade height so more of the banner image is visible down to the red line area */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              <button
                className="absolute right-4 top-4 px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white/80 backdrop-blur hover:bg-white"
                onClick={()=> setShowBannerModal(true)}
              >
                Banner
              </button>
              {/* hidden input kept for modal control */}
              <input type="file" accept="image/*" ref={bannerInputRef} className="hidden" />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 relative">
              {/* Profile Picture */}
              <div className="flex justify-center -mt-20 mb-4">
                <div className="h-32 w-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                  🏢
                </div>
              </div>

              {/* Company Name and Category */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sotheby's International Realty</h1>
                <p className="text-lg text-gray-600">Luxury Real Estate</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-600">Properties</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2,847</div>
                    <div className="text-sm text-gray-600">Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">$1.2B</div>
                    <div className="text-sm text-gray-600">Sales Volume</div>
                  </div>
                </div>
              </div>

              {/* Removed social icons and actions; Banner upload button is on the banner. */}

              {/* Navigation Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex justify-center space-x-8">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "profile"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("followers")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "followers"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Followers
                  </button>
                  <button
                    onClick={() => setActiveTab("agents")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "agents"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Agents
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "gallery"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Gallery
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Agents Section */}
          {activeTab === "agents" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Agents 20</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search Agents"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button 
                      onClick={handleAddAgent}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Agent
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAgents.map((agent) => (
                    <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
                      {/* Edit Icon - Top Right */}
                      <button
                        onClick={() => handleEditAgent(agent)}
                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Profile Picture and Info */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                            {agent.image}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{agent.name}</h3>
                          <p className="text-xs text-gray-600 truncate">{agent.role}</p>
                        </div>
                      </div>

                      {/* Action Icons - Bottom */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEmail(agent)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Email"
                          >
                            <Mail size={14} />
                          </button>
                          <button
                            onClick={() => handleCall(agent)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Call"
                          >
                            <Phone size={14} />
                          </button>
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(agent)}
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
          )}

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <div className="mb-1">Name</div>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Company name" />
                </label>
                <label className="text-sm">
                  <div className="mb-1">Company</div>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Company" />
                </label>
                <label className="text-sm">
                  <div className="mb-1">Phone</div>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Enter phone number" />
                </label>
                <label className="text-sm">
                  <div className="mb-1">E-mail</div>
                  <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Enter email" />
                </label>
                <label className="text-sm md:col-span-2">
                  <div className="mb-1">Invoice Emails</div>
                  <div className="flex items-center gap-2">
                    <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Invoice email" />
                    <button className="px-2 py-1 rounded bg-teal-600 text-white text-xs">+</button>
                  </div>
                </label>
                <label className="text-sm">
                  <div className="mb-1">Password</div>
                  <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Enter password" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="text-sm font-medium mb-2">Image Logo</div>
                  <input type="file" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm">Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold mb-2">Permission</div>
                <div className="divide-y border rounded-lg">
                  {[
                    "View Calendar",
                    "View Blanked out Bookings",
                    "View Invoice",
                    "View Service",
                  ].map((label) => (
                    <label key={label} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span>{label}</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  Send welcome email
                </label>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancel</button>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* Followers Tab Content */}
          {activeTab === "followers" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Followers</h2>
              <p className="text-gray-600">Company followers will be displayed here.</p>
            </div>
          )}

          {/* Gallery Tab Content */}
          {activeTab === "gallery" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
              <p className="text-gray-600">Company gallery and media will be displayed here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Agent Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isAddingNew ? "Add Agent" : "Edit Agent"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Picture Section */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  👨‍💼
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">
                    Change
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                    Reset
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter agent name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <select
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {mockCompanies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                {isAddingNew ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Upload Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Upload Banner Image</h3>
              <button onClick={()=>setShowBannerModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div
                className={`border-2 rounded-lg p-6 text-center cursor-pointer ${isDragging ? 'border-teal-500 border-dashed bg-teal-50' : 'border-dashed'}`}
                onDragOver={(e)=>{ e.preventDefault(); setIsDragging(true); }}
                onDragLeave={()=> setIsDragging(false)}
                onDrop={(e)=>{
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setTempBanner(String(reader.result));
                  reader.readAsDataURL(file);
                }}
                onClick={()=> modalInputRef.current?.click()}
              >
                {tempBanner || bannerUrl ? (
                  <img src={tempBanner || bannerUrl || ''} alt="Banner preview" className="w-full h-40 object-cover rounded" />
                ) : (
                  <div className="text-sm text-gray-600">
                    Drag & drop an image here, or click to choose one
                  </div>
                )}
                <input
                  ref={modalInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e)=>{
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setTempBanner(String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg" onClick={()=>{ setTempBanner(null); setShowBannerModal(false); }}>Cancel</button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg" onClick={()=>{
                  if (tempBanner){
                    setBannerUrl(tempBanner);
                    try { localStorage.setItem(`studiio.company.banner.${id}`, tempBanner); } catch {}
                  }
                  setShowBannerModal(false);
                }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
