import { IconButton, Typography } from "@mui/material";
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
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };
  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  return (
    <div>
      <IconButton onClick={decrementDate}>left </IconButton>
      <Typography>Current Date</Typography>
      <IconButton onClick={incrementDate}> right</IconButton>
    </div>
  );
};
