import { useRef, useState } from "react";
import { Layout, Menu, Progress, Button } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  MenuOutlined,
  RightOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  AudioOutlined,
} from "@ant-design/icons";
// import SongTeacher from "./components/SongTeacher";
import YouTubeSectionPlayer from "./components/YTPlayer";
import SongTeacher from "./components/SongTeacherYT";

const { Header, Sider, Content } = Layout;

// Dummy data for the course content
const courseContent = [
  {
    title: "INTRODUCTION",
    lessons: [
      { title: "The Best Way To Use The Mystery School", type: "text" },
    ],
  },
  {
    title: "THE BOOK OF TRANSFORMATION: The Art Of Discipline",
    lessons: [
      {
        title: "How To Make Your Life A Work Of Art",
        type: "video",
        duration: "2:39",
      },
      {
        title: "The Secret Of Daily Practice",
        type: "video",
        duration: "9:23",
      },
      {
        title: "The Most Attractive Quality That You Can Possess",
        type: "text",
      },
      {
        title: "How To Become A Creativity Machine (Part I)",
        type: "video",
        duration: "12:25",
      },
      { title: "How To Become A Creativity Machine (Part II)", type: "text" },
      { title: "The Mystery Formula", type: "text" },
      { title: "The Make Art Not Content Podcast", type: "audio" },
      { title: "The Five Stages Of Commitment", type: "text" },
    ],
  },
  {
    title: "THE BOOK OF TRANSFORMATION: The Art Of Discipline",
    lessons: [
      {
        title: "How To Make Your Life A Work Of Art",
        type: "video",
        duration: "2:39",
      },
      {
        title: "The Secret Of Daily Practice",
        type: "video",
        duration: "9:23",
      },
      {
        title: "The Most Attractive Quality That You Can Possess",
        type: "text",
      },
      {
        title: "How To Become A Creativity Machine (Part I)",
        type: "video",
        duration: "12:25",
      },
      { title: "How To Become A Creativity Machine (Part II)", type: "text" },
      { title: "The Mystery Formula", type: "text" },
      { title: "The Make Art Not Content Podcast", type: "audio" },
      { title: "The Five Stages Of Commitment", type: "text" },
    ],
  },
  {
    title: "THE BOOK OF TRANSFORMATION: The Art Of Discipline",
    lessons: [
      {
        title: "How To Make Your Life A Work Of Art",
        type: "video",
        duration: "2:39",
      },
      {
        title: "The Secret Of Daily Practice",
        type: "video",
        duration: "9:23",
      },
      {
        title: "The Most Attractive Quality That You Can Possess",
        type: "text",
      },
      {
        title: "How To Become A Creativity Machine (Part I)",
        type: "video",
        duration: "12:25",
      },
      { title: "How To Become A Creativity Machine (Part II)", type: "text" },
      { title: "The Mystery Formula", type: "text" },
      { title: "The Make Art Not Content Podcast", type: "audio" },
      { title: "The Five Stages Of Commitment", type: "text" },
    ],
  },
  {
    title: "THE BOOK OF TRANSFORMATION: The Art Of Discipline",
    lessons: [
      {
        title: "How To Make Your Life A Work Of Art",
        type: "video",
        duration: "2:39",
      },
      {
        title: "The Secret Of Daily Practice",
        type: "video",
        duration: "9:23",
      },
      {
        title: "The Most Attractive Quality That You Can Possess",
        type: "text",
      },
      {
        title: "How To Become A Creativity Machine (Part I)",
        type: "video",
        duration: "12:25",
      },
      { title: "How To Become A Creativity Machine (Part II)", type: "text" },
      { title: "The Mystery Formula", type: "text" },
      { title: "The Make Art Not Content Podcast", type: "audio" },
      { title: "The Five Stages Of Commitment", type: "text" },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const song = {
  name: "আমি যামিনী | Aami Jamini",
  videoId: "NUu7xUxYnn0",
  song: [
    {
      EN: "aami jamini tumi shoshi he",
      HI: "आमी जमिनी तुमी शोशी हे",
      BN: "আমি যামিনী তুমি শশী হে",
      correctOrder: ["I", "am", "the", "night", "you", "are", "the", "moon"],
      audio: "/audio/1.mp3",
      start: 1,
      end: 10,
      trivia:
        "Jamini means night in Bengali, and Shoshi means moon. The song is a metaphor for the relationship between the night and the moon.",
    },
    {
      EN: "bhatichho gogon majhe",
      HI: "भातिछ गगन माझे",
      BN: "ভাতিছ গগন মাঝে",
      correctOrder: ["shining", "in", "the", "sky", "above"],
      alternative: ["shining", "above", "in", "the", "sky"],
      audio: "/audio/2.mp3",
      start: 11,
      end: 17,
    },
    {
      EN: "momo shorosheete tobo ujjol probha",
      HI: "मम सरसीते तब उज्जल प्रभा",
      BN: "মম সরসীতে তব উজল প্রভা",
      correctOrder: ["in", "my", "lake", "your", "bright", "light"],
      alternative: ["your", "bright", "light", "in", "my", "lake"],
      audio: "/audio/3.mp3",
      start: 36,
      end: 42,
    },
    {
      EN: "bimbito jeno laje",
      HI: "बिम्बित येन लाजे",
      BN: "বিম্বিত যেন লাজে",
      correctOrder: ["reflects", "as", "if", "shy"],
      audio: "/audio/4.mp3",
      start: 42,
      end: 46.5,
    },
    {
      EN: "tomay herigo swopone shoyone",
      HI: "तोमाय हेरिगो स्वपने शयने",
      BN: "তোমায় হেরিগো স্বপনে শয়নে",
      correctOrder: ["seeing", "you", "in", "dreams", "while", "sleeping"],
      audio: "/audio/5.mp3",
      start: "1:08",
      end: "1:13.5",
    },
    {
      EN: "tambur ranga boyane",
      HI: "ताम्बुर रंगा बयाने",
      BN: "তাম্বুর রাঙ্গা বয়ানে",
      correctOrder: ["face", "colored", "like", "paan"],
      alternative: ["colored", "like", "paan", "face"],
      start: "1:13.5",
      end: "1:23",
    },
    {
      EN: "mori oporup rup madhuri",
      HI: "मरि अपरूप रूप माधुरी",
      BN: "মরি অপরূপ রূপ মাধুরী",
      correctOrder: ["oh", "what", "exquisite", "beauty"],
      start: "1:24",
      end: "1:34.5",
    },
    {
      EN: "boshonto shom biraje",
      HI: "बसंत-सम बिराजे",
      BN: "বসন্ত-সম বিরাজে",
      correctOrder: ["like", "spring", "reigning"],
      alternative: ["reigning", "like", "spring"],
      start: "1:34.5",
      end: "1:38.7",
    },
    {
      EN: "tumi je shishir bindu",
      HI: "तुमि ये शिशिर बिंदु मम कुमुदिर",
      BN: "তুমি যে শিশির বিন্দু মম কুমুদির",
      options: ["you", "are", "dewdrop"],
      correctOrder: ["you", "are", "dewdrop"],
      start: "1:55",
      end: "2:00",
    },
    {
      EN: "momo kumudir bokkhe",
      HI: "मम कुमुदिर बोक्खे",
      BN: "মম কুমুদির বক্ষে",
      correctOrder: ["in", "my", "waterlily's", "heart"],
      start: "2:00",
      end: "2:05",
    },
    {
      EN: "na herile ogo tomare",
      HI: "बक्षे ना हेरिले ओगो तोमारे",
      BN: "বক্ষে না হেরিলে ওগো তোমারে",
      correctOrder: ["if", "not", "seeing", "you"],
      start: "2:05",
      end: "2:10",
    },
    {
      EN: "tomosha ghonay chokkhe",
      HI: "तमसा घनाय चक्षे",
      BN: "তমসা ঘনায় চক্ষে",
      correctOrder: ["darkness", "thickens", "in", "eyes"],
      start: "2:10.5",
      end: "2:15.5",
    },
    {
      EN: "tumi ogonito tara gogone",
      HI: "तुमि अगणित तारा गगने",
      BN: "তুমি অগণিত তাঁরা গগনে",
      correctOrder: [
        "you",
        "are",
        "the",
        "countless",
        "stars",
        "in",
        "the",
        "sky",
      ],
      start: "2:36",
      end: "2:41.5",
    },
    {
      EN: "pranbayou momo jibone",
      HI: "प्राणबायु मम जीवने",
      BN: "প্রাণবায়ু মম জীবনে",
      correctOrder: ["life-breath", "in", "my", "life"],
      start: "2:42",
      end: "2:51.5",
    },
    {
      EN: "tobo name momo prem muroli",
      HI: "तब नामे मम प्रेम मुरली",
      BN: "তব নামে মম প্রেম মুরলী",
      correctOrder: ["in", "your", "name", "my", "love", "flute"],
      alternative: ["my", "love", "flute", "in", "your", "name"],
      start: "2:51.6",
      end: "3:02",
    },
    {
      EN: "poraner gothe baje",
      HI: "पराणेर गोठे बाजे",
      BN: "পরাণের গোঠে বাজে",
      correctOrder: ["in", "heart's", "abode", "echoes"],
      alternative: ["echoes", "in", "heart's", "abode"],
      start: "3:02",
      end: "3:06.3",
    },
  ],
};

const CourseLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(
    courseContent[0].lessons[0]
  );

  const playerRef = useRef<{ playSection: () => void } | null>(null);

  const triggerPlaySection = () => {
    playerRef.current?.playSection();
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderMenuItem = (
    lesson: { title: string; type: string; duration?: string },
    index: string
  ) => (
    <Menu.Item
      style={{ whiteSpace: "normal", height: "auto", lineHeight: "1.5" }}
      key={index}
      onClick={() => setSelectedLesson(lesson)}
      className="flex py-2"
    >
      {lesson.type === "video" ? (
        <PlayCircleOutlined />
      ) : lesson.type === "audio" ? (
        <AudioOutlined />
      ) : (
        <FileTextOutlined />
      )}
      {"   "}
      {lesson.title}
      {lesson.duration && (
        <span className="text-xs text-gray-500 ml-2">({lesson.duration})</span>
      )}
    </Menu.Item>
  );

  return (
    <Layout className="min-h-screen overflow-hidden">
      {/* <Header className="bg-gray-800 p-0 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleSidebar}
            className="text-white"
          />
          <HomeOutlined className="text-white mx-4" />
          <SettingOutlined className="text-white" />
        </div>
        <Button type="primary" icon={<RightOutlined />} className="mr-4">
          Complete and Continue
        </Button>
      </Header> */}
      <Layout className="h-full">
        {/* <Sider
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
          collapsed={collapsed}
          className="bg-white absolute overflow-scroll h-full"
          width={
            window.innerHeight < window.innerWidth ? 350 : window.innerWidth
          }
          style={{ height: "calc(100vh - 64px)" }}
          trigger={null}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold text-white">The Mystery School</h2>
            <Progress percent={10} size="small" status="active" />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={["0"]}
            className="h-full overflow-scroll"
            disabledOverflow
          >
            {courseContent.map((section, sectionIndex) => (
              <Menu.ItemGroup
                key={sectionIndex}
                title={
                  <div className="text-black font-bold">{section.title}</div>
                }
              >
                {section.lessons.map((lesson, lessonIndex) =>
                  renderMenuItem(lesson, `${sectionIndex}-${lessonIndex}`)
                )}
              </Menu.ItemGroup>
            ))}
          </Menu>
        </Sider> */}
        <Content className="overflow-scroll" style={{ height: "100vh" }}>
          {/* <h1 className="text-2xl font-bold mb-4">{selectedLesson.title}</h1> */}
          <div className="bg-gray-100 rounded flex">
            <SongTeacher song={song} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CourseLayout;
