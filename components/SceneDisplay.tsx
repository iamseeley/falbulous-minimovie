interface SceneDisplayProps {
    loading: boolean;
    currentVideoUrl: string | null;
  }
  
  const SceneDisplay: React.FC<SceneDisplayProps> = ({ loading, currentVideoUrl }) => (
    <div className="w-full rounded">
      {loading ? (
        <div className="shimmer aspect-video rounded"></div>
      ) : currentVideoUrl ? (
        <video preload='metadata' controls src={`${currentVideoUrl}#t=0.001`} className="w-full rounded">
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4" role="alert">
          <p>No video generated for this scene yet. Generate or navigate through the scenes.</p>
        </div>
      )}
    </div>
  );
  

  export default SceneDisplay;