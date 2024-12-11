import { IconButton, Typography, Box } from "@mui/material";
import React from "react";

interface dateProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
}

export const DatePicker: React.FC<dateProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const incrementDate = () => {
    setSelectedDate(new Date(selectedDate.getDate() + 1));
  };
  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.getDate() - 1));
  };

  let printDate = selectedDate.toISOString();

  return (
    <Box
      sx={{ display: "flex", padding: "5px", gap: "8px", alignItems: "center" }}
    >
      <IconButton onClick={decrementDate}>back ⬅️ </IconButton>
      <Typography variant="subtitle1" fontWeight="bold">
        {printDate}
      </Typography>
      <IconButton onClick={incrementDate}>➡️ forward</IconButton>
    </Box>
  );
};
