import React, { useState, useRef, useEffect } from "react";
import { Button, Progress } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import LanguageLearningComponent from "./FillBlanks";

interface SongLine {
  EN: string;
  HI: string;
  BN: string;
  correctOrder: string[];
  alternative?: string[];
  audio?: string;
}

interface SongTeacherProps {
  song: SongLine[];
}

const SongTeacher: React.FC<SongTeacherProps> = ({ song }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<boolean[]>(
    new Array(song.length).fill(false)
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
  }, []);

  const handleComplete = (index: number) => {
    const newCompletedLines = [...completedLines];
    newCompletedLines[index] = true;
    setCompletedLines(newCompletedLines);

    if (index < song.length - 1) {
      setCurrentLineIndex(index + 1);
      // Play the audio for the next line after a short delay
      setTimeout(() => {
        if (audioRef.current && song[index + 1].audio) {
          audioRef.current.src = song[index + 1].audio!;
          audioRef.current.play();
        }
      }, 1000); // 1 second delay
    }
  };

  const handlePrevious = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    }
  };

  const handleNext = () => {
    if (
      currentLineIndex < song.length - 1 &&
      completedLines[currentLineIndex]
    ) {
      setCurrentLineIndex(currentLineIndex + 1);
    }
  };

  const progress = (completedLines.filter(Boolean).length / song.length) * 100;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Learn the Song</h1>
      <Progress percent={progress} status="active" className="mb-6" />

      <LanguageLearningComponent
        key={currentLineIndex}
        title={song[currentLineIndex]}
        correctOrder={song[currentLineIndex].correctOrder}
        alternative={song[currentLineIndex].alternative}
        audio={song[currentLineIndex].audio}
        onComplete={() => handleComplete(currentLineIndex)}
      />

      <div className="flex justify-between mt-6">
        <Button
          icon={<LeftOutlined />}
          onClick={handlePrevious}
          disabled={currentLineIndex === 0}
        >
          Previous
        </Button>
        <Button
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={
            currentLineIndex === song.length - 1 ||
            !completedLines[currentLineIndex]
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SongTeacher;
