import { NextRequest, NextResponse } from 'next/server';
import { updateImage, deleteImage } from '@/src/server/actions/image.actions';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedImage = await updateImage(id, body);

    return NextResponse.json({
      success: true,
      image: updatedImage,
      message: 'Image updated successfully',
    });

  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedImage = await deleteImage(id);

    return NextResponse.json({
      success: true,
      image: deletedImage,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
