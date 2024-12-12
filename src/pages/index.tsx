import { Box } from "@mui/material";
import { useState } from "react";

import NavBar from "@/components/NavBar";
import Chatbox from "@/components/Chatbox";
import { CardList } from "@/components/CardList";

// site name

export const BASE_URL = `https://music-app-simon.vercel.app`;

export default function Home() {
  let [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toISOString().split("T")[0])
  );

  return (
    <Box
      sx={{
        width: "100vw", // Full viewport width
        height: "100vh", // Full viewport height
        margin: "0", // Remove default margin
        padding: "0", // Optional: Remove padding if needed
        backgroundColor: "transparent", // Set background to black
        color: "white", // Text color to white for contrast
        display: "flex",
        flexDirection: "column", // Arrange children vertically
      }}
    >
      <NavBar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Box
        sx={{
          width: "90vw", // Adjust width relative to screen size
          height: "100vh", // Adjust height relative to viewport height
          margin: "0 auto", // Center horizontally
          padding: "20px", // Optional padding
          borderRadius: "8px", // Rounded corners
          backgroundColor: "transparent", // Background color
          display: "flex",
          flexDirection: "column", // Arrange children vertically
        }}
      >
        <CardList
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Chatbox
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </Box>
      </Box>
    </Box>
  );
}
