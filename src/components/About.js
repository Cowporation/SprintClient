import { ThemeProvider } from "@mui/material/styles";
import { Box, Card } from "@mui/material";
import theme from "../theme";

export const About = () => {
  return (
    <ThemeProvider theme={theme}>
      <Card
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          padding: 25,
        }}
      >
        <Box
          color={theme.palette.secondary.light}
          style={{
            display: "flex",
            justifyContent: "center",
            border: "1px solid",
            marginTop: "8rem",
            padding: 25,
            alignItems: "center",
            height: "50px",
          }}
        >
          <h4>Cowporation Sprint App - Version 1.0.0</h4>
        </Box>
      </Card>
    </ThemeProvider>
  );
};
export default About;
