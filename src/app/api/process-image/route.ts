import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const instructions = formData.get('instructions') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!instructions) {
      return NextResponse.json({ error: 'No instructions provided' }, { status: 400 });
    }

    // Get image bytes and size
    const imageBytes = await file.arrayBuffer();
    const imageSize = imageBytes.byteLength;

    // Log to console as requested
    console.log('User prompt:', instructions);
    console.log('Image size (bytes):', imageSize);
    console.log('Image name:', file.name);
    console.log('Image type:', file.type);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Image and instructions received successfully',
      imageSize: imageSize,
      instructions: instructions
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process image and instructions' },
      { status: 500 }
    );
  }
}
