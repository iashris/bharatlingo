import React, { useState, useRef } from "react";
import { Button, Progress } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import LanguageLearningComponent from "./FillBlanks";
import YouTubeSectionPlayer from "./YTPlayer";
import { YouTubeFillBlanksActivity } from "../types/common";

const convertTimeToSeconds = (time: string | number): number => {
  if (typeof time === "number") return time;

  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
};

const SongTeacher: React.FC<{ song: YouTubeFillBlanksActivity }> = ({
  song: songObject,
}) => {
  const { song, videoId, name: songName, introduction } = songObject;
  const [showIntroduction, setShowIntroduction] = useState(
    Boolean(introduction)
  );
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<boolean[]>(
    new Array(song.length).fill(false)
  );
  const playerRef = useRef<{ playSection: () => void } | null>(null);

  const handleComplete = (index: number) => {
    const newCompletedLines = [...completedLines];
    newCompletedLines[index] = true;
    setCompletedLines(newCompletedLines);

    if (index < song.length - 1) {
      setCurrentLineIndex(index + 1);
      playerRef.current?.playSection();
    }
  };

  const handlePrevious = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
      playerRef.current?.playSection();
    }
  };

  const handleNext = () => {
    if (showIntroduction) {
      setShowIntroduction(false);
      playerRef.current?.playSection();
    } else if (
      currentLineIndex < song.length - 1 &&
      completedLines[currentLineIndex]
    ) {
      setCurrentLineIndex(currentLineIndex + 1);
      playerRef.current?.playSection();
    }
  };

  const progress = Number(
    ((completedLines.filter(Boolean).length / song.length) * 100).toFixed(2)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">{songName}</h1>
      <Progress percent={progress} className="mb-6" />
      <YouTubeSectionPlayer
        start={convertTimeToSeconds(song[currentLineIndex].start)}
        end={convertTimeToSeconds(song[currentLineIndex].end)}
        videoId={videoId}
        ref={playerRef}
      />
      {showIntroduction ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">{introduction}</p>
          <Button onClick={handleNext} className="w-full">
            Proceed to Challenges
          </Button>
        </div>
      ) : (
        <>
          <LanguageLearningComponent
            key={currentLineIndex}
            title={song[currentLineIndex]}
            correctOrder={song[currentLineIndex].correctOrder}
            alternative={song[currentLineIndex].alternative}
            trivia={song[currentLineIndex].trivia}
            onComplete={() => handleComplete(currentLineIndex)}
          />
          <div className="flex justify-between mt-6">
            <Button
              icon={<LeftOutlined />}
              onClick={handlePrevious}
              disabled={currentLineIndex === 0}
            />
            <Button
              icon={<RightOutlined />}
              onClick={handleNext}
              disabled={
                currentLineIndex === song.length - 1 ||
                !completedLines[currentLineIndex]
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SongTeacher;
