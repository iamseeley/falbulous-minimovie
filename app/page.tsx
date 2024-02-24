'use client';

import TextInput from '@/components/ui/TextInput';
import * as fal from '@fal-ai/serverless-client';
import { useCallback, useMemo, useState } from 'react';

fal.config({
  // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
  proxyUrl: '/api/fal/proxy',
});

type ErrorProps = {
  error: any;
};

function Error(props: ErrorProps) {
  if (!props.error) {
    return null;
  }
  return (
    <div
      className="p-4 mb-4 text-sm text-red-800 rounded bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <span className="font-medium">Error</span> {props.error.message}
    </div>
  );
}



interface VideoResponse {
  url: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [scenes, setScenes] = useState<string[]>(['Intro', 'Development', 'Climax', 'Conclusion']); // Example scene titles
  const [sceneVideos, setSceneVideos] = useState<{[key: string]: string}>({}); // Object to map scene titles to video URLs
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
 // Example scenes

  const [error, setError] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const moveToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      // Reset states for the new scene
      setPrompt('');
      setVideoUrl(null); // or keep it if you want to review previous videos
      // Optionally reset other states as needed
    } else {
      alert("You've reached the end of the story!");
    }
  };
  
  const moveToPreviousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
      // Handle state reset or adjustments for moving back
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
          // Add any additional parameters required by the model here
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
      }) as unknown as { video: { url: string } }; // Adjusting based on the sample output
  
      const currentScene = scenes[currentSceneIndex]; // Assume currentSceneIndex is managed as part of your state
      setSceneVideos(prevVideos => ({...prevVideos, [currentScene]: result.video.url}));
    } catch (error: any) {
      console.error("Error generating video:", error);
      setError(error);
    } finally {
      setLoading(false);
      setElapsedTime(Date.now() - start);
    }
  };
  
  
  

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="p-10 flex flex-col gap-10">
   
        <div>
          <h2 className="text-4xl font-bold mb-4">
            <span className='text-purple-600'>Fal</span>balous Storytime
          </h2>
          <h4 className='text-xl font-semibold'>Write your own story scence by scene!</h4>
          <div className='flex flex-row gap-2 my-4'>
            <button className=' py-2 px-4 bg-gray-100 font-bold'>fal.ai</button><button className='font-bold py-2 px-4 bg-gray-100'>source</button>
          </div>
        </div>
        
        <section className='flex flex-col gap-8 justify-between'>
        <div>
        <h4 className='text-xl font-semibold mb-2'>Intro</h4>
        <div className="flex flex-col gap-4 items-start w-full  justify-start">
          
          
          <TextInput value={prompt} onChange={handlePromptChange}  placeholder='Set the scene! Introduce the characters and setting.'  />
          <div className='flex flex-row gap-2'>
          <div>
            <h3>Current Scene: {scenes[currentSceneIndex]}</h3>
            <div className="flex gap-4">
              <button
                onClick={moveToPreviousScene}
                disabled={currentSceneIndex === 0}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Previous Scene
              </button>
              <button
                onClick={generateVideo}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Video'}
              </button>
              <button
                onClick={moveToNextScene}
                disabled={currentSceneIndex === scenes.length - 1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Next Scene
              </button>
            </div>
          </div>

         </div>
          {/* <button
            onClick={async (e) => {
              e.preventDefault();
              if (audioFile) {
                try {
                  await transcribeAudio(audioFile);
                } catch (e: any) {
                  setError(e);
                }
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-6 mx-auto rounded focus:outline-none focus:shadow-outline disabled:opacity-70"
            disabled={loading || !audioFile}
          >
            {loading ? 'Transcribing...' : 'Transcribe'}
          </button> */}
        </div>
        </div>  
        <div className=' w-full bg-gray-100 rounded'>
        {videoUrl ? (
  <div>
    <video controls src={videoUrl} className="w-full mt-4">
      Your browser does not support the video tag.
    </video>
  </div>
) : (
  <p>No video generated yet</p>
)}
        </div>
        </section>

        <section>
          <h3>All Scenes</h3>
          {scenes.map((scene, index) => (
            <div key={index}>
              <h4>{scene}</h4>
              {sceneVideos[scene] ? (
                <video controls src={sceneVideos[scene]} className="w-full mt-4" />
              ) : (
                <p>No video generated for this scene yet.</p>
              )}
            </div>
          ))}
        </section>


        <section>
          <div><h4 className='text-xl font-semibold'>What happens next?</h4></div>
          



        </section>


        <Error error={error} />

        
    
    </div>
  );
}