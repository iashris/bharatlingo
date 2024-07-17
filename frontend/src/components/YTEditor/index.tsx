import React, { useState, useRef, useEffect } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Input, Button, Typography, message } from "antd";
import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { Annotation } from "./types";
import useSpeechRecognition from "./useSpeechRecognition";
import { validateAlternative, downloadJson } from "./utils";
import AnnotationForm from "./AnnotationForm";

const { Title, Text } = Typography;
const { TextArea } = Input;

const YouTubeAnnotation: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation>({
    BN: "",
    EN: "",
    correctOrder: [],
    alternative: [[]],
    trivia: "",
    start: 0,
    end: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    getTransliteratedText,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setCurrentAnnotation((prev) => ({
        ...prev,
        BN: transcript,
        EN: getTransliteratedText(),
      }));
    }
  }, [transcript, getTransliteratedText]);

  const onReady = (event: YouTubeEvent<YouTubePlayer>) => {
    playerRef.current = event.target;
  };

  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const id = url.split("v=")[1];
    setVideoId(id);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "correctOrder") {
      setCurrentAnnotation((prev) => ({ ...prev, [name]: value.split(" ") }));
    } else if (name === "start" || name === "end") {
      setCurrentAnnotation((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setCurrentAnnotation((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAlternativeChange = (index: number, value: string) => {
    setCurrentAnnotation((prev) => {
      const newAlternative = [...prev.alternative];
      newAlternative[index] = value.split(" ");
      return { ...prev, alternative: newAlternative };
    });
  };

  const addAlternative = () => {
    setCurrentAnnotation((prev) => ({
      ...prev,
      alternative: [...prev.alternative, []],
    }));
  };

  const handleAddAnnotation = () => {
    if (
      currentAnnotation.BN &&
      currentAnnotation.EN &&
      currentAnnotation.correctOrder.length > 0
    ) {
      if (
        !validateAlternative(
          currentAnnotation.correctOrder,
          currentAnnotation.alternative
        )
      ) {
        message.error(
          "Alternative order can only contain words from the correct order."
        );
        return;
      }
      if (editingIndex !== null) {
        setAnnotations((prev) => {
          const newAnnotations = [...prev];
          newAnnotations[editingIndex] = currentAnnotation;
          return newAnnotations;
        });
        setEditingIndex(null);
      } else {
        setAnnotations((prev) => [...prev, currentAnnotation]);
      }
      setCurrentAnnotation({
        BN: "",
        EN: "",
        correctOrder: [],
        alternative: [[]],
        trivia: "",
        start: currentAnnotation.end,
        end: currentAnnotation.end,
      });
    } else {
      message.warning("Please fill in all required fields.");
    }
  };

  const handleSetTime = (timeType: "start" | "end") => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setCurrentAnnotation((prev) => ({ ...prev, [timeType]: currentTime }));
  };

  const handleEdit = (index: number) => {
    setCurrentAnnotation(annotations[index]);
    setEditingIndex(index);
  };

  const handleTransliterate = () => {
    setCurrentAnnotation((prev) => ({
      ...prev,
      EN: getTransliteratedText(),
    }));
  };

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="w-full md:w-1/2 pr-4">
        <Input
          placeholder="Enter YouTube URL"
          onChange={handleVideoIdChange}
          className="mb-4"
        />
        {videoId && (
          <YouTube
            videoId={videoId}
            opts={{ height: "390", width: "640" }}
            onReady={onReady}
          />
        )}
        <TextArea
          placeholder="Enter introduction"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          className="mt-4"
          rows={4}
        />
      </div>
      <div className="w-full md:w-1/2 pl-4">
        <Title level={3}>Annotation Input</Title>
        <AnnotationForm
          currentAnnotation={currentAnnotation}
          isRecording={isRecording}
          onInputChange={handleInputChange}
          onAlternativeChange={handleAlternativeChange}
          onAddAlternative={addAlternative}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSetTime={handleSetTime}
          onTransliterate={handleTransliterate}
          onSubmit={handleAddAnnotation}
          isEditing={editingIndex !== null}
        />
        <Title level={4} className="mt-4">
          Annotations
        </Title>
        {annotations.map((annotation, index) => (
          <div key={index} className="mb-2 flex justify-between items-start">
            <Text>
              {annotation.BN} - {annotation.EN} - Correct:{" "}
              {annotation.correctOrder.join(", ")} - Alt:{" "}
              {annotation.alternative.map((alt) => alt.join(", ")).join(" | ")}{" "}
              - Trivia: {annotation.trivia}({annotation.start.toFixed(2)} -{" "}
              {annotation.end.toFixed(2)})
            </Text>
            <Button onClick={() => handleEdit(index)} icon={<EditOutlined />} />
          </div>
        ))}
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => downloadJson(annotations, videoId, introduction)}
          className="mt-4"
        >
          Download JSON
        </Button>
      </div>
    </div>
  );
};

export default YouTubeAnnotation;
