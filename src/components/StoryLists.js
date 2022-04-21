import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useReducer,
} from "react";
import DragList from "./DragList";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Paper, Snackbar, Box, TextField, Button, Slide } from "@mui/material";
import StoryDialog from "./StoryDialog";

const SERVER = "http://localhost:5000/";
export const statesContext = createContext();
const StoryLists = () => {
  const initialState = {
    lists: [],
    stories: [],
    projects: [],
    users: [],
    listedStories: {},
    newSprintName: "New Sprint",
    storyDialogOpen: false,
    selectedStory: null,
    selectedStoryUsers: [],
    newSubtaskName: "",
    contactServer: false,
    msg: "",
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(async () => {
    fetchStories(await fetchProjects());
    fetchUsers();
  }, []);

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      contactServer: false,
    });
  };
  const handleCloseStoryDialog = () => setState({ storyDialogOpen: false });
  const onSprintNameChange = (e) => {
    setState({ newSprintName: e.target.value });
  };

  const fetchProjects = async () => {
    try {
      let response = await fetch(SERVER + `project/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      let json = await response.json();
      console.log(json.projects);
      setState({
        projects: json.projects,
      });
      return json.projects;
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };
  const fetchUsers = async () => {
    try {
      let response = await fetch(SERVER + `user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      let json = await response.json();
      setState({
        users: json.users,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  const addNewSprint = async () => {
    if (
      state.lists.filter((list) => list.name === state.newSprintName).length > 0
    ) {
      setState({
        contactServer: true,
        msg: `${state.newSprintName} already exists; Please use a unique sprint name`,
      });
      return;
    }
    try {
      let data = {
        name: state.newSprintName,
      };
      let response = await fetch(SERVER + `sprint/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      setState({
        contactServer: true,
        msg: `${json.msg}`,
      });
      if (response.ok) {
        fetchStories(state.projects);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const generateLists = async () => {
    try {
      let response = await fetch(SERVER + `sprint/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      let json = await response.json();
      let lists = [{ name: "Backlog" }];
      json.sprints.forEach((sprint) => {
        lists.push(sprint);
      });
      setState({ lists: lists });
      return lists;
    } catch (error) {
      console.log(error);
    }
  };
  const sortStories = (lists, stories) => {
    let listedStories = {};
    listedStories["Backlog"] = [];
    lists.forEach((list) => {
      listedStories[list.name] = [];
    });
    for (let i = 0; i < stories.length; ++i) {
      if (!stories[i].belongsToID || stories[i].belongsTo === "Backlog") {
        listedStories["Backlog"].push(stories[i]);
        continue;
      }
      let pushed = false;
      for (let j = 0; j < lists.length; ++j) {
        if (lists[j]?._id && stories[i].belongsToID === lists[j]._id) {
          listedStories[lists[j].name].push(stories[i]);
          pushed = true;
          break;
        }
      }
      if (!pushed) listedStories["Backlog"].push(stories[i]);
    }
    console.log(listedStories);

    setState({ listedStories: listedStories });
  };

  const fetchStories = async (projects) => {
    try {
      let response = await fetch(SERVER + `task/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      let json = await response.json();

      let stories = json.stories;
      stories.forEach((story) => {
        projects.forEach((project) => {
          if (story.projectID === project._id) {
            story.projectName = project.name;
          }
        });
      });
      setState({ stories: stories });
      if (state.selectedStory) {
        stories.forEach((story) => {
          if (story._id === state.selectedStory._id) {
            setState({ selectedStory: story });
          }
        });
      }
      sortStories(await generateLists(stories), stories);
      console.log(stories);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <statesContext.Provider value={{ state, setState }}>
      <ThemeProvider theme={theme}>
        <StoryDialog
          handleCloseDialog={handleCloseStoryDialog}
          refresh={fetchStories}
        ></StoryDialog>
        <Paper
          style={{
            minHeight: "1000px",
            backgroundColor: theme.palette.background.paper,
            paddingTop: "4.5%",
          }}
        >
          <Paper
            component="div"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              p: 1,
              m: 1,
              color: (theme) =>
                theme.palette.mode === "dark" ? "grey.300" : "grey.800",
              fontSize: "1.275rem",
              fontWeight: "600",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "30%",
              }}
            >
              <TextField
                label="name (e.g. Sprint 2)"
                onChange={onSprintNameChange}
                value={state.newSprintName}
              ></TextField>
              <Button
                onClick={() => addNewSprint()}
                disabled={state.newSprintName === ""}
                variant="contained"
                style={{ marginRight: "2%" }}
              >
                {" "}
                Add sprint
              </Button>
            </Box>
          </Paper>
          <Paper
            component="div"
            sx={{
              p: 1,
              m: 1,
              color: (theme) =>
                theme.palette.mode === "dark" ? "grey.300" : "grey.800",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark" ? "grey.800" : "grey.300",
              borderRadius: 2,
            }}
          >
            <DragList update={fetchStories}></DragList>
          </Paper>
        </Paper>
        <Snackbar
          open={state.contactServer}
          message={state.msg}
          autoHideDuration={3000}
          onClose={snackbarClose}
          TransitionComponent={Slide}
        ></Snackbar>
      </ThemeProvider>
    </statesContext.Provider>
  );
};

export default StoryLists;
