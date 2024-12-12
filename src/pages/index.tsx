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
      <DatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </>
  );
}
