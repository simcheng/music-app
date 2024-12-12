import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { SongCardProps, SongCard } from "@/components/SongCard";
import axios from "axios";

import { BASE_URL } from "../pages";

interface dateProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
}

// type definitions for backend response

type Song = {
  title: string;
  artist: string;
  imageSrc: string;
  url: string;
};

type SongCardPropsResponse = {
  id: number;
  date: string;
  songs: Song[];
};

export const CardList: React.FC<dateProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const [songs, setSongs] = useState<SongCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // functions and useeffects for song cards

  const parse = async (): Promise<SongCardProps[]> => {
    // helper function to call and parse the data from backend
    const songList: SongCardProps[] = []; // define songcard array to fill

    try {
      const date = selectedDate.toISOString().split("T")[0];
      const response = await axios.get<SongCardPropsResponse>(
        `${BASE_URL}/api/daily-songs`,
        { params: { date } }
      );
      console.log("Fetched songs:", response.data.songs);
      if (!response.data.songs) {
        return [];
      }
      // Map the songs array to the Song[] format
      response.data.songs.forEach((songData: any) => {
        const song: SongCardProps = {
          title: songData.title,
          artist: songData.artist,
          imageSrc: songData.imageUrl,
          url: songData.appleMusic,
        };

        songList.push(song);
      });

      return songList;
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchDailySongs = async () => {
      setLoading(true);
      const fetchedSongs = await parse();
      setSongs(fetchedSongs);
      setLoading(false);
    };
    fetchDailySongs();
  }, [selectedDate]);

  if (loading) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "16px", // Adding spacing between cards
            paddingTop: "20px",
            paddingBottom: "15px",
          }}
        >
          {["", "", ""].map((_, index) => (
            <SongCard
              key={index}
              imageSrc="https://assets.genius.com/images/default_cover_image.png"
              title=" "
              artist=" "
              url={BASE_URL}
            />
          ))}
        </Box>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "16px", // Spacing between cards
          paddingTop: "20px",
          paddingBottom: "15px",
        }}
      >
        {songs?.map((song, index) => (
          <SongCard
            key={index}
            imageSrc={song.imageSrc}
            title={song.title}
            artist={song.artist}
            url={song.url}
          />
        ))}
      </Box>
    </>
  );
};
