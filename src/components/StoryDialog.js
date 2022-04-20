import {
  AppBar,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { statesContext } from "./StoryLists";
import React, { useEffect, useContext } from "react";
import SubtaskTable from "./SubtaskTable";
const SERVER = "http://localhost:5001/";
const StoryDialog = (props) => {
  const { state, setState } = useContext(statesContext);
  const addNewSubtask = async () => {
    try {
      let data = {
        id: state.selectedStory._id,
        subtask: state.newSubtaskName,
      };
      console.log(data);
      let response = await fetch(SERVER + `task/addsubtask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      console.log(json);
      props.refresh(state.projects);
      setState({ newSubtaskName: "" });
    } catch (error) {
      console.log(error);
    }
  };
  const onTextChange = (e) => {
    setState({ newSubtaskName: e.target.value });
  };
  return (
    <Dialog
      open={state.storyDialogOpen}
      onClose={props.handleCloseDialog}
      style={{ margin: 20 }}
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle style={{ textAlign: "center" }}>
        <Typography style={{ paddingBottom: "2vw" }} color="primary.main">
          {state.selectedStory?.portion}
        </Typography>
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <TextField
          style={{ margin: 10 }}
          label="Enter New Subtask here..."
          value={state.newSubtaskName}
          onChange={onTextChange}
        ></TextField>
        <Button
          style={{ margin: 10 }}
          variant="contained"
          disabled={state.newSubtaskName === ""}
          onClick={addNewSubtask}
        >
          Add Subtask
        </Button>
        <SubtaskTable
          refresh={() => props.refresh(state.projects)}
        ></SubtaskTable>
      </DialogContent>
    </Dialog>
  );
};
export default StoryDialog;
