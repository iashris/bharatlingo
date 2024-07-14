import React, { useState, useRef } from "react";
import { Button, Modal, Progress } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import LanguageLearningComponent from "./FillBlanks";
import YouTubeSectionPlayer from "./YTPlayer";
import { YouTubeFillBlanksActivity } from "../types/common";
import { convertTimeToSeconds } from "../helpers";
import Lottie from "lottie-react";
import congratsAnimation from "../assets/congrats.json";
import { useNavigate } from "react-router-dom";

const SongTeacher: React.FC<{ song: YouTubeFillBlanksActivity }> = ({
  song: songObject,
}) => {
  const navigate = useNavigate();
  const { song, videoId, name: songName, introduction } = songObject;
  const [showIntroduction, setShowIntroduction] = useState(
    Boolean(introduction)
  );
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [completedLines, setCompletedLines] = useState<boolean[]>(
    new Array(song.length).fill(false)
  );
  const playerRef = useRef<{ playSection: () => void } | null>(null);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const updateScore = (correct: boolean) => {
    if (correct) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleComplete = (index: number) => {
    const newCompletedLines = [...completedLines];
    newCompletedLines[index] = true;
    setCompletedLines(newCompletedLines);

    if (index < song.length - 1) {
      setCurrentLineIndex(index + 1);
      // Play the video section for the next line after a short delay
      setTimeout(() => {
        playerRef.current?.playSection();
      }, 1000); // 1 second delay
    } else {
      setIsModalVisible(true);
    }
  };

  const handlePrevious = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    }
  };

  const handleNext = () => {
    if (showIntroduction) {
      setShowIntroduction(false);
      // Play the video section for the next line after a short delay
      setTimeout(() => {
        playerRef.current?.playSection();
      }, 1000); // 1 second delay
    } else if (
      currentLineIndex < song.length - 1 &&
      completedLines[currentLineIndex]
    ) {
      setCurrentLineIndex(currentLineIndex + 1);
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
        showIntroduction={showIntroduction}
      />
      {showIntroduction ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">About this song</h2>
          <p className="mb-4">{introduction}</p>
          <Button onClick={handleNext} className="w-full">
            Begin
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
            onSubmit={updateScore}
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
      <Modal
        open={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
        className="congratulatory-modal"
      >
        <div className="text-center">
          <Lottie
            animationData={congratsAnimation}
            loop={true}
            style={{ width: 200, height: 200, margin: "0 auto" }}
          />
          <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
          <p className="mb-4">You've completed the entire song!</p>
          <div className="mt-4">
            <p className="font-semibold">Your Score:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="text-green-500">
                <span className="font-bold">
                  {(100 * (1 - score.incorrect / score.correct)).toFixed(2) +
                    "%"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              type="primary"
              className="mr-2"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
            <Button
              onClick={() =>
                window
                  .open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
                  ?.focus()
              }
            >
              Watch video on YouTube
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SongTeacher;
