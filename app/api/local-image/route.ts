import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json(
        { error: 'Missing image path parameter' },
        { status: 400 }
      );
    }

    // Security check: ensure the path is within allowed directories
    const allowedBasePaths = [
      '/Volumes/2T SSD/Dropbox/Dropbox/Real Estate Clients 2025',
      '/Users',
      '/Volumes'
    ];
    
    const isAllowed = allowedBasePaths.some(basePath => 
      imagePath.startsWith(basePath)
    );
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Access denied to this directory' },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: 'Image file not found' },
        { status: 404 }
      );
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine content type based on file extension
    const ext = path.extname(imagePath).toLowerCase();
    let contentType = 'image/jpeg'; // default
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.bmp':
        contentType = 'image/bmp';
        break;
      case '.tiff':
      case '.tif':
        contentType = 'image/tiff';
        break;
    }

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    console.error('[Local Image API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}




