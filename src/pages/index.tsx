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
      <Box sx={{ pb: "50px" }}>
        <NavBar></NavBar>
      </Box>
      <DatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      ></DatePicker>
      
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Chatbox
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        ></Chatbox>
      </Box>
    </>
  );
}
