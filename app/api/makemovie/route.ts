import { NextResponse, NextRequest } from "next/server";


const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

async function uploadVideoToCloudinary(videoUrl: string): Promise<string> {
const result = await cloudinary.uploader.upload(videoUrl, {
    resource_type: 'video',
});
return result.public_id;
}

// const videoEditExample = (videoPublicIds: string[]): void => {
//     const baseVideo = new CloudinaryVideo(videoPublicIds[0]);
//     baseVideo.videoEdit(trim().duration(8.0))
//       .videoEdit(
//         concatenate(
//           videoSource(videoPublicIds[1]).transformation(
//             new Transformation()
//               .addFlag("splice")
//               .videoEdit(trim().duration(8.0))
//           )
          
//         )
//       );
//   };

const videoEditExample = (videoPublicIds: string): void => {
    cloudinary.url(videoPublicIds, {
    resource_type: 'video',
    transformation: [{
        flags: 'splice',
        overlay: 'axtotyyw02n45esf24ws'
    }, {
        flags: 'layer_apply'

    }],
    })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body = await req.json();
    const videoUrls: string[] = body.videoUrls;
  
    if (videoUrls.length < 2) {
      return new NextResponse(JSON.stringify({ error: 'Need at least two videos to concatenate' }), { status: 400 });
    }
  
    try {
      // Upload videos to Cloudinary and get their public IDs
    //   const videoPublicIds = await Promise.all(videoUrls.map(uploadVideoToCloudinary));
      // Concatenate videos using their public IDs
      const concatenatedVideoUrl = await videoEditExample('axtotyyw02n45esf24ws');

      return new NextResponse(JSON.stringify({ url: concatenatedVideoUrl }), { status: 200 });
    } catch (error) {
      console.error("Failed to process videos:", error);
      return new NextResponse(JSON.stringify({ error: "Failed to process videos." }), { status: 500 });
    }
  }