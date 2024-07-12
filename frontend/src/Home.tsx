import React from "react";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const content = [
  {
    key: "jamini",
    title: "Aami Jamini, Tumi Soshi He",
    id: "NUu7xUxYnn0",
  },
  {
    key: "porano",
    title: "Amaro Porano Jaha Chay",
    id: "_69QcJf0LLU",
  },
];

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Title level={2} className="mb-6 text-center">
          Video Gallery
        </Title>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
