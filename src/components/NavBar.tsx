import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  SvgIcon,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

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
    let tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // caps the date at the current UTC date
    if (!(tomorrow > currDate))
      setSelectedDate(
        new Date(selectedDate.setDate(selectedDate.getDate() + 1))
      );
  };
  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  // custom arrows (ai)
  const CustomArrowIcon: React.FC<{ direction: "left" | "right" }> = ({
    direction,
  }) => {
    return (
      <SvgIcon
        sx={{
          fontSize: "2rem", // Adjust the icon size
          color: "#ffffff", // White color for the icons for contrast
          "&:hover": {
            color: "#1565c0", // Hover color for interactivity
            transform: "scale(1.2)", // Slightly enlarge the icon on hover
            cursor: "pointer", // Add pointer cursor to indicate it's interactive
          },
          transition: "transform 0.2s, color 0.2s", // Smooth transition for hover effect
        }}
      >
        {direction === "left" ? (
          <path d="M19 12H5m7-7l-7 7 7 7" />
        ) : (
          <path d="M5 12h14m-7 7l7-7-7-7" />
        )}
      </SvgIcon>
    );
  };

  // string form of date
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ display: "flex", pb: "20px", justifyContent: "space-between" }}>
      <AppBar position="static" sx={{ backgroundColor: "#000020" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <MusicNoteIcon />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                background: "linear-gradient(90deg, #1565c0, #003c80)",
                backgroundSize: "400% 400%",
                animation: "gradientAnimation 5s ease infinite",
                backgroundClip: "text",
                color: "transparent",
                display: "flex",
                alignItems: "left",
                textDecoration: "none",
                fontFamily: "Helvetica",
                fontSize: { xs: "1.5rem", sm: "2rem" },
                textAlign: { xs: "center", sm: "left" },
                marginLeft: { xs: "0", sm: "20px" }, // Align the text to the left with some margin
              }}
            >
              Shuffley
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              padding: "5px",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "transparent", // Make the background transparent
              borderRadius: "8px",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: "12px", sm: "8px" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <IconButton
              onClick={decrementDate}
              sx={{
                padding: "5px",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <CustomArrowIcon direction="left" />
            </IconButton>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.2rem" },
                color: "#ffffff",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              {formattedDate}
            </Typography>

            <IconButton
              onClick={incrementDate}
              sx={{
                padding: "5px",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <CustomArrowIcon direction="right" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
