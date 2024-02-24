// components/AnimationDisplayComponent.tsx

interface AnimationDisplayProps {
    videoUrl: string | null;
  }
  
  const AnimationDisplay: React.FC<AnimationDisplayProps> = ({ videoUrl }) => {
    if (!videoUrl) return <div>No animation to display</div>;
  
    return (
      <div className="mt-4">
        <video controls src={videoUrl} className="max-w-full h-auto" />
      </div>
    );
  };
  
  export default AnimationDisplay;
  