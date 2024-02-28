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
  setMotionBucketId: (motionValue: number) => void; // This prop might be adjusted based on the new workflow
  motionValue: number;
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
      />
      <p className='font-medium text-sm'>💡 The more descriptive the prompt the better!</p>
      <TextInput 
        value={prompt} 
        onChange={handlePromptChange} 
        placeholder={placeholder} 
      />
      <SceneDisplay
        loading={loading}
        currentVideoUrl={currentVideoUrl}
      />
      <MotionControls
        motionValue={motionValue}
        setMotionValue={setMotionBucketId} 
        loading={loading}
      />
      <VidGenControl
        generateVideo={() => generateVideo()}
        loading={loading}
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
