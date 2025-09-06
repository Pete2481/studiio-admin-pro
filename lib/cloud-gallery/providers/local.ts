import { CloudImage, CloudGalleryProvider } from '../../types';
import fs from 'fs';
import path from 'path';

export class LocalFolderProvider implements CloudGalleryProvider {
  private folderPath: string;

  constructor(folderPath: string) {
    this.folderPath = folderPath;
  }

  async listImages(): Promise<CloudImage[]> {
    try {
      console.log(`[Local] Reading images from: ${this.folderPath}`);
      
      if (!fs.existsSync(this.folderPath)) {
        throw new Error(`Local folder does not exist: ${this.folderPath}`);
      }

      const files = await this.readDirectoryRecursively(this.folderPath);
      const imageFiles = files.filter(file => this.isImageFile(file.name));
      
      console.log(`[Local] Found ${imageFiles.length} image files`);
      
      return imageFiles.map(file => ({
        id: file.path,
        name: file.name,
        url: `file://${file.path}`,
        width: undefined,
        height: undefined,
        modifiedAt: file.stats.mtime,
        size: file.stats.size,
        mimeType: this.getMimeType(file.name)
      }));
    } catch (error) {
      console.error(`[Local] Error reading local folder:`, error);
      throw error;
    }
  }

  private async readDirectoryRecursively(dirPath: string): Promise<Array<{ name: string; path: string; stats: fs.Stats }>> {
    const files: Array<{ name: string; path: string; stats: fs.Stats }> = [];
    
    try {
      const items = await fs.promises.readdir(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stats = await fs.promises.stat(fullPath);
        
        if (stats.isDirectory()) {
          // Recursively read subdirectories
          const subFiles = await this.readDirectoryRecursively(fullPath);
          files.push(...subFiles);
        } else if (stats.isFile()) {
          files.push({
            name: item,
            path: fullPath,
            stats
          });
        }
      }
    } catch (error) {
      console.warn(`[Local] Error reading directory ${dirPath}:`, error);
    }
    
    return files;
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.bmp', '.tiff'];
    const extension = path.extname(filename).toLowerCase();
    return imageExtensions.includes(extension);
  }

  private getMimeType(filename: string): string {
    const extension = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
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
}




