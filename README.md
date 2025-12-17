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
