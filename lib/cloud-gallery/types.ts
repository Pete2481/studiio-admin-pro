export interface CloudImage {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size?: number;
  type?: string;
  lastModified?: Date;
}

export interface CloudGalleryProvider {
  getImages(): Promise<CloudImage[]>;
  getImageUrl(imageId: string): Promise<string>;
  getThumbnailUrl(imageId: string): Promise<string>;
}
