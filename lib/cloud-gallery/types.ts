export interface CloudImage {
  id: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  modifiedAt?: string;
  size?: number;
  mimeType?: string;
}

export interface CloudGalleryProvider {
  listImages(): Promise<CloudImage[]>;
  getImageUrl(imageId: string): Promise<string>;
  getThumbnailUrl(imageId: string): Promise<string>;
}
