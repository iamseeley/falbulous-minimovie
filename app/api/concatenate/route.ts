// pages/api/concatenate-videos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import cloudinary from 'cloudinary';

// Promisify exec for async/await usage
const execAsync = promisify(exec);

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  export async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).send({ error: 'Method not allowed' });
    }
  
    const videoUrls: string[] = req.body.videoUrls;
  
    try {
      // Assuming you handle the creation of file_list.txt as mentioned earlier
  
      const fileList = 'file_list.txt';
      const fileContent = videoUrls.map((url: string) => `file '${url}'`).join('\n');
      // Save fileContent to fileList here
  
      const outputVideo = 'output.mp4';
      const ffmpegCommand = `ffmpeg -f concat -safe 0 -i ${fileList} -c copy ${outputVideo}`;
  
      await execAsync(ffmpegCommand);
  
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(outputVideo, {
        resource_type: 'video',
      });
  
      // Cleanup and respond
      res.status(200).json({ url: cloudinaryResponse.secure_url });
    } catch (error) {
      console.error('Error processing videos:', error);
      res.status(500).json({ error: 'Failed to process videos.' });
    }
  }