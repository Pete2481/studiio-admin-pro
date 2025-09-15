"use client";
import { useState, useRef } from "react";
import { Upload, X, Camera } from "lucide-react";

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  tenantId: string;
  uploadedBy: string;
  disabled?: boolean;
}

export default function ProfilePhotoUpload({
  currentPhoto,
  onPhotoChange,
  tenantId,
  uploadedBy,
  disabled = false
}: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size (2MB limit for profile photos)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 2MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tenantId', tenantId);
      formData.append('uploadedBy', uploadedBy);
      formData.append('altText', `Profile photo for photographer`);

      console.log('Uploading file:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        tenantId,
        uploadedBy
      });

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Upload response:', result);

      if (result.success && result.image) {
        onPhotoChange(result.image.url);
        setError(null);
        console.log('Upload successful:', result.image.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentPhoto || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChangePhoto = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleResetPhoto = () => {
    setPreview(currentPhoto || null);
    onPhotoChange(currentPhoto || null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Photo Display */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        {/* Upload overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-white animate-pulse" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleChangePhoto}
          disabled={disabled || isUploading}
          className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Change'}
        </button>
        
        {preview && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={disabled || isUploading}
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {currentPhoto && preview !== currentPhoto && (
          <button
            type="button"
            onClick={handleResetPhoto}
            disabled={disabled || isUploading}
            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm text-center max-w-xs">
          {error}
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        Upload a profile photo (JPEG, PNG, GIF, WebP up to 2MB)
      </div>
    </div>
  );
}
