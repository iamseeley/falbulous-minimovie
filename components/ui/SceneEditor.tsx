'use client'

import React from 'react';
import TextInput from '@/components/ui/TextInput';
import VidGenControl from './VidGenControl'; // Adjust based on your structure
import SceneNavigation from './SceneNavigation';
import MotionControls from './MotionControls';
import SceneDisplay from '../SceneDisplay';// Ensure this path matches your project structure

interface SceneEditorProps {
  prompt: string;
  handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  generateVideo: () => void;
  loading: boolean;
  currentVideoUrl: string | null;
  placeholder: string;
  moveToPreviousScene: () => void;
  moveToNextScene: () => void;
  handleMotionChange: (motionValue: number) => void;
  currentSceneIndex: number;
  scenes: string[];
  scenesInfo: {[key: string]: { url: string; prompt: string }};
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
  handleMotionChange,
  currentSceneIndex,
  scenes,
  scenesInfo,
}) => {
  return (
    <div className="flex flex-col">
      <div>
        <h4 className='text-2xl font-semibold mb-2'>{scenes[currentSceneIndex]}</h4>
        <p className='font-medium text-sm mb-2'>💡 The more descriptive the prompt the better!</p>
      </div>
      <div className='flex flex-col gap-4'>
      <TextInput 
        value={prompt} 
        onChange={handlePromptChange} 
        placeholder={placeholder} 
      />
      <SceneDisplay
        loading={loading}
        currentVideoUrl={currentVideoUrl}
      />
      <VidGenControl
        generateVideo={generateVideo}
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
      <MotionControls
        handleMotionChange={handleMotionChange}
        loading={loading}
      />
      </div>
    </div>
  );
};

export default SceneEditor;
