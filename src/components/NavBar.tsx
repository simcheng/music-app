import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Music Recommender
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
