import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  Drawer,
  IconButton,
  Snackbar,
} from "@mui/material";

import Project from "./Project.js";
import NewProject from "./NewProject.js";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

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

const Projects = ({ updatedProjects, projects, setProjects, selectedDate }) => {
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
      let response = await fetcher.updateProject(data);
      updatedProjects(response);
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
    setEditId(id);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box className="project-container">
        <Box
          style={{
            display: "flex",
            position: "absolute",
            top: "4rem",
            right: 0,
            padding: "2.2rem",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setAddProject(true)}
            startIcon={<AddIcon variant="outlined" color="primary"></AddIcon>}
          >
            NEW PROJECT
          </Button>
        </Box>

        <Box
          className="projects-box"
          style={{
            padding: 15,
          }}
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              color: theme.palette.primary.light,
              padding: "4px 15px 0 0",
              margin: 0,
              minWidth: "860px",
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
                  padding: "0 8px",
                  textTransform: "uppercase",
                  marginRight: "115px",
                }}
              >
                Name
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "right",
                width: "150px",
              }}
            >
              Description
            </Box>
            <Box
              style={{
                display: "flex",
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
                display: "flex",
                justifyContent: "right",
                whiteSpace: "nowrap",
              }}
            >
              Total Points (Pts)
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "right",
                whiteSpace: "nowrap",
              }}
            >
              Total Cost ($)
            </Box>
          </Box>

          {projects.map((project) => {
            return (
              <Box key={uuidv4()}>
                <Project
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
      <Drawer anchor={"right"} open={addProject} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 540 }} role="presentation">
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
              horizontal: "right",
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
