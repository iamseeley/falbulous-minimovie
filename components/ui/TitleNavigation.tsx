import React from 'react';

interface TitleNavigationProps {
    setCurrentSceneIndex: (index: number) => void;
    currentSceneIndex: number;
    scenes: string[];
    loading: boolean;
    scenesInfo: { [key: string]: { url: string; prompt: string } };
    moveToNextScene: () => void;
    moveToPreviousScene: () => void;
}

const TitleNavigation: React.FC<TitleNavigationProps> = ({
    setCurrentSceneIndex,
    currentSceneIndex,
    scenes,
    loading,
    scenesInfo,
    moveToNextScene,
    moveToPreviousScene,
}) => {
    // Function to determine if a scene button should be enabled
    const isSceneEnabled = (index: number) => {
        // Enable if it's the current scene or a previously generated one
        if (index <= currentSceneIndex) return true;
        // Enable the next scene button only if the current scene is generated
        if (index === currentSceneIndex + 1 && scenesInfo[scenes[currentSceneIndex]]?.url) return true;
        return false;
    };

    // Handler for scene selection that uses moveToNextScene and moveToPreviousScene logic
    const handleSceneSelection = (index: number) => {
        // Calculate direction of navigation
        const direction = index - currentSceneIndex;
        // Navigate based on the direction
        if (direction > 0) {
            for (let i = 0; i < direction; i++) {
                moveToNextScene();
            }
        } else {
            for (let i = 0; i < Math.abs(direction); i++) {
                moveToPreviousScene();
            }
        }
    };

    return (
        <div className='flex overflow-x-auto no-scrollbar'>
            {scenes.map((scene, index) => (
                <button
                    key={index}
                    onClick={() => isSceneEnabled(index) && handleSceneSelection(index)}
                    className={`text-md rounded-full font-semibold mx-1 px-4 py-1 ${index === currentSceneIndex ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'} ${!isSceneEnabled(index) || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isSceneEnabled(index) || loading}
                >
                    {scene}
                </button>
            ))}
        </div>
    );
};

export default TitleNavigation;
