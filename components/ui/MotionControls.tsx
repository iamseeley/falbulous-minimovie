'use client';

import React from 'react';
import HoverCard from './HoverCard';

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

  const increment = (value: number, setValue: (value: number) => void, max: number) => {
    const newValue = Math.min(value + 1, max);
    setValue(newValue);
  };

  // Decrement function for the input number
  const decrement = (value: number, setValue: (value: number) => void, min: number) => {
    const newValue = Math.max(value - 1, min);
    setValue(newValue);
  };

  const incrementCond = (value: number, setValue: (value: number) => void, max: number) => {
    let newValue = value + 0.1;
    newValue = Math.min(newValue, max);
    setValue(parseFloat(newValue.toFixed(1)));
  };
  
  const decrementCond = (value: number, setValue: (value: number) => void, min: number) => {
    let newValue = value - 0.1;
    newValue = Math.max(newValue, min);
    setValue(parseFloat(newValue.toFixed(1)));
  };
  

  return (
    <div className='flex flex-col  gap-6 mt-4 md:mt-0 leading-none'>
      {/* <div className='text-center font-semibold'>Controls</div> */}
      {/* Motion Bucket */}
      <div className='flex flex-col gap-2'>
      <div className='flex flex-row justify-between items-center'>
      <label className="font-medium">motion bucket</label>
      <HoverCard content={<p className='flex flex-col leading-normal items-start gap-2'>The motion bucket value determines the motion of the generated video. The higher the number, the more motion there will be.<span className='text-xs text-purple-500 border font-medium px-2 border-purple-500 rounded-full'>motion bucket</span></p>} trigger={<button className='text-xs font-medium border rounded-full px-2 py-0 hover:bg-gray-100'>info</button>} />
      </div>
      <div className='flex flex-row gap-4'>
      <input
        type="range"
        min="1"
        max="255"
        value={motionValue} // Controlled component with value from props
        className="accent-purple-500 flex-1 cursor-pointer mt-2"
        onChange={handleChange}
        disabled={loading}
      />
     <div className="flex flex-row rounded">
     <input
          type="number"
          min="1"
          max="255"
          value={motionValue}
          onChange={handleChange}
          disabled={loading}
          className="w-12 px-2 py-1 border rounded-l   focus:outline-purple-500 focus:outline"
        />
        <div className='flex flex-col'>
            <button
              className=" px-1 border-r border-t border-b rounded-tr bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => increment(motionValue, setMotionValue, 255)}
              disabled={loading || steps >= 255}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"></path></svg>
            </button>
            <button
              className="px-1 border-r border-b rounded-br bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => decrement(motionValue, setMotionValue, 1)}
              disabled={loading || motionValue <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
          </div>
        </div>
      </div>
      </div>
      
      {/* Cond Aug */}
      <div className="flex flex-col gap-2">
      <div className='flex flex-row justify-between items-center'>
      <label className="font-medium">cond aug</label>
      <HoverCard content={<p className='flex flex-col leading-normal items-start gap-2'>Increasing the conditioning augmentation value leads to more varied and potentially unexpected results.<span className='text-xs text-purple-500 border font-medium px-2 border-purple-500 rounded-full'>cond aug</span></p>} trigger={<button className='text-xs font-medium border rounded-full px-2 py-0 hover:bg-gray-100'>info</button>} />
      </div>
        <div className='flex flex-row gap-4'>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={condAug}
          onChange={handleCondAugChange}
          disabled={loading}
          className="flex-1 accent-purple-500 cursor-pointer mt-2"
        />
        <div className="flex flex-row rounded">
        <input
          type="number"
          min="0"
          max="10"
          value={condAug}
          onChange={handleCondAugChange}
          disabled={loading}
          className="w-12 px-2 py-1 border rounded-l focus:outline-purple-500 focus:outline"
        />
        <div className='flex flex-col'>
            <button
              className=" px-1 border-r border-t border-b rounded-tr bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => incrementCond(condAug, setCondAug, 10)}
              disabled={loading || condAug >= 10}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"></path></svg>
            </button>
            <button
              className="px-1 border-r border-b rounded-br bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => decrementCond(condAug, setCondAug, 0)}
              disabled={loading || condAug <= 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
        </div>
        </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2">
      <div className='flex flex-row justify-between items-center'>
      <label className="font-medium">steps</label>
      <HoverCard content={<p className='flex flex-col leading-normal items-start gap-2'>The higher the value, the better the quality of the video, and the longer it will take to generate.<span className='text-xs text-purple-500 border font-medium px-2 border-purple-500 rounded-full'>steps</span></p>} trigger={<button className='text-xs font-medium border rounded-full px-2 py-0 hover:bg-gray-100'>info</button>} />
      </div>
        <div className='flex flex-row gap-4'>
        <input
          type="range"
          min="1"
          max="20"
          value={steps}
          onChange={handleStepsChange}
          disabled={loading}
          className="flex-1 accent-purple-500 cursor-pointer mt-2"
        />
        <div className="flex flex-row rounded">
          <input

            type="number"
            min="1"
            max="20"
            value={steps}
            onChange={handleStepsChange}
            disabled={loading}
            className=" w-12 appearance-none px-2 border rounded-l focus:outline-purple-500 focus:outline "
          />

          <div className='flex flex-col'>
            <button
              className=" px-1 border-r border-t border-b rounded-tr bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => increment(steps, setSteps, 20)}
              disabled={loading || steps >= 20}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"></path></svg>
            </button>
            <button
              className="px-1 border-r border-b rounded-br bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => decrement(steps, setSteps, 1)}
              disabled={loading || steps <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
          </div>
        </div>


        </div>
      </div>

      {/* FPS */}
      <div className="flex flex-col gap-2">
      <div className='flex flex-row justify-between items-center'>
      <label className="font-medium">frames per second</label>
      <HoverCard content={<p className='flex flex-col leading-normal items-start gap-2'>The higher the value, the faster the video will play. <span className='text-xs text-purple-500 border font-medium px-2 border-purple-500 rounded-full'>fps</span></p>} trigger={<button className='text-xs font-medium border rounded-full px-2 py-0 hover:bg-gray-100'>info</button>} />
      </div>
        <div className='flex flex-row gap-4'>
        <input
          type="range"
          min="1"
          max="25"
          value={fps}
          onChange={handleFpsChange}
          disabled={loading}
          className="flex-1 accent-purple-500 cursor-pointer mt-2"
        />
        <div className="flex flex-row rounded">
        <input
          type="number"
          min="1"
          max="25"
          value={fps}
          onChange={handleFpsChange}
          disabled={loading}
          className="w-12 px-2 py-1 border rounded-l focus:outline-purple-500 focus:outline"
        />
        <div className='flex flex-col'>
            <button
              className=" px-1 border-r border-t border-b rounded-tr bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => increment(fps, setFps, 25)}
              disabled={loading || fps >= 25}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"></path></svg>
            </button>
            <button
              className="px-1 border-r border-b rounded-br bg-gray-100 hover:bg-gray-300 disabled:bg-gray-100"
              onClick={() => decrement(fps, setFps, 1)}
              disabled={loading || fps <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
            </button>
          </div>
          </div>
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
