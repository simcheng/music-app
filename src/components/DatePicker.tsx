import { IconButton, Typography, Box } from "@mui/material";
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

export const DatePicker: React.FC<dateProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const currDate = new Date();
  const incrementDate = () => {
    if (!(selectedDate.getDate() + 1 > currDate.getDate()))
      setSelectedDate(
        new Date(selectedDate.setDate(selectedDate.getDate() + 1))
      );
  };
  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

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
    return <div>Loading...</div>;
  }

  let printDate = selectedDate.toISOString().split("T")[0];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          padding: "5px",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={decrementDate}>⬅️ </IconButton>
        <Typography variant="subtitle1" fontWeight="bold">
          {printDate}
        </Typography>
        <IconButton onClick={incrementDate}>➡️</IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {songs?.map((song, index) => {
          return (
            <SongCard
              imageSrc={song.imageSrc}
              title={song.title}
              artist={song.artist}
              url={song.url}
            />
          );
        })}
      </Box>
    </>
  );
};
