import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";

interface dateProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
}

export const Navbar: React.FC<dateProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const currDate = new Date();
  const incrementDate = () => {
    if (!(new Date(selectedDate.getDate() + 1) > new Date(currDate.getDate())))
      setSelectedDate(
        new Date(selectedDate.setDate(selectedDate.getDate() + 1))
      );
  };
  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  // string form of date
  let printDate = selectedDate.toISOString().split("T")[0];

  return (
    <Box sx={{ display: "flex", pb: "20px", justifyContent: "space-between" }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Music Recommender
          </Typography>
          <Box
            sx={{
              display: "flex",
              padding: "5px",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton onClick={decrementDate}>⬅️ </IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              {printDate}
            </Typography>
            <IconButton onClick={incrementDate}>➡️</IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
