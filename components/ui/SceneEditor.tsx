'use client';

import React from 'react';
import TextInput from '@/components/ui/TextInput';
import VidGenControl from './VidGenControl';
import SceneNavigation from './SceneNavigation';
import MotionControls from './MotionControls';
import SceneDisplay from '../SceneDisplay';
import TitleNavigation from './TitleNavigation';

interface SceneEditorProps {
  prompt: string;
  handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  generateVideo: () => void;
  loading: boolean;
  currentVideoUrl: string | null;
  placeholder: string;
  moveToPreviousScene: () => void;
  moveToNextScene: () => void;
  setMotionBucketId: (motionValue: number) => void;
  setCondAug: (value: number) => void;
  setSteps: (value: number) => void;
  setFps: (value: number) => void;
  setSeed: (value: number | string) => void;
  motionValue: number;
  condAug: number;
  steps: number;
  fps: number;
  seed: number | string;
  currentSceneIndex: number;
  scenes: string[];
  scenesInfo: {[key: string]: { url: string; prompt: string }};
  setCurrentSceneIndex: (index: number) => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({
  prompt,
  handlePromptChange,
  generateVideo,
  loading,
  currentVideoUrl,
  placeholder,
  moveToPreviousScene,
  moveToNextScene,
  setMotionBucketId, // Make sure this updates a local state or context, not directly triggering video generation
  condAug, setCondAug,
  steps, setSteps,
  fps, setFps,
  seed, setSeed,
  motionValue,
  currentSceneIndex,
  scenes,
  scenesInfo,
  setCurrentSceneIndex, // Ensure this prop is used for direct navigation by title
}) => {
  // Assuming `motionValue` is managed within MotionControls or at a higher level to be used here
  return (
    <div className="flex flex-col gap-4">
      <TitleNavigation
        setCurrentSceneIndex={setCurrentSceneIndex}
        currentSceneIndex={currentSceneIndex}
        scenes={scenes}
        loading={loading}
        scenesInfo={scenesInfo}
        moveToPreviousScene={moveToPreviousScene}
        moveToNextScene={moveToNextScene}
      />
      <p className='font-medium text-sm'>📌 The more descriptive the prompt the better!</p>
      <TextInput 
        value={prompt} 
        onChange={handlePromptChange} 
        placeholder={placeholder} 
      />
      <MotionControls
        motionValue={motionValue}
        setMotionValue={setMotionBucketId} 
        condAug={condAug} setCondAug={setCondAug}
        steps={steps} setSteps={setSteps}
        fps={fps} setFps={setFps}
        seed={seed} setSeed={setSeed}
        loading={loading}
      />
      <VidGenControl
        generateVideo={() => generateVideo()}
        loading={loading}
      />
      <SceneDisplay
        loading={loading}
        currentVideoUrl={currentVideoUrl}
      />
      <SceneNavigation
        moveToPreviousScene={moveToPreviousScene}
        moveToNextScene={moveToNextScene}
        currentSceneIndex={currentSceneIndex}
        scenes={scenes}
        loading={loading}
        scenesInfo={scenesInfo}
      />
    </div>
  );
};

export default SceneEditor;
