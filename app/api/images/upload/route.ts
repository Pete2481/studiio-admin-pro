import { NextRequest, NextResponse } from 'next/server';
import { createImage } from '@/src/server/actions/image.actions';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tenantId = formData.get('tenantId') as string;
    const uploadedBy = formData.get('uploadedBy') as string;
    const altText = formData.get('altText') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!tenantId || !uploadedBy) {
      return NextResponse.json(
        { error: 'Missing tenantId or uploadedBy' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create tenant-specific directory
    const tenantDir = join(uploadsDir, tenantId);
    if (!existsSync(tenantDir)) {
      await mkdir(tenantDir, { recursive: true });
    }

    // Save file to disk
    const filePath = join(tenantDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Get image dimensions (basic implementation)
    let width: number | undefined;
    let height: number | undefined;
    
    // For now, we'll set default dimensions
    // In a production environment, you'd use a library like 'sharp' to get actual dimensions
    width = 800;
    height = 600;

    // Create image record in database
    const imageData = {
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      url: `/uploads/${tenantId}/${filename}`,
      altText: altText || file.name,
      tenantId,
      uploadedBy,
    };

    const savedImage = await createImage(imageData);

    return NextResponse.json({
      success: true,
      image: savedImage,
      message: 'Image uploaded successfully',
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
