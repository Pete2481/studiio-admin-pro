import { ParsedLink } from '../link-parser';

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

export interface DropboxListResponse {
  entries: Array<{
    '.tag': string;
    name: string;
    id: string;
    client_modified?: string;
    size?: number;
    media_info?: {
      metadata?: {
        '.tag': string;
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
  }>;
  cursor?: string;
  has_more: boolean;
}

export class DropboxLister {
  private accessToken: string;
  private cache: Map<string, { images: CloudImage[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * List all image files in a shared Dropbox folder
   */
  async listImages(parsedLink: ParsedLink): Promise<CloudImage[]> {
    const cacheKey = `dropbox:${parsedLink.normalized}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached result if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[Dropbox] Returning cached result for ${parsedLink.normalized}`);
      return cached.images;
    }

    try {
      console.log(`[Dropbox] Fetching images from ${parsedLink.normalized}`);
      const startTime = Date.now();
      
      const images = await this.fetchAllImages(parsedLink.normalized);
      
      const duration = Date.now() - startTime;
      console.log(`[Dropbox] Fetched ${images.length} images in ${duration}ms`);
      
      // Cache the result
      this.cache.set(cacheKey, {
        images,
        timestamp: Date.now()
      });
      
      return images;
    } catch (error) {
      console.error('[Dropbox] Error listing images:', error);
      throw error;
    }
  }

  /**
   * Fetch all images from a shared folder, handling pagination
   */
  private async fetchAllImages(sharedLink: string): Promise<CloudImage[]> {
    const allImages: CloudImage[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.listSharedLinkFiles(sharedLink, cursor);
      
      // Filter for image files only
      const imageEntries = response.entries.filter(entry => 
        entry['.tag'] === 'file' && this.isImageFile(entry.name)
      );

      // Process image entries
      for (const entry of imageEntries) {
        try {
          const image = await this.processImageEntry(entry, sharedLink);
          if (image) {
            allImages.push(image);
          }
        } catch (error) {
          console.warn(`[Dropbox] Failed to process image ${entry.name}:`, error);
          // Continue with other images
        }
      }

      cursor = response.cursor;
      hasMore = response.has_more;
      
      // Rate limiting: small delay between requests
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Sort by filename A→Z
    return allImages.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * List files in a shared link folder
   */
  private async listSharedLinkFiles(sharedLink: string, cursor?: string): Promise<DropboxListResponse> {
    // Use the Dropbox API v1 endpoint for listing shared link files
    // Note: This endpoint requires the 'sharing.read' scope in your Dropbox app
    const url = 'https://api.dropboxapi.com/1/metadata/auto';
    
    // For v1 API, we need to append the shared link as a query parameter
    const urlWithParams = `${url}?${new URLSearchParams({
      path: sharedLink,
      list: 'true'
    })}`;

    console.log(`[Dropbox] Calling v1 API with URL:`, urlWithParams);

    try {
      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Dropbox] API Error Response:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`Dropbox API error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log(`[Dropbox] API Response:`, JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error(`[Dropbox] Network or parsing error:`, error);
      throw error;
    }
  }

  /**
   * Process a single image entry and get temporary link
   */
  private async processImageEntry(entry: any, sharedLink: string): Promise<CloudImage | null> {
    try {
      // Get temporary link for the file
      const tempLink = await this.getTemporaryLink(entry.id);
      
      // Extract dimensions if available
      let width: number | undefined;
      let height: number | undefined;
      
      if (entry.media_info?.metadata?.['.tag'] === 'photo') {
        const dimensions = entry.media_info.metadata.dimensions;
        if (dimensions) {
          width = dimensions.width;
          height = dimensions.height;
        }
      }

      return {
        id: entry.id,
        name: entry.name,
        url: tempLink,
        width,
        height,
        modifiedAt: entry.client_modified,
        size: entry.size,
        mimeType: this.getMimeType(entry.name)
      };
    } catch (error) {
      console.warn(`[Dropbox] Failed to get temporary link for ${entry.name}:`, error);
      return null;
    }
  }

  /**
   * Get a temporary link for a file
   */
  private async getTemporaryLink(fileId: string): Promise<string> {
    const url = 'https://api.dropboxapi.com/2/files/get_temporary_link';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: fileId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get temporary link: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result.link;
  }

  /**
   * Check if a file is an image based on extension
   */
  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.bmp', '.tiff'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(filename: string): string {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.heic': 'image/heic',
      '.bmp': 'image/bmp',
      '.tiff': 'image/tiff'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Clear cache for a specific link
   */
  clearCache(parsedLink: ParsedLink): void {
    const cacheKey = `dropbox:${parsedLink.normalized}`;
    this.cache.delete(cacheKey);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }
}
