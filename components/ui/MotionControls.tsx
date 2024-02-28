'use client';

import React from 'react';

interface MotionControlsProps {
  motionValue: number;
  condAug: number;
  steps: number;
  fps: number;
  seed: number | string; // Can be a number or a string to allow "random" as a value
  setMotionValue: (value: number) => void;
  setCondAug: (value: number) => void;
  setSteps: (value: number) => void;
  setFps: (value: number) => void;
  setSeed: (value: number | string) => void;
  loading: boolean;
}



const MotionControls: React.FC<MotionControlsProps> = ({
  motionValue, setMotionValue,
  condAug, setCondAug,
  steps, setSteps,
  fps, setFps,
  seed, setSeed,
  loading
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {setMotionValue(Number(event.target.value));};
  const handleCondAugChange = (e: React.ChangeEvent<HTMLInputElement>) => setCondAug(Number(e.target.value));
  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => setSteps(Number(e.target.value));
  const handleFpsChange = (e: React.ChangeEvent<HTMLInputElement>) => setFps(Number(e.target.value));
  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => setSeed(e.target.value);

  return (
    <div className='flex flex-col  gap-2'>
      <div className='text-center font-semibold'>Motion Controls</div>
      {/* Motion Bucket */}
      <div className='flex flex-col gap-2'>
      <label className="">
        Motion Value:
      </label>
      <div className='flex flex-row gap-2'>
      <input
        type="range"
        min="1"
        max="255"
        value={motionValue} // Controlled component with value from props
        className="accent-purple-500 flex-1 cursor-pointer"
        onChange={handleChange}
        disabled={loading}
      />
     <input
          type="number"
          min="1"
          max="255"
          value={motionValue}
          onChange={handleChange}
          disabled={loading}
          className="w-20 p-1 border rounded"
        />
      </div>
      </div>
      

      <div className="flex flex-col gap-2">
        <label className="flex-1">Cond Aug:</label>
        <div className='flex flex-row gap-2'>
        <input
          type="range"
          min="0"
          max="10"
          value={condAug}
          onChange={handleCondAugChange}
          disabled={loading}
          className="flex-1 accent-purple-500 cursor-pointer"
        />
        <input
          type="number"
          min="0"
          max="10"
          value={condAug}
          onChange={handleCondAugChange}
          disabled={loading}
          className="w-20 p-1 border rounded"
        />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2">
        <label className="flex-1">Steps:</label>
        <div className='flex flex-row gap-2'>
        <input
          type="range"
          min="1"
          max="20"
          value={steps}
          onChange={handleStepsChange}
          disabled={loading}
          className="flex-1 accent-purple-500 cursor-pointer"
        />
        <input
          type="number"
          min="1"
          max="20"
          value={steps}
          onChange={handleStepsChange}
          disabled={loading}
          className="w-20 p-1 border rounded"
        />
        </div>
      </div>

      {/* FPS */}
      <div className="flex flex-col gap-2">
        <label className="flex-1">FPS:</label>
        <div className='flex flex-row gap-2'>
        <input
          type="range"
          min="1"
          max="25"
          value={fps}
          onChange={handleFpsChange}
          disabled={loading}
          className="flex-1 accent-purple-500 cursor-pointer"
        />
        <input
          type="number"
          min="1"
          max="25"
          value={fps}
          onChange={handleFpsChange}
          disabled={loading}
          className="w-20 p-1 border rounded"
        />
        </div>
      </div>

      {/* Seed */}
      {/* <div className="flex items-center gap-2">
        <label className="flex-1">Seed:</label>
        <input
          type="text"
          value={seed}
          onChange={handleSeedChange}
          disabled={loading}
          className="w-20 p-1 border rounded"
        />
      </div> */}
    

    </div>
  );
};


export default MotionControls;
