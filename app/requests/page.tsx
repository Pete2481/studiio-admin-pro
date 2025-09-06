"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import { MessageSquare, Plus, Search, Filter, MoreVertical, Clock, User, Calendar, Star, Trash2, Edit, Eye } from "lucide-react";

interface Request {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "in-review";
  priority: "low" | "medium" | "high" | "urgent";
  client: string;
  clientAvatar: string;
  submittedAt: string;
  dueDate?: string;
  category: string;
  assignedTo?: string;
  assignedAvatar?: string;
  tags: string[];
  // Additional fields from EditRequestModal
  galleryId?: string;
  galleryTitle?: string;
  requestType?: string;
  comments?: string;
  tasks?: string[];
  selectedImageId?: string;
  selectedImageAlt?: string;
  selectedImageSrc?: string;
  clientEmail?: string;
}

const mockRequests: Request[] = [
  {
    id: "1",
    title: "New Photography Session Request",
    description: "Client is requesting a family portrait session for next month. They have specific requirements for outdoor location and timing.",
    status: "pending",
    priority: "medium",
    client: "Sarah Johnson",
    clientAvatar: "SJ",
    submittedAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-02-15",
    category: "Portrait",
    tags: ["Family", "Outdoor", "Portrait"]
  },
  {
    id: "2",
    title: "Corporate Event Coverage",
    description: "Annual company event needs professional photography coverage. Event is in 3 weeks, requires multiple photographers.",
    status: "approved",
    priority: "high",
    client: "TechCorp Inc.",
    clientAvatar: "TC",
    submittedAt: "2024-01-10T14:20:00Z",
    dueDate: "2024-02-05",
    category: "Event",
    assignedTo: "Mike Chen",
    assignedAvatar: "MC",
    tags: ["Corporate", "Event", "Multiple Photographers"]
  },
  {
    id: "3",
    title: "Product Photography for E-commerce",
    description: "New product line needs professional photos for website and marketing materials. 50+ products to shoot.",
    status: "in-review",
    priority: "urgent",
    client: "Fashion Forward",
    clientAvatar: "FF",
    submittedAt: "2024-01-12T09:15:00Z",
    dueDate: "2024-01-25",
    category: "Product",
    tags: ["Product", "E-commerce", "Marketing"]
  },
  {
    id: "4",
    title: "Wedding Photography Inquiry",
    description: "Couple planning wedding for summer 2024. Looking for full day coverage including engagement session.",
    status: "pending",
    priority: "medium",
    client: "Emily & David",
    clientAvatar: "ED",
    submittedAt: "2024-01-14T16:45:00Z",
    dueDate: "2024-06-15",
    category: "Wedding",
    tags: ["Wedding", "Engagement", "Full Day"]
  },
  {
    id: "5",
    title: "Real Estate Photography",
    description: "Property management company needs photos for 20+ properties. Looking for consistent style across all listings.",
    status: "approved",
    priority: "low",
    client: "Real Estate Pro",
    clientAvatar: "RE",
    submittedAt: "2024-01-08T11:00:00Z",
    dueDate: "2024-02-28",
    category: "Real Estate",
    assignedTo: "Lisa Rodriguez",
    assignedAvatar: "LR",
    tags: ["Real Estate", "Property", "Consistent Style"]
  }
];

