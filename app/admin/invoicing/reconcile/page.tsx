'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PageLayout from '@/components/PageLayout';
import { Upload, FileText, CheckCircle, XCircle, RefreshCw, Download } from 'lucide-react';
import CSVUpload from './components/CSVUpload';
import SuggestionsTab from './components/SuggestionsTab';
import UnallocatedTab from './components/UnallocatedTab';
import AllocatedTab from './components/AllocatedTab';
// import { SuggestedMatch } from '@/lib/reconciliation';

type TabType = 'upload' | 'suggestions' | 'unallocated' | 'allocated';

export default function ReconciliationPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPayments: 0,
    unallocatedPayments: 0,
    suggestedPayments: 0,
    allocatedPayments: 0,
  });

  const tabs = [
    { id: 'upload', label: 'Upload CSV', icon: Upload },
    { id: 'suggestions', label: 'Suggested Matches', icon: FileText, count: stats.suggestedPayments },
    { id: 'unallocated', label: 'Unallocated', icon: XCircle, count: stats.unallocatedPayments },
    { id: 'allocated', label: 'Allocated', icon: CheckCircle, count: stats.allocatedPayments },
  ];

  const loadStats = async () => {
    try {
      const response = await fetch('/api/reconcile/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reconcile/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVProcessed = () => {
    loadStats();
    loadSuggestions();
    setActiveTab('suggestions');
  };

  const handleAllocationUpdated = () => {
    loadStats();
    loadSuggestions();
  };

  useEffect(() => {
    loadStats();
    if (activeTab === 'suggestions') {
      loadSuggestions();
    }
  }, [activeTab]);

  // TEMPORARY: Bypass authentication for testing
  // TODO: Remove this when authentication is properly implemented
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!session?.user && !isDevelopment) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 mt-2">Please sign in to access this page.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Check if user has admin permissions (or bypass in development)
  const userTenant = session?.user?.tenants?.[0];
  const hasAdminAccess = isDevelopment || (userTenant && ['MASTER_ADMIN', 'SUB_ADMIN'].includes(userTenant.role));

  if (!hasAdminAccess) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Insufficient Permissions</h1>
            <p className="text-gray-600 mt-2">You need admin access to use the reconciliation feature.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bank Reconciliation</h1>
          <p className="text-gray-600 mt-2">
            Upload bank CSV files and automatically match payments to invoices
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suggested</p>
                <p className="text-2xl font-bold text-gray-900">{stats.suggestedPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unallocated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unallocatedPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Allocated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.allocatedPayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'upload' && (
              <CSVUpload onProcessed={handleCSVProcessed} />
            )}
            
            {activeTab === 'suggestions' && (
              <SuggestionsTab
                suggestions={suggestions}
                loading={loading}
                onAllocationUpdated={handleAllocationUpdated}
                onRefresh={loadSuggestions}
              />
            )}
            
            {activeTab === 'unallocated' && (
              <UnallocatedTab onAllocationUpdated={handleAllocationUpdated} />
            )}
            
            {activeTab === 'allocated' && (
              <AllocatedTab />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
