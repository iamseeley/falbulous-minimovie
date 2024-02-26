'use client';

import TextInput from '@/components/ui/TextInput';
import * as fal from '@fal-ai/serverless-client';
import {  useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import useFFmpeg from '@/components/Ffmpeg';
import axios from 'axios';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import Ffmpeg from '@/components/Ffmpeg';




fal.config({
  // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
  proxyUrl: '/api/fal/proxy',
});



interface ScenePlaceholders {
  [key: string]: string;
}

const scenePlaceholders: ScenePlaceholders = {
  Intro: "Introduce your characters and setting.",
  Development: "Build up the tension in your story.",
  Climax: "The peak of your story, where everything comes together.",
  Conclusion: "Wrap up your story, providing closure to your characters and plot."
};


export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [scenesInfo, setScenesInfo] = useState<{[key: string]: { url: string; prompt: string }}>({});

  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [scenes, setScenes] = useState<string[]>(['Intro', 'Development', 'Climax', 'Conclusion']); // Example scene titles
  const [sceneVideos, setSceneVideos] = useState<{[key: string]: string}>({}); // Object to map scene titles to video URLs
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
 // Example scenes

  const [error, setError] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);





  const moveToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIndex);
      const nextSceneTitle = scenes[nextIndex];
      setCurrentVideoUrl(scenesInfo[nextSceneTitle]?.url || null);
      setPrompt(scenesInfo[nextSceneTitle]?.prompt || '');
    }
  };
  
  const moveToPreviousScene = () => {
    if (currentSceneIndex > 0) {
      const prevIndex = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIndex);
      const prevSceneTitle = scenes[prevIndex];
      setCurrentVideoUrl(scenesInfo[prevSceneTitle]?.url || null);
      setPrompt(scenesInfo[prevSceneTitle]?.prompt || ''); // Populate the text area with the prompt for the previous scene
    }
  };
  
  
  

  const generateVideo = async () => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    try {
      const result = await fal.subscribe('fal-ai/fast-animatediff/turbo/text-to-video', {
        input: {
          prompt: prompt,
          video_size: "landscape_16_9",
          // Additional parameters as required by the model
        },
        pollInterval: 1000,
        logs: true,
        onQueueUpdate: (update) => {
          console.log("Queue update", update);
          setElapsedTime(Date.now() - start);
          if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
            setLogs((update.logs || []).map((log) => log.message));
          }
        },
      }) as unknown as { video: { url: string } };
  
      const currentSceneTitle = scenes[currentSceneIndex];
      setScenesInfo(prevScenes => ({
        ...prevScenes,
        [currentSceneTitle]: { url: result.video.url, prompt: prompt }
      }));
      setCurrentVideoUrl(result.video.url);
      console.log(result.video.url)
    } catch (error: any) {
      console.error("Error generating video:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  
 
  
  // const CreateMovieButton: React.FC<{ scenesInfo: { [key: string]: { url: string; prompt: string } } }> = ({ scenesInfo }) => {
  //   const { ffmpeg, isFFmpegLoaded, loadFFmpeg } = useFFmpeg();
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  //   useEffect(() => {
  //     loadFFmpeg();
  //   }, [loadFFmpeg]);
  
  //   const handleCreateMovie = async () => {
  //     if (!isFFmpegLoaded) {
  //       console.log("FFmpeg is not loaded yet.");
  //       return;
  //     }
  
  //     setIsLoading(true);
  //     try {
  //       // Define your concatenation logic here using ffmpeg.FS and ffmpeg.run
  //       // Example:
  //       // await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(scenesInfo[...].url));
  //       // await ffmpeg.run(...);
  //       // const output = ffmpeg.FS('readFile', 'output.mp4');
  //       // const videoBlob = new Blob([output.buffer], { type: 'video/mp4' });
  //       // setVideoUrl(URL.createObjectURL(videoBlob));
  
  //       // After successful concatenation
  //       console.log("Movie created successfully");
  //     } catch (error) {
  //       console.error('Error during video concatenation', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  
  //   return (
  //     <>
  //       <button onClick={handleCreateMovie} disabled={isLoading || !isFFmpegLoaded}>
  //         {isLoading ? 'Creating Movie...' : 'Create Movie'}
  //       </button>
  //       {videoUrl && <video controls src={videoUrl} style={{ width: '100%' }} />}
  //     </>
  //   );
  // };
  
 

  
  
  
  const CreateMovieButton: React.FC<{ scenesInfo: {[key: string]: { url: string }} }> = ({ scenesInfo }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // Check if all scenes have generated videos
    const allScenesGenerated = Object.values(scenesInfo).every(scene => scene.url !== "");
  
    const handleCreateMovie = async () => {
      if (!allScenesGenerated) {
        alert("Please generate all scenes before creating the movie.");
        return;
      }
  
      setIsLoading(true);
      setError(null);
      const videoUrls = Object.values(scenesInfo).map(scene => scene.url);
  
      try {
        const response = await axios.post('/api/makemovie', { videoUrls });
        const combinedVideoUrl = response.data.url;
        console.log("Combined video URL:", combinedVideoUrl);
        // Update your state or UI with the combined video URL here
      } catch (error: any) {
        console.error("Error combining videos:", error);
        setError("Failed to create movie. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <>
        <button onClick={handleCreateMovie} disabled={!allScenesGenerated || isLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60">
          {isLoading ? "Creating Movie..." : "Create Movie"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </>
    );
  };
  
  

  

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="p-10 flex flex-col gap-10">
   
        <div>
          <h2 className="text-4xl font-bold mb-4">
            <span className='text-purple-600'>Fal</span>bulous MiniMovie
          </h2>
          <h4 className='text-xl font-semibold'>Write a story scene by scene and create a mini movie!</h4>
          <div className='flex flex-row gap-2 my-4'>
            <Link target='_blank' href={"https://fal.ai"} className='hover:bg-gray-300 py-2 px-4 bg-gray-100 font-semibold'>fal.ai</Link><Link target='_blank' href={"https://github.com/iamseeley/falbalous-minimovie"} className='hover:bg-gray-300 font-semibold py-2 px-4 bg-gray-100'>source</Link>
          </div>
        </div>
        
        <section className='flex flex-col gap-8 justify-between'>
        <div>
        <h4 className='text-2xl font-semibold mb-4'>{scenes[currentSceneIndex]}</h4>
        <div className="flex flex-col gap-4 items-start w-full  justify-start">
          
          
          <TextInput value={prompt} onChange={handlePromptChange}  placeholder={scenePlaceholders[scenes[currentSceneIndex]] || 'Enter your text here'}  />
          <div className='flex flex-row gap-2'>
          <div>
            {/* <h3>Current Scene: {scenes[currentSceneIndex]}</h3> */}
            <div className="flex flex-wrap gap-2">
              {currentSceneIndex > 0 && (
                <button
                  onClick={moveToPreviousScene}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Previous Scene
                </button>
              )}
              <button
              onClick={generateVideo}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
              >
              {loading ? 'Generating' : 'Generate Video'}
              {loading && (
                <svg className="animate-spin ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>


              {currentSceneIndex < scenes.length - 1 && (
                <button
                  onClick={moveToNextScene}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next Scene
                </button>
              )}
            </div>

          </div>

         </div>
        </div>
        </div>  
        <div className="w-full  rounded">
  {loading ? (
    // Shimmer skeleton placeholder
    <div className="shimmer aspect-video rounded"></div>
  ) : currentVideoUrl ? (
    // Video element
    <video controls src={currentVideoUrl} className="w-full rounded">
      Your browser does not support the video tag.
    </video>
  ) : (
    // Message when there's no video and not loading
    <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4" role="alert">
      <p>No video generated for this scene yet. Generate or navigate through the scenes.</p>
    </div>
  )}
</div>





        </section>

        <section>
          <h3 className='text-2xl font-semibold mb-2'>All Scenes</h3>
          <div className='flex flex-col gap-4'>
            {scenes.map((scene, index) => (
              <div className='flex flex-col gap-1' key={index}>
                <h4 className='text-lg font-semibold'>{scene}</h4>
                {scenesInfo[scene]?.url ? (
                  <>
                    <video controls src={scenesInfo[scene].url} className="w-full rounded mb-1" />
                    <p className="text-sm text-gray-600">Prompt: {scenesInfo[scene].prompt}</p>
                  </>
                ) : (
                  <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4" role="alert">
                    <p>No video generated for this scene yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>




        <section>
          <div><h4 className='text-2xl font-semibold mb-2'>Make your movie!</h4></div>
          <CreateMovieButton scenesInfo={scenesInfo} />
           
            <Ffmpeg scenesInfo={scenesInfo} />
        </section>

    </div>
  );
}