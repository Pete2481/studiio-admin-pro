'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
// import { CSVColumnMapping } from '@/src/server/actions/reconciliation.actions';

interface CSVUploadProps {
  onProcessed: () => void;
}

export default function CSVUpload({ onProcessed }: CSVUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'mapping' | 'processing'>('upload');
  const [csvData, setCsvData] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<any[]>([]);
  const [mappingId, setMappingId] = useState<string>('');
  const [columnMap, setColumnMap] = useState<any>({
    date: '',
    amount: '',
    reference: '',
    bankTxnId: '',
  });
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; errors: string[] } | null>(null);

  const downloadTemplate = () => {
    const template = `Date,Amount,Reference,BankTxnId
01/01/2024,1500.00,INV-001 Payment,BNK123456
02/01/2024,2500.00,Invoice 002,BNK123457
03/01/2024,1000.00,Payment for INV-003,BNK123458`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bank_reconciliation_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    const text = await file.text();
    setCsvData(text);
    
    // Upload file to get column mapping
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/reconcile/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setColumns(data.columns);
        setSampleRows(data.sampleRows);
        setMappingId(data.mappingId);
        setUploadStep('mapping');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleProcessCSV = async () => {
    if (!columnMap.date || !columnMap.amount || !columnMap.reference) {
      alert('Please map all required columns');
      return;
    }

    setProcessing(true);
    setUploadStep('processing');

    try {
      const response = await fetch('/api/reconcile/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mappingId,
          columnMap,
          csvData,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTimeout(() => {
          onProcessed();
        }, 2000);
      }
    } catch (error) {
      console.error('Processing error:', error);
      setResult({
        success: false,
        message: 'Processing failed',
        errors: ['An unexpected error occurred'],
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetUpload = () => {
    setUploadStep('upload');
    setCsvData('');
    setColumns([]);
    setSampleRows([]);
    setMappingId('');
    setColumnMap({ date: '', amount: '', reference: '', bankTxnId: '' });
    setResult(null);
  };

  if (uploadStep === 'mapping') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Map CSV Columns</h3>
          <button
            onClick={resetUpload}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Upload different file
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Sample Data</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  {columns.map((column, index) => (
                    <th key={index} className="text-left py-2 px-3 font-medium text-gray-700">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="py-2 px-3 text-gray-600">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Column Mapping</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Column <span className="text-red-500">*</span>
              </label>
              <select
                value={columnMap.date}
                onChange={(e) => setColumnMap({ ...columnMap, date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Column <span className="text-red-500">*</span>
              </label>
              <select
                value={columnMap.amount}
                onChange={(e) => setColumnMap({ ...columnMap, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Column <span className="text-red-500">*</span>
              </label>
              <select
                value={columnMap.reference}
                onChange={(e) => setColumnMap({ ...columnMap, reference: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Transaction ID (Optional)
              </label>
              <select
                value={columnMap.bankTxnId || ''}
                onChange={(e) => setColumnMap({ ...columnMap, bankTxnId: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select column (optional)</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={resetUpload}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessCSV}
              disabled={!columnMap.date || !columnMap.amount || !columnMap.reference}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process CSV
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (uploadStep === 'processing') {
    return (
      <div className="text-center py-12">
        {processing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="text-lg font-medium text-gray-900">Processing CSV...</h3>
            <p className="text-gray-600">This may take a few moments</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {result.success ? (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-12 w-12 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-medium text-gray-900">Processing Complete!</h3>
                  <p className="text-gray-600">{result.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-red-600">
                <AlertCircle className="h-12 w-12 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-medium text-gray-900">Processing Failed</h3>
                  <p className="text-gray-600">{result.message}</p>
                </div>
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-left">
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center space-x-3">
              <button
                onClick={resetUpload}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Upload Another File
              </button>
              {result.success && (
                <button
                  onClick={onProcessed}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  View Suggestions
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Upload Bank CSV</h3>
        <button
          onClick={downloadTemplate}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Download className="h-4 w-4 mr-1" />
          Download Template
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Drop your CSV file here, or{' '}
              <span className="text-blue-600 hover:text-blue-500">browse</span>
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              Supports CSV files with date, amount, and reference columns
            </span>
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileSelect(file);
              }
            }}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-800 mb-2">Supported Formats</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• ANZ, CBA, Westpac, NAB bank exports</li>
          <li>• Generic CSV with date, amount, reference columns</li>
          <li>• UTF-8 encoding</li>
          <li>• Amounts can include currency symbols (will be ignored)</li>
        </ul>
      </div>
    </div>
  );
}



