import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Music Recommender
        </Typography>
        {/* <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
