import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Card } from "@mui/material";

import moment from "moment";
import buildCalendar from "./buildCal";
import "./projectmain.css";
import theme from "../theme";
import LeftArrow from "@mui/icons-material/KeyboardDoubleArrowLeft";
import LeftArrowM from "@mui/icons-material/KeyboardArrowLeft";
import RightArrow from "@mui/icons-material/KeyboardDoubleArrowRight";
import RightArrowM from "@mui/icons-material/KeyboardArrowRight";

import Projects from "./Projects.js";
const fetcher = require("./fetcher");
const ProjectMain = () => {
  const [miniCalendar, setMiniCalendar] = useState([]);
  const [calendar, setCalendar] = useState(moment());
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let resArr = [];
        let json = await fetcher.fetchProjects();
        resArr = json.projects;
        setProjects(resArr);
      } catch (error) {
        console.log(`Problem loading projects - ${error.message}`);
      }
    };
    fetchProjects();
  }, []);

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

  const setUpdatedProjects = async (proj) => {
    let json = await fetcher.fetchProjects();
    setProjects(json.projects);
  };
  return (
    <ThemeProvider theme={theme}>
      <Card style={{ display: "flex", height: "100vh", zIndex: 99 }}>
        <Box sx={{ bgcolor: theme.palette.secondary.dark }} elevation={3}>
          <Box p={2}>
            <Box className=" s-current-month">
              <h1>
                {currSMonthName()} {currSYear()}{" "}
              </h1>
              <LeftArrow
                className="fa fa-angle-double-left"
                aria-hidden="true"
                onClick={() => setCalendar(prevSYear())}
              />
              <LeftArrowM
                className="fas fa-angle-left s-prev"
                onClick={() => setCalendar(prevSMonth())}
              />
              <RightArrowM
                className="fas fa-angle-right s-next"
                onClick={() => setCalendar(nextSMonth())}
              />
              <RightArrow
                className="fa fa-angle-double-right"
                aria-hidden="true"
                onClick={() => setCalendar(nextSYear())}
              />
            </Box>
            <Box className="s-weekdays ">
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
        <Box style={{ width: "100%", overflow: "auto" }}>
          <Projects
            updatedProjects={setUpdatedProjects}
            projects={projects}
            setProjects={setProjects}
          />
        </Box>
      </Card>
    </ThemeProvider>
  );
};
export default ProjectMain;
