import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ProjectMain from "./components/ProjectMain.js";
import About from "./components/About.js";
import Home from "./components/Home.js";
import "./style.css";
import { ThemeProvider } from "@mui/material/styles";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";

import theme from "./theme";

const App = () => {
  const pages = ["Home", "Projects", "About"];

  return (
    <ThemeProvider theme={theme}>
      <AppBar color="secondary">
        <Router>
          <Container>
            <Toolbar style={{ height: "5rem" }}>
              <Box
                className="logo"
                variant="h5"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                }}
              >
                Cowporation
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                }}
              >
                {pages.map((page) => (
                  <Button key={page}>
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "18",
                      }}
                      to={`/${page}`}
                    >
                      {page}
                    </Link>
                  </Button>
                ))}
              </Box>
            </Toolbar>
          </Container>

          <Route path="/Projects" render={(props) => <ProjectMain />} />
          <Route path="/About" component={About} />
          <Route path="/" exact component={Home} />
        </Router>
      </AppBar>
    </ThemeProvider>
  );
};
export default App;
