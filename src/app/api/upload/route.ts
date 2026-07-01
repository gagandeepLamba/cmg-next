import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const fileType = file.type;
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'events');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${generateUUID()}.${fileExtension}`;
    const filePath = join(uploadsDir, uniqueFileName);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Write file
    await writeFile(filePath, buffer);

    // Return the file URL
    const fileUrl = `/uploads/events/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: uniqueFileName,
      size: file.size,
      type: fileType
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename parameter is required' },
        { status: 400 }
      );
    }

    // In production, you would validate access permissions here
    const filePath = join(process.cwd(), 'public', 'uploads', 'events', filename);
    
    try {
      const fileBuffer = await import('fs').then(fs => fs.promises.readFile(filePath));
      const file = fileBuffer;
      
      return new NextResponse(file, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': file.length.toString(),
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
