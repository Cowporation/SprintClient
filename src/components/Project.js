import React, { useState, useEffect, useRef, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  Popover,
  TextField,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Icon from "@mui/icons-material/MoreHorizSharp";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EnterIcon from "@mui/icons-material/KeyboardReturn";
import DoneIcon from "@mui/icons-material/Done";

import theme from "../theme";

const Project = (props) => {
  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        if (!editing && !editingDesc && !editingDate) props.setEditId(null);
        else disableEditing();
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
          boxShadow: " 0px -0.6px 6px rgba(0,0,0,0.3)",
          border:
            props.editingId === props.project._id
              ? "0.5px solid salmon"
              : "0.5px 0.5px 0px 0.5px solid rgba(0,0,0,0.3)",
          borderRadius: 0,
          padding: "12px 25px",
          margin: "0 auto",
          minWidth: props.view === "dash" ? "300px" : "860px",
        }}
      >
        <ClickAwayListener onClickAway={() => disableEditing()}>
          <Box
            ref={projectForm}
            component={"form"}
            style={{
              display: "grid",
              minHeight: "25px",
              alignItems: "center",

              gridTemplateColumns:
                props.view === "dash" ? "repeat(2, 1fr)" : "repeat(6,1fr)",
              minWidth: props.view === "dash" ? "400px" : "860px",
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
                    width: 100,
                    marginLeft: -15,
                    color:
                      props.editingId === props.project._id &&
                      theme.palette.secondary.main,
                  }}
                  onClick={() => setEditing(true)}
                  onMouseDown={() => handleNameMouseDown()}
                >
                  {props.project.name}
                </Box>
              )}
            </Box>
            <Box>
              {editingDesc && props.editingId === props.project._id ? (
                <Box>
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
                      marginLeft: -25,
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
                    marginLeft: -25,
                    minHeight: "30px",
                    width: 100,
                    color:
                      props.editingId === props.project._id &&
                      theme.palette.secondary.main,
                  }}
                  onClick={() => setEditingDesc(true)}
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
                  style={{
                    display: props.view === "dash" ? "none" : "flex",
                    color:
                      props.editingId === props.project._id &&
                      theme.palette.secondary.main,
                    alignItems: "center",
                  }}
                  onClick={() => setEditingDate(true)}
                  onMouseDown={() => handleDateMouseDown()}
                >
                  {props.project.startDate}
                </Box>
              )}
            </Box>
            <Box
              style={{
                display: props.view === "dash" ? "none" : "flex",
                justifyContent: "right",
              }}
            >
              {parseInt(props.project.totalPoints)}
            </Box>
            <Box
              style={{
                display: props.view === "dash" ? "none" : "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              {parseInt(props.project.totalCost, 10)}
            </Box>
          </Box>
        </ClickAwayListener>
        {props.editingId === props.project._id ? (
          <IconButton
            color="secondary"
            disableRipple
            style={{ position: "absolute", top: 2, right: 50 }}
            ria-describedby={id}
            variant="contained"
            onClick={() => props.setEditId(null)}
          >
            <DoneIcon />
          </IconButton>
        ) : (
          ""
        )}
        <IconButton
          color="primary"
          disableRipple
          style={{
            display: props.view === "dash" ? "none" : "flex",
            position: "absolute",
            top: 2,
            right: 0,
          }}
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
            <ListItemText>Edit</ListItemText>
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
