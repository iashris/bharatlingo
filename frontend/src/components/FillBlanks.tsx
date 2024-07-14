import React, { useState, useRef, useMemo } from "react";
import { Button, message } from "antd";
import { LeftSquareOutlined } from "@ant-design/icons";

interface Word {
  id: string;
  text: string;
}

interface LanguageLearningComponentProps {
  title: {
    EN: string;
    HI: string;
    BN: string;
  };
  correctOrder: string[];
  alternative?: string[][] | string[];
  audio?: string;
  onComplete?: () => void;
  onSubmit?: (correct: boolean) => void;
  trivia?: string;
}

const LanguageLearningComponent: React.FC<LanguageLearningComponentProps> = ({
  title,
  correctOrder,
  audio,
  onComplete,
  onSubmit,
  alternative,
  trivia,
}) => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTrivia, setShowTrivia] = useState(false);

  const randomOptions = useMemo(() => {
    return correctOrder
      .map((word, index) => ({
        id: `${word}-${index}`,
        text: word,
      }))
      .sort(() => Math.random() - 0.5);
  }, [correctOrder]);

  const handleWordClick = (word: Word) => {
    if (!selectedWords.some((selected) => selected.id === word.id)) {
      setSelectedWords((prev) => [...prev, word]);
    }
  };

  const handleBackspace = () => {
    setSelectedWords((prev) => {
      const newSelected = [...prev];
      newSelected.pop();
      return newSelected;
    });
  };

  const handleRemoveWord = (index: number) => {
    setSelectedWords((prev) => {
      const newSelected = [...prev];
      newSelected.splice(index, 1);
      return newSelected;
    });
  };

  const handleSubmit = () => {
    const submittedOrder = selectedWords.map((word) => word.text);
    const isOrderCorrect =
      JSON.stringify(submittedOrder) === JSON.stringify(correctOrder) ||
      (alternative &&
        Array.isArray(alternative) &&
        JSON.stringify(submittedOrder) === JSON.stringify(alternative)) ||
      (alternative &&
        alternative.some(
          (alt) => JSON.stringify(submittedOrder) === JSON.stringify(alt)
        ));

    onSubmit?.(Boolean(isOrderCorrect));

    if (isOrderCorrect) {
      message.success("Correct!");
      new Audio("/correct.mp3")
        .play()
        .catch((e) => console.error("Audio error:", e));

      if (trivia) {
        setShowTrivia(true);
      } else {
        onComplete?.();
      }
    } else {
      message.error("Let's try again!");
      new Audio("/wrong.mp3")
        .play()
        .catch((e) => console.error("Audio error:", e));
    }
  };

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  const handleTriviaNext = () => {
    setShowTrivia(false);
    onComplete?.();
  };

  const renderTriviaWithLinks = (trivia: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = trivia.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg border-2 border-slate-100">
      <audio ref={audioRef} />

      <div className="flex items-center mb-4">
        {/* {audio && (
          <Button
            icon={<SoundOutlined />}
            onClick={handlePlayAudio}
            shape="circle"
            className="mr-2"
          />
        )} */}
        <div className="text-center w-full">
          <h2 className="text-3xl mb-2 font-bold text-black bengali-text">
            {title["BN"]}
          </h2>
          <h2 className="text-xl text-gray-400 font-semibold">{title["EN"]}</h2>
          <h2 className="text-xl text-gray-400 font-semibold">{title["HI"]}</h2>
        </div>
      </div>

      <div className="mb-4 relative">
        <div className="h-[40px] p-2 pr-12 border border-gray-300 rounded-md flex flex-wrap gap-2">
          {selectedWords.map((word, index) => (
            <Button
              key={word.id}
              onClick={() => handleRemoveWord(index)}
              size="small"
            >
              {word.text}
            </Button>
          ))}
        </div>
        <Button
          className="absolute right-0 top-0 bottom-0 rounded-l-none h-[40px]"
          icon={<LeftSquareOutlined />}
          onClick={handleBackspace}
          disabled={selectedWords.length === 0}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2 justify-center min-h-[24px]">
        {randomOptions.map((option) => {
          const isSelected = selectedWords.some(
            (selected) => selected.id === option.id
          );
          return (
            <Button
              key={option.id}
              onClick={() => handleWordClick(option)}
              size="small"
              className={`transition-all ${
                isSelected
                  ? "bg-gray-200 text-gray-200 pointer-events-none"
                  : ""
              }`}
            >
              {option.text}
            </Button>
          );
        })}
      </div>

      {showTrivia && trivia && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-600">{renderTriviaWithLinks(trivia)}</p>
        </div>
      )}

      <div className="flex justify-center my-4">
        {showTrivia ? (
          <Button
            type="primary"
            className="w-36 mt-6"
            onClick={handleTriviaNext}
            size="large"
          >
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            className="w-36 mt-6"
            size="large"
            onClick={handleSubmit}
            disabled={selectedWords.length !== correctOrder.length}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default LanguageLearningComponent;
