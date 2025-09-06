'use client';

import { useState, useEffect } from 'react';
import { ImageIcon, Eye, Download, Share2, Heart, X, Loader2 } from 'lucide-react';
import { LinkParser } from '@/lib/cloud-gallery/link-parser';
import GalleryTemplates from './GalleryTemplates';

interface CloudImage {
  id: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  modifiedAt?: string;
  size?: number;
  mimeType?: string;
  isLocal?: boolean;
}

interface CloudGalleryResponse {
  success: boolean;
  data: {
    images: CloudImage[];
    provider: string;
    providerName: string;
    totalCount: number;
    folderId?: string;
  };
  error?: string;
  details?: string;
}

interface CloudGalleryGridProps {
  folderLink: string;
  className?: string;
  photographer?: string;
  galleryName?: string;
  agentName?: string;
  companyName?: string;
  template?: string; // Add template prop
}

export function CloudGalleryGrid({ 
  folderLink, 
  className = '', 
  photographer = 'John Smith',
  galleryName = 'Gallery',
  agentName = 'Agent',
  companyName = 'Company',
  template = 'single-template' // Default to professional gallery (can be: single-template, 3x-layout, 2x-layout)
}: CloudGalleryGridProps) {
  const [images, setImages] = useState<CloudImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<{ name: string; icon: string; color: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<CloudImage | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Parse the link to show provider info
  useEffect(() => {
    if (folderLink) {
      const parsed = LinkParser.parse(folderLink);
      if (parsed) {
        setProviderInfo(LinkParser.getProviderDisplay(parsed.provider));
      }
    }
  }, [folderLink]);

  // Fetch images when folderLink changes
  useEffect(() => {
    if (folderLink) {
      fetchImages();
    }
  }, [folderLink]);

  const fetchImages = async () => {
    if (!folderLink) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cloud-gallery?folderLink=${encodeURIComponent(folderLink)}`);
      const data: CloudGalleryResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (data.success && data.data) {
        // Process images to handle local file paths
        const processedImages = data.data.images.map(image => {
          if (data.data.provider === 'local' && image.url.startsWith('file://')) {
            // Convert local file path to API URL
            const filePath = image.url.replace('file://', '');
            return {
              ...image,
              url: `/api/local-image?path=${encodeURIComponent(filePath)}`,
              isLocal: true
            };
          }
          return image;
        });
        
        setImages(processedImages);
        setImagesLoaded(0); // Reset counter for new images
        setProviderInfo(LinkParser.getProviderDisplay(data.data.provider as 'dropbox' | 'gdrive' | 'local'));
      } else {
        throw new Error(data.error || 'Failed to fetch images');
      }

    } catch (err: any) {
      console.error('Failed to fetch cloud gallery:', err);
      setError(err.message || 'Failed to load images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (image: CloudImage) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading images from cloud folder...</p>
          {providerInfo && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className={providerInfo.color}>{providerInfo.icon}</span>
              <span className="text-sm text-gray-500">{providerInfo.name}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load images</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
        <p className="text-gray-600">
          No image files were found in the specified cloud folder.
        </p>
        {providerInfo && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className={providerInfo.color}>{providerInfo.icon}</span>
            <span className="text-sm text-gray-500">{providerInfo.name}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col`}>


      {/* Template-Based Gallery Layout */}
      <div className="flex-1 min-h-[800px]">
        {images.length > 0 ? (
          <GalleryTemplates
            template={template}
            images={images.map((image, index) => ({
              id: image.id,
              src: image.url,
              alt: image.name
            }))}
            videoUrl={undefined} // No video URL for now
            className="w-full h-full"
            galleryId={galleryName || 'default-gallery'}
            galleryTitle={galleryName || 'Photo Gallery'}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No Images Available</p>
              <p className="text-sm text-gray-500">Upload images or provide a folder link to see the template layout</p>
              <p className="text-xs text-gray-400 mt-2">Selected Template: {template}</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Gallery Image</h3>
                  <p className="text-sm text-gray-600">{formatDate(selectedImage.modifiedAt)}</p>
                </div>
                <button
                  onClick={closeImageModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.modal-image-fallback');
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                
                {/* Fallback for modal images */}
                <div className="modal-image-fallback hidden text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Image failed to load</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Image Details</h4>
                  <div className="space-y-2 text-sm">
                    {/* Photographer field removed */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(selectedImage.modifiedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{formatFileSize(selectedImage.size)}</span>
                    </div>
                    {selectedImage.width && selectedImage.height && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">{selectedImage.width} × {selectedImage.height}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Image
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Image
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4" />
                      Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
