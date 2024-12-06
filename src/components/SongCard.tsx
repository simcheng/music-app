import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

export interface SongCardProps {
  title: string;
  artist: string;
  imageSrc: string;
  url: string;
  //   add more props for link to site, link to song cover img, name of song and artist
}

export const SongCard: React.FC<SongCardProps> = ({
  title,
  artist,
  imageSrc,
  url,
}) => {
  return (
    <Link href={url} passHref>
      <Box
        sx={{
          position: "relative",
          width: "300px",
          height: "300px",
          margin: "16px",
          borderRadius: "8px",
          overflow: "hidden",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.3s ease",
          },
        }}
      >
        <img
          src={imageSrc}
          alt="Missing cover art"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "8px",
          }}
        >
          <Typography
            variant="body1"
            color="white"
            fontWeight={"fontWeightBold"}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="white">
            {artist}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};
