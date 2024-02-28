'use client';

import React from 'react';

interface MotionControlsProps {
  motionValue: number; // Current motion value
  setMotionValue: (value: number) => void; // Function to update motion value
  loading: boolean;
}


const MotionControls: React.FC<MotionControlsProps> = ({ motionValue, setMotionValue, loading }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMotionValue(Number(event.target.value));
  };

  return (
    <div className='flex flex-col justify-center items-center gap-4'>
      <div className='text-center font-semibold'>Motion Controls</div>
      <input
        type="range"
        min="30"
        max="127"
        value={motionValue} // Controlled component with value from props
        className="accent-purple-600 w-full h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none"
        onChange={handleChange}
        disabled={loading}
      />
     
      <div className="text-center font-medium mt-2">
        Motion Value: {motionValue}
      </div>
      <div className='flex justify-between w-full text-sm'>
        <span>Very Low</span>
        <span>Low</span>
        <span>Medium</span>
        <span>Default</span>
      </div>
    </div>
  );
};


export default MotionControls;
