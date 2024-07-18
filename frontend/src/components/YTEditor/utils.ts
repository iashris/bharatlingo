import { Annotation, ChallengeWithMetadata, JsonData } from "./types";

export const validateAlternative = (
  correctOrder: string[],
  alternative: string[][]
) => {
  return alternative.every((alt) =>
    alt.every((word) => correctOrder.includes(word))
  );
};

export const downloadJson = (
  name: string,
  annotations: Annotation[],
  videoId: string,
  introduction: string,
  language?: string,
  challenges?: ChallengeWithMetadata[]
) => {
  const jsonData: JsonData = {
    name: name || "Untitled",
    videoId: videoId,
    introduction: introduction,
    song: annotations,
    language: language || "bengali",
    challenges,
  };
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    annotations[0]?.EN?.toLowerCase().replace(" ", "_") + ".json" ||
    "untitled.json";
  a.click();
  URL.revokeObjectURL(url);
};
