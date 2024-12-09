import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { SongCardProps } from "@/components/SongCard";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
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
      const response = await fetch(`https://music-app-simon.vercel.app/api/genius?query=${num}`); // replace with axios
      let res: GetSongResponse = await response.json();
      let song: SongCardProps = {
        title: res.response.song.title,
        artist: res.response.song.artist_names,
        imageSrc: res.response.song.song_art_image_url,
        url: res.response.song.apple_music_player_url,
      };
      songList.push(song);
    }

    return songList;
  }

  switch (method) {
    case 'GET': {
      try {
        // Check if there are any daily songs already set
        const existingDailySong = await prisma.dailySong.findFirst({
          orderBy: {
            date: 'desc', // Optionally you could fetch the latest daily song
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

        // If no daily songs exist, call geniusRequest to generate songs
        const songList = await geniusRequest();

        // Create a new daily song entry with the fetched songs
        const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Create new daily songs
        const newDailySong = await prisma.dailySong.create({
          data: {
            date: new Date(date),
            songs: {
              create: songList.map(song => ({
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
        console.error('Error fetching or creating daily songs:', error);
        return res.status(500).json({ error: 'Failed to fetch or create daily songs.' });
      }
    }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
