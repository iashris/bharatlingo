import React from "react";
import { Input, Button, Space, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Annotation } from "./types";

const { TextArea } = Input;

interface AnnotationFormProps {
  currentAnnotation: Annotation;
  isRecording: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onAlternativeChange: (index: number, value: string) => void;
  onAddAlternative: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSetTime: (timeType: "start" | "end") => void;
  onTransliterate: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const AnnotationForm: React.FC<AnnotationFormProps> = ({
  currentAnnotation,
  isRecording,
  onInputChange,
  onAlternativeChange,
  onAddAlternative,
  onStartRecording,
  onStopRecording,
  onSetTime,
  onTransliterate,
  onSubmit,
  isEditing,
}) => {
  return (
    <Form layout="vertical">
      <Form.Item label="Bengali:">
        <Space>
          <Input
            value={currentAnnotation.BN}
            onChange={onInputChange}
            name="BN"
            style={{ width: "300px" }}
          />
          <Button onClick={isRecording ? onStopRecording : onStartRecording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
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
          <Button onClick={() => onSetTime("start")}>Set Current Time</Button>
        </Space>
      </Form.Item>
      <Form.Item label="End Time:">
        <Space>
          <Input
            value={currentAnnotation.end.toFixed(2)}
            onChange={onInputChange}
            name="end"
          />
          <Button onClick={() => onSetTime("end")}>Set Current Time</Button>
        </Space>
      </Form.Item>
      <Button onClick={onSubmit}>
        {isEditing ? "Update Annotation" : "Add Annotation"}
      </Button>
    </Form>
  );
};

export default AnnotationForm;
