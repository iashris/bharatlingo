import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ChallengeWithMetadata } from "./types";

const { Option } = Select;

interface ChallengeEditorProps {
  challenges: ChallengeWithMetadata[];
  onChallengeChange: (challenges: ChallengeWithMetadata[]) => void;
  isSpeechEnabled?: boolean;
}

const ChallengeEditor: React.FC<ChallengeEditorProps> = ({
  challenges,
  onChallengeChange,
  isSpeechEnabled = false,
}) => {
  const [editingChallenge, setEditingChallenge] =
    useState<ChallengeWithMetadata | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingChallenge) {
      form.setFieldsValue(editingChallenge);
    } else {
      form.resetFields();
    }
  }, [editingChallenge, form]);

  const showModal = (challenge?: ChallengeWithMetadata) => {
    setEditingChallenge(challenge || null);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.type === "mcq") {
        // Rearrange options to ensure the correct one is first
        const correctOption = values.options.find((option) => option.isCorrect);
        const incorrectOptions = values.options.filter(
          (option) => !option.isCorrect
        );

        if (!correctOption) {
          message.error("Please select a correct option");
          return;
        }

        values.options = [correctOption, ...incorrectOptions].map(
          ({ text }) => ({ text })
        );
      }

      const updatedChallenge: ChallengeWithMetadata = {
        ...values,
        id: editingChallenge ? editingChallenge.id : Date.now().toString(),
      };

      const updatedChallenges = editingChallenge
        ? challenges.map((c) =>
            c.id === editingChallenge.id ? updatedChallenge : c
          )
        : [...challenges, updatedChallenge];

      onChallengeChange(updatedChallenges);
      setIsModalVisible(false);
      setEditingChallenge(null);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleDelete = (id: string) => {
    const updatedChallenges = challenges.filter((c) => c.id !== id);
    onChallengeChange(updatedChallenges);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingChallenge(null);
  };

  const renderChallengeForm = () => {
    return (
      <Form form={form} layout="vertical" initialValues={{ type: "mcq" }}>
        <Form.Item
          name="type"
          label="Challenge Type"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="mcq">Multiple Choice Question</Option>
            {isSpeechEnabled && <Option value="speak">Speak Challenge</Option>}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.type !== currentValues.type
          }
        >
          {({ getFieldValue }) => {
            const challengeType = getFieldValue("type");
            return challengeType === "mcq"
              ? renderMCQFields()
              : renderSpeakFields();
          }}
        </Form.Item>
      </Form>
    );
  };

  const renderMCQFields = () => (
    <>
      <Form.Item name="question" label="Question" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="imageUrl" label="Image URL (optional)">
        <Input />
      </Form.Item>
      <Form.List name="options">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => {
              const { key, name, ...restField } = field;
              return (
                <Space
                  key={key}
                  align="end"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    label={`Option ${index + 1}`}
                    name={[name, "text"]}
                    rules={[
                      { required: true, message: "Option text is required" },
                    ]}
                  >
                    <Input style={{ width: 300 }} />
                  </Form.Item>
                  <Form.Item
                    className="w-36"
                    {...restField}
                    name={[name, "isCorrect"]}
                    valuePropName="checked"
                  >
                    <Select>
                      <Option value={true}>Correct</Option>
                      <Option value={false}>Incorrect</Option>
                    </Select>
                  </Form.Item>
                  {index > 0 && <DeleteOutlined onClick={() => remove(name)} />}
                </Space>
              );
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Option
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );

  const renderSpeakFields = () => (
    <>
      <Form.Item name="prompt" label="Prompt" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="imageUrl" label="Image URL (optional)">
        <Input />
      </Form.Item>
      <Form.Item name="audioPromptUrl" label="Audio Prompt URL (optional)">
        <Input />
      </Form.Item>
      <Form.Item
        name="correctResponse"
        label="Correct Response"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </>
  );

  return (
    <div>
      <Button onClick={() => showModal()} icon={<PlusOutlined />}>
        Add New Challenge
      </Button>
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          style={{ marginTop: 16, padding: 16, border: "1px solid #d9d9d9" }}
        >
          <h4>
            {challenge.type === "mcq"
              ? "Multiple Choice Question"
              : "Speak Challenge"}
          </h4>
          <p>
            {challenge.type === "mcq" ? challenge.question : challenge.prompt}
          </p>
          <Space>
            <Button onClick={() => showModal(challenge)}>Edit</Button>
            <Button danger onClick={() => handleDelete(challenge.id)}>
              Delete
            </Button>
          </Space>
        </div>
      ))}
      <Modal
        title={editingChallenge ? "Edit Challenge" : "Create New Challenge"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        {renderChallengeForm()}
      </Modal>
    </div>
  );
};

export default ChallengeEditor;
