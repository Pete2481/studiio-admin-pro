"use client";

import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import { Search, Filter, Plus, Edit, Phone, Mail, Trash2 } from "lucide-react";

export default function PhotographersPage() {
  // Static data for now
  const photographers = [
    {
      id: '1',
      name: 'Josh',
      email: 'mike.davis@studiio.com',
      role: 'Lead Photographer',
      avatar: '📸',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@studiio.com',
      role: 'Creative Director',
      avatar: '📸',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@studiio.com',
      role: 'Senior Photographer',
      avatar: '📸',
      status: 'Active'
    }
  ];

  return (
    <PageLayout>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Photographers {photographers.length}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your photography team and their permissions
                </p>
              </div>
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="h-4 w-4" />
                Add Photographer
              </button>
            </div>
          </div>

          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search Photographers"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white">
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photographers.map((photographer) => (
                <div
                  key={photographer.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl">
                        {photographer.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{photographer.name}</h3>
                        <p className="text-sm text-gray-600">{photographer.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{photographer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                        {photographer.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors">
                      Email
                    </button>
                    <button className="flex-1 bg-teal-100 hover:bg-teal-200 text-teal-700 px-3 py-2 rounded text-sm transition-colors">
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}