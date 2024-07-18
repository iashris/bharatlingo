import React from "react";
import { Card, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const content = [
  {
    key: "jamini",
    title: "Aami Jamini, Tumi Soshi He",
    id: "NUu7xUxYnn0",
    difficulty: "medium",
  },
  {
    key: "porano",
    title: "Amaro Porano Jaha Chay",
    id: "_69QcJf0LLU",
    difficulty: "medium",
  },
  {
    key: "maati",
    title: "Banglar Mati Banglar Jol",
    id: "OKGTug10PyE",
    difficulty: "easy",
  },
  {
    key: "tomarsonge",
    title: "Tomar Songe Bedhechi Amar Pran",
    id: "sFdDxKaGzs8",
    difficulty: "medium",
  },
  {
    key: "boshonto",
    title: "Boshonto Eshe Geche",
    id: "HohBnpGUllc",
    difficulty: "hard",
  },
  {
    key: "bandhibi",
    title: "Amar Haath Bandhibi",
    id: "PA7DKlXCYdU",
    difficulty: "easy",
  },
  {
    key: "ekla",
    title: "Ekla Cholo Re",
    id: "i5hQ6yBfZRE",
    difficulty: "medium",
  },
  {
    key: "kajal",
    title: "Gulabi Sadi",
    id: "B_6d3RBiEN0",
    difficulty: "medium",
    language: "Marathi",
  },
];

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Title level={2} className="mb-12 text-center">
          BharatLingo | Bengali
        </Title>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {content.map((item) => (
            <Card
              key={item.key}
              hoverable
              cover={
                <img
                  alt={item.title}
                  src={`https://img.youtube.com/vi/${item.id}/mqdefault.jpg`}
                  className="w-full object-cover"
                />
              }
              className="w-full"
              onClick={() => navigate(`/song?id=${item.key}`)}
            >
              <Card.Meta title={item.title} />
              <Tag
                className="mt-2 text-xs"
                color={
                  item.difficulty === "easy"
                    ? "green"
                    : item.difficulty === "medium"
                    ? "orange"
                    : "red"
                }
              >
                {item.difficulty}
              </Tag>
              <Tag className="mt-2 text-xs" color="blue">
                {item.language || "Bengali"}
              </Tag>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
