import React, { useState } from 'react';
import EditRequestModal from './EditRequestModal';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface GalleryTemplatesProps {
  template: string;
  images: GalleryImage[];
  videoUrl?: string;
  className?: string;
  galleryId?: string;
  galleryTitle?: string;
}

export default function GalleryTemplates({ template, images, videoUrl, className = '', galleryId = 'default', galleryTitle = 'Photo Gallery' }: GalleryTemplatesProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ id: string; src: string; alt: string } | null>(null);
  
  // Single, clean gallery template based on mediadrive.studiio.au layout
  const renderGallery = () => (
    <div className="relative w-full min-h-screen bg-white">
      {/* Hero Image Banner - Same as reference example */}
      {images.length > 0 && (
        <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
          <img
            src={images[0].src}
            alt={images[0].alt || "Gallery Hero Image"}
            className="w-full h-full object-cover"
          />
          {/* Banner Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Photo Gallery</h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Professional Photography Collection
              </p>
              <div className="flex items-center space-x-6 text-lg">
                <span>📸 {images.length} Photos</span>
                <span>🎯 High Quality</span>
                <span>✨ Professional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
              <p className="text-sm text-gray-600 mt-1">
                {images.length} photos • Professional Photography
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Download All
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid - ONLY REAL IMAGES, NO PLACEHOLDERS */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Render ONLY real images from the folder - NO PLACEHOLDERS */}
          {images.map((image, index) => (
            <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Image overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Request Edit for this image"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-3 py-1.5 bg-white bg-opacity-90 text-gray-700 text-sm rounded-full hover:bg-opacity-100 transition-all">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gallery Complete Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <div className="text-blue-600 text-lg mr-2">✨</div>
            <div className="text-blue-700 font-medium">Gallery Complete</div>
            <div className="text-blue-500 text-sm ml-2">• {images.length} real photos displayed</div>
          </div>
        </div>
      </div>
    </div>
  );

  // 3x Layout - Same as above but with 3 images across and scroll feature
  const render3xLayout = () => (
    <div className="relative w-full min-h-screen bg-white">
      {/* Hero Image Banner - Same as reference example */}
      {images.length > 0 && (
        <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
          <img
            src={images[0].src}
            alt={images[0].alt || "Gallery Hero Image"}
            className="w-full h-full object-cover"
          />
          {/* Banner Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Photo Gallery</h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Professional Photography Collection
              </p>
              <div className="flex items-center space-x-6 text-lg">
                <span>📸 {images.length} Photos</span>
                <span>🎯 High Quality</span>
                <span>✨ Professional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
              <p className="text-sm text-gray-600 mt-1">
                {images.length} photos • Professional Photography • 3x Layout
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Download All
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid - 3x Layout with scroll feature */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[800px]">
          {/* Render ONLY real images from the folder - NO PLACEHOLDERS */}
          {images.map((image, index) => (
            <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Image overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Request Edit for this image"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-3 py-1.5 bg-white bg-opacity-90 text-gray-700 text-sm rounded-full hover:bg-opacity-100 transition-all">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gallery Complete Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <div className="text-blue-600 text-lg mr-2">✨</div>
            <div className="text-blue-700 font-medium">Gallery Complete</div>
            <div className="text-blue-500 text-sm ml-2">• {images.length} real photos displayed • 3x Layout with scroll</div>
          </div>
        </div>
      </div>
    </div>
  );

  // 2x Layout - Same as above but with 2 images across and scroll feature
  const render2xLayout = () => (
    <div className="relative w-full min-h-screen bg-white">
      {/* Hero Image Banner - Same as reference example */}
      {images.length > 0 && (
        <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
          <img
            src={images[0].src}
            alt={images[0].alt || "Gallery Hero Image"}
            className="w-full h-full object-cover"
          />
          {/* Banner Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Photo Gallery</h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Professional Photography Collection
              </p>
              <div className="flex items-center space-x-6 text-lg">
                <span>📸 {images.length} Photos</span>
                <span>🎯 High Quality</span>
                <span>✨ Professional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
              <p className="text-sm text-gray-600 mt-1">
                {images.length} photos • Professional Photography • 2x Layout
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Download All
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid - 2x Layout with scroll feature */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[800px]">
          {/* Render ONLY real images from the folder - NO PLACEHOLDERS */}
          {images.map((image, index) => (
            <div key={image.id} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Image overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    title="Request Edit for this image"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-3 py-1.5 bg-white bg-opacity-90 text-gray-700 text-sm rounded-full hover:bg-opacity-100 transition-all">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gallery Complete Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <div className="text-blue-600 text-lg mr-2">✨</div>
            <div className="text-blue-700 font-medium">Gallery Complete</div>
            <div className="text-blue-500 text-sm ml-2">• {images.length} real photos displayed • 2x Layout with scroll</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Template selection logic
  const renderTemplate = () => {
    switch (template) {
      case 'single-template':
        return renderGallery();
      case '3x-layout':
        return render3xLayout();
      case '2x-layout':
        return render2xLayout();
      default:
        return renderGallery(); // Default to original layout
    }
  };

  return (
    <div className={className}>
      {renderTemplate()}
      
      {/* Edit Request Modal */}
      <EditRequestModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedImage(null);
        }}
        galleryId={galleryId}
        galleryTitle={galleryTitle}
        images={images}
        selectedImage={selectedImage}
      />
    </div>
  );
}
