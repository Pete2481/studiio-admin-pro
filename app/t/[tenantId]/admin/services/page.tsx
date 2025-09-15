"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import { Search, Filter, Plus, MoreVertical, ChevronLeft, ChevronRight, Edit, Trash2, Heart, Upload, Download, Info } from "lucide-react";
import ServiceModal, { type Service } from "@/components/ServiceModal";
import { useServices, useCreateService, useUpdateService, useDeleteService, toggleServiceFavoriteDirect } from "@/src/client/api/services";
import { useTenant } from "@/components/TenantProvider";
import Papa from 'papaparse';

export default function ServicesPage() {
  const params = useParams();
  const { currentTenant } = useTenant();
  const tenantId = params?.tenantId as string || "business-media-drive"; // Default for Media Drive

  // Database hooks
  const { services, pagination, loading, error } = useServices(tenantId);
  const { mutate: createService, isLoading: isCreating } = useCreateService();
  const { mutate: updateService, isLoading: isUpdating } = useUpdateService();
  const { mutate: deleteService, isLoading: isDeleting } = useDeleteService();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isToggling, setIsToggling] = useState(false);
  
  // CSV Upload state
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvResults, setCsvResults] = useState<any>(null);

  // Mock fetch for compatibility
  useEffect(() => {
    if (currentTenant?.slug) {
      console.log(`Mock fetch called with tenant: ${currentTenant.slug}`);
    }
  }, [currentTenant?.slug, statusFilter, searchTerm, currentPage, rowsPerPage]);

  // Convert database services to UI format
  const convertDbServiceToUI = (dbService: any): Service => ({
    id: dbService.id,
    name: dbService.name,
    description: dbService.description || "",
    icon: dbService.icon || "📸",
    status: dbService.status || "Active",
    cost: `$${dbService.price}`,
    date: new Date(dbService.createdAt).toDateString(),
    durationMinutes: dbService.durationMinutes || 60,
    favorite: dbService.favorite || false,
    imageQuotaEnabled: dbService.imageQuotaEnabled || false,
    imageQuota: dbService.imageQuota || 0,
    displayPrice: dbService.displayPrice !== false,
    active: dbService.isActive !== false,
  });

  // Convert services to UI format and filter
  const uiServices = services.map(convertDbServiceToUI);
  const filteredServices = uiServices.filter(service => {
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

  // CSV Upload functions
  const handleCsvFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Read file as text first to see what we're working with
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      console.log('=== RAW CSV TEXT ===');
      console.log('File size:', text.length, 'characters');
      console.log('First 1000 chars:', text.substring(0, 1000));
      console.log('Last 500 chars:', text.substring(Math.max(0, text.length - 500)));
      
      // Clean the text
      let cleanText = text
        .replace(/^\uFEFF/, '') // Remove BOM
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\r/g, '\n');
      
      // Handle case where CSV is all on one line
      let lines;
      if (cleanText.includes('\n')) {
        lines = cleanText.split('\n').filter(line => line.trim() !== '');
      } else {
        // If no line breaks, split by comma and reconstruct rows
        const parts = cleanText.split(',');
        lines = [];
        let currentLine = '';
        let inQuotes = false;
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          currentLine += (currentLine ? ',' : '') + part;
          
          // Check if we've completed a row (3 fields)
          const fieldCount = currentLine.split(',').length;
          if (fieldCount >= 3 && !inQuotes) {
            lines.push(currentLine);
            currentLine = '';
          }
        }
        if (currentLine.trim()) {
          lines.push(currentLine);
        }
      }
      
      console.log('Total lines after processing:', lines.length);
      console.log('All lines:', lines);
      
      if (lines.length < 2) {
        alert('CSV must have at least 2 lines (header + data)');
        return;
      }
      
      // Parse header - look for the line that contains name,description,price
      let headerLine = lines[0];
      let headerIndex = 0;
      
      // Find the actual header line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes('name') && line.includes('description') && line.includes('price')) {
          headerLine = lines[i];
          headerIndex = i;
          break;
        }
      }
      
      console.log('Header line:', headerLine);
      console.log('Header index:', headerIndex);
      
      // Find column indices for name, description, price
      const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
      console.log('Headers found:', headers);
      
      const nameIndex = headers.findIndex(h => h.includes('name'));
      const descIndex = headers.findIndex(h => h.includes('description'));
      const priceIndex = headers.findIndex(h => h.includes('price'));
      
      console.log('Column indices - name:', nameIndex, 'description:', descIndex, 'price:', priceIndex);
      
      if (nameIndex === -1 || descIndex === -1 || priceIndex === -1) {
        alert('CSV must have columns: name, description, price');
        return;
      }
      
      // Parse data rows - start from after the header
      const services = [];
      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line with proper quote handling
        const fields = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            fields.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        fields.push(currentField.trim());
        
        console.log(`Row ${i}:`, fields);
        
        if (fields.length > Math.max(nameIndex, descIndex, priceIndex)) {
          const service = {
            name: fields[nameIndex] || '',
            description: fields[descIndex] || '',
            price: fields[priceIndex] || ''
          };
          
          if (service.name && service.description && service.price) {
            services.push(service);
            console.log(`Added service ${services.length}:`, service);
          } else {
            console.log(`Skipped row ${i} - missing fields:`, service);
          }
        }
      }
      
      console.log('=== FINAL RESULT ===');
      console.log('Total services parsed:', services.length);
      console.log('All services:', services);
      
      setCsvPreview(services);
      setShowCsvModal(true);
    };
    
    reader.readAsText(file);
  };

  const handleCsvUpload = async () => {
    if (csvPreview.length === 0) return;

    setCsvUploading(true);
    try {
      const response = await fetch(`/api/services/bulk?tenant=${currentTenant?.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services: csvPreview }),
      });

      const result = await response.json();

      if (result.success) {
        setCsvResults(result);
        // Refresh services list
        window.location.reload(); // Simple refresh for now
      } else {
        alert('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setCsvUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvTemplate = [
      ['name', 'description', 'price'],
      ['AERIAL DRONE PHOTOGRAPHY', 'Professional aerial photography services using high-end drones', '225'],
      ['BASIC VIDEO PACKAGE', 'Basic video walkthrough package with editing', '850'],
      ['DUSK PHOTOGRAPHY', 'Evening photography sessions with natural lighting', '245'],
      ['PROPERTY VIDEO TOUR', 'Complete property video tour with narration', '1200'],
      ['VIRTUAL STAGING', 'Digital furniture staging for empty properties', '150']
    ];

    const csvContent = csvTemplate.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'services-template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditService = (serviceId: string) => {
    const svc = uiServices.find((s) => s.id === serviceId);
    if (svc) {
      setEditing(svc);
      setModalOpen(true);
    }
    setDropdownOpen(null);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      console.log("Deleting service:", serviceId);
      
      if (currentTenant?.slug) {
        const response = await fetch(`/api/services/${serviceId}?tenant=${currentTenant.slug}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log("Service deleted successfully");
          setDropdownOpen(null);
          // Refresh the services list
          window.location.reload();
        } else {
          console.error("Failed to delete service:", result.error);
          alert(`Failed to delete service: ${result.error}`);
        }
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert(`Failed to delete service: ${error}`);
    }
  };

  const handleToggleFavorite = async (serviceId: string) => {
    console.log("Services page: Toggling favorite for service:", serviceId);
    
    setIsToggling(true);
    try {
      // Use the services API to toggle favorite
      if (currentTenant?.slug) {
        const result = await toggleServiceFavoriteDirect(currentTenant.slug, serviceId);
        if (result?.ok) {
          console.log("Services page: Favorite toggled successfully");
          // Refresh the services list to show updated favorite status
          window.location.reload();
        } else {
          console.error("Services page: Failed to toggle favorite:", result?.error);
        }
      }
    } catch (error) {
      console.error("Services page: Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const onSaveService = async (svc: Service) => {
    try {
      if (svc.id && svc.id.startsWith('temp-')) {
        // New service - create new service
        console.log("Creating new service:", svc);
        const result = await createService(tenantId, {
          name: svc.name,
          description: svc.description,
          icon: svc.icon,
          price: parseFloat(svc.cost) || 0,
          durationMinutes: svc.durationMinutes || 60,
          isActive: svc.status === "Active",
          displayPrice: svc.displayPrice,
          imageQuotaEnabled: svc.imageQuotaEnabled,
          imageQuota: svc.imageQuota || 0,
          favorite: svc.favorite || false,
        });
        
        if (result?.ok) {
          setModalOpen(false);
          setEditing(undefined);
          // Refresh the services list
          window.location.reload();
        } else {
          console.error("Failed to create service:", result?.error);
        }
      } else {
        // Update existing service
        console.log("Updating service:", svc);
        const result = await updateService(tenantId, svc.id, {
          name: svc.name,
          description: svc.description,
          icon: svc.icon,
          price: parseFloat(svc.cost) || 0,
          durationMinutes: svc.durationMinutes || 60,
          isActive: svc.status === "Active",
          displayPrice: svc.displayPrice,
          imageQuotaEnabled: svc.imageQuotaEnabled,
          imageQuota: svc.imageQuota || 0,
          favorite: svc.favorite || false,
        });
        
        if (result?.ok) {
          setModalOpen(false);
          setEditing(undefined);
          // Refresh the services list
          window.location.reload();
        } else {
          console.error("Failed to update service:", result?.error);
        }
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-orange-100 text-orange-800";
  };

  if (loading) {
    return (
      <PageLayout className="bg-gray-50">
        <Sidebar />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading services...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-gray-50">
      <Sidebar />
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
          <div className="flex items-center gap-4">
            <button 
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2" 
              onClick={() => { setEditing(undefined); setModalOpen(true); }}
              disabled={isCreating || isUpdating}
            >
              <Plus size={16} />
              {isCreating ? "Adding..." : "Add Service"}
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors duration-200 relative group"
                title="Download CSV template with example data"
              >
                <Download size={16} />
                Download Template
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Download CSV template with example data
                </div>
              </button>
              
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer transition-colors duration-200 relative group">
                <Upload size={16} />
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileSelect}
                  className="hidden"
                />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Upload CSV file with services data
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* CSV Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">CSV Import Instructions:</div>
              <ul className="space-y-1 text-blue-700">
                <li>• <strong>Required columns:</strong> name, description, price</li>
                <li>• <strong>Download template</strong> to see the correct format with examples</li>
                <li>• <strong>Default values:</strong> Icon: 📸, Status: Active, Duration: 60min, Display Price: OFF</li>
                <li>• <strong>Duplicate prevention:</strong> Services with existing names will be skipped</li>
                <li>• <strong>Price format:</strong> Numbers only (e.g., 225, 850.50)</li>
              </ul>
            </div>
          </div>
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
                                  disabled={false}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={14} />
                                  Delete Service
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
        
        <ServiceModal
          open={modalOpen}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={onSaveService}
          onDelete={handleDeleteService}
        />
      </div>

      {/* CSV Preview Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">CSV Import Preview</h2>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Found {csvPreview.length} services to import.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Default values:</strong> Icon: 📸, Status: Active, Duration: 60min, Display Price: OFF
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {csvPreview.map((service, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{service.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">{service.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${service.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvUpload}
                disabled={csvUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {csvUploading ? "Importing..." : `Import ${csvPreview.length} Services`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Results Modal */}
      {csvResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Import Results</h2>
              <button
                onClick={() => {
                  setCsvResults(null);
                  setShowCsvModal(false);
                  setCsvPreview([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{csvResults.summary.created}</div>
                  <div className="text-sm text-gray-600">Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{csvResults.summary.skipped}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{csvResults.summary.errors}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>
              
              {csvResults.results.created.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-green-600 mb-2">✅ Created Services:</h3>
                  <div className="text-sm text-gray-600">
                    {csvResults.results.created.map((s: any) => s.name).join(", ")}
                  </div>
                </div>
              )}
              
              {csvResults.results.skipped.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-yellow-600 mb-2">⚠️ Skipped (Already Exist):</h3>
                  <div className="text-sm text-gray-600">
                    {csvResults.results.skipped.map((s: any) => s.name).join(", ")}
                  </div>
                </div>
              )}
              
              {csvResults.results.errors.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-red-600 mb-2">❌ Errors:</h3>
                  <div className="text-sm text-gray-600">
                    {csvResults.results.errors.map((e: any, i: number) => (
                      <div key={i}>{e.service}: {e.error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setCsvResults(null);
                  setShowCsvModal(false);
                  setCsvPreview([]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
