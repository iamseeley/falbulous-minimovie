# 🎞️  Falbulous MiniMovie

Create mini movies from text using [fal's](https://fal.ai) open source ml model apis and [ffmpeg-wasm](https://ffmpegwasm.netlify.app/) for video concatenation.

*now using SDXL for text-image and then SVD-Turbo for image-video* 

## Use
1. Input text for each scene.
2. Generate videos for scenes using fal's API.
3. Save the video for each scene.
3. Concatenate generated scenes into a movie using ffmpeg-wasm.
4. Download the movie.

## Reproduce
1. Clone this repository.
2. Install dependencies: `npm install`.
3. Add fal's environment variables: 'FAL_KEY'
3. Run the app: `npm run dev`.

**I had to downgrade ffmpeg to version 0.12.6 for it to work with Next.js / Vercel**

## Todo
- [ ] Improve video generation nav
- [ ] Fix thumbnail for final video
- [ ] Add audio

## Contributing
Feel free to contribute by submitting pull requests.

## License

1. Go forth and use this code freely.
2. Some credit would be nice.


## Notes

New setup using sdxl and svd-turbo together.

```TypeScript
  const generateVideo = async () => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    try {
      // Step 1: Generate an image from the text
      const imageResult = await fal.subscribe('fal-ai/fast-sdxl', {
        input: {
          prompt: prompt,
          image_size: "landscape_16_9",
        },
        pollInterval: 1000,
        logs: true,
        onQueueUpdate: (update) => {
               console.log("Queue update", update);
                setElapsedTime(Date.now() - start);
             if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
                    setLogs((update.logs || []).map((log) => log.message));
                  }
                }
      }) as unknown as { images: Array<{url: string; content_type: string;}>; };
      

      const imageUrl = imageResult.images[0].url;

  
      // Step 2: Convert the generated image to a video
      const videoResult = await fal.subscribe('fal-ai/fast-svd-lcm', {
        input: {
          image_url: imageUrl,
          video_size: "landscape_16_9",
        },
        logs: true,
        pollInterval: 1000,
        onQueueUpdate: (update) => {
          console.log("Queue update", update);
           setElapsedTime(Date.now() - start);
        if (update.status === 'IN_PROGRESS' || update.status === 'COMPLETED') {
               setLogs((update.logs || []).map((log) => log.message));
             }
           }
      }) as unknown as { video: { url: string } };;
      
  
      const currentSceneTitle = scenes[currentSceneIndex];
      setScenesInfo(prevScenes => ({
        ...prevScenes,
        [currentSceneTitle]: { url: videoResult.video.url, prompt: prompt }
      }));
      setCurrentVideoUrl(videoResult.video.url);
      console.log(videoResult.video.url);
    } catch (error) {
      console.error("Error generating video:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
```

This is my setup using fal's api to generate the mini scenes. (this was using only one model - animatediff)

```TypeScript
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
