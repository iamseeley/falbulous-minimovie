# Falbulous MiniMovie

🎞️ Create mini movies from text scenes using Fal's [AnimateDiff Turbo API](https://fal.ai/models/fast-animatediff-t2v-turbo) and [ffmpeg-wasm](https://ffmpegwasm.netlify.app/) for video concatenation.


## How it works
1. User inputs text for each scene.
2. Generate videos for scenes using Fal's API.
3. Concatenate generated scenes into a movie using ffmpeg-wasm.
4. Download your movie.

## Reproduce
1. Clone this repository.
2. Install dependencies: `npm install`.
3. Add Fal's environment variables: 'FAL_KEY'
3. Run the app: `npm run dev`.

**I had to downgrade ffmpeg to version 0.12.6 for it to work with Next.js / Vercel**

## Contributing
Feel free to contribute by submitting pull requests.

## License

1. Go forth and use this code freely.
2. Some credit would be nice.


## Notes

This is my setup for integrating fal's api to generate the little scenes.

```
 const generateVideo = async () => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    try {
      const result = await fal.subscribe('fal-ai/fast-animatediff/turbo/text-to-video', {
        input: {
          prompt: prompt,
          video_size: "landscape_16_9",
          
        },
        pollInterval: 1000,
        logs: true,
        onQueueUpdate: (update) => {
          console.log("Queue update", update);
          setElapsedTime(Date.now() - start);
          if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
            setLogs((update.logs || []).map((log) => log.message));
          }
        },
      }) as unknown as { video: { url: string } };
  
      const currentSceneTitle = scenes[currentSceneIndex];
      setScenesInfo(prevScenes => ({
        ...prevScenes,
        [currentSceneTitle]: { url: result.video.url, prompt: prompt }
      }));
      setCurrentVideoUrl(result.video.url);
      console.log(result.video.url)
    } catch (error: any) {
      console.error("Error generating video:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
```