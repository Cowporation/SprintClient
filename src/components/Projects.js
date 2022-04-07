import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Alert, Box, Button, Card, IconButton, Snackbar } from "@mui/material";

import Project from "./Project.js";
import NewProject from "./NewProject.js";

import AddIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../theme";
import "./project.scss";
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
const Projects = ({ projects, setProjects, selectedDate, onToggle }) => {
  const [showAddProjects, setShowAddProjects] = useState(false);
  useEffect(() => {
    //fetch projects
    const fetchProjects = async () => {
      try {
        let res = await fetch("http://localhost:5000/project");
        await res.json();
      } catch (error) {
        console.log(`Problem loading projects - ${error.message}`);
      }
    };
    fetchProjects();
  }, []);
  //add new project
  const newProject = async (project) => {
    try {
      let response = await fetch("http://localhost:5000/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(project),
      });
      const data = await response.json();

      if (response.ok) {
        setProjects([...projects, data]);
        setOpen(true);
        setId(`Project ${data.name} ADDED!`);
      } else {
        setOpen(true);
        setId(`Project ${data.name} NOT ADDED!`);
      }
    } catch (error) {
      setOpen(true);
      setId(`ERROR!`);
    }
  };
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const onDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/project/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      setProjects(projects.filter((a) => a._id !== id));
      setOpen(true);
      setId(`Project ${projects.filter((a) => a._id === id)[0].name} Deleted!`);
    } catch (error) {
      setId(`Project ${id} NOT Deleted!`);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card className="project-container">
        <Box style={{ display: "flex" }}>
          <Box mt={10} ml={1}>
            <Button
              variant="outlined"
              onClick={() => setShowAddProjects(!showAddProjects)}
              startIcon={showAddProjects ? <MinusIcon /> : <AddIcon />}
            >
              {showAddProjects ? "DONE" : "ADD PROJECT"}
            </Button>
          </Box>

          {showAddProjects && (
            <NewProject
              projects={projects}
              selectedDate={selectedDate}
              onAdd={newProject}
              onClickOutside={() => {
                setShowAddProjects(false);
              }}
            />
          )}
        </Box>
        <Box className="projects-box">
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              color: theme.palette.primary.light,
              padding: "4px 15px 0 0",
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
                }}
              >
                Name
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "right",
              }}
            >
              Description
            </Box>
            <Box style={{ display: "flex", justifyContent: "right" }}>
              Start Date
            </Box>
            <Box style={{ display: "flex", justifyContent: "right" }}>
              Total Points (Pts)
            </Box>
            <Box style={{ display: "flex", justifyContent: "right" }}>
              Total Cost ($)
            </Box>
          </Box>
          {projects.map((project) => {
            return (
              <Project
                key={uuidv4()}
                number={project._id}
                project={project}
                selectedDate={selectedDate}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            );
          })}
        </Box>
      </Card>
      <div
        className="snack-bar"
        style={{ display: "flex", position: "absolute", top: 0, right: 0 }}
      >
        <Box
          sx={{
            display: open ? "" : "none",
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
            open={open}
            autoHideDuration={3500}
            onClose={handleClose}
          >
            <Alert
              severity={id.includes("NOT") ? "error" : "success"}
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
              onClose={handleClose}
            >
              {id}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </ThemeProvider>
  );
};
export default Projects;
