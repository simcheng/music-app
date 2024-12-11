import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { SongCardProps } from "@/components/SongCard";
import axios from "axios";

import { BASE_URL } from "..";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  let queryDate: Date = new Date();

  type GetSongResponse = { response: GetSongResponseResponse };
  type GetSongResponseResponse = { song: GetSongResponseSong };
  type GetSongResponseSong = {
    song_art_image_url: string;
    title: string;
    artist_names: string;
    apple_music_player_url: string;
  };

  async function geniusRequest(): Promise<SongCardProps[]> {
    // write a random num gen for three nums from 1 to 1862727 (max)

    let songList: SongCardProps[] = [];

    for (let i = 0; i < 3; i++) {
      let num = Math.round(Math.random() * 1862727 - 1) + 1;
      const res = await axios.get<GetSongResponse>(
        `${BASE_URL}/api/genius?query=${num}`
      );
      let song: SongCardProps = {
        title: res.data.response.song.title,
        artist: res.data.response.song.artist_names,
        imageSrc: res.data.response.song.song_art_image_url,
        url: res.data.response.song.apple_music_player_url,
      };
      songList.push(song);
    }

    return songList;
  }

  switch (method) {
    case "GET": {
      try {
        // check selected date passed in query for validity
        queryDate = new Date(req.query.date as string);

        if (!queryDate || Array.isArray(queryDate)) {
          return res
            .status(400)
            .json({ error: "Invalid or missing date parameter" });
        } // Format: YYYY-MM-DD

        // Check if there are any daily songs already set
        const existingDailySong = await prisma.dailySong.findUnique({
          where: {
            date: queryDate,
          },
          include: {
            songs: true, // Include the songs in the response
          },
        });

        console.log("API Response:", existingDailySong);

        // If there are existing daily songs, return them
        if (existingDailySong) {
          return res.status(200).json(existingDailySong);
        }

        // if there are no daily songs, call geniusRequest to generate songs
        const songList = await geniusRequest();

        // Create new daily songs
        const newDailySong = await prisma.dailySong.create({
          data: {
            date: queryDate,
            songs: {
              create: songList.map((song) => ({
                title: song.title,
                artist: song.artist,
                imageUrl: song.imageSrc,
                appleMusic: song.url,
              })),
            },
          },
          include: {
            songs: true, // Include the songs in the response
          },
        });

        return res.status(200).json(newDailySong);
      } catch (error) {
        console.error("Error fetching or creating daily songs:", error);
        return res
          .status(500)
          .json({ error: "Failed to fetch or create daily songs." });
      }
    }

    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
