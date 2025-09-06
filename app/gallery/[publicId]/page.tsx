'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import GalleryTemplates from '@/components/GalleryTemplates';
import { Play, Download, Share2, Heart, Eye, ArrowLeft } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
}

interface Gallery {
  id: string;
  title: string;
  propertyAddress: string;
  companyName: string;
  image: string;
  agent: string;
  services: string[];
  teamMember: string;
  template: string;
  galleryHeader: string;
  imageFolderLink: string;
  videoLink?: string;
  virtualTourLink?: string;
  floorPlansSupport?: string;
  restrictDownload: boolean;
  watermarkEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function GalleryViewPage() {
  const params = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        
        // Load gallery from localStorage
        const savedGalleries = localStorage.getItem('galleries');
        if (savedGalleries) {
          const galleries: Gallery[] = JSON.parse(savedGalleries);
          const foundGallery = galleries.find(g => g.id === params.publicId);
          
          if (foundGallery) {
            setGallery(foundGallery);
            
            // Generate mock images for demonstration
            // In a real app, you'd load these from the imageFolderLink
            const mockImages: GalleryImage[] = [
              {
                id: '1',
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
                alt: 'Property Image 1',
                title: 'Exterior View'
              },
              {
                id: '2',
                src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop',
                alt: 'Property Image 2',
                title: 'Living Room'
              },
              {
                id: '3',
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
                alt: 'Property Image 3',
                title: 'Kitchen'
              },
              {
                id: '4',
                src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop',
                alt: 'Property Image 4',
                title: 'Bedroom'
              },
              {
                id: '5',
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
                alt: 'Property Image 5',
                title: 'Bathroom'
              },
              {
                id: '6',
                src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop',
                alt: 'Property Image 6',
                title: 'Garden'
              },
              {
                id: '7',
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                alt: 'Property Image 7',
                title: 'Pool Area'
              },
              {
                id: '8',
                src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop',
                alt: 'Property Image 8',
                title: 'Garage'
              }
            ];
            
            setImages(mockImages);
          } else {
            setError('Gallery not found');
          }
        } else {
          setError('No galleries found');
        }
      } catch (err) {
        setError('Failed to load gallery');
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.publicId) {
      loadGallery();
    }
  }, [params.publicId]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !gallery) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gallery Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The requested gallery could not be found.'}</p>
            <a
              href="/galleries"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Galleries
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Gallery Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <a
                href="/galleries"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Galleries
              </a>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{gallery.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{gallery.propertyAddress}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {gallery.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Gallery Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Agent:</span>
                      <span className="ml-2 font-medium">{gallery.agent}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <span className="ml-2 font-medium">{gallery.companyName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Photographer:</span>
                      <span className="ml-2 font-medium">{gallery.teamMember}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Template:</span>
                      <span className="ml-2 font-medium capitalize">
                        {gallery.template.replace('layout-', 'Layout ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium">
                        {new Date(gallery.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Download All
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share Gallery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{gallery.galleryHeader}</h2>
            
            {/* Template Layout */}
            <div className="h-96 mb-8">
              <GalleryTemplates
                template={gallery.template || 'layout-3'}
                images={images}
                videoUrl={gallery.videoLink}
                className="w-full h-full"
              />
            </div>
            
            {/* Additional Gallery Info */}
            {gallery.virtualTourLink && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Virtual Tour</h3>
                <a
                  href={gallery.virtualTourLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Virtual Tour
                </a>
              </div>
            )}
            
            {gallery.floorPlansSupport && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Floor Plans</h3>
                <p className="text-gray-600">{gallery.floorPlansSupport}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
