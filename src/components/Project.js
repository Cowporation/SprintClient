import React, { useState, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  IconButton,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  InputAdornment,
  Input,
  TextField,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Icon from "@mui/icons-material/MoreHorizSharp";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EnterIcon from "@mui/icons-material/KeyboardReturn";

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
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const updateNameKeyPress = (e) => {
    if (e.key === "Enter") {
      setEditing(!editing);
      props.updateProject({ ...props.project, name: e.target.value });
    }
  };
  const projectForm = useRef(null);

  const updateNameButtonClick = (e, c) => {
    setEditing(!editing);
    props.updateProject({
      ...props.project,
      name: projectForm.current["name"].value,
    });
  };
  const updateDescKeyPress = (e) => {
    if (e.key === "Enter") {
      setEditingDesc(!editingDesc);
      props.updateProject({ ...props.project, description: e.target.value });
    }
  };
  const updateDescButtonClick = () => {
    setEditingDesc(!editingDesc);
    props.updateProject({
      ...props.project,
      description: projectForm.current["description"].value,
    });
  };
  const updateDateButtonClick = (v) => {
    setEditingDate(!editingDate);

    props.updateProject({
      ...props.project,
      startDate: v.format("YYYY-MM-DD"),
    });
  };

  const handleNameMouseDown = () => {
    setEditingDesc(false);
    setEditingDate(false);
  };
  const handleDescMouseDown = () => {
    setEditing(false);
    setEditingDate(false);
  };
  const handleDateMouseDown = () => {
    setEditingDesc(false);
    setEditing(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundColor: theme.palette.secondary.dark,
          display: "block",
          position: "relative",
          borderBottom: "0.6px solid black",
          borderRadius: 0,
          padding: 15,
          width: "100%",
          minWidth: "860px",
        }}
      >
        <Box
          ref={projectForm}
          component={"form"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "left",
            }}
          >
            {editing && props.editMode ? (
              <Box
                style={{
                  display: "flex",
                  width: 150,
                }}
              >
                <Input
                  style={{ fontSize: "12px" }}
                  name={"name"}
                  autoFocus
                  onKeyPress={(e) => updateNameKeyPress(e)}
                  variant="standard"
                  defaultValue={props.project.name}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => updateNameButtonClick(e)}
                        edge="end"
                      >
                        {
                          <EnterIcon
                            color="primary"
                            style={{ fontSize: "16px" }}
                          />
                        }
                      </IconButton>
                    </InputAdornment>
                  }
                ></Input>
              </Box>
            ) : (
              <Box
                style={{
                  display: "flex",
                  width: "150px",
                  borderBottom: props.editMode ? "1px dashed salmon" : "none",
                }}
                onClick={() => setEditing(!editing)}
                onMouseDown={() => handleNameMouseDown()}
              >
                {props.project.name}
              </Box>
            )}
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "right",
              textAlign: "right",
              width: "150px",
            }}
          >
            {editingDesc && props.editMode ? (
              <Box
                style={{
                  display: "flex",
                }}
              >
                <Input
                  multiline
                  rows={3}
                  name={"description"}
                  autoFocus
                  onKeyPress={(e) => updateDescKeyPress(e)}
                  variant="standard"
                  defaultValue={props.project.description}
                  style={{
                    fontSize: "12px",
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => updateDescButtonClick(e)}
                        edge="end"
                      >
                        {
                          <EnterIcon
                            color="primary"
                            style={{ fontSize: "16px" }}
                          />
                        }
                      </IconButton>
                    </InputAdornment>
                  }
                ></Input>
              </Box>
            ) : (
              <Box
                style={{
                  display: "flex",
                  borderBottom: props.editMode ? "1px dashed salmon" : "none",
                }}
                onClick={() => setEditingDesc(!editingDesc)}
                onMouseDown={() => handleDescMouseDown()}
              >
                {props.project.description}
              </Box>
            )}
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "right",
              paddingRight: "10px",

              width: "200px",
              textAlign: "right",
            }}
          >
            {editingDate && props.editMode ? (
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={props.project.startDate}
                    views={["day"]}
                    InputProps={{
                      style: {
                        fontSize: "13px",
                        width: "100px",
                      },
                    }}
                    onChange={(newValue) => {
                      updateDateButtonClick(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name={"date"}
                        variant="standard"
                        sx={{
                          svg: {
                            color: theme.palette.primary.main,
                            fontSize: "16px",
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            ) : (
              <Box
                onClick={() => setEditingDate(!editingDate)}
                onMouseDown={() => handleDateMouseDown()}
                style={{
                  borderBottom: props.editMode ? "1px dashed salmon" : "none",
                }}
              >
                {props.project.startDate}
              </Box>
            )}
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
      </Box>

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
          <MenuItem
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255,0,0,0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "rgba(255,0,0,0")
            }
            onClick={() => props.onDelete(props.project._id)}
          >
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
