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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          disabled={loading || !scenesInfo[scenes[currentSceneIndex - 1]]?.url}
        >
          Previous Scene
        </button>
      )}
      {currentSceneIndex < scenes.length - 1 && (
        <button
          onClick={moveToNextScene}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          disabled={loading || !scenesInfo[scenes[currentSceneIndex]]?.url}
        >
          Next Scene
        </button>
      )}
    </div>
  );
  
  export default SceneNavigation;
  