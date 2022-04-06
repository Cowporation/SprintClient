import { createTheme } from "@mui/material/styles";
export default createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: {
      paper: "rgba(50, 50, 50, 1)",
      default: "rgba(62, 59, 65, 0.89)",
    },
    primary: {
      light: "rgba(255, 172, 173, 1)",
      main: "rgba(255, 120, 122, 1)",
      dark: "rgba(223, 72, 72, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(176, 176, 176, 1)",
      main: "rgba(249, 200, 137, 1)",
      dark: "rgba(42, 42, 42, 1)",
      contrastText: "rgba(79, 79, 79, 1)",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(211, 211, 211, 1)",
      secondary: "rgba(255, 255, 255, 0.54)",
      disabled: "rgba(216, 216, 216, 1)",
      hint: "rgba(255, 103, 103, 0.74)",
    },
  },
});
