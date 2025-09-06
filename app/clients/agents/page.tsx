"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, Mail, Phone, Edit, Trash2, Building, UserCheck } from "lucide-react";
import { useAllAgents } from "@/src/client/api/agents";
import AgentModal from "@/components/AgentModal";

// Use the Agent type from the API instead of local definition
import type { Agent } from "@/src/client/api/agents";

interface GroupedAgents {
  [companyName: string]: Agent[];
}

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [groupedAgents, setGroupedAgents] = useState<GroupedAgents>({});
  const [filteredGroupedAgents, setFilteredGroupedAgents] = useState<GroupedAgents>({});

  // Fetch all agents
  const { agents, isLoading, error, fetch } = useAllAgents();

  useEffect(() => {
    // Fetch agents when component mounts
    fetch("studiio-pro");
  }, [fetch]);

  useEffect(() => {
    // Group agents by company
    const grouped: GroupedAgents = {};
    agents.forEach(agent => {
      const companyName = agent.company?.name || "Unknown Company";
      if (!grouped[companyName]) {
        grouped[companyName] = [];
      }
      grouped[companyName].push(agent);
    });

    // Sort companies alphabetically
    const sortedGrouped: GroupedAgents = {};
    Object.keys(grouped)
      .sort()
      .forEach(companyName => {
        sortedGrouped[companyName] = grouped[companyName].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
      });

    setGroupedAgents(sortedGrouped);
  }, [agents]);

  useEffect(() => {
    // Apply search and filter
    const filtered: GroupedAgents = {};
    
    Object.keys(groupedAgents).forEach(companyName => {
      const companyAgents = groupedAgents[companyName].filter(agent => {
                 const matchesSearch = 
           agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
           agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           companyName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
          statusFilter === "all" || 
          (statusFilter === "active" && agent.isActive) ||
          (statusFilter === "inactive" && !agent.isActive);
        
        return matchesSearch && matchesStatus;
      });
      
      if (companyAgents.length > 0) {
        filtered[companyName] = companyAgents;
      }
    });

    setFilteredGroupedAgents(filtered);
  }, [groupedAgents, searchTerm, statusFilter]);

  const handleAddAgent = () => {
    // For now, redirect to companies page to add agents from there
    alert("Please add agents from the company profile page. Navigate to a company and use the 'Add Agent' button there.");
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsAgentModalOpen(true);
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (confirm(`Are you sure you want to delete ${agent.name}?`)) {
      // TODO: Implement delete functionality
      console.log("Delete agent:", agent.id);
    }
  };

  const handleAgentSuccess = () => {
    setIsAgentModalOpen(false);
    setSelectedAgent(null);
    // Refresh agents list
    fetch("studiio-pro");
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.isActive).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading agents...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading agents: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Agents</h1>
              <p className="text-gray-600">
                {totalAgents} total agents • {activeAgents} active
              </p>
            </div>
            <button
              onClick={handleAddAgent}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Agent</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Filter Button */}
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Agents List */}
        <div className="space-y-6">
          {Object.keys(filteredGroupedAgents).length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first agent."
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <button
                  onClick={handleAddAgent}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Your First Agent
                </button>
              )}
            </div>
          ) : (
            Object.keys(filteredGroupedAgents).map(companyName => (
              <div key={companyName} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Company Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-teal-600" />
                    <h2 className="text-xl font-semibold text-gray-900">{companyName}</h2>
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                      {filteredGroupedAgents[companyName].length} agent{filteredGroupedAgents[companyName].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Agents Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredGroupedAgents[companyName].map(agent => (
                      <div
                        key={agent.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {/* Agent Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              {agent.profileImage ? (
                                <img
                                  src={agent.profileImage}
                                  alt={agent.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.textContent = agent.name.charAt(0).toUpperCase();
                                  }}
                                />
                              ) : (
                                <span className="text-lg font-semibold text-gray-600">
                                  {agent.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.role}</p>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                          {agent.email && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{agent.email}</span>
                            </div>
                          )}
                          {agent.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{agent.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleEditAgent(agent)}
                            className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                            title="Edit agent"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgent(agent)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete agent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Agent Modal */}
        {isAgentModalOpen && selectedAgent && (
          <AgentModal
            isOpen={isAgentModalOpen}
            onClose={() => setIsAgentModalOpen(false)}
            companyId={selectedAgent.companyId}
            agent={selectedAgent}
            onSuccess={handleAgentSuccess}
          />
        )}
      </div>
    </div>
  );
}
