import { useRef, forwardRef, useImperativeHandle } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { MinimalYouTubeSectionPlayerProps } from "../types/common";

const isLocalhost = window.location.hostname === "localhost";

const MinimalYouTubeSectionPlayer = forwardRef<
  {
    playSection: () => void;
  },
  MinimalYouTubeSectionPlayerProps
>(({ videoId, start, end }, ref) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => ({
    playSection,
  }));

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
  };

  const playSection = () => {
    if (playerRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      playerRef.current.seekTo(start, true);
      playerRef.current.playVideo();
      if (typeof end === "string" || typeof start === "string") return;
      const duration = (end - start) * 1000; // Convert to milliseconds
      timeoutRef.current = setTimeout(() => {
        playerRef.current?.pauseVideo();
      }, duration);
    }
  };

  const playerWidth = Math.min(560, window.innerWidth);
  const playerHeight = (playerWidth * 9) / 16;

  const opts = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
      autoplay: 0,
      controls: 1,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          className={isLocalhost ? null : "pointer-events-none"}
        />
      </div>
      <button
        onClick={playSection}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Play section
      </button>
    </div>
  );
});

export default MinimalYouTubeSectionPlayer;
