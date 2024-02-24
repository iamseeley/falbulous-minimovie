import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// Assuming cloudinary is correctly typed or declarations are extended to match usage
// If using TypeScript, ensure you have types for cloudinary, or extend them as needed

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const videoUrls: string[] = body.videoUrls;

  if (!videoUrls || videoUrls.length === 0) {
    return new NextResponse(JSON.stringify({ error: "No video URLs provided." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const fetchPromises = videoUrls.map(url => fetchAndTransformVideo(url));
    const results = await Promise.all(fetchPromises);
    return new NextResponse(JSON.stringify({ urls: results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Failed to fetch and transform videos:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch and transform videos." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Explicitly type the videoUrl parameter
// async function fetchAndTransformVideo(videoUrls: string[]): Promise<string> {
  
//   const transformations = videoUrls.map((url, index) => {
//     const encodedUrl = encodeURIComponent(url)
//     return {
//       overlay: `video:fetch:${encodedUrl}`,
//       width: 640, // Adjust as needed
//       height: 360, // Adjust as needed
//       crop: 'fill', // Adjust as needed
//       flags: index < videoUrls.length - 1 ? 'layer_apply' : undefined, // Apply transformations except for the last video
//     };
//   });

//   try {
//     const result = await cloudinary.v2.uploader.upload('https://res.cloudinary.com/demo/image/upload/v1566403028/sample.jpg', {
//       resource_type: 'video',
//       transformation: [
//         ...transformations,
//         { format: 'mp4' }, // Specify the desired output format
//       ],
//     });

//     return result.secure_url;
//   } catch (error) {
//     console.error("Error concatenating videos:", error);
//     throw error; // Throw the error to be caught by the calling function
//   }
// }


async function fetchAndTransformVideo(videoUrl: string): Promise<string> {
  try {
    // Use the full video URL directly without the 'fetch:' prefix
    const result = await cloudinary.v2.uploader.upload(videoUrl, {
      resource_type: 'video',
      // Specify any transformations here
      transformation: [
        { width: 640, height: 360, crop: 'fill' },
        { format: 'mp4' }
      ]
    });

    console.log('Transformed video URL:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Error fetching and transforming video:', error);
    throw error;
  }
}





// const result = await cloudinary.v2.uploader.upload(videoUrl, {
//   resource_type: 'video',
//   transformation: [{
//     flags: 'splice',
//     overlay: 'video:fetch:${encodedUrl}',
//     width: 640, height: 360, crop: 'fill',
//     format: 'mp4',
// }]
// });

// return result.secure_url;
// }
