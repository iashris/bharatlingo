import React, { useState, useRef, useMemo } from "react";
import { Button, message } from "antd";
import { SoundOutlined, DeleteOutlined } from "@ant-design/icons";

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
    setSelectedWords((prev) => [...prev, word]);
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
      if (trivia) {
        setShowTrivia(true);
      } else {
        onComplete?.();
      }
    } else {
      message.error("Let's try again!");
    }
  };

  const handleRemoveAll = () => {
    setSelectedWords([]);
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleTriviaNext = () => {
    setShowTrivia(false);
    onComplete?.();
  };

  const remainingOptions = randomOptions.filter(
    (option) => !selectedWords.some((selected) => selected.id === option.id)
  );

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
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {audio && (
          <Button
            icon={<SoundOutlined />}
            onClick={handlePlayAudio}
            shape="circle"
            className="mr-2"
          />
        )}
        <div className="text-center w-full">
          <h2 className="text-4xl mb-2 font-bold text-black">{title["BN"]}</h2>

          <h2 className="text-xl text-gray-400 font-semibold">{title["EN"]}</h2>
          <h2 className="text-xl  text-gray-400 font-semibold">
            {title["HI"]}
          </h2>
        </div>
      </div>

      <div className="mb-4 min-h-[40px] p-2 border border-gray-300 rounded-md flex flex-wrap gap-2">
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

      <div className="mb-4 flex flex-wrap gap-2 justify-center min-h-18">
        {remainingOptions.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleWordClick(option)}
            size="small"
          >
            {option.text}
          </Button>
        ))}
      </div>
      {showTrivia && trivia && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-600">{renderTriviaWithLinks(trivia)}</p>
        </div>
      )}
      <div className="flex justify-between mb-4">
        <Button
          onClick={handleRemoveAll}
          icon={<DeleteOutlined />}
          disabled={!selectedWords.length}
        >
          Remove All
        </Button>
        {showTrivia ? (
          <Button type="primary" onClick={handleTriviaNext}>
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={selectedWords.length !== correctOrder.length}
          >
            Submit
          </Button>
        )}

        {/* Dev button */}
      </div>
    </div>
  );
};

export default LanguageLearningComponent;
