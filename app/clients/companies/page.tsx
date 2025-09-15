"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import { Search, Filter, MoreVertical, ChevronLeft, ChevronRight, Edit, Trash2, Images, CreditCard, Plus } from "lucide-react";
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany, Company } from "@/src/client/api/companies";
import { useTenant } from "@/components/TenantProvider";

export default function CompaniesPage() {
  const router = useRouter();
  const { currentTenant } = useTenant();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Database hooks
  const { fetch, companies, isLoading, error } = useCompanies();
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();

  // Fetch companies on component mount and when filters change
  useEffect(() => {
    if (currentTenant?.slug) {
      console.log(`Mock fetch called with tenant: ${currentTenant.slug}`);
    }
  }, [currentTenant?.slug, searchQuery, currentPage, rowsPerPage, selectedStatus]);

  const totalPages = 1;
  const totalCount = companies.length;

  const filteredCompanies = companies.filter(company => {
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && company.isActive) ||
      (selectedStatus === "inactive" && !company.isActive);
    return matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500" : "bg-orange-500";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditProfile = (company: Company) => {
    setEditingCompany(company);
    setShowNewCompany(true);
    setOpenMenuId(null);
  };

  const handleDeleteProfile = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleViewGalleries = (company: Company) => {
    // Navigate to galleries page
    window.location.href = `/galleries?company=${company.id}`;
  };

  const handleViewInvoices = (company: Company) => {
    // Navigate to invoices page
    window.location.href = `/invoices?company=${company.id}`;
  };

  const confirmDelete = async () => {
    if (companyToDelete && currentTenant?.slug) {
      const result = await deleteCompanyMutation.mutate(companyToDelete.id);
      if (result?.ok) {
        setShowDeleteModal(false);
        setCompanyToDelete(null);
      }
    }
  };

  const handleSaveCompany = async (companyData: any) => {
    if (!currentTenant?.slug) return;
    
    if (editingCompany) {
      // Update existing company
      const result = await updateCompanyMutation.mutate(editingCompany.id, companyData);
      if (result?.ok) {
        setShowNewCompany(false);
        setEditingCompany(null);
      }
    } else {
      // Create new company
      const result = await createCompanyMutation.mutate(companyData, currentTenant.slug);
      if (result?.ok) {
        setShowNewCompany(false);
      }
    }
  };

  if (isLoading) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center text-red-600">
              Error loading companies: {error}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <Sidebar />
      <PageLayout className="bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
                <button 
                  className="bg-[#ebfbf2] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#d4f7e4] flex items-center gap-2 font-medium transition-colors"
                  onClick={() => setShowNewCompany(true)}
                >
                  <Plus size={16} />
                  NEW COMPANY ADD
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search Companies"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Companies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                                             <td className="px-6 py-4">
                         <div className="flex items-center">
                           <div className="flex-shrink-0 h-10 w-10">
                             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                               {company.logoUrl ? (
                                 <img src={company.logoUrl} alt={company.name} className="h-10 w-10 rounded-full object-cover" />
                               ) : (
                                 "🏢"
                               )}
                             </div>
                           </div>
                           <div className="ml-4">
                             <button
                               onClick={() => router.push(`/clients/companies/${company.id}`)}
                               className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors cursor-pointer text-left"
                             >
                               {company.name}
                             </button>
                             <div className="text-sm text-gray-500">{company.type}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-900">
                         {new Date(company.createdAt).toLocaleDateString()}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(company.isActive)} mr-2`}></div>
                          <span className="text-sm text-gray-900">{getStatusText(company.isActive)}</span>
                        </div>
                      </td>
                                             <td className="px-6 py-4 text-sm text-gray-900">{company.email || company.phone}</td>
                      <td className="px-6 py-4 relative">
                        <button 
                          onClick={() => handleMenuToggle(company.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {openMenuId === company.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditProfile(company)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit size={16} className="mr-3" />
                                Edit Profile
                              </button>
                              <button
                                onClick={() => handleDeleteProfile(company)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 size={16} className="mr-3" />
                                Delete Profile
                              </button>
                              <button
                                onClick={() => handleViewGalleries(company)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Images size={16} className="mr-3" />
                                View Galleries
                              </button>
                              <button
                                onClick={() => handleViewInvoices(company)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <CreditCard size={16} className="mr-3" />
                                View Invoices
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 border border-gray-300 rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  {totalCount > 0 ? `${totalCount} companies` : "No companies found"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Company</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{companyToDelete?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Company Modal */}
      {showNewCompany && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6">
                          <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {editingCompany ? "Edit Company" : "Add Company"}
                </h3>
                <button 
                  className="text-gray-500 hover:text-gray-700" 
                  onClick={() => {
                    setShowNewCompany(false);
                    setEditingCompany(null);
                  }}
                >
                  ✕
                </button>
              </div>

                         <NewCompanyForm 
               company={editingCompany}
               onCancel={() => {
                 setShowNewCompany(false);
                 setEditingCompany(null);
               }} 
               onSave={handleSaveCompany}
               isLoading={createCompanyMutation.isLoading || updateCompanyMutation.isLoading}
             />
          </div>
        </div>
      )}
    </>
  );
}

function NewCompanyForm({ company, onCancel, onSave, isLoading }: {
  company?: Company | null;
  onCancel: () => void;
  onSave: (companyData: any) => Promise<void>;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    name: company?.name || "",
    type: company?.type || "Real Estate",
    phone: company?.phone || "",
    email: company?.email || "",
    password: company?.password || "",
    invoiceEmails: company?.invoiceEmails ? JSON.parse(company.invoiceEmails) : [""],
    logoUrl: company?.logoUrl || "",
    isActive: company?.isActive !== false,
    propertiesCount: company?.propertiesCount || 0,
    clientsCount: company?.clientsCount || 0,
    salesVolume: company?.salesVolume || "",
    permissions: company?.permissions ? JSON.parse(company.permissions) : {
      viewCalendar: true,
      viewBlankedBookings: true,
      viewInvoice: true,
      viewService: true,
    },
    sendWelcomeEmail: company?.sendWelcomeEmail || false,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  function set(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Starting save process...");
      
      // Validate required fields
      if (!form.name.trim()) {
        alert("Company name is required");
        return;
      }
      
      // Handle logo upload here - for now we'll use the preview URL
      const logoUrl = logoPreview || form.logoUrl;
      
      const companyData = {
        ...form,
        logoUrl,
        invoiceEmails: JSON.stringify(form.invoiceEmails.filter((email: string) => email.trim())),
        permissions: JSON.stringify(form.permissions)
      };

      console.log("Company data to save:", companyData);
      
      await onSave(companyData);
      
      console.log("Save completed successfully");
    } catch (error) {
      console.error("Error saving company:", error);
      alert(`Error saving company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm">
          <div className="mb-1">Name</div>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.name} onChange={e=>set("name", e.target.value)} />
        </label>
                  <label className="text-sm">
            <div className="mb-1">Type</div>
            <select 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" 
              value={form.type} 
              onChange={e => set("type", e.target.value)}
            >
              <option value="Real Estate">Real Estate</option>
              <option value="Property Management">Property Management</option>
              <option value="Development">Development</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </label>
        <label className="text-sm">
          <div className="mb-1">Phone</div>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.phone} onChange={e=>set("phone", e.target.value)} />
        </label>
        <label className="text-sm">
          <div className="mb-1">E-mail</div>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.email} onChange={e=>set("email", e.target.value)} />
        </label>
        <label className="text-sm">
          <div className="mb-1">Invoice Emails</div>
          <div className="space-y-2">
            {form.invoiceEmails.map((email: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" 
                  value={email} 
                  onChange={e => {
                    const newEmails = [...form.invoiceEmails];
                    newEmails[index] = e.target.value;
                    set("invoiceEmails", newEmails);
                  }}
                  placeholder="email@example.com"
                />
                {form.invoiceEmails.length > 1 && (
                  <button 
                    type="button"
                    className="px-2 py-1 rounded bg-red-600 text-white text-xs" 
                    onClick={() => {
                      const newEmails = form.invoiceEmails.filter((_: string, i: number) => i !== index);
                      set("invoiceEmails", newEmails);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              className="px-2 py-1 rounded bg-teal-600 text-white text-xs" 
              onClick={() => set("invoiceEmails", [...form.invoiceEmails, ""])}
            >
              + Add Email
            </button>
          </div>
        </label>
        <label className="text-sm">
          <div className="mb-1">Password</div>
          <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.password} onChange={e=>set("password", e.target.value)} />
        </label>
        <label className="text-sm">
          <div className="mb-1">Properties Count</div>
          <input 
            type="number" 
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" 
            value={form.propertiesCount} 
            onChange={e => set("propertiesCount", parseInt(e.target.value) || 0)}
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">Clients Count</div>
          <input 
            type="number" 
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" 
            value={form.clientsCount} 
            onChange={e => set("clientsCount", parseInt(e.target.value) || 0)}
          />
        </label>
        <label className="text-sm">
          <div className="mb-1">Sales Volume</div>
          <input 
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" 
            value={form.salesVolume} 
            onChange={e => set("salesVolume", e.target.value)}
            placeholder="e.g., $1M - $5M"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-medium mb-2">Upload Logo</div>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full"
          />
          {logoPreview && (
            <div className="mt-2">
              <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-cover rounded" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="text-sm">Active</span>
          <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e=>set("isActive", e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-sm font-semibold mb-2">Permission</div>
        <div className="divide-y border rounded-lg">
          {[
            { key: "viewCalendar", label: "View Calendar" },
            { key: "viewBlankedBookings", label: "View Blanked out Bookings" },
            { key: "viewInvoice", label: "View Invoice" },
            { key: "viewService", label: "View Service" },
          ].map(p => (
            <label key={p.key} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{p.label}</span>
              <input type="checkbox" checked={(form.permissions as any)[p.key]} onChange={e=>set("permissions", { ...form.permissions, [p.key]: e.target.checked })} />
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={form.sendWelcomeEmail}
            onChange={e => set("sendWelcomeEmail", e.target.checked)}
          />
          Send welcome email
        </label>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg" onClick={onCancel}>Cancel</button>
          <button 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50" 
            onClick={handleSave}
            disabled={isLoading || !form.name.trim()}
          >
            {isLoading ? "Saving..." : (company ? "Update Company" : "Add Company")}
          </button>
        </div>
      </div>
    </div>
  );
}
