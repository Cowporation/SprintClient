import React, { useState, useEffect, useRef, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  ClickAwayListener,
  Divider,
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
import EditIcon from "@mui/icons-material/Update";
import EnterIcon from "@mui/icons-material/KeyboardReturn";

import theme from "../theme";

const Project = (props) => {
  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        props.setEditId(null);
      }
    },
    [props]
  );
  useEffect(() => {
    document.addEventListener("keydown", escFunction);

    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [escFunction]);
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

  const projectForm = useRef(null);
  const updateNameKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      props.updateProject({ ...props.project, name: e.target.value });
    }
  };
  const updateNameButtonClick = (e, c) => {
    props.updateProject({
      ...props.project,
      name: projectForm.current["name"].value,
    });
  };
  const updateDescKeyPress = (e) => {
    if (e.key === "Enter") {
      props.updateProject({ ...props.project, description: e.target.value });
    }
  };
  const updateDescButtonClick = () => {
    props.updateProject({
      ...props.project,
      description: projectForm.current["description"].value,
    });
  };
  const updateDateButtonClick = (v) => {
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
  const editingProject = () => {
    props.editId(props.project._id);
  };

  const disableEditing = () => {
    setEditing(false);
    setEditingDesc(false);
    setEditingDate(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          backgroundColor: theme.palette.secondary.dark,
          display: "block",
          position: "relative",
          border:
            props.project._id === props.editingId
              ? `0.6px solid ${theme.palette.primary.main}`
              : "0.6px solid black",
          borderRadius: 0,
          padding: 15,
          width: "100%",
          minWidth: "860px",
        }}
      >
        <ClickAwayListener onClickAway={() => disableEditing()}>
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
              {editing && props.editingId === props.project._id ? (
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
              {editingDesc && props.editingId === props.project._id ? (
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
              {editingDate && props.editingId === props.project._id ? (
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
        </ClickAwayListener>
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
          <MenuItem onClick={() => editingProject()}>
            <ListItemIcon>
              <EditIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText>Update</ListItemText>
          </MenuItem>
          <Divider />
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
