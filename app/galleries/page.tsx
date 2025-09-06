"use client";
import { useState, useRef, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Edit, Trash2, Copy, Eye, Plus, Grid3X3, List, X, Upload, Search, CheckCircle } from "lucide-react";
import BookingDropdown from "@/components/BookingDropdown";
import PhotographerDropdown from "@/components/PhotographerDropdown";
import { LinkParser } from "@/lib/cloud-gallery/link-parser";
import { CloudGalleryGrid } from "@/components/CloudGalleryGrid";
import GalleryTemplates from "@/components/GalleryTemplates";

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

interface Agent {
  id: string;
  name: string;
  company: string;
  avatar: string;
}

const galleries: Gallery[] = [
  {
    id: "1",
    title: "Beachfront Villa",
    propertyAddress: "456 Coastal Highway",
    companyName: "Exclusive Events Ltd",
    image: "https://mediadrive.com.au/images/bg/1.jpg",
    agent: "John Smith",
    services: ["Photography", "Videography"],
    teamMember: "John Smith",
    template: "single-template",
    galleryHeader: "Luxury Beachfront Villa",
    imageFolderLink: "https://example.com/gallery1",
    videoLink: "https://example.com/video1",
    virtualTourLink: "https://example.com/tour1",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: "2",
    title: "Urban Loft Space",
    propertyAddress: "321 Industrial Blvd",
    companyName: "Luxury Travel Agency",
    image: "https://mediadrive.com.au/images/bg/2.jpg",
    agent: "Sarah Johnson",
    services: ["Photography", "Drone"],
    teamMember: "Sarah Johnson",
    template: "single-template",
    galleryHeader: "Modern Urban Loft",
    imageFolderLink: "https://example.com/gallery2",
    videoLink: "https://example.com/video2",
    virtualTourLink: "https://example.com/tour2",
    floorPlansSupport: "Available",
    restrictDownload: true,
    watermarkEnabled: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: "3",
    title: "Country Estate",
    propertyAddress: "567 Rural Route 1",
    companyName: "Premium Consulting Group",
    image: "https://mediadrive.com.au/images/bg/3.jpg",
    agent: "Mike Wilson",
    services: ["Photography", "Virtual Tour"],
    teamMember: "Mike Wilson",
    template: "single-template",
    galleryHeader: "Elegant Country Estate",
    imageFolderLink: "https://example.com/gallery3",
    videoLink: "https://example.com/video3",
    virtualTourLink: "https://example.com/tour3",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: "4",
    title: "Modern Office Complex",
    propertyAddress: "890 Business Park",
    companyName: "Elite Financial Services",
    image: "https://mediadrive.com.au/images/bg/4.jpg",
    agent: "Lisa Brown",
    services: ["Photography", "Floor Plans"],
    teamMember: "Lisa Brown",
    template: "single-template",
    galleryHeader: "Contemporary Office Space",
    imageFolderLink: "https://example.com/gallery4",
    videoLink: "https://example.com/video4",
    virtualTourLink: "https://example.com/tour4",
    floorPlansSupport: "Available",
    restrictDownload: true,
    watermarkEnabled: true,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: "5",
    title: "Luxury Penthouse",
    propertyAddress: "123 Skyline Drive",
    companyName: "Premium Real Estate",
    image: "https://mediadrive.com.au/images/bg/5.jpg",
    agent: "David Lee",
    services: ["Photography", "Videography", "Drone"],
    teamMember: "David Lee",
    template: "single-template",
    galleryHeader: "Exclusive Skyline Penthouse",
    imageFolderLink: "https://example.com/gallery5",
    videoLink: "https://example.com/video5",
    virtualTourLink: "https://example.com/tour5",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: "6",
    title: "Waterfront Condo",
    propertyAddress: "789 Harbor View",
    companyName: "Coastal Properties",
    image: "https://mediadrive.com.au/images/bg/6.jpg",
    agent: "Emma Davis",
    services: ["Photography", "Virtual Tour"],
    teamMember: "Emma Davis",
    template: "single-template",
    galleryHeader: "Stunning Waterfront Views",
    imageFolderLink: "https://example.com/gallery6",
    videoLink: "https://example.com/video6",
    virtualTourLink: "https://example.com/tour6",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')
  },
  {
    id: "7",
    title: "Mountain Retreat",
    propertyAddress: "456 Alpine Way",
    companyName: "Nature Homes",
    image: "https://mediadrive.com.au/images/bg/7.jpg",
    agent: "Tom Anderson",
    services: ["Photography", "Drone"],
    teamMember: "Tom Anderson",
    template: "single-template",
    galleryHeader: "Serene Mountain Getaway",
    imageFolderLink: "https://example.com/gallery7",
    videoLink: "https://example.com/video7",
    virtualTourLink: "https://example.com/tour7",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  },
  {
    id: "8",
    title: "City Center Apartment",
    propertyAddress: "321 Downtown Ave",
    companyName: "Urban Living",
    image: "https://mediadrive.com.au/images/bg/8.jpg",
    agent: "Rachel Green",
    services: ["Photography", "Floor Plans"],
    teamMember: "Rachel Green",
    template: "single-template",
    galleryHeader: "Downtown Living",
    imageFolderLink: "https://example.com/gallery8",
    videoLink: "https://example.com/video8",
    virtualTourLink: "https://example.com/tour8",
    floorPlansSupport: "Available",
    restrictDownload: true,
    watermarkEnabled: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: "9",
    title: "Garden Villa",
    propertyAddress: "567 Botanical Gardens",
    companyName: "Green Spaces",
    image: "https://mediadrive.com.au/images/bg/9.jpg",
    agent: "Chris Martin",
    services: ["Photography", "Virtual Tour"],
    teamMember: "Chris Martin",
    template: "single-template",
    galleryHeader: "Botanical Garden Villa",
    imageFolderLink: "https://example.com/gallery9",
    videoLink: "https://example.com/video9",
    virtualTourLink: "https://example.com/tour9",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: "10",
    title: "Historic Mansion",
    propertyAddress: "890 Heritage Lane",
    companyName: "Classic Properties",
    image: "https://mediadrive.com.au/images/bg/10.jpg",
    agent: "Anna White",
    services: ["Photography", "Videography", "Virtual Tour"],
    teamMember: "Anna White",
    template: "single-template",
    galleryHeader: "Historic Heritage Mansion",
    imageFolderLink: "https://example.com/gallery10",
    videoLink: "https://example.com/video10",
    virtualTourLink: "https://example.com/tour10",
    floorPlansSupport: "Available",
    restrictDownload: true,
    watermarkEnabled: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: "11",
    title: "Modern Townhouse",
    propertyAddress: "123 Contemporary St",
    companyName: "Modern Living",
    image: "https://mediadrive.com.au/images/bg/11.jpg",
    agent: "James Taylor",
    services: ["Photography", "Floor Plans"],
    teamMember: "James Taylor",
    template: "single-template",
    galleryHeader: "Contemporary Townhouse",
    imageFolderLink: "https://example.com/gallery11",
    videoLink: "https://example.com/video11",
    virtualTourLink: "https://example.com/tour11",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: "12",
    title: "Seaside Cottage",
    propertyAddress: "456 Ocean Drive",
    companyName: "Beach Homes",
    image: "https://mediadrive.com.au/images/bg/12.jpg",
    agent: "Maria Garcia",
    services: ["Photography", "Drone", "Virtual Tour"],
    teamMember: "Maria Garcia",
    template: "single-template",
    galleryHeader: "Charming Seaside Cottage",
    imageFolderLink: "https://example.com/gallery12",
    videoLink: "https://example.com/video12",
    virtualTourLink: "https://example.com/tour12",
    floorPlansSupport: "Available",
    restrictDownload: false,
    watermarkEnabled: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

const agents: Agent[] = [
  { id: "1", name: "John Smith", company: "Exclusive Events Ltd", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Sarah Johnson", company: "Luxury Travel Agency", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "3", name: "Mike Wilson", company: "Premium Consulting Group", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: "4", name: "Lisa Brown", company: "Elite Financial Services", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: "5", name: "David Lee", company: "Premium Real Estate", avatar: "https://i.pravatar.cc/40?img=5" },
  { id: "6", name: "Emma Davis", company: "Coastal Properties", avatar: "https://i.pravatar.cc/40?img=6" },
  { id: "7", name: "Tom Anderson", company: "Nature Homes", avatar: "https://i.pravatar.cc/40?img=7" },
  { id: "8", name: "Rachel Green", company: "Urban Living", avatar: "https://i.pravatar.cc/40?img=8" },
  { id: "9", name: "Chris Martin", company: "Green Spaces", avatar: "https://i.pravatar.cc/40?img=9" },
  { id: "10", name: "Anna White", company: "Classic Properties", avatar: "https://i.pravatar.cc/40?img=10" },
  { id: "11", name: "James Taylor", company: "Modern Living", avatar: "https://i.pravatar.cc/40?img=11" },
  { id: "12", name: "Maria Garcia", company: "Beach Homes", avatar: "https://i.pravatar.cc/40?img=12" }
];

export default function GalleriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState('');
  const agentDropdownRef = useRef<HTMLDivElement>(null);
  
  // Galleries state
  const [galleriesList, setGalleriesList] = useState<Gallery[]>(() => {
    // Load galleries from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('galleries');
      return saved ? JSON.parse(saved) : galleries;
    }
    return galleries;
  });
  
  // Cloud Gallery state
  const [imageFolderLink, setImageFolderLink] = useState('');
  const [detectedProvider, setDetectedProvider] = useState<{ name: string; icon: string; color: string } | null>(null);
  const [imageFolderLinkError, setImageFolderLinkError] = useState<string | null>(null);
  const [showCloudGalleryPreview, setShowCloudGalleryPreview] = useState(false);
  
  // Gallery form state
  const [galleryTitle, setGalleryTitle] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [restrictDownload, setRestrictDownload] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [teamMember, setTeamMember] = useState('');
  const [selectedPhotographers, setSelectedPhotographers] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('single-template'); // Default template
  const [galleryHeader, setGalleryHeader] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [virtualTourLink, setVirtualTourLink] = useState('');
  const [floorPlansSupport, setFloorPlansSupport] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUpdatingGallery, setIsUpdatingGallery] = useState(false);

  const filteredGalleries = galleriesList.filter(gallery =>
    gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gallery.agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
    agent.company.toLowerCase().includes(agentSearchQuery.toLowerCase())
  );



  const handleViewGallery = async (galleryId: string) => {
    const gallery = galleriesList.find(g => g.id === galleryId);
    if (!gallery) return;
    
    // Open the gallery preview modal with the gallery's image folder link
    setImageFolderLink(gallery.imageFolderLink);
    setGalleryTitle(gallery.title); // Set the gallery title for the header
    setSelectedAgent(gallery.agent); // Set the agent for the header
    setTeamMember(gallery.teamMember); // Set the team member for photographer display
    setDetectedProvider(LinkParser.getProviderDisplay('local')); // Assume local for now
    setImageFolderLinkError(null);
    setShowCloudGalleryPreview(true);
  };

  const handleEditGallery = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsUpdatingGallery(true);
    setGalleryTitle(gallery.title);
    setSelectedAgent(gallery.agent);
    setSelectedServices(gallery.services);
    setTeamMember(gallery.teamMember);
    setSelectedTemplate(gallery.template || 'single-template');
    
    // Parse teamMember string to set selectedPhotographers
    if (gallery.teamMember) {
      // Split by comma and trim whitespace, then map to photographer IDs
      // For now, we'll use the names as IDs since we don't have a mapping
      const photographerNames = gallery.teamMember.split(',').map(name => name.trim());
      // This is a simplified approach - in a real app you'd want to map names to IDs
      setSelectedPhotographers(photographerNames);
    } else {
      setSelectedPhotographers([]);
    }
    
    setGalleryHeader(gallery.galleryHeader);
    setImageFolderLink(gallery.imageFolderLink);
    setVideoLink(gallery.videoLink || '');
    setVirtualTourLink(gallery.virtualTourLink || '');
    setFloorPlansSupport(gallery.floorPlansSupport || '');
    setRestrictDownload(gallery.restrictDownload);
    setWatermarkEnabled(gallery.watermarkEnabled);
    setIsAddGalleryOpen(true);
  };

  const handleCopyURL = (galleryId: string) => {
    const gallery = galleriesList.find(g => g.id === galleryId);
    if (!gallery) return;
    
    const galleryUrl = `${window.location.origin}/gallery/${galleryId}`;
    navigator.clipboard.writeText(galleryUrl);
    
    // Show a brief success message
    alert('Gallery URL copied to clipboard!');
  };

  const handleDeleteGallery = (galleryId: string) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      setGalleriesList(prev => {
        const updatedList = prev.filter(g => g.id !== galleryId);
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('galleries', JSON.stringify(updatedList));
        }
        return updatedList;
      });
    }
  };

  const handleSaveGallery = async () => {
    // Validation - ensure all required fields are filled
    if (!galleryTitle.trim()) {
      alert('Please enter a Booking Title');
      return;
    }
    if (!selectedAgent) {
      alert('Please select a Client/Agent');
      return;
    }
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    if (selectedPhotographers.length === 0) {
      alert('Please select at least one photographer');
      return;
    }
    if (!galleryHeader.trim()) {
      alert('Please enter a Gallery Header');
      return;
    }
    if (!imageFolderLink.trim()) {
      alert('Please provide an Image Folder Link');
      return;
    }

    if (editingGallery) {
      // Update existing gallery
      const updateGallery = async () => {
        let imageData = editingGallery.image;
        
        if (uploadedFiles.length > 0) {
          try {
            imageData = await fileToCompressedBase64(uploadedFiles[0]);
          } catch (error) {
            console.error('Failed to convert image to base64:', error);
            imageData = editingGallery.image; // Keep existing image if conversion fails
          }
        }

        const updatedGallery: Gallery = {
          ...editingGallery,
          title: galleryTitle,
          propertyAddress: galleryTitle,
          companyName: selectedAgent,
          image: imageData,
          agent: selectedAgent,
          services: selectedServices,
          teamMember: selectedPhotographers.join(', '),
          template: selectedTemplate,
          galleryHeader: galleryHeader,
          imageFolderLink: imageFolderLink,
          videoLink: videoLink || undefined,
          virtualTourLink: virtualTourLink || undefined,
          floorPlansSupport: floorPlansSupport || undefined,
          restrictDownload: restrictDownload,
          watermarkEnabled: watermarkEnabled,
          updatedAt: new Date()
        };
        
        console.log("Updating gallery with template:", selectedTemplate);
        console.log("Updated gallery object:", updatedGallery);
        
        // Update galleries list
        setGalleriesList(prev => {
          const updatedList = prev.map(g => g.id === editingGallery.id ? updatedGallery : g);
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('galleries', JSON.stringify(updatedList));
          }
          return updatedList;
        });
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
        
        // Close modal and reset form after successful update
        setIsAddGalleryOpen(false);
        setEditingGallery(null);
        handleCloseAddGallery();
      };

      updateGallery();
    } else {
      // Create new gallery object
      const createGallery = async () => {
        let imageData = 'https://mediadrive.com.au/images/bg/default.jpg'; // Default image
        
        if (uploadedFiles.length > 0) {
          try {
            imageData = await fileToCompressedBase64(uploadedFiles[0]);
          } catch (error) {
            console.error('Failed to convert image to base64:', error);
            imageData = 'https://mediadrive.com.au/images/bg/default.jpg'; // Use default if conversion fails
          }
        }

        const newGallery: Gallery = {
          id: Date.now().toString(), // Generate unique ID
          title: galleryTitle,
          propertyAddress: galleryTitle, // Use title as address for now
          companyName: selectedAgent, // Use agent as company for now
          image: imageData,
          agent: selectedAgent,
          services: selectedServices,
          teamMember: selectedPhotographers.join(', '),
          template: selectedTemplate,
          galleryHeader: galleryHeader,
          imageFolderLink: imageFolderLink,
          videoLink: videoLink || undefined,
          virtualTourLink: virtualTourLink || undefined,
          floorPlansSupport: floorPlansSupport || undefined,
          restrictDownload: restrictDownload,
          watermarkEnabled: watermarkEnabled,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        console.log("Creating new gallery with template:", selectedTemplate);
        console.log("New gallery object:", newGallery);
        
        // Add to galleries list
        setGalleriesList(prev => {
          const updatedList = [newGallery, ...prev];
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('galleries', JSON.stringify(updatedList));
          }
          return updatedList;
        });
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      };

      createGallery();
    }
    
    // Reset form
    setGalleryTitle('');
    setSelectedServices([]);
    setUploadedFiles([]);
    setRestrictDownload(false);
    setWatermarkEnabled(false);
    setTeamMember('');
    setSelectedPhotographers([]);
    setSelectedTemplate('single-template'); // Reset to default template
    setGalleryHeader('');
    setVideoLink('');
    setVirtualTourLink('');
    setFloorPlansSupport('');
    setImageFolderLink('');
    setDetectedProvider(null);
    setImageFolderLinkError(null);
    
    setIsAddGalleryOpen(false);
    setEditingGallery(null);
    setSelectedAgent('');
  };

  const handleCloseAddGallery = () => {
    setIsAddGalleryOpen(false);
    setEditingGallery(null);
    setIsUpdatingGallery(false);
    setSelectedAgent('');
    
    // Reset form
    setGalleryTitle('');
    setSelectedServices([]);
    setUploadedFiles([]);
    setRestrictDownload(false);
    setWatermarkEnabled(false);
    setTeamMember('');
    setSelectedPhotographers([]);
    setSelectedTemplate('single-template'); // Reset to default template
    setGalleryHeader('');
    setVideoLink('');
    setVirtualTourLink('');
    setFloorPlansSupport('');
    setImageFolderLink('');
    setDetectedProvider(null);
    setImageFolderLinkError(null);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Convert file to compressed base64 for persistence
  const fileToCompressedBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 300x300 for thumbnail)
        const maxSize = 300;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression (0.7 quality)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };
  
  const handleWatermarkToggle = (enabled: boolean) => {
    setWatermarkEnabled(enabled);
  };

  const handleServiceSelection = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...imageFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Cloud Gallery handlers
  const handleImageFolderLinkBlur = () => {
    if (!imageFolderLink.trim()) {
      setDetectedProvider(null);
      setImageFolderLinkError(null);
      return;
    }

    try {
      const parsed = LinkParser.parse(imageFolderLink.trim());
      if (parsed) {
        setDetectedProvider(LinkParser.getProviderDisplay(parsed.provider));
        setImageFolderLinkError(null);
      } else {
        setDetectedProvider(null);
        setImageFolderLinkError('Invalid folder link. Please use a Dropbox, Google Drive folder link, or local folder path.');
      }
    } catch (error) {
      setDetectedProvider(null);
      setImageFolderLinkError('Failed to parse folder link. Please check the URL format.');
    }
  };

  // Close agent dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target as Node)) {
        setIsAgentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Galleries</h1>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Add Gallery Button */}
            <button
              onClick={() => {
                setIsAddGalleryOpen(true);
                setIsUpdatingGallery(false);
                // Reset form for new gallery
                setGalleryTitle('');
                setSelectedServices([]);
                setUploadedFiles([]);
                setRestrictDownload(false);
                setWatermarkEnabled(false);
                setTeamMember('');
        setSelectedPhotographers([]);
                setGalleryHeader('');
                setVideoLink('');
                setVirtualTourLink('');
                setFloorPlansSupport('');
                setImageFolderLink('');
                setDetectedProvider(null);
                setImageFolderLinkError(null);
                setSelectedAgent('');
              }}
              className="btn bg-[#ebfbf2] text-green-700 hover:bg-green-100 border-green-300"
            >
              <Plus size={16} className="mr-2" />
              Add Gallery
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {isUpdatingGallery ? 'Gallery updated successfully!' : 'Gallery created successfully!'}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {isUpdatingGallery 
                    ? 'Your gallery has been updated with the new information.' 
                    : 'Your new gallery has been saved and is ready to use.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search galleries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Galleries Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGalleries.map((gallery) => (
              <div key={gallery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                {/* Gallery Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={gallery.image} 
                    alt={gallery.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.className = 'h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl';
                      e.currentTarget.parentElement!.textContent = '🏠';
                    }}
                  />
                </div>
                
                {/* Gallery Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{gallery.propertyAddress}</p>
                  <p className="text-sm text-gray-500 mb-2">{gallery.companyName}</p>
                  
                  {/* Services */}
                  {gallery.services && gallery.services.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {gallery.services.slice(0, 3).map((service, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {gallery.services.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{gallery.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Team Member */}
                  {gallery.teamMember && (
                    <p className="text-xs text-gray-500 mb-3">
                      📸 {gallery.teamMember}
                    </p>
                  )}
                  
                  {/* Action Icons */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditGallery(gallery)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleCopyURL(gallery.id)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Copy URL"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleViewGallery(gallery.id)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                      title="View Gallery"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(gallery.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGalleries.map((gallery) => (
                  <tr key={gallery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-110" 
                            src={gallery.image} 
                            alt={gallery.title}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.className = 'h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg';
                              e.currentTarget.parentElement!.textContent = '🏠';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gallery.propertyAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gallery.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gallery.agent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditGallery(gallery)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleCopyURL(gallery.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleViewGallery(gallery.id)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                          title="View Gallery"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Gallery Slide-out */}
      {isAddGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingGallery ? 'Edit Gallery' : 'Add Gallery'}
                </h2>
                <button
                  onClick={handleCloseAddGallery}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveGallery(); }} className="space-y-6">
                {/* Select Client/Agent */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client <span className="text-red-500">Agent</span>
                  </label>
                  <div className="relative" ref={agentDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                    >
                      <span className={selectedAgent ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedAgent || 'Select Client...'}
                      </span>
                      <Plus size={16} className="text-gray-400" />
                    </button>

                    {isAgentDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              placeholder="Search agents..."
                              value={agentSearchQuery}
                              onChange={(e) => setAgentSearchQuery(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-auto">
                          {filteredAgents.map((agent) => (
                            <button
                              key={agent.id}
                              type="button"
                              onClick={() => {
                                setSelectedAgent(agent.name);
                                setIsAgentDropdownOpen(false);
                                setAgentSearchQuery('');
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                            >
                              <img
                                src={agent.avatar}
                                alt={agent.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                <div className="text-xs text-gray-500">{agent.company}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Title</label>
                  <BookingDropdown
                    value={galleryTitle}
                    onChange={(bookingId) => {
                      // Find the selected booking and set the title
                      try {
                        const savedEvents = localStorage.getItem("studiio.events.v2");
                        if (savedEvents) {
                          const parsedEvents = JSON.parse(savedEvents);
                          const selectedBooking = parsedEvents.find((b: any) => b.id === bookingId);
                          if (selectedBooking) {
                            setGalleryTitle(selectedBooking.title);
                            // Also set the address if available
                            if (selectedBooking.address) {
                              // You might want to add an address field to the form
                              console.log("Selected booking address:", selectedBooking.address);
                            }
                          }
                        }
                      } catch (error) {
                        console.error("Error loading booking:", error);
                      }
                    }}
                    placeholder="Select a recent booking..."
                  />
                </div>

                {/* Select Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Services</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                    >
                      <span className={selectedServices.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedServices.length > 0 ? selectedServices.join(', ') : 'Select Services...'}
                      </span>
                      <Plus size={16} className="text-gray-400" />
                    </button>
                    
                    {isServicesDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              placeholder="Search services..."
                              className="w-full pl-8 pr-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-auto">
                          {['Photography', 'Videography', 'Drone', 'Virtual Tour', 'Floor Plans', 'Marketing'].map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => {
                                handleServiceSelection(service);
                                setIsServicesDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                            >
                              <div className="text-sm font-medium text-gray-900">{service}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Select Template Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Template Style</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="single-template">Professional Gallery - Clean, modern gallery layout with responsive grid</option>
                    <option value="3x-layout">3x Layout - Same style but 3 images across, full size, no cropping, with scroll</option>
                    <option value="2x-layout">2x Layout - Same style but 2 images across, full size, no cropping, with scroll</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose how your gallery images will be displayed
                  </p>
                  
                  {/* Template Preview Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (galleryTitle && imageFolderLink) {
                        setShowCloudGalleryPreview(true);
                      } else {
                        alert('Please enter a gallery title and image folder link first to preview the template.');
                      }
                    }}
                    className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                  >
                    👁️ Preview Template Layout
                  </button>
                  
                  {/* Template Preview Section */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Template Preview:</h4>
                    <div className="h-32 border rounded-lg overflow-hidden">
                      <GalleryTemplates
                        template={selectedTemplate}
                        images={[]} // Empty array for preview
                        videoUrl={undefined}
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This shows how your gallery will look with the selected template
                    </p>
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                      const files = Array.from(e.dataTransfer.files);
                      const imageFiles = files.filter(file => file.type.startsWith('image/'));
                      if (imageFiles.length > 0) {
                        setUploadedFiles(prev => [...prev, ...imageFiles]);
                      }
                    }}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-500 font-medium">Upload files</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    <p className="text-xs text-blue-600 mt-1">First image will be used as gallery thumbnail</p>
                    
                    {/* Show uploaded files with previews */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">Uploaded files ({uploadedFiles.length}):</p>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={file.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span className="text-xs text-gray-700 truncate flex-1">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleFileRemove(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Restrict clients download option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="restrict-download"
                    checked={restrictDownload}
                    onChange={(e) => setRestrictDownload(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="restrict-download" className="ml-2 block text-sm text-gray-700">
                    Restrict clients download option (Optional)
                  </label>
                </div>

                {/* Watermark enabled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Watermark enabled</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleWatermarkToggle(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !watermarkEnabled 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWatermarkToggle(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        watermarkEnabled 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {/* Select Photographers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Photographers</label>
                  <PhotographerDropdown
                    value={selectedPhotographers}
                    onChange={setSelectedPhotographers}
                    placeholder="Select photographers for this gallery..."
                    multiple={true}
                  />
                </div>

                {/* Gallery Header */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Header</label>
                  <input
                    type="text"
                    value={galleryHeader}
                    onChange={(e) => setGalleryHeader(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Gallery Header"
                  />
                </div>

                {/* Gallery Links Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Links</h3>
                  
                  {/* Image Folder Link */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Folder Link</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={imageFolderLink}
                        onChange={(e) => setImageFolderLink(e.target.value)}
                        onBlur={handleImageFolderLinkBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Paste Dropbox, Google Drive, or local folder path..."
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Plus size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Paste a Dropbox or Google Drive folder link, or use a local folder path (e.g., /path/to/images)
                    </p>
                    
                    {/* Provider Detection Badge */}
                    {detectedProvider && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-sm px-2 py-1 rounded-full ${detectedProvider.color}`}>
                          {detectedProvider.icon} {detectedProvider.name}
                        </span>
                        <span className="text-xs text-gray-500">Provider detected</span>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {imageFolderLinkError && (
                      <p className="text-xs text-red-500 mt-1">{imageFolderLinkError}</p>
                    )}
                    
                    {/* Test Gallery Button */}
                    {imageFolderLink && detectedProvider && !imageFolderLinkError && (
                      <button
                        type="button"
                        onClick={() => setShowCloudGalleryPreview(true)}
                        className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Preview Cloud Gallery
                      </button>
                    )}
                  </div>

                  {/* Video Link */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Link</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Video Link"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Plus size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Video Link</p>
                  </div>

                  {/* Virtual Tour Link */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Tour Link</label>
                    <input
                      type="text"
                      value={virtualTourLink}
                      onChange={(e) => setVirtualTourLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Virtual Tour Link"
                    />
                    <p className="text-xs text-gray-500 mt-1">Virtual Tour Link</p>
                  </div>

                  {/* Interactive Floor Plans Support */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interactive Floor Plans Support</label>
                    <input
                      type="text"
                      value={floorPlansSupport}
                      onChange={(e) => setFloorPlansSupport(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Interactive Floor Plans Support"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveGallery}
                    className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    {editingGallery ? 'Update Gallery' : 'Save Gallery'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAddGallery}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Gallery Preview Modal */}
      {showCloudGalleryPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cloud Gallery Preview</h3>
                <button
                  onClick={() => setShowCloudGalleryPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Previewing images from: {imageFolderLink}
              </p>
            </div>
            
            <div className="p-6 h-full overflow-y-auto">
              <CloudGalleryGrid 
                folderLink={imageFolderLink} 
                photographer={selectedPhotographers.length > 0 ? selectedPhotographers[1] : 'John Smith'}
                galleryName={galleryTitle || 'Gallery'}
                agentName={selectedAgent || 'Agent'}
                companyName={agents.find(a => a.id === selectedAgent)?.company || 'Company'}
                template={selectedTemplate} // Pass the selected template
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}
      
              {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{editingGallery ? 'Gallery updated successfully!' : 'Gallery created successfully!'}</span>
            </div>
          </div>
        )}

        {/* Test Buttons */}
        <div className="fixed bottom-4 right-4 space-y-2">
          <button
            onClick={() => {
              setImageFolderLink('/Volumes/2T SSD/Dropbox/Dropbox/Real Estate Clients 2025/Sothebys Byron Bay 2025/248 Seven Mile Beach Road');
              setGalleryTitle('Byron Bay Beach House Gallery');
              setSelectedAgent('agent1');
              setTeamMember('John Smith');
              setSelectedPhotographers(['1']); // John Smith's ID
              setSelectedTemplate('single-template'); // Video Center Layout
              setDetectedProvider(LinkParser.getProviderDisplay('local'));
              setImageFolderLinkError(null);
              setShowCloudGalleryPreview(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors w-full"
          >
            Test Local Gallery
          </button>
          
          <button
            onClick={() => {
              // Pre-fill form with sample data for testing
              setGalleryTitle('Test Gallery 1');
              setSelectedAgent('agent1');
              setSelectedServices(['Photography', 'Videography']);
              setTeamMember('John Smith');
              setSelectedPhotographers(['1', '2']); // John Smith and Sarah Johnson
              setSelectedTemplate('single-template'); // Asymmetrical Grid
              setGalleryHeader('Beautiful Beach House');
              setImageFolderLink('/Volumes/2T SSD/Dropbox/Dropbox/Real Estate Clients 2025/Sothebys Byron Bay 2025/248 Seven Mile Beach Road');
              setVideoLink('https://example.com/video1');
              setVirtualTourLink('https://example.com/tour1');
              setFloorPlansSupport('Available');
              setIsAddGalleryOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors w-full"
          >
            Pre-fill Test Data
          </button>
        </div>
    </PageLayout>
  );
}

