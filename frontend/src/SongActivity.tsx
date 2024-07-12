import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Song from "./components/SongTeacherYT";
import { YouTubeFillBlanksActivity } from "./types/common";

export const SongActivity: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [song, setSong] = useState<YouTubeFillBlanksActivity>();

  useEffect(() => {
    const fetchSong = async () => {
      if (id) {
        try {
          const response = await fetch(`/songs/${id}.json`);
          const data = await response.json();
          setSong(data);
        } catch (error) {
          console.error("Failed to fetch song:", error);
        }
      }
    };

    fetchSong();
  }, [id]);

  if (!song) {
    return <div>Loading...</div>;
  }

  return <Song song={song} />;
};
