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
  Paper,
  Collapse,
  Box,
  Autocomplete,
} from "@mui/material";
import { statesContext } from "./StoryLists";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UserHourRow from "./UserHourRow";
import React, { useEffect, useContext, useState } from "react";
const SERVER = "http://localhost:5000/";

const SubtaskRow = (props) => {
  const [open, setOpen] = React.useState(false);
  const [selectedSubtaskUser, setSelectedSubtaskUser] = React.useState();
  //Total hours for a story calculated from subtasks
  const [workSummary, setWorkSummary] = React.useState({
    estHours: 0,
    actHours: 0,
    reestHours: 0,
  });
  const { state, setState } = useContext(statesContext);
  React.useEffect(() => {calculateHoursForStory()}, []);
  const calculateHoursForStory = () => {
    let data = {
      estHours: 0,
      actHours: 0,
      reestHours: 0,
    };
    props.row.workedby.forEach(user =>{
      data.estHours +=user.estHours;
      data.actHours +=user.actHours;
      data.reestHours +=user.reestHours;
    })
    setWorkSummary(data);
  };
  const CustomPaper = (props) => {
    return <Paper elevation={8} {...props} />;
  };
  const onChangeUserAutoComplete = (e, selectedOption) => {
    //console.log(selectedOption);
    setSelectedSubtaskUser(selectedOption);
  };
  const addUserToSubtask = async () => {
    try {
      if (
        props.row.workedby
          .map((user) => user._id)
          .includes(selectedSubtaskUser._id)
      ) {
        setSelectedSubtaskUser(null);
        return;
      }
      let user = {
        ...selectedSubtaskUser,
        estHours: 0,
        actHours: 0,
        reestHours: 0,
      };

      props.row.workedby.push(user);

      let data = {
        storyid: state.selectedStory._id,
        subtaskid: props.row._id,
        subtask: props.row,
      };
      console.log(data);
      let response = await fetch(SERVER + `task/updatesubtask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      console.log(json);
      props.refresh();
      setSelectedSubtaskUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const updateHours = async (user) => {
    let index = props.row.workedby.findIndex(
      (record) => record._id === user._id
    );
    if (index === -1) {
      return;
    }
    console.log(index);
    console.log(user);
    console.log(props.row);
    try {
      let data = {
        storyid: state.selectedStory._id,
        subtaskid: props.row._id,
        subtask: props.row,
      };
      console.log(data);
      let response = await fetch(SERVER + `task/updatesubtask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      console.log(json);
      props.refresh();
      calculateHoursForStory();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <React.Fragment>
      <TableRow hover role="checkbox" tabIndex={-1} key={props.index}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
              setSelectedSubtaskUser(null);
              console.log(props.row);
            }}
          >
            {open ? (
              <KeyboardArrowUpIcon style={{ fill: "white" }} />
            ) : (
              <KeyboardArrowDownIcon style={{ fill: "white" }} />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.row.name}
        </TableCell>
        <TableCell align="center">{workSummary.estHours}</TableCell>
        <TableCell align="center">{workSummary.actHours}</TableCell>
        <TableCell align="center">{workSummary.reestHours}</TableCell>
        <TableCell align="center">
          <Button aria-label="edit">Delete</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              style={{ display: "flex", flexDirection: "row" }}
              sx={{ margin: 1 }}
            >
              <Autocomplete
                data-testid="autocomplete"
                PaperComponent={CustomPaper}
                popupIcon={
                  <ArrowDropDownIcon
                    style={{
                      color: "white",
                    }}
                  />
                }
                options={state.selectedStoryUsers}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName}`
                }
                style={{ width: "100%", margin: 10, flex: 7 }}
                onChange={onChangeUserAutoComplete}
                value={selectedSubtaskUser}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign user to this subtask"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Button
                style={{ margin: 10, flex: 1 }}
                variant="contained"
                disabled={!selectedSubtaskUser}
                onClick={addUserToSubtask}
              >
                Add
              </Button>
            </Box>
            {props.row.workedby.length > 0 && (
              <Box style={{ marginBottom: "2%" }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Estimate Hours</TableCell>
                      <TableCell align="center">Actual Hours</TableCell>
                      <TableCell align="center">Re-estimate</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.row.workedby.map((user, index) => (
                      <UserHourRow
                        user={user}
                        key={index}
                        update={updateHours}
                      ></UserHourRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default SubtaskRow;
