import { ThemeProvider } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";
import theme from "../theme";

export const About = () => {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 25,
        }}
      >
        <Box
          color={theme.palette.secondary.light}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            border: "solid",
            marginTop: "8rem",
            padding: 25,
          }}
        >
          <h4>Cowporation Sprint App - Version 1.0.0</h4>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};
export default About;
