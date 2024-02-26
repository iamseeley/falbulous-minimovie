import { CloudinaryVideo } from '@cloudinary/url-gen/assets/CloudinaryVideo';
import { trim, concatenate } from '@cloudinary/url-gen/actions/videoEdit';
import { videoSource } from "@cloudinary/url-gen/qualifiers/concatenate";
import { Transformation } from '@cloudinary/url-gen';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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



const videoEditExample = (videoPublicIds: string[]): void => {
  const baseVideo = new CloudinaryVideo(videoPublicIds[0]);
  baseVideo.videoEdit(trim().duration(8.0))
    .videoEdit(
      concatenate(
        videoSource(videoPublicIds[1]).transformation(
          new Transformation()
            .addFlag("splice")
            .videoEdit(trim().duration(8.0))
        )
      )
    );
};

// new CloudinaryVideo("docs/empty.mp4")
//   .videoEdit(trim().duration(1.1))
//   .videoEdit(
//     concatenate(
//       videoSource("docs/room1").transformation(
//         new Transformation()
//           .addFlag(splice("transition"))
//           .videoEdit(trim().duration("6.0"))
//       )
//     )
//   )
//   .videoEdit(
//     concatenate(
//       imageSource("docs/room2").transformation(
//         new Transformation()
//           .addFlag(splice("transition_(name_pixelize)"))
//           .videoEdit(trim().duration("6.0"))
//           .resize(fill().width(400).height(300))
//       )
//     )
//   )
//   .videoEdit(
//     concatenate(
//       imageSource("docs/room3").transformation(
//         new Transformation()
//           .addFlag(splice("transition_(name_hlslice)"))
//           .videoEdit(trim().duration("6.0"))
//           .resize(fill().width(400).height(300))
//       )
//     )
//   )
//   .videoEdit(
//     concatenate(
//       imageSource("docs/room4").transformation(
//         new Transformation()
//           .addFlag(splice("transition_(name_vertopen)"))
//           .videoEdit(trim().duration("6.0"))
//           .resize(fill().width(400).height(300))
//       )
//     )
//   );



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
      const concatenatedVideoUrl = await videoEditExample(videoPublicIds);

      return new NextResponse(JSON.stringify({ url: concatenatedVideoUrl }), { status: 200 });
    } catch (error) {
      console.error("Failed to process videos:", error);
      return new NextResponse(JSON.stringify({ error: "Failed to process videos." }), { status: 500 });
    }
  }