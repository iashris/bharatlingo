import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { MinimalYouTubeSectionPlayerProps } from "../types/common";
import { convertTimeToSeconds } from "../helpers";

const isLocalhost = window.location.hostname === "localhosxt";
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const MinimalYouTubeSectionPlayer = forwardRef<
  {
    playSection: () => void;
  },
  MinimalYouTubeSectionPlayerProps
>(({ videoId, start, end, showIntroduction }, ref) => {
  const playerRef = useRef<YouTubePlayer | null>(null);

  useImperativeHandle(ref, () => ({
    playSection,
  }));

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
  };

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const playSection = useCallback(() => {
    if (playerRef.current) {
      clearTimers();

      const startTime =
        typeof start === "string" ? convertTimeToSeconds(start) : start;
      const endTime = typeof end === "string" ? convertTimeToSeconds(end) : end;
      const duration = endTime - startTime;

      playerRef.current.seekTo(startTime, true);
      playerRef.current.playVideo();

      if (isMobile) {
        timeoutRef.current = setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.pauseVideo();
          }
        }, duration * 1000);
      } else {
        intervalRef.current = setInterval(() => {
          if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime >= endTime) {
              playerRef.current.pauseVideo();
              clearTimers();
            }
          }
        }, 100);
      }
    }
  }, [start, end, clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

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
      {!showIntroduction && (
        <button
          onClick={playSection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Play section
        </button>
      )}
    </div>
  );
});

export default MinimalYouTubeSectionPlayer;
