import React, { useState, useEffect } from "react";
//material ui
import { ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Drawer,
  IconButton,
  Snackbar,
} from "@mui/material";
//icons
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CircularLoading from "@mui/material/CircularProgress";
//components
import Project from "./Project.js";
import NewProject from "./NewProject.js";
//theme/css
import theme from "../theme";
import "./project.scss";
const fetcher = require("./fetcher");

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const Projects = ({ projectId, selectedDate, view, getProject }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let resArr = [];
        let json = await fetcher.fetchProjects();
        resArr = json.projects;
        setProjects(resArr);
      } catch (error) {
        console.log(`Problem loading projects - ${error.message}`);
      }
    };

    fetchProjects();
  }, [setProjects]);
  //add new project
  const newProject = async (project) => {
    let data;
    data = await fetcher.postProject(project);
    if (data && typeof data !== "string") {
      setProjects([...projects, data]);
      setShowToast(true);
      setToastMessage(`Project ${data.name} ADDED!`);
    } else {
      setShowToast(true);
      setToastMessage(data);
    }
  };
  //delete project
  const onDelete = async (id) => {
    try {
      await fetcher.deleteProject(id);
      setProjects(projects.filter((a) => a._id !== id));
      setShowToast(true);
      setToastMessage(
        `Project ${projects.filter((a) => a._id === id)[0].name} Deleted!`
      );
    } catch (error) {
      setToastMessage(`ERROR: Project ${id} NOT Deleted!`);
    }
  };
  //update project
  const updateProject = async (e) => {
    try {
      let data = {
        id: e._id,
        name: e.name,
        description: e.description,
        startDate: e.startDate,
      };
      await fetcher.updateProject(data);
      let json = await fetcher.fetchProjects();
      setProjects(json.projects);
    } catch (error) {
      setToastMessage(`ERROR: Project ${toastMessage} NOT Deleted!`);
    }
  };

  const [addProject, setAddProject] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toggleDrawer = (open) => (event) => {
    setAddProject(open);
  };
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowToast(false);
  };

  const [editId, setEditId] = useState("");
  const getEditId = (id) => {
    view === "dash" ? setEditId(null) : setEditId(id);
  };
  const [viewId, setViewId] = useState("");
  const getStory = (id) => {
    setViewId(id);
    projectId(id);
    getProject(projects.filter((p) => p._id === id)[0]);
  };
  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={projects.length === 0}
      >
        <CircularLoading color="inherit" />
      </Backdrop>

      <Box
        style={{
          position: "fixed",
          top: "4rem",
          right: 0,
          padding: view === "dash" ? "0" : "2.2rem",
        }}
      >
        <Button
          disableRipple
          variant="outlined"
          onClick={() => setAddProject(true)}
          startIcon={<AddIcon variant="outlined" color="primary"></AddIcon>}
        >
          NEW PROJECT
        </Button>
      </Box>
      <Box
        style={{
          width: "100%",
          fontSize: "14px",
          marginTop: view === "dash" ? "8rem" : "12rem",
          padding: view === "dash" ? "0 1rem" : "0 2rem",
          marginRight: "calc((100vw - 100%))",
        }}
      >
        {projects.length !== 0 && (
          <Box>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns:
                  view === "dash" ? "repeat(2,1fr)" : "repeat(6, 1fr)",
                color: theme.palette.primary.light,
                padding: view === "dash" ? "2px 2px 0 0" : "4px 4px 0 0",
                width: view === "dash" ? "400px" : "100vh",
                minWidth: view === "dash" ? "400px" : "860px",
              }}
            >
              <Box
                style={{
                  display: "inline-flex",
                }}
              >
                <Box
                  style={{
                    display: "inline-flex",
                    height: "19px",
                    alignItems: "center",
                    backgroundColor: theme.palette.primary.dark,
                    borderRadius: "4px 4px 0 0",
                    padding: "2px 8px",
                    textTransform: "uppercase",
                    marginRight: "115px",
                  }}
                >
                  name
                </Box>
              </Box>
              <Box
                style={{
                  width: view === "dash" ? "100px" : "150px",
                }}
              >
                Description
              </Box>
              <Box
                style={{
                  display: view === "dash" ? "none" : "flex",
                  justifyContent: "right",
                  whiteSpace: "nowrap",
                  width: "200px",
                  paddingRight: "10px",
                }}
              >
                Start Date
              </Box>
              <Box
                style={{
                  display: view === "dash" ? "none" : "flex",
                  justifyContent: "right",
                  whiteSpace: "nowrap",
                }}
              >
                Total Points (Pts)
              </Box>
              <Box
                style={{
                  display: view === "dash" ? "none" : "flex",
                  justifyContent: "right",
                  whiteSpace: "nowrap",
                }}
              >
                Total Cost ($)
              </Box>
            </Box>

            <Box
              className="project-list"
              style={{
                display: "flex",
                flexDirection: "column",
                justifySelf: "center",
                height: view === "dash" ? "480px" : "768px",
                marginBottom: "110rem",
                marginRight: projects.length >= 14 ? "" : "-7px",
              }}
            >
              {projects.map((project) => {
                return (
                  <Box
                    key={uuidv4()}
                    onClick={() => view === "dash" && getStory(project._id)}
                    style={{
                      cursor: view === "dash" && "pointer",
                      width: view === "dash" ? "400px" : "100vh",
                      color:
                        viewId === project._id && view === "dash"
                          ? theme.palette.secondary.main
                          : theme.palette.secondary.light,

                      border: view === "dash" && `0.1px solid rgba(0,0,0,0.4)`,
                    }}
                  >
                    <Project
                      view={view}
                      project={project}
                      selectedDate={selectedDate}
                      onDelete={onDelete}
                      updateProject={updateProject}
                      editId={getEditId}
                      editingId={editId}
                      setEditId={setEditId}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
      <Drawer anchor={"right"} open={addProject} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 540 }}>
          <NewProject
            projects={projects}
            selectedDate={selectedDate}
            onAdd={newProject}
          />
        </Box>
      </Drawer>
      <div
        className="snack-bar"
        style={{ display: "flex", position: "absolute", top: 0, right: 0 }}
      >
        <Box
          sx={{
            display: showToast ? "" : "none",
            margin: 8,
            width: "100%",
          }}
        >
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{ pt: 5 }}
            open={showToast}
            autoHideDuration={3500}
            onClose={handleClose}
          >
            <Alert
              severity={toastMessage.includes("ERROR") ? "error" : "success"}
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={() => {
                    setShowToast(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
              onClose={handleClose}
            >
              {toastMessage}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </ThemeProvider>
  );
};
export default Projects;
