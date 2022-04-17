import React, { useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

import theme from "../theme";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
const NewStory = ({ newStory }) => {
  const initialState = {
    id: "",
    portion: "",
    priority: "",
    storyPoints: 0,
    estimatedCost: 0,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleStory = () => {
    setState({ id: uuidv4() });
    newStory(state);
  };
  const requiredEntry =
    state.portion === null ||
    state.portion === "" ||
    state.priority === null ||
    state.priority === "" ||
    state.storyPoints === 0 ||
    state.storyPoints === null;
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          "& .MuiBox-root": { mb: 2, mr: 1 },
          display: "flex",
        }}
      >
        <Box>
          <TextField
            multiline
            required
            rows={4}
            label="Portion"
            value={state.portion}
            onChange={(e) =>
              setState({
                id: uuidv4(),
                portion: e.target.value,
              })
            }
          />
        </Box>
        <Box
          sx={{
            "& .MuiBox-root": { mb: 1, mr: 1 },
            display: "block",
          }}
        >
          <Box>
            <TextField
              required
              select
              style={{ width: 205 }}
              label="Priority"
              id="standard-start-adornment"
              size="small"
              variant="outlined"
              value={state.priority !== "" ? state.priority : ""}
              onChange={(e) => setState({ priority: e.target.value })}
            >
              <MenuItem style={{ color: "red" }} value="High">
                High Priority
              </MenuItem>
              <MenuItem style={{ color: "orange" }} value="Medium">
                Medium Priority
              </MenuItem>
              <MenuItem style={{ color: "yellow" }} value="Low">
                Low Priority
              </MenuItem>
            </TextField>
          </Box>
          <Box>
            <TextField
              required
              style={{ width: 205 }}
              type="number"
              label="Story Points"
              id="standard-start-adornment"
              size="small"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="end">Pts</InputAdornment>
                ),
              }}
              variant="outlined"
              value={state.storyPoints}
              onChange={(e) => setState({ storyPoints: e.target.value })}
            />
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "right",
            }}
          >
            <IconButton
              disabled={requiredEntry}
              variant="outlined"
              size="small"
              onClick={handleStory}
            >
              <CheckIcon style={{ color: requiredEntry ? "grey" : "green" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default NewStory;
