"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompany } from "@/src/client/api/companies";
import { Company } from "@/src/client/api/companies";
import { useAgentsByCompany, Agent } from "@/src/client/api/agents";
import { ArrowLeft, Search, Plus, Mail, Phone, Edit, Trash2, ExternalLink } from "lucide-react";
import AgentModal from "@/components/AgentModal";

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [activeTab, setActiveTab] = useState("agents");
  
  const { company, isLoading, error, fetch: fetchCompany } = useCompany();
  const { fetch: fetchAgents, agents, isLoading: agentsLoading } = useAgentsByCompany();
  
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch company and agents when component loads
  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
      fetchAgents("business-media-drive", companyId);
    }
  }, [companyId, fetchCompany, fetchAgents]);

  const handleAddAgent = () => {
    setSelectedAgent(null);
    setIsAgentModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAgentModalOpen(true);
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      // TODO: Implement delete agent functionality
      console.log("Delete agent:", agentId);
      // Refresh agents list
      fetchAgents("business-media-drive", companyId);
    }
  };

  const handleAgentSuccess = () => {
    // Refresh agents list
    fetchAgents("business-media-drive", companyId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="container mx-auto px-6 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
            <p className="text-gray-600 mb-4">The company you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push("/clients/companies")}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Companies
            </button>
          </div>
        </div>
      </div>
    );
  }

  const parseJsonField = (field: string | null | undefined) => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const invoiceEmails = parseJsonField(company.invoiceEmails);
  const permissions = parseJsonField(company.permissions);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/clients/companies")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>← Back to Companies</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Companies • Edit Company Profile</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Banner
            </button>
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏢</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
            <p className="text-xl opacity-90">{company.type || "Luxury Real Estate"}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{company.propertiesCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{company.clientsCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{company.salesVolume || "$1.2B"}</div>
              <div className="text-sm text-gray-600">Sales Volume</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "followers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab("agents")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "agents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Agents {agents.length}
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "gallery"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Name</label>
                  <p className="text-gray-900">{company.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900">{company.type || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    company.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {company.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(company.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{company.email || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{company.phone || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Invoice Emails</label>
                  {invoiceEmails.length > 0 ? (
                    <div className="space-y-1">
                      {invoiceEmails.map((email: string, index: number) => (
                        <p key={index} className="text-gray-900">{email}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No invoice emails configured</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Agents {agents.length}</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search Agents"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={handleAddAgent}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Agent
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {agentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No agents found</p>
                  <button 
                    onClick={handleAddAgent}
                    className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Add Your First Agent
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {agents.map((agent: Agent) => (
                    <div key={agent.id} className="bg-gray-50 rounded-lg p-4 relative group">
                      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={16} className="text-gray-400 hover:text-gray-600" />
                      </button>
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          {agent.profileImage ? (
                            <img
                              src={agent.profileImage}
                              alt={agent.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">👤</span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{agent.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{agent.role}</p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {agent.email && (
                          <a 
                            href={`mailto:${agent.email}`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Mail size={16} />
                          </a>
                        )}
                        {agent.phone && (
                          <a 
                            href={`tel:${agent.phone}`}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <Phone size={16} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleEditAgent(agent)}
                          className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Agent Modal */}
        <AgentModal
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
          companyId={companyId}
          agent={selectedAgent}
          onSuccess={handleAgentSuccess}
        />

        {activeTab === "followers" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Followers</h2>
            <p className="text-gray-600">Followers functionality coming soon...</p>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
            <p className="text-gray-600">Gallery functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
