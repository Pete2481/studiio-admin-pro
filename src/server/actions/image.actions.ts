import { ImageRepo, CreateImageData } from '../repos/image.repo';

const imageRepo = new ImageRepo();

export async function createImage(data: CreateImageData) {
  try {
    return await imageRepo.createImage(data);
  } catch (error) {
    console.error('Error creating image:', error);
    throw new Error('Failed to create image');
  }
}

export async function getImageById(id: string) {
  try {
    return await imageRepo.getImageById(id);
  } catch (error) {
    console.error('Error getting image:', error);
    throw new Error('Failed to get image');
  }
}

export async function getImagesByTenant(tenantId: string) {
  try {
    return await imageRepo.getImagesByTenant(tenantId);
  } catch (error) {
    console.error('Error getting images by tenant:', error);
    throw new Error('Failed to get images by tenant');
  }
}

export async function getImagesByUser(userId: string) {
  try {
    return await imageRepo.getImagesByUser(userId);
  } catch (error) {
    console.error('Error getting images by user:', error);
    throw new Error('Failed to get images by user');
  }
}

export async function updateImage(id: string, data: Partial<CreateImageData>) {
  try {
    return await imageRepo.updateImage(id, data);
  } catch (error) {
    console.error('Error updating image:', error);
    throw new Error('Failed to update image');
  }
}

export async function deleteImage(id: string) {
  try {
    return await imageRepo.deleteImage(id);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

export async function getImageUsageCount(imageId: string) {
  try {
    return await imageRepo.getImageUsageCount(imageId);
  } catch (error) {
    console.error('Error getting image usage count:', error);
    throw new Error('Failed to get image usage count');
  }
}
