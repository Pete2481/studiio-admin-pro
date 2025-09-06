import { NextRequest, NextResponse } from 'next/server';
import { LinkParser } from '@/lib/cloud-gallery/link-parser';
import { DropboxLister } from '@/lib/cloud-gallery/providers/dropbox';
import { GoogleDriveLister } from '@/lib/cloud-gallery/providers/google-drive';
import { LocalFolderProvider } from '@/lib/cloud-gallery/providers/local';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderLink = searchParams.get('folderLink');

    // Validate input
    if (!folderLink) {
      return NextResponse.json(
        { error: 'Missing folderLink parameter' },
        { status: 400 }
      );
    }

    // Parse the link to detect provider
    const parsedLink = LinkParser.parse(folderLink);
    if (!parsedLink) {
      return NextResponse.json(
        { error: 'Unsupported or invalid folder link' },
        { status: 400 }
      );
    }

    // Validate the parsed link
    if (!LinkParser.validate(parsedLink)) {
      return NextResponse.json(
        { error: 'Invalid folder link format' },
        { status: 400 }
      );
    }

    console.log(`[Cloud Gallery] Processing ${parsedLink.provider} link: ${parsedLink.normalized}`);

    let images: any[] = [];

    try {
      if (parsedLink.provider === 'dropbox') {
        // Initialize Dropbox lister
        const dropboxToken = process.env.DROPBOX_TOKEN;
        if (!dropboxToken) {
          return NextResponse.json(
            { error: 'Dropbox integration not configured' },
            { status: 500 }
          );
        }

        const dropboxLister = new DropboxLister(dropboxToken);
        images = await dropboxLister.listImages(parsedLink);

      } else if (parsedLink.provider === 'gdrive') {
        // Initialize Google Drive lister
        const serviceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!serviceAccountEmail || !privateKey) {
          return NextResponse.json(
            { error: 'Google Drive integration not configured' },
            { status: 500 }
          );
        }

        const gdriveLister = new GoogleDriveLister(serviceAccountEmail, privateKey, apiKey);
        images = await gdriveLister.listImages(parsedLink);
        
      } else if (parsedLink.provider === 'local') {
        // Initialize Local folder provider
        const localProvider = new LocalFolderProvider(parsedLink.normalized);
        images = await localProvider.listImages();
      }

      // Return the images
      return NextResponse.json({
        success: true,
        data: {
          images,
          provider: parsedLink.provider,
          providerName: LinkParser.getProviderName(parsedLink.provider),
          totalCount: images.length,
          folderId: parsedLink.id
        }
      });

    } catch (providerError: any) {
      console.error(`[Cloud Gallery] Provider error (${parsedLink.provider}):`, providerError);
      
      // Return provider-specific error
      return NextResponse.json(
        { 
          error: `Failed to fetch images from ${LinkParser.getProviderName(parsedLink.provider)}`,
          details: providerError.message,
          provider: parsedLink.provider
        },
        { status: 502 }
      );
    }

  } catch (error: any) {
    console.error('[Cloud Gallery] Unexpected error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
