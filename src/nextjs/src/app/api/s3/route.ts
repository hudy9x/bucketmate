import { createS3Client } from '@bucketmate/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call the createS3Client function
    createS3Client();
    
    // Return a success response
    return NextResponse.json({
      success: true,
      message: 'S3 Client created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Return an error response if something goes wrong
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create S3 client',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}