import { Footer, Header } from "./components/Common";
import { Typography, Space, Button } from "antd";

const { Title, Paragraph } = Typography;

export const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Title level={1} className="text-center mb-8">
            About BharatLingo
          </Title>
          <Space direction="vertical" size="large" className="w-full">
            <Paragraph>
              Welcome to BharatLingo, where we're reimagining language learning
              through the power of music!
            </Paragraph>

            <Title level={3}>Our Motivation</Title>
            <Paragraph>
              At BharatLingo, we believe that learning a language should be an
              enjoyable and immersive experience. Our motivation stems from a
              simple yet powerful idea: to create a fun and engaging way to
              explore Indian languages without the monotony of traditional word
              memorization techniques.
            </Paragraph>

            <Title level={3}>Why Songs?</Title>
            <Paragraph>
              Music has a unique ability to connect with our emotions and
              memories. By using popular and classic songs from various Indian
              languages, we aim to:
            </Paragraph>
            <ul className="list-disc list-inside mb-4">
              <li>Make language learning more enjoyable and less daunting</li>
              <li>Help learners pick up natural phrases and expressions</li>
              <li>Provide cultural context along with language skills</li>
              <li>Improve pronunciation through melodic repetition</li>
              <li>Enhance vocabulary retention through musical association</li>
            </ul>

            <Title level={3}>Our Approach</Title>
            <Paragraph>
              Each song on BharatLingo is carefully selected to offer a blend of
              linguistic value and cultural significance. We provide:
            </Paragraph>
            <ul className="list-disc list-inside mb-4">
              <li>Lyrics in the original script and romanized form</li>
              <li>Word-by-word translations and explanations</li>
              <li>Cultural notes to understand the context better</li>
              <li>Interactive exercises to reinforce learning</li>
            </ul>

            <Title level={3}>Work in Progress</Title>
            <Paragraph>
              BharatLingo is an evolving project, and we're continuously working
              to improve and expand our offerings. We acknowledge that there's
              still much to do, and we're excited about the journey ahead. Your
              feedback and suggestions are invaluable in shaping the future of
              this platform.
            </Paragraph>

            <Title level={3}>Get Involved</Title>
            <Paragraph>
              We believe in the power of community and collaboration. If you're
              passionate about Indian languages, music, or education technology,
              we'd love to have you on board! Whether you're a language expert,
              a developer, a designer, or simply someone with great ideas, your
              contributions can make a significant impact.
            </Paragraph>
            <Paragraph>
              To volunteer or learn more about how you can contribute to
              BharatLingo, please email us at:
            </Paragraph>
            <Button
              type="primary"
              size="large"
              href="mailto:hello@iashris.com"
              className="mb-4"
            >
              hello@iashris.com
            </Button>

            <Paragraph>
              Join us in our mission to make language learning a melodious
              journey through the rich landscape of Indian cultures!
            </Paragraph>
          </Space>
        </div>
      </main>
      <Footer />
    </div>
  );
};
