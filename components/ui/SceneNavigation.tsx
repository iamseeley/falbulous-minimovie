'use client'

interface SceneNavigationProps {
    moveToPreviousScene: () => void;
    moveToNextScene: () => void;
    currentSceneIndex: number;
    scenes: string[];
    loading: boolean;
    scenesInfo: {[key: string]: { url: string; prompt: string }};
  }
  
  
  const SceneNavigation: React.FC<SceneNavigationProps> = ({
    moveToPreviousScene,
    moveToNextScene,
    currentSceneIndex,
    scenes,
    loading,
    scenesInfo,
  }) => (
    
    <div className="flex flex-wrap justify-center gap-2">
      {currentSceneIndex > 0 && (
        <button
          onClick={moveToPreviousScene}
          className="bg-black hover:opacity-80 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          disabled={loading || !scenesInfo[scenes[currentSceneIndex - 1]]?.url}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      )}
      {currentSceneIndex < scenes.length - 1 && (
        <button
          onClick={moveToNextScene}
          className="bg-black hover:opacity-80 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          disabled={loading || !scenesInfo[scenes[currentSceneIndex]]?.url}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      )}
    </div>
  );
  
  export default SceneNavigation;
  