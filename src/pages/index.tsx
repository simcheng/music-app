import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

import NavBar from "@/components/NavBar";
import { SongCardProps, SongCard } from "@/components/SongCard";
import Chatbox from "@/components/Chatbox";

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

export default function Home() {
  const [songs, setSongs] = useState<SongCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // functions and useeffects for song cards

  const parse = async (): Promise<SongCardProps[]> => {
    // helper function to call and parse the data from backend
    const songList: SongCardProps[] = []; // define songcard array to fill

    try {
      const response = await axios.get<SongCardPropsResponse>(
        "https://music-app-three-theta.vercel.app/api/daily-songs"
      );
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box sx={{ pb: "50px" }}>
        <NavBar></NavBar>
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Chatbox />
      </Box>
    </>
  );
}