function getStatusColor(status: Request["status"]) {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "approved": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "in-review": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getPriorityColor(priority: Request["priority"]) {
  switch (priority) {
    case "urgent": return "bg-red-500";
    case "high": return "bg-orange-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-500";
  }
}

function getPriorityLabel(priority: Request["priority"]) {
  switch (priority) {
    case "urgent": return "Urgent";
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
    default: return "Unknown";
  }
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Load requests from localStorage on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    try {
      // Load requests from localStorage (set by EditRequestModal)
      const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      
      // Convert stored requests to match our interface
      const convertedRequests: Request[] = storedRequests.map((req: any) => ({
        id: req.id,
        title: req.type || 'Edit Request',
        description: req.description || '',
        status: req.status?.toLowerCase() as Request['status'] || 'pending',
        priority: req.priority?.toLowerCase() as Request['priority'] || 'medium',
        client: req.client || 'Unknown Client',
        clientAvatar: req.client ? req.client.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'UC',
        submittedAt: req.submitted || new Date().toISOString(),
        dueDate: req.dueDate || undefined,
        category: req.requestType || 'Edit',
        tags: req.tasks || [],
        // Additional fields
        galleryId: req.galleryId,
        galleryTitle: req.galleryTitle,
        requestType: req.requestType,
        comments: req.comments,
        tasks: req.tasks,
        selectedImageId: req.selectedImageId,
        selectedImageAlt: req.selectedImageAlt,
        selectedImageSrc: req.selectedImageSrc,
        clientEmail: req.clientEmail
      }));

      // Combine with mock data for demonstration
      const allRequests = [...convertedRequests, ...mockRequests];
      setRequests(allRequests);
      
      console.log('Loaded requests:', allRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests(mockRequests);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openDetailPanel = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailPanelOpen(true);
  };

  const closeDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setTimeout(() => setSelectedRequest(null), 300); // Wait for animation to complete
  };

  const updateRequestStatus = (requestId: string, newStatus: Request["status"]) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
    }
    
    // Save updated status to localStorage
    try {
      const storedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const updatedRequests = storedRequests.map((req: any) => 
        req.id === requestId ? { ...req, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : req
      );
      localStorage.setItem('requests', JSON.stringify(updatedRequests));
      console.log('Request status updated in localStorage');
    } catch (error) {
      console.error('Error updating request status in localStorage:', error);
    }
  };

  const refreshRequests = () => {
    loadRequests();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  return (
    <PageLayout>
      <Topbar title="Requests" showImportExport={false} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
            <p className="text-gray-600">Manage client requests and inquiries</p>
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {requests.filter(r => r.status === 'pending').length} pending requests
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={refreshRequests}
              className="btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="Refresh to see new requests"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={20} />
              New Request
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in-review">In Review</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr 
                    key={request.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openDetailPanel(request)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{request.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{request.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {request.tags.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{request.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                            {request.clientAvatar}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{request.client}</p>
                          <p className="text-sm text-gray-500">{request.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)} mr-2`}></div>
                        <span className="text-sm text-gray-900">{getPriorityLabel(request.priority)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.selectedImageSrc ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(request.selectedImageSrc, '_blank');
                          }}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                          title="Click to open image"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Image
                        </button>
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimeAgo(request.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.dueDate ? formatDate(request.dueDate) : "No due date"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailPanel(request);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit functionality
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete functionality
                          }}
                          className="text-red-600 hover:text-red-900"
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
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Slide-out Detail Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isDetailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedRequest && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
              <button
                onClick={closeDetailPanel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Title and Status */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedRequest.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1).replace('-', ' ')}
                    </span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedRequest.priority)} mr-2`}></div>
                      <span className="text-sm text-gray-600">{getPriorityLabel(selectedRequest.priority)} Priority</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.description}</p>
                </div>

                {/* Client Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Client</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                      {selectedRequest.clientAvatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedRequest.client}</p>
                      <p className="text-sm text-gray-500">{selectedRequest.category}</p>
                    </div>
                  </div>
                </div>

                {/* Image Information */}
                {selectedRequest.selectedImageSrc && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Image Details</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Image:</strong> {selectedRequest.selectedImageAlt || 'Selected Image'}
                      </p>
                      {selectedRequest.galleryTitle && (
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Gallery:</strong> {selectedRequest.galleryTitle}
                        </p>
                      )}
                      <button
                        onClick={() => window.open(selectedRequest.selectedImageSrc, '_blank')}
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Image
                      </button>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted</h4>
                    <p className="text-sm text-gray-600">{formatDate(selectedRequest.submittedAt)}</p>
                  </div>
                  {selectedRequest.dueDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
                      <p className="text-sm text-gray-600">{formatDate(selectedRequest.dueDate)}</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned To */}
                {selectedRequest.assignedTo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-300 flex items-center justify-center text-sm font-medium text-blue-700">
                        {selectedRequest.assignedAvatar}
                      </div>
                      <p className="text-sm text-gray-900">{selectedRequest.assignedTo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 space-y-3">
              <div className="flex gap-2">
                <select
                  value={selectedRequest.status}
                  onChange={(e) => updateRequestStatus(selectedRequest.id, e.target.value as Request["status"])}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="approved">Mark as Approved</option>
                  <option value="rejected">Mark as Rejected</option>
                  <option value="in-review">Mark as In Review</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 btn bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                  Edit Request
                </button>
                <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg">
                  <Star size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isDetailPanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
          onClick={closeDetailPanel}
        />
      )}
    </PageLayout>
  );
}
