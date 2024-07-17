import { useState, useEffect } from "react";
import Sanscript from "@indic-transliteration/sanscript";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = "bn-IN";
      newRecognition.continuous = false;
      newRecognition.interimResults = false;

      newRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const newTranscript = event.results[0][0].transcript;
        setIsRecording(false);
        setTranscript(newTranscript);
      };

      newRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      setRecognition(newRecognition);
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const getTransliteratedText = () => {
    return Sanscript.t(transcript, "bengali", "itrans")
      .toLowerCase()
      .replace(".", "");
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    getTransliteratedText,
  };
};

export default useSpeechRecognition;
