import React, { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Input, Button, Space, Typography, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Sanscript from "@indic-transliteration/sanscript";

const { Title, Text } = Typography;

interface Annotation {
  BN: string;
  EN: string;
  correctOrder: string[];
  alternative: string[];
  trivia: string;
  start: number;
  end: number;
}

interface JsonData {
  name: string;
  videoId: string;
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
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation>({
    BN: "",
    EN: "",
    correctOrder: [],
    alternative: [],
    trivia: "",
    start: 0,
    end: 0,
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

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
        const transliteratedText = Sanscript.t(transcript, "bengali", "iast")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "correctOrder" || name === "alternative") {
      setCurrentAnnotation((prev) => ({ ...prev, [name]: value.split(" ") }));
    } else {
      setCurrentAnnotation((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateAlternative = (
    correctOrder: string[],
    alternative: string[]
  ) => {
    return alternative.every((word) => correctOrder.includes(word));
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
      setAnnotations((prev) => [...prev, { ...currentAnnotation }]);
      setCurrentAnnotation({
        BN: "",
        EN: "",
        correctOrder: [],
        alternative: [],
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
      song: annotations,
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youtube_annotation.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSetTime = (timeType: "start" | "end") => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setCurrentAnnotation((prev) => ({ ...prev, [timeType]: currentTime }));
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
      </div>
      <div className="w-full md:w-1/2 pl-4">
        <Title level={3}>Annotation Input</Title>
        <Space direction="vertical" className="w-full">
          <div>
            <Text>Bengali:</Text>
            <Space>
              <Input
                value={currentAnnotation.BN}
                onChange={handleInputChange}
                name="BN"
              />
              <Button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Space>
          </div>
          <div>
            <Text>Transliteration:</Text>
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
            <Input
              value={currentAnnotation.EN}
              onChange={handleInputChange}
              name="EN"
            />
          </div>
          <div>
            <Text>Correct Order (space-separated):</Text>
            <Input
              value={currentAnnotation.correctOrder.join(" ")}
              onChange={handleInputChange}
              name="correctOrder"
            />
          </div>
          <div>
            <Text>Alternative Order (space-separated):</Text>
            <Input
              value={currentAnnotation.alternative.join(" ")}
              onChange={handleInputChange}
              name="alternative"
            />
          </div>
          <div>
            <Text>Trivia:</Text>
            <Input
              value={currentAnnotation.trivia}
              onChange={handleInputChange}
              name="trivia"
            />
          </div>
          <div>
            <Text>Start Time:</Text>
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
          </div>
          <div>
            <Text>End Time:</Text>
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
          </div>
          <Button onClick={handleAddAnnotation}>Add Annotation</Button>
        </Space>
        <Title level={4} className="mt-4">
          Annotations
        </Title>
        {annotations.map((annotation, index) => (
          <div key={index} className="mb-2">
            <Text>
              {annotation.BN} - {annotation.EN} - Correct:{" "}
              {annotation.correctOrder.join(", ")} - Alt:{" "}
              {annotation.alternative.join(", ")} - Trivia: {annotation.trivia}(
              {annotation.start.toFixed(2)} - {annotation.end.toFixed(2)})
            </Text>
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
