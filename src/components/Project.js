import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Divider,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

import Icon from "@mui/icons-material/MoreHorizSharp";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import UpdateIcon from "@mui/icons-material/EditOutlined";

import theme from "../theme";
const Project = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [editing, setEditing] = useState(false);
  const test = (e) => {
    if (e.key === "Enter") setEditing(!editing);
  };
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        style={{
          backgroundColor: theme.palette.secondary.dark,
          color: theme.palette.secondary.light,
          display: "block",
          position: "relative",
          borderBottom: "0.6px solid black",
          borderRadius: 0,
          padding: 15,
          width: "100vh",
        }}
      >
        <Box style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
          <Box style={{ display: "flex", justifyContent: "left" }}>
            {!editing ? (
              <div onClick={() => setEditing(!editing)}>
                {props.project.name}
              </div>
            ) : (
              <TextField
                autoFocus
                onClick={() => setEditing(!editing)}
                onKeyPress={(e) => test(e)}
                variant="standard"
                defaultValue={props.project.name}
              ></TextField>
            )}
          </Box>
          <Box style={{ display: "flex", justifyContent: "right" }}>
            {props.project.description}
          </Box>
          <Box style={{ display: "flex", justifyContent: "right" }}>
            {props.project.startDate}
          </Box>
          <Box style={{ display: "flex", justifyContent: "right" }}>
            {props.project.totalPoints}
          </Box>
          <Box style={{ display: "flex", justifyContent: "right" }}>
            {props.project.totalCost}
          </Box>
        </Box>
        <IconButton
          color="primary"
          disableRipple
          style={{ position: "absolute", top: 2, right: 0 }}
          ria-describedby={id}
          variant="contained"
          onClick={handleClick}
        >
          <Icon />
        </IconButton>
      </Paper>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <UpdateIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Update</ListItemText>
          </MenuItem>

          <Divider />
          <MenuItem onClick={() => props.onDelete(props.project._id)}>
            <ListItemIcon>
              <DeleteIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </ThemeProvider>
  );
};
export default Project;
