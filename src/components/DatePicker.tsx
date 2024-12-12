import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { SongCardProps, SongCard } from "@/components/SongCard";
import Chatbox from "@/components/Chatbox";
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
    if (!(new Date(selectedDate.getDate() + 1) > new Date(currDate.getDate())))
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

  // string form of date
  let printDate = selectedDate.toISOString().split("T")[0];

  if (loading) {
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
        <Box
          sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
        >
          {["", "", ""].map((index) => {
            return (
              <SongCard
                imageSrc="https://assets.genius.com/images/default_cover_image.png"
                title=" "
                artist=" "
                url={BASE_URL}
              />
            );
          })}
        </Box>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{ display: "flex", pb: "20px", justifyContent: "space-between" }}
      >
        <AppBar position="static" color="transparent">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Music Recommender
            </Typography>
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
          </Toolbar>
        </AppBar>
      </Box>

      <Box
        sx={{
          width: "90vw", // Adjust width relative to screen size
          height: "100vh", // Adjust height relative to viewport height
          margin: "0 auto", // Center horizontally
          padding: "20px", // Optional padding
          borderRadius: "8px", // Rounded corners
          backgroundColor: "#fff", // Background color
          display: "flex",
          flexDirection: "column", // Arrange children vertically
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
        >
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Chatbox
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </Box>
      </Box>
    </>
  );
};
