interface MCQOption {
  text: string;
  isCorrect: boolean;
}

interface MCQChallenge {
  type: "mcq";
  question: string;
  imageUrl?: string;
  options: MCQOption[]; // First option is always the correct one
}

interface SpeakChallenge {
  type: "speak";
  prompt: string;
  imageUrl?: string;
  audioPromptUrl?: string;
  correctResponse: string;
}

interface ChallengeMetadata {
  id: string;
}

// Union type for all challenge types
type Challenge = MCQChallenge | SpeakChallenge;

// Combine challenge data with metadata
export type ChallengeWithMetadata = Challenge & ChallengeMetadata;

// Updated Annotation interface
export interface Annotation {
  BN: string;
  EN: string;
  correctOrder: string[];
  alternative: string[][];
  trivia: string;
  start: number;
  end: number;
  challengeIds?: string[];
}

// Updated JsonData interface
export interface JsonData {
  name: string;
  videoId: string;
  introduction: string;
  language: string;
  song: Annotation[];
  challenges?: ChallengeWithMetadata[];
}
