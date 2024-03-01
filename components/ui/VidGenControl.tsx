interface VidGenControlProps {
    generateVideo: () => void;
    loading: boolean;
  }
  
  const VidGenControl: React.FC<VidGenControlProps> = ({
    generateVideo,
    loading
  }) => (
    <div className="flex flex-col justify-center items-center gap-4">
      <button
        onClick={generateVideo}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Scene'}
        {loading && (
          <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </button>
    </div>
  );
  
  export default VidGenControl;
  