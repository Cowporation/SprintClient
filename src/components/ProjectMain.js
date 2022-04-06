import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Card, CardContent, Paper } from "@mui/material";

import moment from "moment";
import buildCalendar from "./buildCal";
import "./projectmain.css";
import theme from "../theme";

import Projects from "./Projects.js";

const ProjectMain = () => {
  const [miniCalendar, setMiniCalendar] = useState([]);
  const [calendar, setCalendar] = useState(moment());
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    let resArr = [];
    const fetchProjects = async () => {
      try {
        let res = await fetch("http://localhost:5000/project");
        let json = await res.json();
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

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: "100vh" }}>
        <Card style={{ display: "flex", height: "100%" }}>
          <Paper sx={{ bgcolor: theme.palette.secondary.dark }} elevation={3}>
            <Box p={2}>
              <div className=" s-current-month">
                <h1>
                  {currSMonthName()} {currSYear()}{" "}
                </h1>
                <i
                  className="fa fa-angle-double-left"
                  aria-hidden="true"
                  onClick={() => setCalendar(prevSYear())}
                ></i>
                <i
                  className="fas fa-angle-left s-prev"
                  onClick={() => setCalendar(prevSMonth())}
                ></i>
                <i
                  className="fas fa-angle-right s-next"
                  onClick={() => setCalendar(nextSMonth())}
                ></i>
                <i
                  className="fa fa-angle-double-right"
                  aria-hidden="true"
                  onClick={() => setCalendar(nextSYear())}
                ></i>
              </div>
              <div className="s-weekdays ">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              {miniCalendar.map((week2) => (
                <div key={week2} className="s-weeks">
                  {week2.map((day2) => (
                    <div
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
                      <div>{day2.clone().format("D").toString()} </div>
                    </div>
                  ))}
                </div>
              ))}
            </Box>
          </Paper>
          <CardContent>
            <Projects projects={projects} setProjects={setProjects} />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};
export default ProjectMain;
