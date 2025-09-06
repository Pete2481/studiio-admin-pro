export interface Image {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  altText?: string;
  tenantId: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadImageData {
  file: File;
  tenantId: string;
  uploadedBy: string;
  altText?: string;
}

export const imageApi = {
  async uploadImage(data: UploadImageData): Promise<Image> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('tenantId', data.tenantId);
    formData.append('uploadedBy', data.uploadedBy);
    if (data.altText) {
      formData.append('altText', data.altText);
    }

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const result = await response.json();
    return result.image;
  },

  async getImagesByTenant(tenantId: string): Promise<Image[]> {
    const response = await fetch(`/api/images?tenantId=${tenantId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }

    const result = await response.json();
    return result.images;
  },

  async getImagesByUser(userId: string): Promise<Image[]> {
    const response = await fetch(`/api/images?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }

    const result = await response.json();
    return result.images;
  },

  async deleteImage(imageId: string): Promise<void> {
    const response = await fetch(`/api/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  },

  async updateImage(imageId: string, data: Partial<Image>): Promise<Image> {
    const response = await fetch(`/api/images/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update image');
    }

    const result = await response.json();
    return result.image;
  },
};
