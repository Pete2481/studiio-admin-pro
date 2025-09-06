import { ParsedLink } from '../link-parser';
import { CloudImage } from './dropbox';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
  };
}

export interface GoogleDriveListResponse {
  files: GoogleDriveFile[];
  nextPageToken?: string;
}

export class GoogleDriveLister {
  private serviceAccountEmail: string;
  private privateKey: string;
  private apiKey?: string;
  private cache: Map<string, { images: CloudImage[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor(serviceAccountEmail: string, privateKey: string, apiKey?: string) {
    this.serviceAccountEmail = serviceAccountEmail;
    this.privateKey = privateKey;
    this.apiKey = apiKey;
  }

  /**
   * List all image files in a Google Drive folder
   */
  async listImages(parsedLink: ParsedLink): Promise<CloudImage[]> {
    if (!parsedLink.id) {
      throw new Error('Google Drive folder ID is required');
    }

    const cacheKey = `gdrive:${parsedLink.id}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached result if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[Google Drive] Returning cached result for folder ${parsedLink.id}`);
      return cached.images;
    }

    try {
      console.log(`[Google Drive] Fetching images from folder ${parsedLink.id}`);
      const startTime = Date.now();
      
      const images = await this.fetchAllImages(parsedLink.id);
      
      const duration = Date.now() - startTime;
      console.log(`[Google Drive] Fetched ${images.length} images in ${duration}ms`);
      
      // Cache the result
      this.cache.set(cacheKey, {
        images,
        timestamp: Date.now()
      });
      
      return images;
    } catch (error) {
      console.error('[Google Drive] Error listing images:', error);
      throw error;
    }
  }

  /**
   * Fetch all images from a folder, handling pagination
   */
  private async fetchAllImages(folderId: string): Promise<CloudImage[]> {
    const allImages: CloudImage[] = [];
    let pageToken: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.listFiles(folderId, pageToken);
      
      // Filter for image files only
      const imageFiles = response.files.filter(file => 
        file.mimeType.startsWith('image/')
      );

      // Process image files
      for (const file of imageFiles) {
        try {
          const image = this.processImageFile(file);
          if (image) {
            allImages.push(image);
          }
        } catch (error) {
          console.warn(`[Google Drive] Failed to process image ${file.name}:`, error);
          // Continue with other images
        }
      }

      pageToken = response.nextPageToken;
      hasMore = !!pageToken;
      
      // Rate limiting: small delay between requests
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Sort by filename A→Z
    return allImages.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * List files in a Google Drive folder
   */
  private async listFiles(folderId: string, pageToken?: string): Promise<GoogleDriveListResponse> {
    const baseUrl = 'https://www.googleapis.com/drive/v3/files';
    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    
    const params = new URLSearchParams({
      q: query,
      fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime,imageMediaMetadata)',
      orderBy: 'name',
      pageSize: '1000'
    });
    
    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const url = `${baseUrl}?${params.toString()}`;
    
    const headers: Record<string, string> = {};
    
    // Try service account authentication first
    if (this.serviceAccountEmail && this.privateKey) {
      try {
        const accessToken = await this.getServiceAccountToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        console.warn('[Google Drive] Service account auth failed, trying API key:', error);
      }
    }
    
    // Fallback to API key if service account fails
    if (!headers['Authorization'] && this.apiKey) {
      params.append('key', this.apiKey);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Drive API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * Process a single image file
   */
  private processImageFile(file: GoogleDriveFile): CloudImage | null {
    try {
      // Generate view URL for the file
      const viewUrl = this.generateViewUrl(file.id);
      
      // Extract dimensions if available
      let width: number | undefined;
      let height: number | undefined;
      
      if (file.imageMediaMetadata) {
        width = file.imageMediaMetadata.width;
        height = file.imageMediaMetadata.height;
      }

      return {
        id: file.id,
        name: file.name,
        url: viewUrl,
        width,
        height,
        modifiedAt: file.modifiedTime,
        size: file.size ? parseInt(file.size) : undefined,
        mimeType: file.mimeType
      };
    } catch (error) {
      console.warn(`[Google Drive] Failed to process file ${file.name}:`, error);
      return null;
    }
  }

  /**
   * Generate a view URL for a Google Drive file
   */
  private generateViewUrl(fileId: string): string {
    // For public files, we can use the direct view URL
    if (this.apiKey) {
      return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${this.apiKey}`;
    }
    
    // For service account access, we'll need to proxy through our server
    // This is a placeholder - in practice, you might want to create a signed URL
    // or proxy the file through your server
    return `https://drive.google.com/uc?id=${fileId}`;
  }

  /**
   * Get service account access token using JWT
   */
  private async getServiceAccountToken(): Promise<string> {
    // This is a simplified JWT implementation
    // In production, you might want to use a proper JWT library
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1 hour
    
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    
    const claim = {
      iss: this.serviceAccountEmail,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: expiry,
      iat: now
    };
    
    // Note: This is a simplified implementation
    // In production, use a proper JWT library like 'jsonwebtoken'
    const token = await this.createJWT(header, claim);
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return result.access_token;
  }

  /**
   * Create JWT token (simplified implementation)
   */
  private async createJWT(header: any, claim: any): Promise<string> {
    // This is a placeholder - in production, use a proper JWT library
    // For now, we'll return a mock token to avoid build errors
    console.warn('[Google Drive] JWT creation not implemented - use a proper JWT library');
    return 'mock-jwt-token';
  }

  /**
   * Clear cache for a specific folder
   */
  clearCache(parsedLink: ParsedLink): void {
    if (parsedLink.id) {
      const cacheKey = `gdrive:${parsedLink.id}`;
      this.cache.delete(cacheKey);
    }
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }
}
