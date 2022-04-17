import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Card } from "@mui/material";
import theme from "../theme";

import "./home.css";

export const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          backgroundColor: theme.palette.secondary.dark,
          display: "flex",
          height: "100vh",
          width: "100vw",
        }}
      ></Card>
    </ThemeProvider>
  );
};

export default Home;
