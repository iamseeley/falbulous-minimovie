import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { TransformationOptions } from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Function to upload a video to Cloudinary and return the public ID
async function uploadVideoToCloudinary(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      videoUrl,
      { resource_type: 'video', folder: 'falbulous' },
      (error, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else if (result?.public_id) resolve(result.public_id);
        else reject(new Error('Failed to upload video to Cloudinary.'));
      }
    );
  });
}



async function concatenateVideos(videoPublicIds: string[]): Promise<string> {
  if (videoPublicIds.length < 2) {
    throw new Error('Need at least two videos to concatenate');
  }

  // Construct the transformation for concatenation
  const transformations = videoPublicIds.slice(1).map(publicId => ({
    overlay: `${publicId}`,
    flags: "splice", // Indicate concatenation
  }));

  try {
    // Perform the transformation on the first video
    const result = await cloudinary.v2.uploader.upload(`${videoPublicIds[0]}`, {
      resource_type: 'video',
      transformation: transformations,
      format: 'mp4', // Specify desired output format
    });

    if (!result || !result.secure_url) {
      throw new Error('Concatenation failed or secure_url is missing');
    }
    return result.secure_url;
  } catch (error) {
    console.error('Error during video concatenation:', error);
    throw error;
  }
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const videoUrls: string[] = body.videoUrls;

  if (videoUrls.length === 0) {
    return new NextResponse(JSON.stringify({ error: 'No video URLs provided.' }), { status: 400 });
  }

  try {
    // Upload videos to Cloudinary and get their public IDs
    const videoPublicIds = await Promise.all(videoUrls.map(uploadVideoToCloudinary));
    const concatenatedVideoUrl = await concatenateVideos(videoPublicIds);
    // Concatenate videos using their public IDs
  
    
    // Return the URL of the concatenated video
    return new NextResponse(JSON.stringify({ url: concatenatedVideoUrl }), { status: 200 });
  } catch (error) {
    console.error('Failed to process videos:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to process videos.' }), { status: 500 });
  }
}
