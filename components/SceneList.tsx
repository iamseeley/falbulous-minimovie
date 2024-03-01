'use client'

import React, { useState } from 'react';

interface Scene {
  url: string;
  prompt: string;
}

interface SceneListProps {
  scenes: string[];
  scenesInfo: { [key: string]: Scene };
}

const SceneList: React.FC<SceneListProps> = ({ scenes, scenesInfo }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex === 0 ? scenes.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex === scenes.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-semibold mb-4">Scenes</h3>
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {scenes.map((scene, index) => (
            <div className="min-w-full" key={index}>
              <h4 className="text-lg font-semibold mb-2">{scene}</h4>
              {scenesInfo[scene]?.url ? (
                <>
                  <video controls src={scenesInfo[scene].url} className="w-full rounded mb-2 aspect-video" />
                  <p className="text-sm text-gray-600">Prompt: {scenesInfo[scene].prompt}</p>
                </>
              ) : (
                <div className="aspect-video video-placeholder flex justify-center items-center text-4xl rounded">🎞️</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <button onClick={handlePrev} className="bg-black hover:opacity-80 text-white font-bold py-2 px-4 rounded disabled:opacity-60">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button onClick={handleNext} className="bg-black hover:opacity-80 text-white font-bold py-2 px-4 rounded disabled:opacity-60">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SceneList;
