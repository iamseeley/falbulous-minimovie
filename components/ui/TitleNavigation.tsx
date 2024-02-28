'use client'

import React from 'react';

interface TitleNavigationProps {
    setCurrentSceneIndex: (index: number) => void;
    currentSceneIndex: number;
    scenes: string[];
    loading: boolean;
    scenesInfo: { [key: string]: { url: string; prompt: string } }; // Assuming this holds generated content info
  }
  

  const TitleNavigation: React.FC<TitleNavigationProps> = ({
    setCurrentSceneIndex,
    currentSceneIndex,
    scenes,
    loading,
    scenesInfo, // Now we have info about generated content
  }) => {
    return (
      <div className='flex overflow-x-auto no-scrollbar'>
        {scenes.map((scene, index) => {
          // Determine if the previous scene is generated (has a URL)
          const isPrevGenerated = index === 0 || scenesInfo[scenes[index - 1]]?.url;
          // Button is disabled if loading or if the previous scene is not generated
          const disabled = loading || !isPrevGenerated;
  
          return (
            <button
              key={index}
              onClick={() => setCurrentSceneIndex(index)}
              className={`text-md rounded-full font-semibold mx-1 px-4 py-1 ${index === currentSceneIndex ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'} disabled:opacity-50`}
              disabled={disabled}
            >
              {scene}
            </button>
          );
        })}
      </div>
    );
  };
  

export default TitleNavigation;
