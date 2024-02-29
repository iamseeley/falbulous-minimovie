interface SceneListProps {
  scenes: string[];
  scenesInfo: { [key: string]: { url: string; prompt: string } };
}

const SceneList: React.FC<SceneListProps> = ({ scenes, scenesInfo }) => {
  return (
    <section>
      <h3 className='text-2xl font-semibold mb-2'>Scenes</h3>
      <div className='flex flex-col gap-4'>
        {scenes.map((scene, index) => (
          <div className='flex flex-col gap-1' key={index}>
            <h4 className='text-lg font-semibold'>{scene}</h4>
            {scenesInfo[scene]?.url ? (
              <>
                <video controls src={`${scenesInfo[scene].url}#t=0.001`} className="w-full rounded mb-1" />
                <p className="text-sm text-gray-600">Prompt: {scenesInfo[scene].prompt}</p>
              </>
            ) : (
              <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4" role="alert">
                <p>No video generated for this scene yet.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SceneList;
