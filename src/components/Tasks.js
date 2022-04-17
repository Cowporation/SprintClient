import React, { useState, useEffect } from "react";
//material ui
import { ThemeProvider } from "@mui/material/styles";
import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";
//icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import CircularLoading from "@mui/material/CircularProgress";
//components
import CircularProgress from "./CircularProgress.js";
//theme/css
import theme from "../theme";
import "./project.scss";
const fetcher = require("./fetcher");

const Tasks = (props) => {
  const [tasks, setTasks] = useState([]);
  const getTotalEstimatedHours = () => {
    let sum = 0;
    if (tasks)
      tasks.forEach((a) => {
        if (a.projectID === props.project._id && a.subtasks)
          a.subtasks.forEach((a) => {
            a.workedby.forEach((w) => {
              if (w.actHours === 0) sum += w.estHours;
            });
          });
      });
    return sum;
  };
  const getTotalEstimatedHoursRE = () => {
    let sum = 0;
    if (tasks)
      tasks.forEach((a) => {
        if (a.projectID === props.project._id && a.subtasks)
          a.subtasks.forEach((a) => {
            a.workedby.forEach((w) => {
              sum += w.reestHours;
            });
          });
      });
    return sum;
  };
  const getInitVelocity = () => {
    let sum = 0;
    if (props.project) {
      sum += (props.project.users.length * 8) / props.project.storyPointHours;
    }
    return sum.toFixed(2);
  };

  const getCurrentVelocity = () => {
    let sum = 0;
    if (tasks)
      tasks.forEach((a) => {
        if (a.projectID === props.project._id && a.subtasks)
          a.subtasks.forEach((a) => {
            a.workedby.forEach((w) => {
              sum += w.actHours;
            });
          });
      });
    return (sum * props.project.users.length) / props.project.storyPointHours;
  };
  const getPercentage = (num, div) => {
    let divd = parseFloat(div);
    if (divd === 0 || divd === null) return 0;
    return parseInt((num / divd) * 100, 10);
  };
  const getPercentageCompletion = (subtasks) => {
    let actHours = 0;
    let reestHours = 0;
    if (subtasks)
      subtasks.forEach((a) => {
        a.workedby.forEach((b) => {
          actHours += b.actHours;
          reestHours += b.reestHours;
        });
      });
    if (actHours === 0) return 0;
    return (
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            display: "block",
          }}
        >
          <Box
            style={{
              margin: "auto",
            }}
          >
            <CircularProgress
              size={60}
              strokeWidth={2}
              color={"green"}
              percent={parseInt((actHours / (reestHours + actHours)) * 100, 10)}
            ></CircularProgress>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1">
            ${parseInt((actHours + reestHours) * 65, 10)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">
            {(reestHours / 8).toFixed(2)}
          </Typography>
        </Box>
      </Box>
    );
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let resArr = [];
        let json = await fetcher.fetchTasks();
        resArr = json.stories;
        setTasks(resArr);
      } catch (error) {
        console.log(`Problem loading tasks - ${error.message}`);
      }
    };
    fetchTasks();
  }, [setTasks]);

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={tasks.length === 0}
      >
        <CircularLoading color="inherit" />
      </Backdrop>
      <Box>
        {props.project ? (
          <Box>
            <Box
              style={{
                display: "flex",
                fontSize: "14px",
                gap: "1rem",
              }}
            >
              <Card
                color="secondary"
                style={{
                  padding: "1rem",
                  fontSize: "14px",
                  height: "450px",
                  minWidth: "450px",
                  maxWidth: "450px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => getTotalEstimatedHoursRE()}
              >
                <CardHeader
                  titleTypographyProps={{
                    color: theme.palette.secondary.main,
                    variant: "h5",
                  }}
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      <AssignmentIcon />
                    </Avatar>
                  }
                  title={props.project.name}
                  subheader={props.project && props.project.startDate}
                />

                <Box
                  style={{
                    display: "flex",
                    marginTop: "12rem",
                    justifyContent: "space-between",
                    textAlign: "center",
                    gap: "2rem",
                  }}
                >
                  <Card
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <Typography variant="caption" color="secondary">
                      Total Estimated Hours
                    </Typography>
                    <Typography variant="h5" color="primary" component="div">
                      {getTotalEstimatedHours()}
                    </Typography>
                  </Card>
                  <Card
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <Typography variant="caption" color="secondary">
                      Re-Estimated Hours
                    </Typography>
                    <Typography variant="h5" color="primary" component="div">
                      {getTotalEstimatedHoursRE()}
                    </Typography>
                  </Card>
                </Box>
              </Card>
              <Card
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  textAlign: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" color="primary" component="div">
                  Percentage of Initial Velocity
                  <Box style={{ display: "flex", margin: 15 }}>
                    <CircularProgress
                      size={150}
                      strokeWidth={5}
                      color={
                        getPercentage(
                          getCurrentVelocity(),
                          getInitVelocity()
                        ) >= 100
                          ? "green"
                          : "#ff4242"
                      }
                      percent={getPercentage(
                        getCurrentVelocity(),
                        getInitVelocity()
                      )}
                    />
                    <Box style={{ display: "block" }}>
                      <Box style={{ display: "flex" }}>
                        <Box
                          height={5}
                          width={5}
                          style={{ backgroundColor: "green", margin: 5 }}
                        />
                        <Typography variant="caption" color="secondary">
                          At initial velocity
                        </Typography>
                      </Box>
                      <Box style={{ display: "flex" }}>
                        <Box
                          height={5}
                          width={5}
                          style={{ backgroundColor: "#ff4242", margin: 5 }}
                        />
                        <Typography variant="caption" color="secondary">
                          Under initial velocity
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Typography>
                <Card
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "1rem",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="secondary">
                      Initial Velocity
                    </Typography>
                    <Typography variant="h5" color="primary" component="div">
                      {getInitVelocity()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="secondary">
                      Current Velocity
                    </Typography>
                    <Typography variant="h5" color="primary" component="div">
                      {getCurrentVelocity()}
                    </Typography>
                  </Box>
                </Card>
              </Card>
            </Box>
            <Card style={{ marginTop: "25px", height: "450px", width: "100%" }}>
              <Box
                style={{
                  width: "768px",
                }}
              >
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    alignItems: "baseline",
                  }}
                >
                  <Box>
                    <Box
                      style={{
                        display: "inline-flex",

                        height: "19px",
                        alignItems: "center",
                        backgroundColor: theme.palette.primary.dark,
                        borderRadius: "4px 4px 0 0",
                        padding: "2px 4px",
                        textTransform: "uppercase",
                      }}
                    >
                      Task
                    </Box>
                  </Box>
                  <Box
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "0 12px",
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <Box>% Completion</Box>
                    <Box>Total Cost Est.</Box>
                    <Box># Sprint(s) to Completion</Box>
                  </Box>
                </Box>
                {tasks.length !== 0 &&
                  tasks.map((task) => {
                    return (
                      task.projectID === props.project._id && (
                        <Box
                          key={task._id}
                          style={{
                            display: "grid",
                            height: "100%",

                            gridTemplateColumns: "repeat(2, 1fr)",
                            minWidth: "860px",
                            backgroundColor: theme.palette.secondary.dark,
                            boxShadow: " 0px -0.6px 6px rgba(0,0,0,0.3)",
                            border:
                              "0.5px 0.5px 0px 0.5px solid rgba(0,0,0,0.3)",
                            borderRadius: 0,
                            padding: "12px",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            style={{
                              width: "100px",
                            }}
                          >
                            {task.portion}
                          </Box>
                          <Box>{getPercentageCompletion(task.subtasks)}</Box>
                        </Box>
                      )
                    );
                  })}
              </Box>
            </Card>
          </Box>
        ) : (
          <Card
            style={{
              width: "1000px",
              height: "500px",
              padding: "2rem",
            }}
          >
            <Typography variant="h5">No Project Selected</Typography>
          </Card>
        )}
      </Box>
    </ThemeProvider>
  );
};
export default Tasks;
