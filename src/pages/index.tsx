import { Box } from "@mui/material";
import { useState } from "react";

import NavBar from "@/components/NavBar";
import Chatbox from "@/components/Chatbox";
import { DatePicker } from "@/components/DatePicker";

// site name

export const BASE_URL = `https://music-app-simon.vercel.app`;

export default function Home() {
  let [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toISOString().split("T")[0])
  );

  return (
    <>
      <Box
        sx={{
          width: "80%", // Adjust width relative to screen size
          height: "90vh", // Adjust height relative to viewport height
          margin: "0 auto", // Center horizontally
          padding: "20px", // Optional padding
          borderRadius: "8px", // Rounded corners
          backgroundColor: "#fff", // Background color
          display: "flex",
          flexDirection: "column", // Arrange children vertically
          justifyContent: "space-between", // Spread out components
        }}
      >
        <Box sx={{ pb: "20px" }}>
          <NavBar />
        </Box>

        <DatePicker
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
    </>
  );
}
