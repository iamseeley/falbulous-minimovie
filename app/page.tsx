'use client';

import TextInput from '@/components/ui/TextInput';
import * as fal from '@fal-ai/serverless-client';
import {  useState, useEffect } from 'react';
import Link from 'next/link';
import Ffmpeg from '@/components/MovieDisplay';
import MovieDisplay from '@/components/MovieDisplay';
import Hero from '@/components/Hero';
import SceneEditor from '@/components/ui/SceneEditor';
import SceneList from '@/components/SceneList';


fal.config({
  // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
  proxyUrl: '/api/fal/proxy',
});

interface SceneInfo {
  url: string;
  prompt: string;
}

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
  const [scenesInfo, setScenesInfo] = useState<{ [key: string]: SceneInfo }>({});
  const scenes = ['Intro', 'Development', 'Climax', 'Conclusion'];
  const [motionBucketId, setMotionBucketId] = useState<number>(127);
  const [triggerVideoGeneration, setTriggerVideoGeneration] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [condAug, setCondAug] = useState<number>(0.2);
  const [steps, setSteps] = useState<number>(4);
  const [fps, setFps] = useState<number>(10);
  const [seed, setSeed] = useState<number | string>('random');


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

  const handleSetCurrentSceneIndex = (index: number) => {
    const scene = scenes[index];
    const sceneInfo = scenesInfo[scene];
    setCurrentSceneIndex(index);
    setPrompt(sceneInfo?.prompt || '');
    setCurrentVideoUrl(sceneInfo?.url || null);
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
          // seed: seed,
          motion_bucket_id: motionBucketId,
          cond_aug: condAug,
          setps: steps,
          fps: fps,
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
    <div className="flex flex-col gap-20">

        <section>
          <Hero />
        </section>

        <section>
        <SceneEditor
          prompt={prompt}
          handlePromptChange={handlePromptChange}
          generateVideo={generateVideo}
          loading={loading}
          placeholder={scenePlaceholders[scenes[currentSceneIndex]] || 'Enter your text here'}
          moveToPreviousScene={moveToPreviousScene}
          moveToNextScene={moveToNextScene}
          setMotionBucketId={setMotionBucketId} // Use only this for clarity
          motionValue={motionBucketId}
          condAug={condAug}
          setCondAug={setCondAug}
          steps={steps}
          setSteps={setSteps}
          fps={fps}
          setFps={setFps}
          seed={seed}
          setSeed={setSeed}
          currentSceneIndex={currentSceneIndex}
          setCurrentSceneIndex={setCurrentSceneIndex}
          scenes={scenes}
          scenesInfo={scenesInfo}
          currentVideoUrl={currentVideoUrl}
          handleSetCurrentSceneIndex={handleSetCurrentSceneIndex}
        />
        </section>

        <section>
          <SceneList scenes={scenes} scenesInfo={scenesInfo} />
        </section>

        <section>
            <div><h4 className='text-2xl font-semibold mb-4'>Make your movie!</h4></div>
            <MovieDisplay  scenesInfo={scenesInfo} />
        </section>

    </div>
  );
}