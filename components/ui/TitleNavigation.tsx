import React from 'react';

interface TitleNavigationProps {
    setCurrentSceneIndex: (index: number) => void;
    currentSceneIndex: number;
    scenes: string[];
    loading: boolean;
    scenesInfo: { [key: string]: { url: string; prompt: string } };
}

const TitleNavigation: React.FC<TitleNavigationProps> = ({
    setCurrentSceneIndex,
    currentSceneIndex,
    scenes,
    loading,
    scenesInfo,
   
}) => {
    // Function to determine if a scene button should be enabled
    // Determine the index of the last scene with a generated video
    const hasVideoGenerated = (index: number) => scenesInfo[scenes[index]]?.url !== undefined;

    // Function to determine if a scene button should be enabled
    const isSceneEnabled = (index: number) => {
        if (index === 0) return true; // Always enable the first scene for navigation
        
        // Enable if the scene has a generated video
        if (hasVideoGenerated(index)) return true;

        // Enable the immediate next scene after the last scene with a generated video
        for (let i = index - 1; i >= 0; i--) {
            if (hasVideoGenerated(i)) {
                return index === i + 1;
            }
        }

        return false;
    };

    // Handler for scene selection that uses moveToNextScene and moveToPreviousScene logic
    const handleSceneSelection = (index: number) => {
        setCurrentSceneIndex(index);
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
