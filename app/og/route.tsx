import { ImageResponse } from 'next/og';

export const runtime = 'edge';
 
export async function GET() {
  return new ImageResponse(
    (
      
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <div tw="flex">
          <div tw="flex flex-col w-full py-12 px-4 items-center justify-center p-8">
            <h2 tw="flex text-6xl font-bold tracking-tight text-gray-900 text-left">
              <span tw='mr-2 bg-white '>🎞️</span>
              <span tw='text-purple-600'>Fal</span>bulous MiniMovie
            </h2>
            <p tw='text-4xl w-3/4 text-center font-medium'>Bring your stories to life, scene by scene, and watch your movie unfold.</p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}