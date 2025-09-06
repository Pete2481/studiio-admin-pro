import path from 'path';

export interface ParsedLink {
  provider: 'dropbox' | 'gdrive' | 'local';
  normalized: string;
  id?: string;
  originalUrl: string;
}

export class LinkParser {
  /**
   * Parse a cloud storage folder link and detect the provider
   */
  static parse(originalUrl: string): ParsedLink | null {
    try {
      // Local folder detection (check first)
      if (this.isLocalFolder(originalUrl)) {
        return this.parseLocalFolder(originalUrl);
      }
      
      const url = new URL(originalUrl);
      
      // Dropbox detection
      if (this.isDropboxLink(url)) {
        return this.parseDropboxLink(url, originalUrl);
      }
      
      // Google Drive detection
      if (this.isGoogleDriveLink(url)) {
        return this.parseGoogleDriveLink(url, originalUrl);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to parse URL:', error);
      return null;
    }
  }
  
  /**
   * Check if URL is a Dropbox shared link
   */
  private static isDropboxLink(url: URL): boolean {
    return url.hostname === 'www.dropbox.com' && 
           url.pathname.includes('/scl/fo/');
  }
  
  /**
   * Check if URL is a Google Drive folder link
   */
  private static isGoogleDriveLink(url: URL): boolean {
    return url.hostname === 'drive.google.com' && 
           url.pathname.includes('/drive/folders/');
  }
  
  /**
   * Check if input is a local folder path
   */
  private static isLocalFolder(input: string): boolean {
    // Check if it's a valid file system path
    return input.startsWith('/') || input.startsWith('./') || input.startsWith('../') || 
           (process.platform === 'win32' && (!!input.match(/^[A-Za-z]:\\/) || !!input.match(/^\\\\/)));
  }
  
  /**
   * Parse local folder path
   */
  private static parseLocalFolder(folderPath: string): ParsedLink {
    // Normalize the path
    const normalizedPath = path.resolve(folderPath);
    
    return {
      provider: 'local',
      normalized: normalizedPath,
      id: normalizedPath,
      originalUrl: folderPath
    };
  }
  
  /**
   * Parse Dropbox shared link
   * Supports: https://www.dropbox.com/scl/fo/abc123/...?dl=0/1
   */
  private static parseDropboxLink(url: URL, originalUrl: string): ParsedLink {
    // Extract the shared link ID from the path
    const pathParts = url.pathname.split('/');
    const sharedLinkIndex = pathParts.findIndex(part => part === 'scl');
    
    if (sharedLinkIndex === -1 || sharedLinkIndex + 2 >= pathParts.length) {
      throw new Error('Invalid Dropbox shared link format');
    }
    
    const sharedLinkId = pathParts[sharedLinkIndex + 2];
    
    // Normalize to the base shared link URL (remove dl parameter)
    const normalizedUrl = new URL(url);
    normalizedUrl.searchParams.delete('dl');
    
    return {
      provider: 'dropbox',
      normalized: normalizedUrl.toString(),
      id: sharedLinkId,
      originalUrl
    };
  }
  
  /**
   * Parse Google Drive folder link
   * Supports: https://drive.google.com/drive/folders/{FOLDER_ID}?usp=sharing&resourcekey=...
   */
  private static parseGoogleDriveLink(url: URL, originalUrl: string): ParsedLink {
    // Extract folder ID from path
    const pathParts = url.pathname.split('/');
    const foldersIndex = pathParts.findIndex(part => part === 'folders');
    
    if (foldersIndex === -1 || foldersIndex + 1 >= pathParts.length) {
      throw new Error('Invalid Google Drive folder link format');
    }
    
    const folderId = pathParts[foldersIndex + 1];
    
    // Validate folder ID format (Google Drive IDs are typically 33 characters)
    if (!folderId || folderId.length < 20) {
      throw new Error('Invalid Google Drive folder ID');
    }
    
    // Normalize to just the folder ID (remove query parameters)
    const normalizedUrl = `https://drive.google.com/drive/folders/${folderId}`;
    
    return {
      provider: 'gdrive',
      normalized: normalizedUrl,
      id: folderId,
      originalUrl
    };
  }
  
  /**
   * Validate if a parsed link is valid for API calls
   */
  static validate(parsedLink: ParsedLink): boolean {
    if (!parsedLink.provider || !parsedLink.normalized) {
      return false;
    }
    
    if (parsedLink.provider === 'dropbox') {
      return parsedLink.normalized.includes('dropbox.com') && !!parsedLink.id;
    }
    
    if (parsedLink.provider === 'gdrive') {
      return parsedLink.normalized.includes('drive.google.com') && !!parsedLink.id;
    }
    
    if (parsedLink.provider === 'local') {
      return !!parsedLink.id && parsedLink.normalized.length > 0;
    }
    
    return false;
  }
  
  /**
   * Get a human-readable provider name
   */
  static getProviderName(provider: 'dropbox' | 'gdrive' | 'local'): string {
    if (provider === 'dropbox') return 'Dropbox';
    if (provider === 'gdrive') return 'Google Drive';
    if (provider === 'local') return 'Local Folder';
    return 'Unknown';
  }
  
  /**
   * Get a human-readable provider name with icon
   */
  static getProviderDisplay(provider: 'dropbox' | 'gdrive' | 'local'): { name: string; icon: string; color: string } {
    if (provider === 'dropbox') {
      return {
        name: 'Dropbox',
        icon: '📦',
        color: 'text-blue-600'
      };
    }
    
    if (provider === 'gdrive') {
      return {
        name: 'Google Drive',
        icon: '☁️',
        color: 'text-green-600'
      };
    }
    
    if (provider === 'local') {
      return {
        name: 'Local Folder',
        icon: '💾',
        color: 'text-purple-600'
      };
    }
    
    return {
      name: 'Unknown',
      icon: '❓',
      color: 'text-gray-600'
    };
  }
}
