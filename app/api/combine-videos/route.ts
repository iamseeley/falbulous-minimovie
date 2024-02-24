// First, import necessary modules and configure Cloudinary at the top of your file.
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// API Route Handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request to /api/combine-videos`); 
  
  if (req.method === 'POST') {
    // Extract video URLs from the request body
    const { videoUrls } = req.body;

    // Ensure all videos are provided
    if (!videoUrls || videoUrls.length === 0) {
      return res.status(400).json({ error: "No video URLs provided." });
    }

    try {
      // Combine videos on Cloudinary
      const combinedVideoUrl = await combineVideosOnCloudinary(videoUrls);
      // Respond with the URL of the combined video
      return res.status(200).json({ url: combinedVideoUrl });
    } catch (error) {
      console.error("Failed to combine videos:", error);
      // Handle errors appropriately
      return res.status(500).json({ error: "Failed to combine videos." });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
    
  }
}

async function combineVideosOnCloudinary(videoUrls: string[]): Promise<string> {
  // Fetch and concatenate videos
  const transformations = videoUrls.map((url, index) => ({
    overlay: `remote:${url}`, // Use remote fetch by specifying the URL
    width: 640,
    crop: "scale",
    flags: index === 0 ? undefined : "splice", // Apply 'splice' to concatenate, starting from the second video
  }));

  try {
    // Initiate the upload and concatenation process
    const response = await cloudinary.v2.uploader.upload("remote:video_placeholder_or_first_video_url_here", {
      resource_type: "video",
      transformation: transformations,
    });
    
    return response.secure_url; // URL of the concatenated video
  } catch (error) {
    console.error("Error uploading and concatenating videos:", error);
    throw error; // Rethrow to handle it in the calling function
  }
}
