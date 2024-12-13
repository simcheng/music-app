import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// taking props from parent
interface dateProps {
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
}

export const Navbar: React.FC<dateProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const currDate = new Date();
  const incrementDate = () => {
    let tomorrow = new Date(selectedDate);
    // caps date at today
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (!(tomorrow > currDate)) {
      setSelectedDate(
        new Date(selectedDate.setDate(selectedDate.getDate() + 1))
      );
    }
  };

  const decrementDate = () => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const CustomArrowIcon: React.FC<{ direction: "left" | "right" }> = ({
    direction,
  }) => {
    return (
      <SvgIcon
        sx={{
          fontSize: "2rem",
          color: "#ffffff",
          "&:hover": {
            color: "#1565c0",
            transform: "scale(1.2)",
            cursor: "pointer",
          },
          transition: "transform 0.2s, color 0.2s",
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
                letterSpacing: -1,
                background: "linear-gradient(90deg, #1565c0, #003c80)",
                backgroundSize: "400% 400%",
                animation: "gradientAnimation 3s ease infinite",
                backgroundClip: "text",
                color: "transparent",
                display: "flex",
                alignItems: "left",
                textDecoration: "none",
                fontFamily: "Helvetica",
                fontSize: { xs: "1.5rem", sm: "2rem" },
                textAlign: { xs: "center", sm: "left" },
                marginLeft: { xs: "0", sm: "20px" },
              }}
            >
              Shuffley
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
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
                fontWeight: "medium",
                fontSize: { xs: "1rem", sm: "1.2rem" },
                color: "#ffffff",
                textAlign: "center",
                minWidth: "250px", // Ensure static width to prevent movement
                cursor: "pointer",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
              onClick={() => setDatePickerOpen(true)}
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

      <Dialog open={isDatePickerOpen} onClose={() => setDatePickerOpen(false)}>
        <DialogTitle>Select a Date</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate && newDate <= currDate) setSelectedDate(newDate);
              }}
              slots={{
                textField: (params) => <TextField {...params} fullWidth />,
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDatePickerOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
