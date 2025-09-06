import React, { useState, useEffect } from 'react';

interface EditRequest {
  id: string;
  galleryId: string;
  clientName: string;
  clientEmail: string;
  requestType: 'edit' | 'revision' | 'new_photos' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'approved' | 'completed';
  title: string;
  description: string;
  comments: string;
  tasks: string[];
  dueDate: string;
  selectedImageId?: string;
  selectedImageAlt?: string;
  selectedImageSrc?: string;
  submittedAt: Date;
  updatedAt: Date;
}

interface EditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryId: string;
  galleryTitle: string;
  images: Array<{ id: string; src: string; alt: string }>;
  selectedImage?: { id: string; src: string; alt: string } | null;
}

export default function EditRequestModal({ 
  isOpen, 
  onClose, 
  galleryId, 
  galleryTitle, 
  images,
  selectedImage
}: EditRequestModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    requestType: 'edit' as const,
    priority: 'medium' as const,
    title: '',
    description: '',
    comments: '',
    tasks: [''],
    dueDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        clientName: '',
        clientEmail: '',
        requestType: 'edit',
        priority: 'medium',
        title: '',
        description: '',
        comments: '',
        tasks: [''],
        dueDate: ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const updateTask = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the edit request object
      const editRequest: Omit<EditRequest, 'id' | 'submittedAt' | 'updatedAt'> = {
        galleryId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        requestType: formData.requestType,
        priority: formData.priority,
        status: 'pending',
        title: formData.title,
        description: formData.description,
        comments: formData.comments,
        tasks: formData.tasks.filter(task => task.trim() !== ''),
        dueDate: formData.dueDate,
        selectedImageId: selectedImage?.id,
        selectedImageAlt: selectedImage?.alt,
        selectedImageSrc: selectedImage?.src
      };

      // Save to localStorage (in a real app, this would go to a database)
      const existingRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
      const newRequest = {
        ...editRequest,
        id: Date.now().toString(),
        submittedAt: new Date(),
        updatedAt: new Date()
      };
      
      localStorage.setItem('editRequests', JSON.stringify([...existingRequests, newRequest]));

      // Also save to the main requests array for the admin panel
      const existingAdminRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const adminRequest = {
        id: newRequest.id,
        client: formData.clientName,
        type: formData.requestType === 'edit' ? 'Edit Request' : 
              formData.requestType === 'revision' ? 'Revision Request' :
              formData.requestType === 'new_photos' ? 'New Photos Request' : 'Other Request',
        status: 'Pending',
        priority: formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1),
        submitted: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : 'Not specified',
        description: formData.description,
        galleryId,
        galleryTitle,
        requestType: formData.requestType,
        comments: formData.comments,
        tasks: formData.tasks.filter(task => task.trim() !== ''),
        selectedImageId: selectedImage?.id,
        selectedImageAlt: selectedImage?.alt,
        selectedImageSrc: selectedImage?.src
      };

      localStorage.setItem('requests', JSON.stringify([...existingAdminRequests, adminRequest]));

      console.log('Edit request submitted:', newRequest);
      console.log('Admin request created:', adminRequest);

      // Show success message
      alert('Edit request submitted successfully! It will be reviewed by our team.');
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error submitting edit request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Edit Request</h2>
              <p className="text-sm text-gray-600 mt-1">
                Requesting changes for: {galleryTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type *
                    </label>
                    <select
                      required
                      value={formData.requestType}
                      onChange={(e) => handleInputChange('requestType', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="edit">Edit Photos</option>
                      <option value="revision">Revision Request</option>
                      <option value="new_photos">New Photos Needed</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level *
                    </label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your request"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please describe the changes you'd like to request..."
                />
              </div>

              {/* Tasks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Tasks
                </label>
                <div className="space-y-3">
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => updateTask(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Task ${index + 1}`}
                      />
                      {formData.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTask}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    + Add Another Task
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={3}
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional notes or special requests..."
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Gallery Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Gallery Information</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Gallery:</strong> {galleryTitle}</p>
                  <p><strong>Images:</strong> {images.length} photos</p>
                  <p><strong>Request ID:</strong> {galleryId}</p>
                  {selectedImage && (
                    <>
                      <p><strong>Selected Image:</strong> {selectedImage.alt}</p>
                      <p><strong>Image ID:</strong> {selectedImage.id}</p>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => window.open(selectedImage.src, '_blank')}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Image
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Edit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
