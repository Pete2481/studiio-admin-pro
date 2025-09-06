"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { Search, Filter, Plus, MoreVertical, ChevronLeft, ChevronRight, Edit, Trash2, Heart } from "lucide-react";
import ServiceModal, { type Service } from "@/components/ServiceModal";
import { getAllServices, toggleServiceFavorite } from "@/lib/serviceManager";

export default function ServicesPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string || "studiio-pro"; // Default for demo

  // Local state for loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Local state
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Load services from service manager
  useEffect(() => {
    const allServices = getAllServices();
    setServices(allServices);
  }, []);

  // Listen for service updates from service manager
  useEffect(() => {
    const handleServicesUpdate = () => {
      console.log("Services page: Received servicesUpdated event");
      const allServices = getAllServices();
      console.log("Services page: Updated services:", allServices);
      setServices(allServices);
    };

    console.log("Services page: Setting up event listener");
    window.addEventListener("studiio:servicesUpdated", handleServicesUpdate);
    return () => {
      console.log("Services page: Cleaning up event listener");
      window.removeEventListener("studiio:servicesUpdated", handleServicesUpdate);
    };
  }, []);

  // Filter services based on search and status
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && service.status === "Active") ||
                         (statusFilter === "inactive" && service.status === "Inactive");
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage);
  const totalServices = filteredServices.length;

  const handleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map(service => service.id));
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleMenuToggle = (serviceId: string) => {
    setDropdownOpen(dropdownOpen === serviceId ? null : serviceId);
  };

  const handleEditService = (serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    if (svc) {
      setEditing(svc);
      setModalOpen(true);
    }
    setDropdownOpen(null);
  };

  const handleDeleteService = async (serviceId: string) => {
    setIsDeleting(true);
    try {
      // Remove from local state
      setServices(prev => prev.filter(service => service.id !== serviceId));
      // TODO: Add to service manager delete function
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsDeleting(false);
      setDropdownOpen(null);
    }
  };

  const handleToggleFavorite = async (serviceId: string) => {
    console.log("Services page: Toggling favorite for service:", serviceId);
    setIsToggling(true);
    
    try {
      // Use the service manager to toggle favorite
      toggleServiceFavorite(serviceId);
      console.log("Services page: Favorite toggled successfully");
    } catch (error) {
      console.error("Services page: Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const onSaveService = async (svc: Service) => {
    if (svc.id && svc.id.startsWith('temp-')) {
      // New service
      setIsCreating(true);
      try {
        const newService = { ...svc, id: `temp-${Date.now()}` };
        setServices(prev => [...prev, newService]);
        setModalOpen(false);
      } catch (error) {
        console.error("Failed to create service:", error);
      } finally {
        setIsCreating(false);
      }
    } else {
      // Update existing service
      setIsUpdating(true);
      try {
        setServices(prev => prev.map(service => 
          service.id === svc.id ? svc : service
        ));
        setModalOpen(false);
      } catch (error) {
        console.error("Failed to update service:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-orange-100 text-orange-800";
  };

  if (isLoading) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading services...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
            <button 
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2" 
              onClick={() => { setEditing(undefined); setModalOpen(true); }}
              disabled={isCreating}
            >
              <Plus size={16} />
              {isCreating ? "Adding..." : "Add Service"}
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search Services"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
              </div>
              
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SERVICES
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      COST
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleSelectService(service.id)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                              {service.icon}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{service.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.cost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFavorite(service.id)}
                            disabled={isToggling}
                            className={`p-1 rounded transition-colors ${
                              service.favorite 
                                ? 'text-red-500 hover:text-red-600 bg-red-50' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                            title={service.favorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart size={16} className={service.favorite ? 'fill-current' : ''} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => handleMenuToggle(service.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {dropdownOpen === service.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleEditService(service.id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Edit size={14} />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(service.id)}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 size={14} />
                                    {isDeleting ? "Deleting..." : "Delete Service"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, totalServices)} of {totalServices}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
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
      <ServiceModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={onSaveService}
        onDelete={handleDeleteService}
      />
    </>
  );
}
