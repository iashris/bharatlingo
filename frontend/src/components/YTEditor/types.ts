export interface Annotation {
  BN: string;
  EN: string;
  correctOrder: string[];
  alternative: string[][];
  trivia: string;
  start: number;
  end: number;
}

export interface JsonData {
  name: string;
  videoId: string;
  introduction: string;
  song: Annotation[];
  language?: string;
}
