import React, { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Input, Button, Space, Typography, message, Form } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Sanscript from "@indic-transliteration/sanscript";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Annotation {
  BN: string;
  EN: string;
  correctOrder: string[];
  alternative: string[][];
  trivia: string;
  start: number;
  end: number;
}

interface JsonData {
  name: string;
  videoId: string;
  introduction: string;
  song: Annotation[];
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = "bn-IN";
      newRecognition.continuous = false;
      newRecognition.interimResults = false;

      newRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        const transliteratedText = Sanscript.t(transcript, "bengali", "itrans")
          .toLowerCase()
          .replace(".", "");

        setCurrentAnnotation((prev) => ({
          ...prev,
          BN: transcript,
          EN: transliteratedText,
        }));
      };

      newRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      setRecognition(newRecognition);
    }
  }, []);

  const onReady = (event: YouTubeEvent<YouTubePlayer>) => {
    playerRef.current = event.target;
  };

  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const id = url.split("v=")[1];
    setVideoId(id);
  };

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    } else {
      message.error("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      updateEndTime();
    }
  };

  const updateEndTime = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setCurrentAnnotation((prev) => ({ ...prev, end: currentTime }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "correctOrder") {
      setCurrentAnnotation((prev) => ({ ...prev, [name]: value.split(" ") }));
    } else if (name === "alternative") {
      // Do nothing here, we'll handle alternative separately
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

  const validateAlternative = (
    correctOrder: string[],
    alternative: string[][]
  ) => {
    return alternative.every((alt) =>
      alt.every((word) => correctOrder.includes(word))
    );
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

  const handleDownload = () => {
    const jsonData: JsonData = {
      name: annotations[0]?.EN || "Untitled",
      videoId: videoId,
      introduction: introduction,
      song: annotations,
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      annotations[0]?.EN?.toLowerCase().replace(" ", "_") + ".json" ||
      "untitled.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSetTime = (timeType: "start" | "end") => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setCurrentAnnotation((prev) => ({ ...prev, [timeType]: currentTime }));
  };

  const handleEdit = (index: number) => {
    setCurrentAnnotation(annotations[index]);
    setEditingIndex(index);
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
        <Form layout="vertical">
          <Form.Item label="Bengali:">
            <Space>
              <Input
                value={currentAnnotation.BN}
                onChange={handleInputChange}
                name="BN"
                style={{ width: "300px" }}
              />
              <Button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="Transliteration:">
            <Space>
              <Input
                value={currentAnnotation.EN}
                onChange={handleInputChange}
                name="EN"
                style={{ width: "300px" }}
              />
              <Button
                onClick={() => {
                  const transliteratedText = Sanscript.t(
                    currentAnnotation.BN,
                    "bengali",
                    "itrans"
                  )
                    .toLowerCase()
                    .replace(".", "");
                  setCurrentAnnotation((prev) => ({
                    ...prev,
                    EN: transliteratedText,
                  }));
                }}
              >
                Transliterate
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="Correct Order (space-separated):">
            <Input
              value={currentAnnotation.correctOrder.join(" ")}
              onChange={handleInputChange}
              name="correctOrder"
            />
          </Form.Item>
          {currentAnnotation.alternative.map((alt, index) => (
            <Form.Item
              key={index}
              label={`Alternative Order ${index + 1} (space-separated):`}
            >
              <Input
                value={alt.join(" ")}
                onChange={(e) => handleAlternativeChange(index, e.target.value)}
              />
            </Form.Item>
          ))}
          <Button onClick={addAlternative} icon={<PlusOutlined />}>
            Add Another Alternative
          </Button>
          <Form.Item label="Trivia:">
            <TextArea
              value={currentAnnotation.trivia}
              onChange={handleInputChange}
              name="trivia"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Start Time:">
            <Space>
              <Input
                value={currentAnnotation.start.toFixed(2)}
                onChange={(e) =>
                  setCurrentAnnotation((prev) => ({
                    ...prev,
                    start: parseFloat(e.target.value),
                  }))
                }
              />
              <Button onClick={() => handleSetTime("start")}>
                Set Current Time
              </Button>
            </Space>
          </Form.Item>
          <Form.Item label="End Time:">
            <Space>
              <Input
                value={currentAnnotation.end.toFixed(2)}
                onChange={(e) =>
                  setCurrentAnnotation((prev) => ({
                    ...prev,
                    end: parseFloat(e.target.value),
                  }))
                }
              />
              <Button onClick={() => handleSetTime("end")}>
                Set Current Time
              </Button>
            </Space>
          </Form.Item>
          <Button onClick={handleAddAnnotation}>
            {editingIndex !== null ? "Update Annotation" : "Add Annotation"}
          </Button>
        </Form>
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
          onClick={handleDownload}
          className="mt-4"
        >
          Download JSON
        </Button>
      </div>
    </div>
  );
};

export default YouTubeAnnotation;
