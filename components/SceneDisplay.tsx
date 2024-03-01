interface SceneDisplayProps {
    loading: boolean;
    currentVideoUrl: string | null;
  }
  
const SceneDisplay: React.FC<SceneDisplayProps> = ({ loading, currentVideoUrl }) => (
<div className="w-full rounded mt-2">
    {loading ? (
    <div className="shimmer aspect-video rounded"></div>
    ) : currentVideoUrl ? (
    <video preload='metadata' controls src={`${currentVideoUrl}#t=0.001`} className="w-full rounded">
        Your browser does not support the video tag.
    </video>
    ) : (
    <div className="aspect-video video-placeholder flex justify-center items-center text-4xl rounded">🎞️</div>
    )}
</div>
);


export default SceneDisplay;