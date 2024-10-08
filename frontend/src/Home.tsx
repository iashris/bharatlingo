import { Card, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Footer, Header } from "./components/Common";

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
  {
    key: "munbe",
    title: "Munbe Vaa",
    id: "UPQZ4vuvW2s",
    difficulty: "hard",
    language: "Tamil",
  },
  {
    key: "denanna",
    title: "Dennanna Dennanna",
    id: "aQI_5aV9v_0",
    difficulty: "hard",
    language: "Tulu",
    contributor: "Parth Shelar",
  },
  {
    key: "kadhi",
    title: "Kadhi Te",
    id: "VYdWSp8pIjg",
    difficulty: "medium",
    language: "Marathi",
    contributor: "Mihir Khadilkar",
  },
  {
    key: "priyam",
    title: "Priyam Bharatam",
    id: "Vpv8eMlXuzM",
    difficulty: "medium",
    language: "Sanskrit",
    contributor: "Parth Shelar",
  },
  {
    key: "bhagyo",
    title: "Vagyo Re Dhol",
    id: "sDZA54sTqwQ",
    difficulty: "medium",
    language: "Gujarati",
    contributor: "Parth Shelar",
  },
];

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Title level={3} className="mb-8 text-center">
            Explore Indian Languages Through Music
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
                <div>
                  {item.contributor && (
                    <div className="mt-2 text-xs italic">
                      Contributed by {item.contributor}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
