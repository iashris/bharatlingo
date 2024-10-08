export interface MinimalYouTubeSectionPlayerProps {
  videoId: string;
  start: number | string;
  end: number | string;
  showIntroduction?: boolean;
}

type BaseActivityComponent = {
  trivia?: string;
};

type ArrangeWords = {
  EN: string;
  HI: string;
  BN: string;
  correctOrder: string[];
  alternative?: string[] | string[][];
};

// type MCQ = {
//   question: string;
//   options: string[];
//   answer: string;
// };

type SongLine = BaseActivityComponent &
  ArrangeWords &
  Pick<MinimalYouTubeSectionPlayerProps, "start" | "end">;

export type YouTubeFillBlanksActivity = {
  song: SongLine[];
  videoId: string;
  name: string;
  introduction?: string;
};
