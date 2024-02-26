import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Ensure Cloudinary is correctly configured with your cloud details
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a video to Cloudinary and return the public ID
async function uploadVideoToCloudinary(videoUrl: string): Promise<string> {
  const result = await cloudinary.uploader.upload(videoUrl, {
    resource_type: 'video',
  });
  return result.public_id;
}

// Function to concatenate videos using their Cloudinary public IDs
async function concatenateVideos(videoPublicIds: string[]): Promise<string> {
    // Base video public ID
    const baseVideoPublicId = videoPublicIds[0];
  
    // Transformation for each video to concatenate
    const transformations = videoPublicIds.slice(1).map(publicId => ({
      overlay: `video:${publicId}`,
      width: 300, // Example dimensions
      height: 200,
      crop: 'fill',
      flags: 'layer_apply', // Apply transformations
    }));
  
    // Concatenate using the first video as base
    const result = await cloudinary.uploader.upload(`video:${baseVideoPublicId}`, {
      resource_type: 'video',
      transformation: transformations,
      format: 'mp4',
    });
  
    return result.secure_url; // URL of the concatenated video
  }
  

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const videoUrls: string[] = body.videoUrls;

  if (videoUrls.length < 2) {
    return new NextResponse(JSON.stringify({ error: 'Need at least two videos to concatenate' }), { status: 400 });
  }

  try {
    // Upload videos to Cloudinary and get their public IDs
    const videoPublicIds = await Promise.all(videoUrls.map(uploadVideoToCloudinary));
    // Concatenate videos using their public IDs
    const concatenatedVideoUrl = await concatenateVideos(videoPublicIds);
    return new NextResponse(JSON.stringify({ url: concatenatedVideoUrl }), { status: 200 });
  } catch (error) {
    console.error("Failed to process videos:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to process videos." }), { status: 500 });
  }
}
