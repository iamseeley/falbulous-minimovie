'use client';

import TextInput from '@/components/ui/TextInput';
import * as fal from '@fal-ai/serverless-client';
import {  useState, useEffect } from 'react';
import Link from 'next/link';
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

  const [loading, setLoading] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const [scenesInfo, setScenesInfo] = useState<{[key: string]: { url: string; prompt: string }}>({});
  const [scenes, setScenes] = useState<string[]>(['Intro', 'Development', 'Climax', 'Conclusion']); // Example scene titles
 
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
  
// One Model setup - AnimateDiff

  // const generateVideo = async () => {
  //   setLoading(true);
  //   setError(null);
  //   const start = Date.now();
  //   try {
  //     const result = await fal.subscribe('fal-ai/fast-animatediff/text-to-video', {
  //       input: {
  //         prompt: prompt,
  //         video_size: "landscape_16_9",
          
  //       },
  //       pollInterval: 1000,
  //       logs: true,
  //       onQueueUpdate: (update) => {
  //         console.log("Queue update", update);
  //         setElapsedTime(Date.now() - start);
  //         if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
  //           setLogs((update.logs || []).map((log) => log.message));
  //         }
  //       },
  //     }) as unknown as { video: { url: string } };
  
  //     const currentSceneTitle = scenes[currentSceneIndex];
  //     setScenesInfo(prevScenes => ({
  //       ...prevScenes,
  //       [currentSceneTitle]: { url: result.video.url, prompt: prompt }
  //     }));
  //     setCurrentVideoUrl(result.video.url);
  //     console.log(result.video.url)
  //   } catch (error: any) {
  //     console.error("Error generating video:", error);
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [motionBucketId, setMotionBucketId] = useState<number>(127);
  const [triggerVideoGeneration, setTriggerVideoGeneration] = useState<boolean>(false);
  
  const handleMotionChange = (motionValue: number): void => {
    setMotionBucketId(motionValue); // Directly set the motion value
    setTriggerVideoGeneration(true); // Indicate that this change should trigger video generation
  };
  
  useEffect(() => {
    if (triggerVideoGeneration) {
      generateVideo();
      setTriggerVideoGeneration(false); // Reset the flag after generating the video
    }
  }, [motionBucketId, triggerVideoGeneration]); 
  


  const generateVideo = async () => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    // const previousSceneIndex = currentSceneIndex - 1;
    // const previousScenePrompt = scenesInfo[scenes[previousSceneIndex]]?.prompt || '';
    // const combinedPrompt = `${previousScenePrompt} ${prompt}`.trim();

    try {
      
      // Step 1: Generate an image from the text
      const imageResult = await fal.subscribe('fal-ai/fast-sdxl', {
        input: {
          prompt: prompt,
          image_size: "landscape_16_9",
          seed: 1,
        },
        pollInterval: 1000,
        logs: true,
        onQueueUpdate: (update) => {
               console.log("Queue update", update);
                setElapsedTime(Date.now() - start);
             if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
                    setLogs((update.logs || []).map((log) => log.message));
                  }
                }
      }) as unknown as { images: Array<{url: string; content_type: string;}>; };
      

      const imageUrl = imageResult.images[0].url;

  
      // Step 2: Convert the generated image to a video
      const videoResult = await fal.subscribe('fal-ai/fast-svd-lcm', {
        input: {
          image_url: imageUrl,
          video_size: "landscape_16_9",
          seed: 1,
          motion_bucket_id: motionBucketId,
        },
        logs: true,
        pollInterval: 1000,
        onQueueUpdate: (update) => {
          console.log("Queue update", update);
           setElapsedTime(Date.now() - start);
        if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
               setLogs((update.logs || []).map((log) => log.message));
             }
           }
      }) as unknown as { video: { url: string } };;
      console.log(motionBucketId)
  
      const currentSceneTitle = scenes[currentSceneIndex];
      setScenesInfo(prevScenes => ({
        ...prevScenes,
        [currentSceneTitle]: { url: videoResult.video.url, prompt: prompt }
      }));
      setCurrentVideoUrl(videoResult.video.url);
      console.log(videoResult.video.url);
    } catch (error) {
      console.error("Error generating video:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  


  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="px-4 py-10 flex flex-col gap-10">
   
        <section>
          <h2 className="text-4xl font-bold mb-4">
            <span className='text-purple-600'>Fal</span>bulous MiniMovie
          </h2>
          <h4 className='text-xl font-semibold'>Write a story scene by scene to create a mini movie!</h4>
          <div className='flex flex-row gap-2 my-4'>
            <Link target='_blank' href={"https://fal.ai"} className='hover:bg-gray-300 py-2 px-4 bg-gray-100 font-semibold'>fal.ai</Link><Link target='_blank' href={"https://github.com/iamseeley/falbulous-minimovie"} className='hover:bg-gray-300 font-semibold py-2 px-4 bg-gray-100'>source</Link>
          </div>
        </section>
        
        <section className='flex flex-col gap-8 justify-between'>

        <div>
        <h4 className='text-2xl font-semibold mb-4'>{scenes[currentSceneIndex]}</h4>

        <div className="flex flex-col gap-4  w-full  ">
          <TextInput value={prompt} onChange={handlePromptChange}  placeholder={scenePlaceholders[scenes[currentSceneIndex]] || 'Enter your text here'}  />
        <div className='flex flex-row justify-center gap-2'>

        <div>
         
          <div className="flex flex-col items-center justify-center gap-2">
            <div className='flex flex-wrap justify-center gap-2'>
          {currentSceneIndex > 0 && (
            <button
              onClick={moveToPreviousScene}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
              disabled={loading || !scenesInfo[scenes[currentSceneIndex - 1]]?.url}
            >
              Previous Scene
            </button>
          )}
  
            {currentSceneIndex < scenes.length - 1 && (
              <button
                onClick={moveToNextScene}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
                disabled={loading || !scenesInfo[scenes[currentSceneIndex]]?.url}
              >
                Next Scene
              </button>
            )}
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          
              <button
                onClick={generateVideo}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Video'}
                {loading && (
                  <svg className="animate-spin ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
              <div className='flex flex-col gap-2 md:flex-row'>
                <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60' onClick={() => handleMotionChange(127)} disabled={loading}>Default Motion</button>
                <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60' onClick={() => handleMotionChange(95)} disabled={loading}>Medium Motion</button>
                <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60' onClick={() => handleMotionChange(60)} disabled={loading}>Low Motion</button>
                <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60' onClick={() => handleMotionChange(30)} disabled={loading}>Very Low Motion</button>
              </div>

            </div>
            </div>
            </div>
            </div>
          </div>
        </div>  
        <div className="w-full  rounded">
          {loading ? (
          
            <div className="shimmer aspect-video rounded"></div>
          ) : currentVideoUrl ? (
            
            <video preload='metadata' controls src={`${currentVideoUrl}#t=0.001`} className="w-full rounded">
              Your browser does not support the video tag. 
            </video>
          ) : (
            
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
                    <video controls src={`${scenesInfo[scene].url}#t=0.001`} className="w-full rounded mb-1" />
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
            <div><h4 className='text-2xl font-semibold mb-4'>Make your movie!</h4></div>
         
            <Ffmpeg  scenesInfo={scenesInfo} />
        </section>

    </div>
  );
}