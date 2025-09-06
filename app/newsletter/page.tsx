"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Topbar from "@/components/Topbar";
import { Mail, Send, Eye, ChevronDown, ChevronLeft, ChevronRight, X, Plus, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, List, ListOrdered, Link, Smile, Copy, Upload, Calendar } from "lucide-react";
import { newsletterApi, Newsletter, NewsletterContent } from "@/src/client/api/newsletters";
import { imageApi, Image } from "@/src/client/api/images";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'heading' | 'button' | 'divider';
  content: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  order: number;
  metadata?: string;
}

const mockClients: Client[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", company: "Portrait Studio" },
  { id: "2", name: "TechCorp Inc.", email: "contact@techcorp.com", company: "TechCorp Inc." },
  { id: "3", name: "Fashion Forward", email: "info@fashionforward.com", company: "Fashion Forward" },
  { id: "4", name: "Emily & David", email: "wedding@example.com", company: "Wedding Planning" },
  { id: "5", name: "Real Estate Pro", email: "sales@realestatepro.com", company: "Real Estate Pro" },
  { id: "6", name: "Mike Chen", email: "mike@example.com", company: "Event Services" },
  { id: "7", name: "Lisa Rodriguez", email: "lisa@example.com", company: "Property Management" },
];

const contentBlocks = [
  { type: 'text', icon: 'T', label: 'Text' },
  { type: 'image', icon: '🏔️', label: 'Image' },
  { type: 'heading', icon: 'H', label: 'Heading' },
  { type: 'button', icon: '⬜', label: 'Button' },
  { type: 'divider', icon: '➖', label: 'Divider' },
];

