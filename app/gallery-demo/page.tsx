'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Topbar from '@/components/Topbar';
import { CloudGalleryGrid } from '@/components/CloudGalleryGrid';
import { LinkParser } from '@/lib/cloud-gallery/link-parser';
import { ImageIcon, Link, AlertCircle, CheckCircle } from 'lucide-react';

export default function GalleryDemoPage() {
  const [folderLink, setFolderLink] = useState('');
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [detectedProvider, setDetectedProvider] = useState<{ name: string; icon: string; color: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setFolderLink(link);
    
    if (!link.trim()) {
      setIsValidLink(null);
      setDetectedProvider(null);
      setErrorMessage(null);
      return;
    }

    try {
      const parsed = LinkParser.parse(link.trim());
      if (parsed) {
        setIsValidLink(true);
        setDetectedProvider(LinkParser.getProviderDisplay(parsed.provider));
        setErrorMessage(null);
      } else {
        setIsValidLink(false);
        setDetectedProvider(null);
        setErrorMessage('Invalid folder link. Please use a Dropbox or Google Drive folder link.');
      }
    } catch (error) {
      setIsValidLink(false);
      setDetectedProvider(null);
      setErrorMessage('Failed to parse folder link. Please check the URL format.');
    }
  };

  const handleTestLink = (testLink: string) => {
    setFolderLink(testLink);
    handleLinkChange({ target: { value: testLink } } as any);
  };

  return (
    <PageLayout>
      <Topbar title="Cloud Gallery Demo" showImportExport={false} />
      
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cloud Gallery Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the cloud gallery functionality by pasting a Dropbox or Google Drive folder link below.
          </p>
        </div>

        {/* Link Input Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="max-w-2xl mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cloud Folder Link
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={folderLink}
                onChange={handleLinkChange}
                placeholder="Paste your Dropbox or Google Drive folder link here..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            
            {/* Validation Feedback */}
            {isValidLink !== null && (
              <div className="mt-3 flex items-center gap-2">
                {isValidLink ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-sm ${isValidLink ? 'text-green-600' : 'text-red-600'}`}>
                  {isValidLink ? 'Valid link detected!' : errorMessage}
                </span>
              </div>
            )}

            {/* Provider Detection */}
            {detectedProvider && (
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-sm px-3 py-1 rounded-full ${detectedProvider.color}`}>
                  {detectedProvider.icon} {detectedProvider.name}
                </span>
                <span className="text-sm text-gray-500">Provider detected</span>
              </div>
            )}
          </div>
        </div>

        {/* Test Links */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Local Folder Example</h4>
              <p className="text-sm text-gray-600 mb-3">
                Use a local folder path: /path/to/your/images
              </p>
              <button
                onClick={() => handleTestLink('/Volumes/2T SSD/Dropbox/Dropbox/Real Estate Clients 2025/Sothebys Byron Bay 2025/248 Seven Mile Beach Road')}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded hover:bg-purple-200 transition-colors"
              >
                Try Local Folder
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Dropbox Example</h4>
              <p className="text-sm text-gray-600 mb-3">
                Use this format: https://www.dropbox.com/scl/fo/abc123/...?dl=0
              </p>
              <button
                onClick={() => handleTestLink('https://www.dropbox.com/scl/fo/example123/test-folder?dl=0')}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
              >
                Try Dropbox Format
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Google Drive Example</h4>
              <p className="text-sm text-gray-600 mb-3">
                Use this format: https://drive.google.com/drive/folders/1ABC123...
              </p>
              <button
                onClick={() => handleTestLink('https://drive.google.com/drive/folders/1ABC123example456')}
                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
              >
                Try Drive Format
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Display */}
        {folderLink && isValidLink && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Gallery Preview</h3>
              <p className="text-sm text-gray-600">
                Images from: {folderLink}
              </p>
            </div>
            
            <CloudGalleryGrid folderLink={folderLink} />
          </div>
        )}

        {/* Instructions */}
        {!folderLink && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to test?</h3>
            <p className="text-gray-600">
              Paste a cloud folder link above to see the gallery in action.
            </p>
          </div>
        )}

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Automatic Detection</h4>
            <p className="text-sm text-gray-600">
              Automatically detects Dropbox, Google Drive, and local folder paths
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Masonry Layout</h4>
            <p className="text-sm text-gray-600">
              Beautiful responsive masonry grid layout
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Smart Caching</h4>
            <p className="text-sm text-gray-600">
              Efficient caching to minimize API calls
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
