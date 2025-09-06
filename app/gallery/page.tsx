'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Topbar from '@/components/Topbar';
import { ImageIcon, Plus, Search, Filter, Grid3X3, List, Download, Share2, Heart, Eye, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  width: number;
  height: number;
  client?: string;
  date?: string;
  downloads?: number;
  views?: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Mock gallery data for testing
  useEffect(() => {
    const mockImages: GalleryImage[] = [
      {
        id: '1',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        alt: 'Mountain landscape with waterfall',
        title: 'Mountain Adventure',
        category: 'nature',
        width: 400,
        height: 600,
        client: 'Adventure Co.',
        date: '2024-01-15',
        downloads: 45,
        views: 234
      },
      {
        id: '2',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop',
        alt: 'Forest path in sunlight',
        title: 'Forest Path',
        category: 'nature',
        width: 500,
        height: 400,
        client: 'Nature Magazine',
        date: '2024-01-10',
        downloads: 32,
        views: 189
      },
      {
        id: '3',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
        alt: 'City skyline at sunset',
        title: 'Urban Sunset',
        category: 'urban',
        width: 300,
        height: 500,
        client: 'City Planning',
        date: '2024-01-08',
        downloads: 67,
        views: 456
      },
      {
        id: '4',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop',
        alt: 'Abstract geometric patterns',
        title: 'Geometric Art',
        category: 'abstract',
        width: 600,
        height: 300,
        client: 'Art Studio',
        date: '2024-01-05',
        downloads: 23,
        views: 145
      },
      {
        id: '5',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        alt: 'Portrait photography',
        title: 'Portrait Series',
        category: 'portrait',
        width: 400,
        height: 400,
        client: 'Fashion Brand',
        date: '2024-01-03',
        downloads: 89,
        views: 567
      },
      {
        id: '6',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=600&fit=crop',
        alt: 'Architectural photography',
        title: 'Modern Architecture',
        category: 'architecture',
        width: 500,
        height: 600,
        client: 'Design Firm',
        date: '2024-01-01',
        downloads: 56,
        views: 298
      },
      {
        id: '7',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
        alt: 'Food photography',
        title: 'Culinary Delights',
        category: 'food',
        width: 300,
        height: 400,
        client: 'Restaurant',
        date: '2023-12-28',
        downloads: 78,
        views: 432
      },
      {
        id: '8',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop',
        alt: 'Travel photography',
        title: 'World Travels',
        category: 'travel',
        width: 400,
        height: 500,
        client: 'Travel Agency',
        date: '2023-12-25',
        downloads: 34,
        views: 267
      },
      {
        id: '9',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        alt: 'Product photography',
        title: 'Product Showcase',
        category: 'product',
        width: 600,
        height: 400,
        client: 'E-commerce',
        date: '2023-12-20',
        downloads: 91,
        views: 623
      },
      {
        id: '10',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=350&h=550&fit=crop',
        alt: 'Event photography',
        title: 'Corporate Event',
        category: 'event',
        width: 350,
        height: 550,
        client: 'Business Corp',
        date: '2023-12-18',
        downloads: 42,
        views: 198
      },
      {
        id: '11',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=450&h=350&fit=crop',
        alt: 'Wedding photography',
        title: 'Wedding Day',
        category: 'wedding',
        width: 450,
        height: 350,
        client: 'Wedding Venue',
        date: '2023-12-15',
        downloads: 67,
        views: 445
      },
      {
        id: '12',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
        alt: 'Street photography',
        title: 'Street Life',
        category: 'street',
        width: 400,
        height: 600,
        client: 'Photo Journal',
        date: '2023-12-12',
        downloads: 28,
        views: 156
      }
    ];

    setImages(mockImages);
    setFilteredImages(mockImages);
  }, []);

  // Filter images based on category and search
  useEffect(() => {
    let filtered = images;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [images, selectedCategory, searchTerm]);

  const categories = [
    'all', 'nature', 'urban', 'abstract', 'portrait', 'architecture', 
    'food', 'travel', 'product', 'event', 'wedding', 'street'
  ];

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <PageLayout>
      <Topbar title="Gallery" showImportExport={true} />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are passionate about creating innovative products. We believe that technology can make people's lives better.
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search images, clients, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'masonry' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Masonry View"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredImages.length} of {images.length} images
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mb-8">
          {viewMode === 'masonry' ? (
            /* Masonry Layout */
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="break-inside-avoid group">
                  <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => openImageModal(image)}
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                          <button
                            onClick={() => openImageModal(image)}
                            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                            title="View Full Size"
                          >
                            <Eye className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors" title="Download">
                            <Download className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors" title="Share">
                            <Share2 className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors" title="Like">
                            <Heart className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {image.category}
                        </span>
                        <span>{image.client}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{image.date}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {image.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {image.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="group">
                  <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => openImageModal(image)}
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                          <button
                            onClick={() => openImageModal(image)}
                            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                            title="View Full Size"
                          >
                            <Eye className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors" title="Download">
                            <Download className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors" title="Share">
                            <Share2 className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors" title="Like">
                            <Heart className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {image.category}
                        </span>
                        <span>{image.client}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{image.date}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {image.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {image.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
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
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Image Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{selectedImage.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {selectedImage.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">{selectedImage.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedImage.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium">{selectedImage.width} × {selectedImage.height}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium">{selectedImage.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-medium">{selectedImage.downloads}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Image
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
