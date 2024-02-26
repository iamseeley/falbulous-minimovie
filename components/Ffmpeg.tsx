'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { useRef, useState } from 'react'

interface FfmpegProps {
  scenesInfo: { [key: string]: { url: string; prompt: string } };
}

const Ffmpeg: React.FC<FfmpegProps> = ({ scenesInfo }) => {
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)
 

  const load = async () => {
    setIsLoading(true)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })
    setLoaded(true)
    setIsLoading(false)
  }

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current


    for (const [index, url] of Object.entries(scenesInfo).map(entry => entry[1].url).entries()) {
      const filename = `input${index}.mp4`;
      await ffmpeg.writeFile(filename, await fetchFile(url));
    }

    // Create and write the file list for concatenation
  const fileList = 'file_list.txt';
  const fileContent = Object.keys(scenesInfo).map((_, index) => `file 'input${index}.mp4'`).join('\n');
  await ffmpeg.writeFile(fileList, new TextEncoder().encode(fileContent));

  // Execute concatenation
  await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', fileList, '-c', 'copy', 'output.mp4']);

    const data = (await ffmpeg.readFile('output.mp4')) as any
    if (videoRef.current)
      videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
  }

  return (
    <div className="">
      <video className='aspect-video' ref={videoRef} controls></video>
      {/* <br />
      <button
        onClick={transcode}
        className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
      >
        Transcode avi to mp4
      </button>
      <p ref={messageRef}></p>
    </div>
  ) : ( */}
    <button
      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60"
      onClick={async () => {
        if (!loaded) {
          await load();
        }
        await transcode();
      }}  
    >
      Create Movie
      {isLoading && (
        <span className="animate-spin ml-3">
          <svg
            viewBox="0 0 1024 1024"
            focusable="false"
            data-icon="loading"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
          </svg>
        </span>
      )}
    </button>
    </div>
  )
};

export default Ffmpeg;


// 'use client'

// // Ffmpeg.tsx
// import { toBlobURL, fetchFile } from "@ffmpeg/util";
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { useRef, useState, useEffect } from 'react';

// interface FfmpegProps {
//   videoUrls: string[]; // Add this line to accept videoUrls as a prop
// }

// const Ffmpeg = ({ videoUrls }: FfmpegProps) => {
//   const [loaded, setLoaded] = useState(false);
//   const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
//   const videoRef = useRef<HTMLVideoElement | null>(null)
//   const messageRef = useRef<HTMLParagraphElement | null>(null)
  

//   useEffect(() => {
//     // Function to load FFmpeg
//     const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
//         const ffmpeg = ffmpegRef.current;
//         ffmpeg.on('log', ({ message }) => {
//             messageRef.current.innerHTML = message;
//             console.log(message);
//         });
//         // toBlobURL is used to bypass CORS issue, urls with the same
//         // domain can be used directly.
//         await ffmpeg.load({
//             coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//             wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
//         });
//         setLoaded(true);
//     };

//   }, []);

//   const transcode = async (videoUrls: FfmpegProps) => {
//     if (!loaded) return;

//     // Download and concatenate videos
//     for (const [index, url] of videoUrls.entries()) {
//       const filename = `input${index}.mp4`;
//       await ffmpeg.current.writeFile(filename, await fetchFile(url));
//     }

//     // Create and write the file list for concatenation
//     const fileList = 'file_list.txt';
//     const fileContent = Object.keys(videoUrls).map((_, index) => `file 'input${index}.mp4'`).join('\n');
//     await ffmpeg.writeFile(fileList, new TextEncoder().encode(fileContent));

//     await ffmpegRef.exec(['-f', 'concat', '-safe', '0', '-i', fileList, '-c', 'copy', 'output.mp4']);

//     // Example: Display the first video for demonstration purposes
//     // This is where you'd implement your concatenation logic
//     if (videoUrls.length > 0) {
//       const outputFilename = `input0.mp4`; // This is just an example
//       const data = ffmpegRef.current.readFile( outputFilename);
//       if (videoRef.current) {
//         videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
//       }
//     }
//   };

//   return (
//     <div>
//       {loaded ? (
//         <>
//           <video ref={videoRef} controls></video>
//           <button onClick={transcode}>Concatenate Videos</button>
//         </>
//       ) : (
//         <p>Loading FFmpeg...</p>
//       )}
//     </div>
//   );
// };

// export default Ffmpeg;
