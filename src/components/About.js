import { ThemeProvider } from "@mui/material/styles";
import { Avatar, Box, Card, CardHeader } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
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
            flexDirection: "column",
            justifyContent: "space-around",
            border: "1px solid",
            marginTop: "8rem",
            padding: 25,
            height: "500px",
          }}
        >
          <CardHeader
            titleTypographyProps={{
              color: theme.palette.secondary.light,
              variant: "h5",
            }}
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonOutlineIcon />
              </Avatar>
            }
            title="Zitong Wang"
          />
          <CardHeader
            titleTypographyProps={{
              color: theme.palette.secondary.light,
              variant: "h5",
            }}
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonOutlineIcon />
              </Avatar>
            }
            title="Jiahui Jiao"
          />
          <CardHeader
            titleTypographyProps={{
              color: theme.palette.secondary.light,
              variant: "h5",
            }}
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonOutlineIcon />
              </Avatar>
            }
            title="Jia Zeng"
          />
          <Box>
            <h4>Cowporation Sprint App - Version 1.0.0</h4>
          </Box>
        </Box>
      </Card>
    </ThemeProvider>
  );
};
export default About;
