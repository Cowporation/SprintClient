import React, { useState, useEffect } from "react";
//other frameworks
import moment from "moment";
//material ui
import { ThemeProvider } from "@mui/material/styles";
import { Avatar, Box, Button, CardHeader, Typography } from "@mui/material";
//icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import LeftArrow from "@mui/icons-material/KeyboardDoubleArrowLeft";
import LeftArrowM from "@mui/icons-material/KeyboardArrowLeft";
import RightArrow from "@mui/icons-material/KeyboardDoubleArrowRight";
import RightArrowM from "@mui/icons-material/KeyboardArrowRight";
//helpers
import buildCalendar from "./buildCal";
//components
import Projects from "./Projects.js";
import Tasks from "./Tasks.js";
//theme/css
import theme from "../theme";
import "./projectmain.scss";

const ProjectMain = () => {
  const [view, setView] = useState("");

  const [miniCalendar, setMiniCalendar] = useState([]);
  const [calendar, setCalendar] = useState(moment());

  // Calendar Set-up
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // mini Calendar
  function currSMonthName() {
    return calendar.format("MMM");
  }
  function currSYear() {
    return calendar.format("YYYY");
  }
  function nextSMonth() {
    return calendar.clone().add(1, "month");
  }
  function prevSMonth() {
    return calendar.clone().subtract(1, "month");
  }
  function nextSYear() {
    return calendar.clone().add(1, "year");
  }
  function prevSYear() {
    return calendar.clone().subtract(1, "year");
  }
  const showDate = (year, month, date) => {
    setSelectedDate(moment([year, month, date]).clone().format("YYYY-MM-DD"));
  };

  useEffect(() => {
    setMiniCalendar(buildCalendar(calendar));
  }, [calendar]);

  const changeView = (e) => {
    setView("dash");
  };
  const [vid, setVId] = useState("");
  const [proj, setProj] = useState();
  const setViewId = (id) => {
    setVId(id);
  };
  const getProject = (project) => {
    setProj(project);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          minHeight: "2160px",
          height: "100vh",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        <Box
          style={{
            display: view === "dash" ? "block" : "flex",
            position: view === "dash" ? "fixed" : "fixed",
            left: 0,
            color: theme.palette.secondary.light,
            backgroundColor:
              view === "dash" ? theme.palette.secondary.dark : "",
            height: "100vh",
            width: view === "dash" ? "400px" : "100vw",
            zIndex: 1,
            overflow: "hidden",

            overflowX: "hidden",
          }}
        >
          <Box
            sx={{
              minWidth: "400px",
              padding: 2,
              paddingBottom: 0,
              bgcolor: theme.palette.secondary.dark,
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5.25rem",
              }}
            >
              <Button
                variant={view !== "dash" ? "outlined" : "text"}
                onClick={() => setView("project")}
              >
                Projects
              </Button>
              <Button
                variant={view !== "dash" ? "text" : "outlined"}
                onClick={() => changeView()}
              >
                Dashboard
              </Button>
            </Box>
            <Box
              pt={4}
              style={{
                display: view === "dash" && "none",
              }}
            >
              <Box className=" s-current-month">
                <h3>
                  {currSMonthName()} {currSYear()}{" "}
                </h3>
                <Box>
                  <LeftArrow
                    className="s-left"
                    aria-hidden="true"
                    onClick={() => setCalendar(prevSYear())}
                  />
                  <LeftArrowM
                    className="s-prev"
                    onClick={() => setCalendar(prevSMonth())}
                  />
                  <RightArrowM
                    className="s-next"
                    onClick={() => setCalendar(nextSMonth())}
                  />
                  <RightArrow
                    className="s-right"
                    aria-hidden="true"
                    onClick={() => setCalendar(nextSYear())}
                  />
                </Box>
              </Box>
              <Box className="s-weekdays">
                <Box>S</Box>
                <Box>M</Box>
                <Box>T</Box>
                <Box>W</Box>
                <Box>T</Box>
                <Box>F</Box>
                <Box>S</Box>
              </Box>
              {miniCalendar.map((week2) => (
                <Box key={week2} className="s-weeks">
                  {week2.map((day2) => (
                    <Box
                      key={day2}
                      className={
                        selectedDate === day2.clone().format("YYYY-MM-DD")
                          ? day2.year() === moment().year() &&
                            day2.date() === moment().date() &&
                            day2.month() === moment().month()
                            ? "s-dates s-today s-selected-date"
                            : "s-dates s-selected-date"
                          : day2.year() === moment().year() &&
                            day2.date() === moment().date() &&
                            day2.month() === moment().month()
                          ? "s-dates s-today"
                          : "s-dates"
                      }
                      onClick={() => {
                        showDate(day2.year(), day2.month(), day2.date());
                      }}
                    >
                      <Box>{day2.clone().format("D").toString()} </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            style={{
              width: "100%",
              height: "100vh",
            }}
          >
            <Projects
              view={view}
              projectId={setViewId}
              getProject={getProject}
              selectedDate={selectedDate}
            />
          </Box>
        </Box>
        {view === "dash" && (
          <Box
            style={{
              padding: "2rem",
              paddingTop: "12rem",
              height: "100vh",
              marginLeft: "400px",
            }}
          >
            <Typography
              variant="h3"
              color="primary"
              gutterBottom
              component="div"
              sx={{
                border: "1px solid grey",
              }}
            >
              <CardHeader
                titleTypographyProps={{
                  color: theme.palette.secondary.light,
                  variant: "h4",
                }}
                avatar={
                  <Avatar
                    sx={{ bgcolor: theme.palette.primary.main }}
                    aria-label="recipe"
                  >
                    <DashboardIcon />
                  </Avatar>
                }
                title="Project Dashboard"
              />
            </Typography>
            <Tasks vid={vid} project={proj} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};
export default ProjectMain;
