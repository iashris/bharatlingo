import React, { useState, useRef, useCallback } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Typography, message, Upload, Tooltip, Tabs, Select } from "antd";
import {
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { JsonData } from "./types";
import { validateAlternative, downloadJson } from "./utils";
import { Input, Button, Space, Form } from "antd";
import { Annotation } from "./types";
import Sanscript from "@indic-transliteration/sanscript";

const { Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const OVERLAP_THRESHOLD = 3; // seconds

const LANGUAGES = [
  { code: "bn-IN", name: "Bengali", script: "bengali", voice: 1 },
  { code: "ta-IN", name: "Tamil", script: "tamil", voice: 1 },
  { code: "mr-IN", name: "Marathi", script: "devanagari", voice: 1 },
  { code: "te-IN", name: "Telugu", script: "telugu", voice: 1 },
  { code: "ml-IN", name: "Malayalam", script: "malayalam", voice: 1 },
  { code: "ne-NP", name: "Nepali", script: "devanagari", voice: 1 },
  { code: "hi-IN", name: "Hindi", script: "devanagari", voice: 1 },
  { code: "gu-IN", name: "Gujarati", script: "gujarati", voice: 1 },
  { code: "kn-IN", name: "Kannada", script: "kannada", voice: 1 },
  { code: "pa-IN", name: "Punjabi", script: "gurmukhi", voice: 0 },
  { code: "or-IN", name: "Odia", script: "oriya", voice: 0 },
  { code: "as-IN", name: "Assamese", script: "assamese", voice: 0 }, // Changed from bengali to assamese
  { code: "mai-IN", name: "Maithili", script: "tirhuta_maithili", voice: 0 }, // Changed from devanagari to tirhuta_maithili
  { code: "bho-IN", name: "Bhojpuri", script: "devanagari", voice: 0 },
  { code: "awa-IN", name: "Awadhi", script: "devanagari", voice: 0 },
  { code: "kok-IN", name: "Konkani", script: "devanagari", voice: 0 },
  { code: "tcy-IN", name: "Tulu", script: "kannada", voice: 0 },
  { code: "sa-IN", name: "Sanskrit", script: "devanagari", voice: 0 },
  { code: "si-LK", name: "Sinhala", script: "sinhala", voice: 1 },
  { code: "ur-IN", name: "Urdu", script: "urdu", voice: 1 },
  { code: "sd-IN", name: "Sindhi", script: "devanagari", voice: 0 },
  { code: "brx-IN", name: "Bodo", script: "devanagari", voice: 0 },
  { code: "sat-IN", name: "Santali", script: "ol_chiki", voice: 0 }, // Changed from ol-chiki to ol_chiki
];

const YouTubeAnnotation: React.FC = () => {
  const [videoId, setVideoId] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [name, setName] = useState<string>("");
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
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
  const [activeTab, setActiveTab] = useState<string>("1");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const transliterate = useCallback(
    (text: string) => {
      return Sanscript.t(text, selectedLanguage.script, "itrans", {})
        .toLowerCase()
        .replace(".", "");
    },
    [selectedLanguage]
  );

  const startRecording = useCallback(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (!recognitionRef.current) {
        console.error("Speech recognition not supported in this browser");
        return;
      }
      recognitionRef.current.lang = selectedLanguage.code;
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setCurrentAnnotation((prev) => ({
          ...prev,
          BN: transcript,
          EN: transliterate(transcript),
        }));
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      console.error("Speech recognition not supported in this browser");
    }
  }, [selectedLanguage, transliterate]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const handleRecordingToggle = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  const onReady = (event: YouTubeEvent<YouTubePlayer>) => {
    playerRef.current = event.target;
  };

  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const id = url.split("v=")[1];
    setVideoId(id);
  };

  const onInputChange = (
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

  const onAlternativeChange = (index: number, value: string) => {
    setCurrentAnnotation((prev) => {
      const newAlternative = [...prev.alternative];
      newAlternative[index] = value.split(" ");
      return { ...prev, alternative: newAlternative };
    });
  };

  const onAddAlternative = () => {
    setCurrentAnnotation((prev) => ({
      ...prev,
      alternative: [...prev.alternative, []],
    }));
  };

  const sortAnnotations = (anns: Annotation[]): Annotation[] => {
    return [...anns].sort((a, b) => a.start - b.start);
  };

  const checkOverlap = (anns: Annotation[]): boolean => {
    for (let i = 0; i < anns.length - 1; i++) {
      if (anns[i + 1].start - anns[i].end < -OVERLAP_THRESHOLD) {
        message.error(
          `Annotations at index ${i} and ${
            i + 1
          } overlap by more than ${OVERLAP_THRESHOLD} seconds.`
        );
        return true;
      }
    }
    return false;
  };

  const onSubmit = () => {
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

      let newAnnotations: Annotation[];
      if (editingIndex !== null) {
        newAnnotations = annotations.map((ann, index) =>
          index === editingIndex ? currentAnnotation : ann
        );
      } else {
        newAnnotations = [...annotations, currentAnnotation];
      }

      newAnnotations = sortAnnotations(newAnnotations);

      if (checkOverlap(newAnnotations)) {
        return;
      }

      setAnnotations(newAnnotations);
      setEditingIndex(null);
      setCurrentAnnotation({
        BN: "",
        EN: "",
        correctOrder: [],
        alternative: [[]],
        trivia: "",
        start: newAnnotations[newAnnotations.length - 1].end,
        end: newAnnotations[newAnnotations.length - 1].end,
      });
      setActiveTab("2");
    } else {
      message.warning("Please fill in all required fields.");
    }
  };

  const onSetTime = (timeType: "start" | "end") => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setCurrentAnnotation((prev) => ({ ...prev, [timeType]: currentTime }));
  };

  const onGoToTime = (timeType: "start" | "end") => {
    const currentTime = currentAnnotation[timeType];
    playerRef.current?.seekTo(currentTime);
  };

  const handleLanguageChange = (value: string) => {
    const newLanguage = LANGUAGES.find((lang) => lang.code === value);
    if (newLanguage) {
      setSelectedLanguage(newLanguage);
    }
  };

  const onTransliterate = () => {
    setCurrentAnnotation((prev) => ({
      ...prev,
      EN: transliterate(prev.BN),
    }));
  };

  const handleUpload = (info: any) => {
    const { status } = info.file;
    if (status === "done") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData: JsonData = JSON.parse(e.target?.result as string);
          restoreStateFromJson(jsonData);
          message.success(`${info.file.name} file uploaded successfully.`);
        } catch (error) {
          message.error(
            `Failed to parse ${info.file.name}. Please ensure it's a valid JSON file.`
          );
        }
      };
      reader.readAsText(info.file.originFileObj);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const restoreStateFromJson = (jsonData: JsonData) => {
    setVideoId(jsonData.videoId);
    setIntroduction(jsonData.introduction);
    setName(jsonData.name);
    setAnnotations(sortAnnotations(jsonData.song));
    if (jsonData.song.length > 0) {
      setCurrentAnnotation({
        BN: "",
        EN: "",
        correctOrder: [],
        alternative: [[]],
        trivia: "",
        start: jsonData.song[jsonData.song.length - 1].end,
        end: jsonData.song[jsonData.song.length - 1].end,
      });
    }
  };

  const handleAnnotationClick = (index: number) => {
    setCurrentAnnotation(annotations[index]);
    setEditingIndex(index);
    setActiveTab("1");
  };

  const handleInsertAnnotation = (index: number) => {
    const newAnnotation: Annotation = {
      BN: "",
      EN: "",
      correctOrder: [],
      alternative: [[]],
      trivia: "",
      start: annotations[index].end,
      end: annotations[index].end + 1,
    };
    const newAnnotations = sortAnnotations([...annotations, newAnnotation]);
    if (checkOverlap(newAnnotations)) {
      return;
    }
    setAnnotations(newAnnotations);
    setCurrentAnnotation(newAnnotation);
    setEditingIndex(newAnnotations.findIndex((ann) => ann === newAnnotation));
    setActiveTab("1");
  };

  const handleDeleteAnnotation = (index: number) => {
    setAnnotations((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentAnnotation({
        BN: "",
        EN: "",
        correctOrder: [],
        alternative: [[]],
        trivia: "",
        start: 0,
        end: 0,
      });
    }
  };

  const isEditing = editingIndex !== null;

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="w-full md:w-1/2 pr-4">
        <Select
          style={{ width: 200 }}
          value={selectedLanguage.code}
          onChange={handleLanguageChange}
          className="mb-4"
        >
          {LANGUAGES.map((lang) => (
            <Select.Option key={lang.code} value={lang.code}>
              {lang.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Enter YouTube URL"
          onChange={handleVideoIdChange}
          value={`https://www.youtube.com/watch?v=${videoId}`}
          className="mb-4"
        />
        {videoId && (
          <YouTube
            videoId={videoId}
            opts={{ height: "390", width: "640" }}
            onReady={onReady}
          />
        )}
        <Input
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4"
        />
        <TextArea
          placeholder="Enter introduction"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          className="mt-4"
          rows={4}
        />
      </div>
      <div className="w-full md:w-1/2 pl-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Edit Annotation" key="1">
            <Form layout="vertical">
              <Form.Item label={selectedLanguage.name + ":"}>
                <Space>
                  <Input
                    value={currentAnnotation.BN}
                    onChange={onInputChange}
                    name="BN"
                    style={{ width: "300px" }}
                  />
                  {selectedLanguage.voice ? (
                    <Button onClick={handleRecordingToggle}>
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  ) : null}
                </Space>
              </Form.Item>
              <Form.Item label="Transliteration:">
                <Space>
                  <Input
                    value={currentAnnotation.EN}
                    onChange={onInputChange}
                    name="EN"
                    style={{ width: "300px" }}
                  />
                  <Button onClick={onTransliterate}>Transliterate</Button>
                </Space>
              </Form.Item>
              <Form.Item label="Correct Order (space-separated):">
                <Input
                  value={currentAnnotation.correctOrder.join(" ")}
                  onChange={onInputChange}
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
                    onChange={(e) => onAlternativeChange(index, e.target.value)}
                  />
                </Form.Item>
              ))}
              <Button onClick={onAddAlternative} icon={<PlusOutlined />}>
                Add Another Alternative
              </Button>
              <Form.Item label="Trivia:">
                <TextArea
                  value={currentAnnotation.trivia}
                  onChange={onInputChange}
                  name="trivia"
                  rows={4}
                />
              </Form.Item>
              <Form.Item label="Start Time:">
                <Space>
                  <Input
                    value={currentAnnotation.start.toFixed(2)}
                    onChange={onInputChange}
                    name="start"
                  />
                  <Button onClick={() => onSetTime("start")}>
                    Set Current Time
                  </Button>
                  <Button onClick={() => onGoToTime("start")}>
                    Go to time
                  </Button>
                </Space>
              </Form.Item>
              <Form.Item label="End Time:">
                <Space>
                  <Input
                    value={currentAnnotation.end.toFixed(2)}
                    onChange={onInputChange}
                    name="end"
                  />
                  <Button onClick={() => onSetTime("end")}>
                    Set Current Time
                  </Button>
                  <Button onClick={() => onGoToTime("end")}>Go to time</Button>
                </Space>
              </Form.Item>
              <Button onClick={onSubmit}>
                {isEditing ? "Update Annotation" : "Add Annotation"}
              </Button>
            </Form>
          </TabPane>
          <TabPane tab="Annotations List" key="2">
            {annotations.map((annotation, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded cursor-pointer hover:bg-gray-100`}
                onClick={() => handleAnnotationClick(index)}
              >
                <div className="flex justify-between items-start">
                  <Text>
                    {annotation.BN} - {annotation.EN} - Correct:{" "}
                    {annotation.correctOrder.join(", ")} - Alt:{" "}
                    {/* {annotation.alternative
                      .map((alt) => alt.join(", "))
                      .join(" | ")}{" "} */}
                    - Trivia: {annotation.trivia}({annotation.start.toFixed(2)}{" "}
                    - {annotation.end.toFixed(2)})
                  </Text>
                  <Space>
                    <Tooltip title="Insert">
                      <Button
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsertAnnotation(index);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAnnotation(index);
                        }}
                      />
                    </Tooltip>
                  </Space>
                </div>
              </div>
            ))}
          </TabPane>
        </Tabs>
        <Space className="mt-4">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() =>
              downloadJson(
                name,
                annotations,
                videoId,
                introduction,
                selectedLanguage.name
              )
            }
          >
            Download JSON
          </Button>
          <Upload
            accept=".json"
            showUploadList={false}
            customRequest={({ file, onSuccess }: any) => {
              setTimeout(() => {
                onSuccess("ok", file);
              }, 0);
            }}
            onChange={handleUpload}
          >
            <Button icon={<UploadOutlined />}>Upload JSON</Button>
          </Upload>
        </Space>
      </div>
    </div>
  );
};

export default YouTubeAnnotation;