export default function NewsletterPage() {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("Important Update Regarding Bookings This Week");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviousNewsletterPreview, setIsPreviousNewsletterPreview] = useState(false);
  const [previousNewsletterData, setPreviousNewsletterData] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: 'sample-1',
      type: 'heading',
      content: 'Important Update Regarding Bookings This Week',
      position: { x: 0, y: 0 },
      width: 800,
      height: 60,
      order: 0,
    },
    {
      id: 'sample-2',
      type: 'text',
      content: 'We wanted to provide you with an update regarding bookings this week. Due to the recent run of wet weather, our team is working hard to catch up on a backlog of jobs.\n\nAs a result, our photographers may be running slightly ahead of schedule or slightly behind.\n\nTo help manage expectations, please let your vendors know the following:\n\n• If we are running early, the photographer may arrive up to 30 minutes before the scheduled booking time.\n• If we are running late, the photographer may arrive up to 30 minutes after the scheduled booking time.\n\nOur priority is ensuring that every booking receives the attention and time it requires.\n\nThank you for your cooperation and for keeping your vendors informed.\n\nKind regards,\nMedia Drive Team',
      position: { x: 0, y: 0 },
      width: 800,
      height: 300,
      order: 1,
    }
  ]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'blocks' | 'body' | 'previous'>('content');
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [savedNewsletters, setSavedNewsletters] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [showAllNewsletters, setShowAllNewsletters] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'John Smith', email: 'john@example.com', company: 'company1' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', company: 'company1' },
    { id: '3', name: 'Mike Davis', email: 'mike@example.com', company: 'company2' },
    { id: '4', name: 'Lisa Wilson', email: 'lisa@example.com', company: 'company2' },
    { id: '5', name: 'David Brown', email: 'david@example.com', company: 'company3' },
  ]);
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Load existing newsletters from database on component mount
  useEffect(() => {
    console.log('🔄 Component mounted, loading newsletters...');
    // Add a small delay to ensure everything is ready
    setTimeout(() => {
      loadExistingNewsletters();
    }, 1000);
  }, []);

  // Function to load existing newsletters from database
  const loadExistingNewsletters = async () => {
    try {
      console.log('🔄 Loading existing newsletters from database...');
      console.log('🔄 Using tenant ID: cmey7fmyt0001i1yk8smaasls');
      
      const result = await newsletterApi.getNewslettersByTenant('cmey7fmyt0001i1yk8smaasls');
      console.log('📡 API result:', result);
      
      if (result.success && result.data) {
        console.log('✅ Loaded newsletters from database:', result.data);
        console.log('📊 Number of newsletters:', result.data.length);
        
        // Transform database newsletters to saved newsletters format
        const existingNewsletters = result.data.map((newsletter: any) => ({
          id: newsletter.id,
          subject: newsletter.subject,
          status: newsletter.status || 'DRAFT',
          sentAt: newsletter.sentAt,
          scheduledFor: newsletter.scheduledFor,
          recipientCount: newsletter.recipients?.length || 0,
          content: newsletter.content || [],
          createdAt: newsletter.createdAt,
          title: newsletter.title
        }));
        
        console.log('🔄 Setting saved newsletters state:', existingNewsletters);
        setSavedNewsletters(existingNewsletters);
        console.log('✅ Transformed newsletters:', existingNewsletters);
        
        // Populate imagePreviews for database image references
        const newImagePreviews: Record<string, string> = {};
        existingNewsletters.forEach(newsletter => {
          newsletter.content.forEach((block: any) => {
            if (block.type === 'image' && block.content && block.content.startsWith('{')) {
              try {
                const imageData = JSON.parse(block.content);
                // Create a preview URL for the uploaded image
                newImagePreviews[block.id] = `/uploads/${imageData.filename}`;
              } catch (e) {
                console.log('Could not parse image content:', block.content);
              }
            }
          });
        });
        
        setImagePreviews(prev => ({ ...prev, ...newImagePreviews }));
        console.log('🖼️ Set image previews:', newImagePreviews);
      } else {
        console.log('⚠️ No newsletters found or error loading:', result);
        console.log('⚠️ Result success:', result.success);
        console.log('⚠️ Result data:', result.data);
      }
    } catch (error: any) {
      console.error('❌ Error loading existing newsletters:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
  };

  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const selectAllClients = () => {
    setSelectedClients(clients.map(client => client.id));
  };

  const deselectAllClients = () => {
    setSelectedClients([]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // Check if files are being dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        // Create a new image block and upload the image
        const newBlock: ContentBlock = {
          id: crypto.randomUUID(),
          type: 'image',
          content: 'Image placeholder',
          position: { x: 0, y: 0 },
          width: 800,
          height: 200,
          order: contentBlocks.length,
        };
        
        setContentBlocks(prev => [...prev, newBlock]);
        
        // Upload the image to the new block
        setTimeout(() => {
          handleImageFileUpload(file, newBlock.id);
        }, 100);
        
        return;
      }
    }
    
    // Handle content block drops (only if no files were dropped)
    const blockType = e.dataTransfer.getData('text/plain');
    if (blockType && !e.dataTransfer.files?.length) {
      // Prevent creating duplicate empty image blocks
      if (blockType === 'image') {
        const hasEmptyImageBlock = contentBlocks.some(block => 
          block.type === 'image' && 
          (block.content === 'Image placeholder' || block.content === '')
        );
        
        if (hasEmptyImageBlock) {
          console.log('Skipping duplicate empty image block');
          return;
        }
      }
      
      const newBlock: ContentBlock = {
        id: crypto.randomUUID(),
        type: blockType as ContentBlock['type'],
        content: blockType === 'text' ? 'Enter your email content here...' : 
                blockType === 'image' ? 'Image placeholder' : 
                blockType === 'heading' ? 'Enter heading...' :
                blockType === 'button' ? 'Click Me' :
                'Divider',
        position: { x: 0, y: 0 }, // Position handled by CSS layout
        width: 800, // Full width for unified layout
        height: blockType === 'image' ? 200 : 
                blockType === 'heading' ? 60 :
                blockType === 'button' ? 80 :
                blockType === 'divider' ? 40 : 120,
        order: contentBlocks.length,
      };
      
      setContentBlocks(prev => [...prev, newBlock]);
    }
  }, [contentBlocks.length]);

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('text/plain', blockType);
  };

  const removeBlock = (blockId: string) => {
    setContentBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  // Previous newsletter data
  const previousNewsletters = {
    'monthly-update': {
      id: 'monthly-update',
      subject: 'Monthly Update - January 2024',
      status: 'SENT',
      sentAt: '2024-01-15T10:00:00Z',
      recipientCount: 45,
      content: [
        { type: 'heading', content: 'Monthly Update - January 2024', position: { x: 50, y: 50 }, width: 400, height: 40, order: 0 },
        { type: 'text', content: 'Happy New Year! We hope 2024 brings you success and prosperity. Here\'s what\'s been happening this month:', position: { x: 50, y: 120 }, width: 400, height: 80, order: 1 },
        { type: 'divider', content: '', position: { x: 50, y: 220 }, width: 400, height: 20, order: 2 },
        { type: 'text', content: '• New product launches\n• Customer success stories\n• Industry insights and trends\n• Upcoming events and webinars', position: { x: 50, y: 260 }, width: 400, height: 100, order: 3 },
        { type: 'button', content: 'Read More', position: { x: 50, y: 380 }, width: 150, height: 50, order: 4 }
      ]
    },
    'holiday-offer': {
      id: 'holiday-offer',
      subject: 'Holiday Special Offer - Limited Time!',
      status: 'SENT',
      sentAt: '2023-12-20T14:00:00Z',
      recipientCount: 32,
      content: [
        { type: 'heading', content: '🎄 Holiday Special Offer', position: { x: 50, y: 50 }, width: 400, height: 40, order: 0 },
        { type: 'text', content: 'Spread the holiday cheer with our exclusive seasonal promotions!', position: { x: 50, y: 120 }, width: 400, height: 60, order: 1 },
        { type: 'divider', content: '', position: { x: 50, y: 200 }, width: 400, height: 20, order: 2 },
        { type: 'text', content: '🎁 25% off all services\n🎯 Free consultation\n🌟 Gift certificates available\n⏰ Offer ends December 31st', position: { x: 50, y: 240 }, width: 400, height: 100, order: 3 },
        { type: 'button', content: 'Claim Offer', position: { x: 50, y: 360 }, width: 150, height: 50, order: 4 }
      ]
    },
    'service-announcement': {
      id: 'service-announcement',
      subject: 'Exciting New Service Announcement',
      status: 'SENT',
      sentAt: '2023-11-10T09:00:00Z',
      recipientCount: 28,
      content: [
        { type: 'heading', content: '🚀 New Service Launch!', position: { x: 50, y: 50 }, width: 400, height: 40, order: 0 },
        { type: 'text', content: 'We\'re thrilled to announce our latest service offering that will revolutionize your experience.', position: { x: 50, y: 120 }, width: 400, height: 60, order: 1 },
        { type: 'divider', content: '', position: { x: 50, y: 200 }, width: 400, height: 20, order: 2 },
        { type: 'text', content: '✨ Advanced analytics dashboard\n🔒 Enhanced security features\n📱 Mobile-first design\n🎯 Personalized recommendations', position: { x: 50, y: 240 }, width: 400, height: 100, order: 3 },
        { type: 'button', content: 'Learn More', position: { x: 50, y: 360 }, width: 150, height: 50, order: 4 }
      ]
    },
    'success-story': {
      id: 'success-story',
      subject: 'Client Success Story - Amazing Results!',
      status: 'SENT',
      sentAt: '2023-10-25T11:00:00Z',
      recipientCount: 38,
      content: [
        { type: 'heading', content: '🏆 Client Success Story', position: { x: 50, y: 50 }, width: 400, height: 40, order: 0 },
        { type: 'text', content: 'We love sharing success stories from our amazing clients. Here\'s what they\'ve achieved:', position: { x: 50, y: 120 }, width: 400, height: 60, order: 1 },
        { type: 'divider', content: '', position: { x: 50, y: 200 }, width: 400, height: 20, order: 2 },
        { type: 'text', content: '📈 300% increase in productivity\n💰 50% cost reduction\n🎯 95% customer satisfaction\n🌟 Industry recognition awards', position: { x: 50, y: 240 }, width: 400, height: 100, order: 3 },
        { type: 'button', content: 'View Case Study', position: { x: 50, y: 360 }, width: 150, height: 50, order: 4 }
      ]
    },
    'summer-promotion': {
      id: 'summer-promotion',
      subject: 'Summer Promotion - Hot Deals Inside!',
      status: 'SENT',
      sentAt: '2023-09-05T15:00:00Z',
      recipientCount: 41,
      content: [
        { type: 'heading', content: '☀️ Summer Promotion', position: { x: 50, y: 50 }, width: 400, height: 40, order: 0 },
        { type: 'text', content: 'Beat the heat with our sizzling summer deals and special offers!', position: { x: 50, y: 120 }, width: 400, height: 60, order: 1 },
        { type: 'divider', content: '', position: { x: 50, y: 200 }, width: 400, height: 20, order: 2 },
        { type: 'text', content: '🔥 30% off summer packages\n🏖️ Early bird specials\n🎉 Referral bonuses\n📅 Limited time availability', position: { x: 50, y: 240 }, width: 400, height: 100, order: 3 },
        { type: 'button', content: 'Get Summer Deal', position: { x: 50, y: 360 }, width: 150, height: 50, order: 4 }
      ]
    }
  };

  const previewPreviousNewsletter = (newsletterId: string) => {
    const newsletter = previousNewsletters[newsletterId as keyof typeof previousNewsletters];
    if (newsletter) {
      setPreviousNewsletterData(newsletter);
      setIsPreviousNewsletterPreview(true);
    }
  };

  const reuseNewsletter = (newsletterId: string) => {
    const newsletter = previousNewsletters[newsletterId as keyof typeof previousNewsletters];
    if (newsletter) {
      // Clear current content and load the previous newsletter
      setContentBlocks(newsletter.content.map((block: any, index: number) => ({
        ...block,
        id: `reused-${index}-${Date.now()}`,
        position: { x: block.position.x, y: block.position.y }
      })));
      setEmailSubject(newsletter.subject);
      
      // Show success message with better styling
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span>✓</span>
          <span>Newsletter template loaded successfully!</span>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Remove after 3 seconds
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 3000);
    }
  };

  const handleImageFileUpload = async (file: File, blockId: string) => {
    try {
      setIsImageUploading(true);
      
      // Upload to server first
      const uploadedImage = await imageApi.uploadImage({
        file,
        tenantId: 'cmey7fmyt0001i1yk8smaasls', // Studiio Pro tenant
        uploadedBy: 'cmey7fmye0000i1ykthzrw0ji', // Master Admin user
        altText: file.name,
      });

      // Store the image reference in the database
      const imageReference = {
        id: uploadedImage.id,
        filename: uploadedImage.filename,
        path: uploadedImage.filename, // Use filename as path for now
        altText: uploadedImage.altText
      };

      // Update the image block content with the database reference
      updateBlockContent(blockId, JSON.stringify(imageReference));
      
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      
      // Store the preview URL temporarily for display
      setImagePreviews(prev => ({ ...prev, [blockId]: previewUrl }));
      
      setUploadedImages(prev => [uploadedImage, ...prev]);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span>✓</span>
          <span>Image uploaded successfully!</span>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 3000);

    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span>✗</span>
          <span>Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 5000);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImageUploading(true);
      
      // Find the image block that was clicked (by finding the file input's parent block)
      const fileInput = event.target;
      const blockId = fileInput.id.replace('image-upload-', '');
      
      // Upload to server first
      const uploadedImage = await imageApi.uploadImage({
        file,
        tenantId: 'cmey7fmyt0001i1yk8smaasls', // Studiio Pro tenant
        uploadedBy: 'cmey7fmye0000i1ykthzrw0ji', // Master Admin user
        altText: file.name,
      });

      // Store the image reference in the database
      const imageReference = {
        id: uploadedImage.id,
        filename: uploadedImage.filename,
        path: uploadedImage.filename, // Use filename as path for now
        altText: uploadedImage.altText
      };

      // Update the image block content with the database reference
      updateBlockContent(blockId, JSON.stringify(imageReference));
      
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      
      // Store the preview URL temporarily for display
      setImagePreviews(prev => ({ ...prev, [blockId]: previewUrl }));
      
      setUploadedImages(prev => [uploadedImage, ...prev]);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span>✓</span>
          <span>Image uploaded successfully!</span>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 3000);

    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span>✗</span>
          <span>Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 5000);
    } finally {
      setIsImageUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Auto-resize textarea function
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  // Handle text content change with auto-resize
  const handleTextContentChange = (blockId: string, content: string) => {
    updateBlockContent(blockId, content);
    
    // Auto-resize the textarea after content update
    setTimeout(() => {
      const textarea = document.querySelector(`textarea[data-block-id="${blockId}"]`) as HTMLTextAreaElement;
      if (textarea) {
        autoResizeTextarea(textarea);
        // Update block dimensions based on new height
        updateBlockDimensions(blockId, textarea.scrollHeight);
      }
    }, 0);
  };

  // Initialize textarea heights when content blocks change
  useEffect(() => {
    contentBlocks.forEach(block => {
      if (block.type === 'text') {
        setTimeout(() => {
          const textarea = document.querySelector(`textarea[data-block-id="${block.id}"]`) as HTMLTextAreaElement;
          if (textarea) {
            autoResizeTextarea(textarea);
          }
        }, 100);
      }
    });
  }, [contentBlocks]);

  // Update block dimensions based on content
  const updateBlockDimensions = (blockId: string, newHeight: number) => {
    setContentBlocks(prev => prev.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          height: Math.max(newHeight + 20, 60) // Add padding and minimum height
        };
      }
      return block;
    }));
  };

  const updateBlockContent = (blockId: string, content: string) => {
    setContentBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  const selectedClientsCount = selectedClients.length;
  const totalClientsCount = clients.length;

  // Load clients from database
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        // For now, use a mock tenant ID - in production this would come from auth context
        const result = await newsletterApi.getClientsByTenant('mock-tenant-id');
        if (result.success && result.data) {
          setClients(result.data.map(client => ({
            id: client.id,
            name: client.name,
            email: client.email || '',
            company: client.company?.name
          })));
        } else {
          // Fallback to mock data if API fails
          setClients(mockClients);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
        setClients(mockClients);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  // Save newsletter to database
  const saveNewsletter = async () => {
    if (!emailSubject.trim()) {
      alert('Please enter an email subject');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting newsletter save...');
      
      const newsletterInputData = {
        title: 'Newsletter',
        subject: emailSubject,
        tenantId: 'cmey7fmyt0001i1yk8smaasls', // Studiio Pro tenant
        createdBy: 'cmey7fmye0000i1ykthzrw0ji', // Master Admin user
      };

      console.log('Newsletter data:', newsletterInputData);
      const result = await newsletterApi.createNewsletter(newsletterInputData);
      console.log('Create newsletter result:', result);
      
      // Handle different response formats
      let newsletterResponseData = null;
      if (result.success && result.data) {
        newsletterResponseData = result.data;
      } else if ((result as any).id && (result as any).title) {
        // API returned the newsletter data directly
        newsletterResponseData = result as any;
      } else {
        console.error('Failed to save newsletter:', result.error);
        alert('Failed to save newsletter: ' + (result.error || 'Unknown error'));
        return;
      }
      
      if (newsletterResponseData) {
        setCurrentNewsletter(newsletterResponseData);
        console.log('Newsletter created, saving content blocks...');
        
        // Save content blocks
        for (let i = 0; i < contentBlocks.length; i++) {
          const block = contentBlocks[i];
          const contentBlockData = {
            newsletterId: newsletterResponseData.id,
            type: block.type,
            content: block.content,
            positionX: block.position.x,
            positionY: block.position.y,
            width: block.width,
            height: block.height,
            order: i,
          };
          console.log('Saving content block:', contentBlockData);
          const blockResult = await newsletterApi.addContentBlock(contentBlockData);
          console.log('Content block result:', blockResult);
          
          if (!blockResult.success) {
            console.error('Failed to save content block:', blockResult.error);
            alert('Warning: Some content blocks failed to save');
          }
        }

        // Save recipients
        if (selectedClients.length > 0) {
          const recipients = selectedClients.map(clientId => {
            const client = clients.find(c => c.id === clientId);
            return {
              newsletterId: newsletterResponseData.id,
              clientId,
              email: client?.email || '', // Get email from client data
            };
          });
          console.log('Saving recipients:', recipients);
          const recipientResult = await newsletterApi.addRecipients(recipients);
          console.log('Recipient result:', recipientResult);
          
          if (!recipientResult.success) {
            console.error('Failed to save recipients:', recipientResult.error);
            alert('Warning: Recipients failed to save');
          }
        }

        // Add the saved newsletter to the saved newsletters list
        const newSavedNewsletter = {
          id: newsletterResponseData.id,
          subject: emailSubject,
          status: 'DRAFT',
          sentAt: null,
          recipientCount: selectedClients.length,
          content: contentBlocks,
          createdAt: new Date().toISOString(),
        };
        
        setSavedNewsletters(prev => [newSavedNewsletter, ...prev]);
        
        alert('Newsletter saved successfully!');
        console.log('Newsletter saved successfully!');
        
        // Refresh the saved newsletters list from database
        await loadExistingNewsletters();
      }
    } catch (error) {
      console.error('Error saving newsletter:', error);
      alert('Failed to save newsletter: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Send newsletter
  const sendNewsletter = async () => {
    if (!currentNewsletter) {
      alert('Please save the newsletter first');
      return;
    }

    try {
      setIsLoading(true);
      const result = await newsletterApi.markNewsletterAsSent(currentNewsletter.id);
      if (result.success) {
        alert('Newsletter sent successfully!');
        setCurrentNewsletter(prev => prev ? { ...prev, status: 'SENT' } : null);
        
        // Refresh the saved newsletters list from database
        await loadExistingNewsletters();
      } else {
        alert('Failed to send newsletter: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  // Schedule newsletter
  const scheduleNewsletter = async () => {
    if (!currentNewsletter) {
      alert('Please save the newsletter first');
      return;
    }

    if (!scheduledDate) {
      alert('Please select a date to schedule the newsletter');
      return;
    }

    try {
      setIsLoading(true);
      const result = await newsletterApi.scheduleNewsletter(currentNewsletter.id, scheduledDate);
      if (result.success) {
        alert('Newsletter scheduled successfully for ' + new Date(scheduledDate).toLocaleDateString());
        setCurrentNewsletter(prev => prev ? { ...prev, scheduledFor: scheduledDate } : null);
        setIsScheduleModalOpen(false);
        setScheduledDate('');
        
        // Refresh the saved newsletters list from database
        await loadExistingNewsletters();
      } else {
        alert('Failed to schedule newsletter: ' + result.error);
      }
    } catch (error) {
      console.error('Error scheduling newsletter:', error);
      alert('Failed to schedule newsletter: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Edit newsletter
  const editNewsletter = (newsletterId: string) => {
    const newsletter = previousNewsletters[newsletterId as keyof typeof previousNewsletters];
    if (newsletter) {
      // Load the newsletter content into the editor
      setContentBlocks(newsletter.content.map((block: any, index: number) => ({
        ...block,
        id: `edit-${index}-${Date.now()}`,
        order: index,
      })));
      setEmailSubject(newsletter.subject);
      setCurrentNewsletter(newsletter as any);
      
      // Switch to content tab
      setActiveTab('content');
      
      alert('Newsletter loaded for editing. You can now modify and save it as a new newsletter.');
    }
  };

  // Preview saved newsletter
  const previewSavedNewsletter = (newsletter: any) => {
    setPreviousNewsletterData(newsletter);
    setIsPreviousNewsletterPreview(true);
  };

  // Reuse saved newsletter
  const reuseSavedNewsletter = (newsletter: any) => {
    // Load the newsletter content into the editor
    setContentBlocks(newsletter.content.map((block: any, index: number) => ({
      ...block,
      id: `reuse-${index}-${Date.now()}`,
      order: index,
    })));
    setEmailSubject(newsletter.subject);
    setCurrentNewsletter(newsletter);
    
    // Switch to content tab
    setActiveTab('content');
    
    alert('Saved newsletter loaded for editing. You can now modify and save it as a new newsletter.');
  };

  // Edit saved newsletter
  const editSavedNewsletter = (newsletter: any) => {
    // Load the newsletter content into the editor
    setContentBlocks(newsletter.content.map((block: any, index: number) => ({
      ...block,
      id: `edit-saved-${index}-${Date.now()}`,
      order: index,
    })));
    setEmailSubject(newsletter.subject);
    setCurrentNewsletter(newsletter);
    
    // Switch to content tab
    setActiveTab('content');
    
    alert('Saved newsletter loaded for editing. You can now modify and save it as a new newsletter.');
  };

  return (
    <PageLayout>
      <Topbar title="Newsletter" showImportExport={false} />
      
      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
            <div className="text-sm text-gray-500 mt-1">HOME / NEWSLETTER</div>
          </div>

          {/* Status Display */}
          {isLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                <span className="text-sm font-medium">Loading...</span>
              </div>
            </div>
          )}
          
          {currentNewsletter && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-sm font-medium">
                  Newsletter saved successfully! Status: {currentNewsletter.status}
                </span>
              </div>
            </div>
          )}

          {/* Sample Newsletter Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700">
              <strong>🎯 Quick Start Guide:</strong>
              <ul className="mt-2 space-y-1">
                <li>• <strong>Step 1:</strong> Select clients from the dropdown above</li>
                <li>• <strong>Step 2:</strong> Customize the email subject</li>
                <li>• <strong>Step 3:</strong> Drag content blocks from the right sidebar to the editor</li>
                <li>• <strong>Step 4:</strong> Click "Preview Email" to see how it looks</li>
                <li>• <strong>Step 5:</strong> Click "Save Newsletter" to save to database</li>
                <li>• <strong>Step 6:</strong> Click "Send Email" when ready to send</li>
              </ul>
            </div>
          </div>

          {/* Client Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Clients
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className={selectedClientsCount > 0 ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedClientsCount === 0 
                      ? 'Select...' 
                      : selectedClientsCount === totalClientsCount 
                        ? 'All Clients' 
                        : `${selectedClientsCount} client${selectedClientsCount > 1 ? 's' : ''} selected`
                    }
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isClientDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200">
                      <button
                        onClick={selectAllClients}
                        className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllClients}
                        className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Deselect All
                      </button>
                    </div>
                    {clients.map((client) => (
                      <label key={client.id} className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(client.id)}
                          onChange={() => handleClientSelection(client.id)}
                          className="mr-2"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email Subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email Content Editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded" title="Desktop Preview">
                  <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded" 
                  title="Live Preview"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => {
                  setContentBlocks([]);
                  setEmailSubject('');
                  setSelectedClients([]);
                  setCurrentNewsletter(null);
                  setImagePreviews({});
                  setShowAllNewsletters(false);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Newsletter
              </button>
            </div>
            
            <div
              ref={editorRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`min-h-[600px] border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                dragOver ? 'border-blue-400 bg-blue-50 scale-[1.02] shadow-lg' : 'border-gray-300 bg-white'
              }`}
            >
              {contentBlocks.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                  <p>Drag and drop content blocks from the right sidebar</p>
                  <p className="text-sm mt-1">or click on blocks to add them</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                  {/* Unified Email Content Display */}
                  <div className="space-y-6">
                    {contentBlocks
                      .sort((a, b) => a.order - b.order)
                      .map((block) => (
                        <div key={block.id} className="relative group">
                          {/* Block Controls - Only visible on hover */}
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                              <span className="text-xs text-gray-500 capitalize font-medium px-2 py-1 bg-gray-100 rounded">
                                {block.type}
                              </span>
                              <button
                                onClick={() => removeBlock(block.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                title="Remove block"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Content Display */}
                          {block.type === 'heading' && (
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                              {block.content || 'Heading'}
                            </h2>
                          )}
                          
                          {block.type === 'text' && (
                            <div className="prose prose-gray max-w-none">
                              <textarea
                                value={block.content}
                                onChange={(e) => handleTextContentChange(block.id, e.target.value)}
                                onInput={(e) => autoResizeTextarea(e.currentTarget)}
                                className="w-full text-base text-gray-700 leading-relaxed border-none outline-none resize-none bg-transparent min-h-[60px] font-normal"
                                data-block-id={block.id}
                                placeholder="Enter your email content here..."
                                style={{ fontFamily: 'inherit' }}
                              />
                            </div>
                          )}
                          
                          {block.type === 'image' && (
                            <div className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              {(block.content && (block.content.startsWith('data:image') || block.content.startsWith('blob:'))) || 
                               (block.content && block.content.startsWith('{') && imagePreviews[block.id]) ? (
                                // Show uploaded image
                                <div className="relative">
                                  <img 
                                    src={block.content.startsWith('{') ? imagePreviews[block.id] : block.content} 
                                    alt="Uploaded content" 
                                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm"
                                  />
                                  <button
                                    onClick={() => removeBlock(block.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                // Show upload interface
                                <div className="text-center text-gray-500">
                                  <ImageIcon className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                                  <p className="text-sm font-medium">Image: {block.content || 'Image Placeholder'}</p>
                                  <p className="text-xs mt-1 text-gray-400 mb-3">Click to upload or drag image here</p>
                                  
                                  {/* Hidden file input */}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id={`image-upload-${block.id}`}
                                  />
                                  
                                  {/* Upload button */}
                                  <button
                                    onClick={() => document.getElementById(`image-upload-${block.id}`)?.click()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
                                    disabled={isImageUploading}
                                  >
                                    {isImageUploading ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-3 h-3" />
                                        Upload Image
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {block.type === 'button' && (
                            <div className="text-center">
                              <button className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                {block.content || 'Button'}
                              </button>
                            </div>
                          )}
                          
                          {block.type === 'divider' && (
                            <div className="border-t-2 border-gray-200 my-6"></div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Eye className="w-4 h-4" />
              Preview Email
            </button>
            <button 
              onClick={saveNewsletter}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save Newsletter
                </>
                )}
            </button>
            <button 
              onClick={sendNewsletter}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              disabled={isLoading || !currentNewsletter}
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              disabled={isLoading || !currentNewsletter}
            >
              <Calendar className="w-4 h-4" />
              Schedule Send
            </button>
            
            {/* Test Gallery Button */}
            <button 
              onClick={() => window.location.href = '/gallery'}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              title="Test Gallery Page"
            >
              <ImageIcon className="w-4 h-4" />
              Test Gallery
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`w-80 bg-white border-l border-gray-200 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-80'
        }`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className={`font-semibold text-gray-900 transition-opacity ${
              isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              Content Blocks
            </h3>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {['content', 'blocks', 'body', 'previous'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'previous' ? 'Previous' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Blocks Grid */}
          {activeTab === 'content' && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {contentBlocks.map((block) => (
                  <div
                    key={block.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block.type)}
                    className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all text-center"
                  >
                    <div className="text-2xl mb-1">{(block as any).icon}</div>
                    <div className="text-xs text-gray-600">{(block as any).label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="p-4">
              <div className="space-y-2">
                <div 
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'text')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Text Block</span>
                  </div>
                  <p className="text-xs text-gray-500">Drag to add text content</p>
                </div>
                
                <div 
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'image')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Image Block</span>
                  </div>
                  <p className="text-xs text-gray-500">Drag to add images</p>
                </div>

                <div 
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'heading')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Heading Block</span>
                  </div>
                  <p className="text-xs text-gray-500">Drag to add headings</p>
                </div>

                <div 
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'button')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Button Block</span>
                  </div>
                  <p className="text-xs text-gray-500">Drag to add buttons</p>
                </div>

                <div 
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'divider')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Divider Block</span>
                  </div>
                  <p className="text-xs text-gray-500">Drag to add dividers</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'body' && (
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded" title="Bold">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Italic">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Underline">
                    <Underline className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded" title="Align Left">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Align Center">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Align Right">
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded" title="Bullet List">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Numbered List">
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Link">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" title="Emoji">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'previous' && (
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-700">Previous Newsletters</div>
                  <button
                    onClick={loadExistingNewsletters}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                    title="Refresh newsletters from database"
                  >
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Refresh
                  </button>
                </div>
                
                {/* Recently saved newsletters */}
                {savedNewsletters.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Recently Saved</div>
                    <div className="space-y-2">
                      {savedNewsletters
                        .slice(0, showAllNewsletters ? savedNewsletters.length : 5)
                        .map((newsletter, index) => (
                        <div key={newsletter.id} className="p-3 border border-blue-200 rounded-lg hover:bg-blue-50 bg-blue-50">
                          <div className="text-sm font-medium text-gray-900">{newsletter.subject}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {newsletter.recipientCount > 0 
                              ? `Saved for ${newsletter.recipientCount} clients` 
                              : 'No clients selected'
                            } • {new Date(newsletter.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">📝 Draft</div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <button 
                              onClick={() => previewSavedNewsletter(newsletter)}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Preview
                            </button>
                            <button 
                              onClick={() => reuseSavedNewsletter(newsletter)}
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Reuse
                            </button>
                            <button 
                              onClick={() => {
                                setCurrentNewsletter(newsletter);
                                setIsScheduleModalOpen(true);
                              }}
                              className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                              <Calendar className="w-3 h-3" />
                              Schedule
                            </button>
                            <button 
                              onClick={() => editSavedNewsletter(newsletter)}
                              className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors flex items-center gap-1"
                            >
                              <Type className="w-3 h-3" />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show All / Show Less button */}
                      {savedNewsletters.length > 5 && (
                        <div className="text-center pt-2">
                          <button
                            onClick={() => setShowAllNewsletters(!showAllNewsletters)}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            {showAllNewsletters ? 'Show Less' : `Show All (${savedNewsletters.length})`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Sample previous newsletters */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Template Examples</div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">Monthly Update - January 2024</div>
                    <div className="text-xs text-gray-500 mt-1">Sent to 45 clients • Jan 15, 2024</div>
                    <div className="text-xs text-green-600 mt-1">✓ Delivered</div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button 
                        onClick={() => previewPreviousNewsletter('monthly-update')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button 
                        onClick={() => reuseNewsletter('monthly-update')}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Reuse
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentNewsletter(previousNewsletters['monthly-update'] as any);
                          setIsScheduleModalOpen(true);
                        }}
                        className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Schedule
                      </button>
                      <button 
                        onClick={() => editNewsletter('monthly-update')}
                        className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors flex items-center gap-1"
                      >
                        <Type className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">Holiday Special Offer</div>
                    <div className="text-xs text-gray-500 mt-1">Sent to 32 clients • Dec 20, 2023</div>
                    <div className="text-xs text-green-600 mt-1">✓ Delivered</div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => previewPreviousNewsletter('holiday-offer')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button 
                        onClick={() => reuseNewsletter('holiday-offer')}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Reuse
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">New Service Announcement</div>
                    <div className="text-xs text-gray-500 mt-1">Sent to 28 clients • Nov 10, 2023</div>
                    <div className="text-xs text-green-600 mt-1">✓ Delivered</div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => previewPreviousNewsletter('service-announcement')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button 
                        onClick={() => reuseNewsletter('service-announcement')}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Reuse
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">Client Success Story</div>
                    <div className="text-xs text-gray-500 mt-1">Sent to 38 clients • Oct 25, 2023</div>
                    <div className="text-xs text-green-600 mt-1">✓ Delivered</div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => previewPreviousNewsletter('success-story')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button 
                        onClick={() => reuseNewsletter('success-story')}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Reuse
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">Summer Promotion</div>
                    <div className="text-xs text-gray-500 mt-1">Sent to 41 clients • Sep 5, 2023</div>
                    <div className="text-xs text-green-600 mt-1">✓ Delivered</div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => previewPreviousNewsletter('summer-promotion')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button 
                        onClick={() => reuseNewsletter('summer-promotion')}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Reuse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Newsletter Preview</h3>
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>To:</strong> {selectedClientsCount} client{selectedClientsCount !== 1 ? 's' : ''} selected
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Subject:</strong> {emailSubject || 'No subject'}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div className="max-w-2xl mx-auto">
                  {contentBlocks.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                      <p>No content blocks added yet</p>
                      <p className="text-sm mt-1">Add content blocks to see the preview</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contentBlocks
                        .sort((a, b) => a.order - b.order)
                        .map((block) => (
                          <div key={block.id} className="w-full">
                            {block.type === 'heading' && (
                              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                {block.content || 'Heading'}
                              </h2>
                            )}
                            
                            {block.type === 'text' && (
                              <div className="text-gray-700 leading-relaxed mb-4">
                                {block.content || 'Text content will appear here...'}
                              </div>
                            )}
                            
                            {block.type === 'image' && (
                              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                                <ImageIcon className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                <p className="text-gray-500">Image: {block.content}</p>
                              </div>
                            )}
                            
                            {block.type === 'button' && (
                              <div className="text-center mb-4">
                                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                  {block.content || 'Button'}
                                </button>
                              </div>
                            )}
                            
                            {block.type === 'divider' && (
                              <div className="border-t-2 border-gray-200 my-4"></div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous Newsletter Preview Modal */}
      {isPreviousNewsletterPreview && previousNewsletterData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Previous Newsletter Preview</h3>
                <button
                  onClick={() => setIsPreviousNewsletterPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Subject:</strong> {previousNewsletterData.subject}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Type:</strong> Previous Newsletter Template
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-4">
                    {previousNewsletterData.content.map((block: any, index: number) => (
                      <div key={index} className="w-full">
                        {block.type === 'heading' && (
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {block.content}
                          </h2>
                        )}
                        
                        {block.type === 'text' && (
                          <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                            {block.content}
                          </div>
                        )}
                        
                        {block.type === 'image' && (
                          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                            {block.content && block.content.startsWith('{') ? (
                              // Parse JSON image reference and display image
                              (() => {
                                try {
                                  const imageData = JSON.parse(block.content);
                                  return (
                                    <div>
                                      <img 
                                        src={`/uploads/${imageData.filename}`} 
                                        alt={imageData.altText || 'Newsletter image'} 
                                        className="max-w-full h-auto max-h-48 mx-auto rounded-lg shadow-sm mb-2"
                                        onError={(e) => {
                                          // Fallback to placeholder if image fails to load
                                          e.currentTarget.style.display = 'none';
                                          if (e.currentTarget.nextElementSibling) {
                                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                                          }
                                        }}
                                      />
                                      <div className="hidden">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                        <p className="text-gray-500">Image: {imageData.filename}</p>
                                      </div>
                                    </div>
                                  );
                                } catch (e) {
                                  // Fallback if JSON parsing fails
                                  return (
                                    <>
                                      <ImageIcon className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                      <p className="text-gray-500">Image: {block.content}</p>
                                    </>
                                  );
                                }
                              })()
                            ) : (
                              // Display as regular image content
                              <>
                                <ImageIcon className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                <p className="text-gray-500">Image: {block.content}</p>
                              </>
                            )}
                          </div>
                        )}
                        
                        {block.type === 'button' && (
                          <div className="text-center mb-4">
                            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                              {block.content}
                            </button>
                          </div>
                        )}
                        
                        {block.type === 'divider' && (
                          <div className="border-t-2 border-gray-200 my-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    reuseNewsletter(Object.keys(previousNewsletters).find(key => 
                      previousNewsletters[key as keyof typeof previousNewsletters] === previousNewsletterData
                    ) || '');
                    setIsPreviousNewsletterPreview(false);
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Send Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Newsletter</h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Send Date
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={scheduleNewsletter}
                disabled={!scheduledDate || isLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Scheduling...' : 'Schedule Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
