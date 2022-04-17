import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";

import theme from "../theme";

const Task = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box>{props.task.portion}</Box>
    </ThemeProvider>
  );
};
export default Task;
