'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Eye, DollarSign, Calendar, User, FileText } from 'lucide-react';
// import { SuggestedMatch } from '@/lib/reconciliation';

interface SuggestionsTabProps {
  suggestions: any[];
  loading: boolean;
  onAllocationUpdated: () => void;
  onRefresh: () => void;
}

export default function SuggestionsTab({ suggestions, loading, onAllocationUpdated, onRefresh }: SuggestionsTabProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">High</span>;
    } else if (confidence >= 0.75) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Low</span>;
    }
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(cents / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  const handleApprove = async (suggestion: any) => {
    setProcessing(suggestion.payment.id);
    
    try {
      const response = await fetch('/api/reconcile/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: suggestion.payment.id,
          allocations: [{
            invoiceId: suggestion.invoice.id,
            amountCents: Math.min(suggestion.payment.amountCents, suggestion.invoice.amountCents),
          }],
        }),
      });

      if (response.ok) {
        onAllocationUpdated();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to approve allocation');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve allocation');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (suggestion: any) => {
    setProcessing(suggestion.payment.id);
    
    try {
      const response = await fetch('/api/reconcile/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: suggestion.payment.id,
          reason: 'Manually rejected',
        }),
      });

      if (response.ok) {
        onAllocationUpdated();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject payment');
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkApprove = async () => {
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence >= 0.85);
    
    if (highConfidenceSuggestions.length === 0) {
      alert('No high confidence suggestions to approve');
      return;
    }

    if (!confirm(`Approve ${highConfidenceSuggestions.length} high confidence matches?`)) {
      return;
    }

    setProcessing('bulk');
    
    try {
      for (const suggestion of highConfidenceSuggestions) {
        await fetch('/api/reconcile/approve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: suggestion.payment.id,
            allocations: [{
              invoiceId: suggestion.invoice.id,
              amountCents: Math.min(suggestion.payment.amountCents, suggestion.invoice.amountCents),
            }],
          }),
        });
      }
      
      onAllocationUpdated();
    } catch (error) {
      console.error('Bulk approve error:', error);
      alert('Failed to approve some allocations');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading suggestions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload a CSV file to see suggested matches
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Suggested Matches ({suggestions.length})
          </h3>
          <p className="text-sm text-gray-600">
            Review and approve automatic payment matches
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
          <button
            onClick={handleBulkApprove}
            disabled={processing === 'bulk'}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve High Confidence
          </button>
        </div>
      </div>

      {/* Suggestions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {suggestions.map((suggestion) => (
            <li key={suggestion.payment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getConfidenceBadge(suggestion.confidence)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.payment.bankReference}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {formatAmount(suggestion.payment.amountCents)}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(suggestion.payment.paidAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {suggestion.invoice.invoiceNumber}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {suggestion.invoice.client?.name || 'No client'}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {formatAmount(suggestion.invoice.amountCents)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {suggestion.matchReason}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedSuggestion(suggestion)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleApprove(suggestion)}
                    disabled={processing === suggestion.payment.id}
                    className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  
                  <button
                    onClick={() => handleReject(suggestion)}
                    disabled={processing === suggestion.payment.id}
                    className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Detail Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Match Details</h3>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reference:</span>
                      <span className="text-sm font-medium">{selectedSuggestion.payment.bankReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-sm font-medium">{formatAmount(selectedSuggestion.payment.amountCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium">{formatDate(selectedSuggestion.payment.paidAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank Txn ID:</span>
                      <span className="text-sm font-medium">{selectedSuggestion.payment.bankTxnId || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Invoice</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Number:</span>
                      <span className="text-sm font-medium">{selectedSuggestion.invoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Client:</span>
                      <span className="text-sm font-medium">{selectedSuggestion.invoice.client?.name || 'No client'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-sm font-medium">{formatAmount(selectedSuggestion.invoice.amountCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium">{selectedSuggestion.invoice.status}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Match Analysis</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="text-sm font-medium">{(selectedSuggestion.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reason:</span>
                      <span className="text-sm font-medium">{selectedSuggestion.matchReason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Invoice Number Match:</span>
                      <span className="text-sm font-medium">{(selectedSuggestion.ruleScores.invoiceNumberMatch * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Exact Amount Match:</span>
                      <span className="text-sm font-medium">{(selectedSuggestion.ruleScores.exactAmountMatch * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date Proximity:</span>
                      <span className="text-sm font-medium">{(selectedSuggestion.ruleScores.dateProximity * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reference Similarity:</span>
                      <span className="text-sm font-medium">{(selectedSuggestion.ruleScores.referenceSimilarity * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Partial Payment:</span>
                      <span className="text-sm font-medium">{(selectedSuggestion.ruleScores.partialPayment * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedSuggestion);
                    setSelectedSuggestion(null);
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
