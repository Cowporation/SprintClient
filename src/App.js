import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ProjectMain from "./components/ProjectMain.js";
import About from "./components/About.js";
import User from "./components/User";
import Home from "./components/Home.js";
import StoryLists from "./components/StoryLists.js"
import "./style.css";
import { ThemeProvider } from "@mui/material/styles";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";

import theme from "./theme";
import { fetchSprints } from "./components/fetcher.js";

const App = () => {
  const pages = ["Home", "Projects", "Users", "Sprints", "About"];

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar color="secondary" style={{ height: "4rem" }}>
          <Container>
            <Toolbar>
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
        </AppBar>

        <Route path="/Projects" render={(props) => <ProjectMain />} />
        <Route path="/About" component={About} />
        <Route path="/Home" component={Home} />
        <Route path="/Users" component={User} />
        <Route path="/Sprints" component={StoryLists} />
        <Route path="/" exact component={Home} />
      </Router>
    </ThemeProvider>
  );
};
export default App;
