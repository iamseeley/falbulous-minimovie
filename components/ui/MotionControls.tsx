'use client'

interface MotionControlsProps {
    handleMotionChange: (motionValue: number) => void;
    loading: boolean;
  }
  
  const MotionControls: React.FC<MotionControlsProps> = ({ handleMotionChange, loading }) => {
    return (
      <div className='flex flex-col justify-center items-center gap-4'>
        <div className='text-center font-semibold'>Motion Controls</div>
        <div className='flex flex-col md:flex-row gap-2'>
          <button 
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50' 
            onClick={() => handleMotionChange(127)} 
            disabled={loading}>
            Default Motion
          </button>
          <button 
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50' 
            onClick={() => handleMotionChange(95)} 
            disabled={loading}>
            Medium Motion
          </button>
          <button 
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50' 
            onClick={() => handleMotionChange(60)} 
            disabled={loading}>
            Low Motion
          </button>
          <button 
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50' 
            onClick={() => handleMotionChange(30)} 
            disabled={loading}>
            Very Low Motion
          </button>
        </div>
      </div>
    );
  };
  
  export default MotionControls;
  