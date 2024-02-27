'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { downloadWithProgress, fetchFile, toBlobURL } from '@ffmpeg/util'
import { stringify } from 'querystring';
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
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
 

  const load = async () => {
    setIsLoading(true)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })
    
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

 // filelist
  const fileList = 'file_list.txt';
  const fileContent = Object.keys(scenesInfo).map((_, index) => `file 'input${index}.mp4'`).join('\n');
  await ffmpeg.writeFile(fileList, new TextEncoder().encode(fileContent));

// concatenate
  await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', fileList, '-c', 'copy', 'output.mp4']);

    const data = (await ffmpeg.readFile('output.mp4')) as any

    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

  
  if (videoRef.current) {
    videoRef.current.src = videoUrl;
  }

  

  
  setFinalVideoUrl(videoUrl);
}
    

  const allScenesGenerated = Object.keys(scenesInfo).length !== 4 || isLoading;

  return (
    <div className="">
    
        
    <div className="w-full  rounded">
        {isLoading ? (
        <div className="shimmer aspect-video rounded"></div>
        ) : !allScenesGenerated ? (
        <>
        
        {finalVideoUrl && (
          <>
          <video preload='metadata' className='mb-4 rounded aspect-video' ref={videoRef} controls>Your browser does not support the video tag. </video>
          <div className='flex justify-center'>
            <a className='py-1 px-4 bg-gray-100  hover:bg-gray-300 rounded-full font-medium' href={finalVideoUrl} download="finalMovie.mp4">Download Movie</a>
          </div>
          </>
        )}
        </>
        ) : (
          <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4" role="alert">
            <p>No movie generated yet. Please generate all the scenes first.</p>
          </div>
        )}
    </div>
    <div className='flex justify-center'>
          <button
            disabled={Object.keys(scenesInfo).length !== 4 || isLoading}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60"
            onClick={async () => {
              if (!loaded) {
                await load();
              }
              await transcode();
            }}  
          >
      {isLoading ? 'Creating' : 'Create Movie'}
              {isLoading && (
                <svg className="animate-spin ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
    </button>
    </div>
      
    </div>
  )
};

export default Ffmpeg;
