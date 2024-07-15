import React, { useState, useRef, useMemo } from "react";
import { Button, message } from "antd";
import { LeftSquareOutlined } from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

const SortableItem = ({
  id,
  text,
  onRemove,
  isDragging,
}: {
  id: string;
  text: string;
  onRemove: () => void;
  isDragging: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1 : "auto",
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Button
        size="small"
        onClick={onRemove}
        className="draggable-button"
        style={{
          boxShadow: isDragging ? "0 5px 15px rgba(0,0,0,0.2)" : "none",
          transform: isDragging ? "scale(1.05)" : "scale(1)",
          transition: "box-shadow 0.2s, transform 0.2s",
        }}
      >
        {text}
      </Button>
    </div>
  );
};

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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTrivia, setShowTrivia] = useState(false);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

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

  const handleRemoveWord = (id: string) => {
    setSelectedWords((prev) => prev.filter((word) => word.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedWords((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
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
    <div className="max-w-2xl mx-auto mt-2 md:mt-8 p-6 bg-white rounded-lg border-2 border-slate-100">
      <audio ref={audioRef} />

      <div className="flex items-center mb-4">
        <div className="text-center w-full">
          <h2 className="md:text-3xl text-xl mb-2 font-bold text-black bengali-text leading-relaxed">
            {title["BN"]}
          </h2>
          <h2 className="md:text-xl text-md text-gray-400 font-semibold">
            {title["EN"]}
          </h2>
          <h2 className="md:text-xl text-md text-gray-400 font-semibold">
            {title["HI"]}
          </h2>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mb-4 relative">
          <SortableContext
            items={selectedWords.map((w) => w.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="min-h-[40px] p-2 pr-12 border border-gray-300 rounded-md flex flex-wrap gap-2">
              {selectedWords.map((word) => (
                <SortableItem
                  key={word.id}
                  id={word.id}
                  text={word.text}
                  onRemove={() => handleRemoveWord(word.id)}
                  isDragging={word.id === activeId}
                />
              ))}
            </div>
          </SortableContext>
          <Button
            className="absolute right-0 top-0 bottom-0 rounded-l-none min-h-[40px]"
            icon={<LeftSquareOutlined />}
            onClick={handleBackspace}
            disabled={selectedWords.length === 0}
          />
        </div>
      </DndContext>

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
              className="option-button"
              style={{
                backgroundColor: isSelected ? "#f0f0f0" : "white",
                color: isSelected ? "#bfbfbf" : "inherit",
                border: isSelected ? "1px solid #d9d9d9" : "1px solid #d9d9d9",
                cursor: isSelected ? "default" : "pointer",
                touchAction: "none",
              }}
              disabled={isSelected}
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
