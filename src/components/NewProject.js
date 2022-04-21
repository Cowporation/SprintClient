import React, { useState, useReducer } from "react";
import moment from "moment";

import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import TrashIcon from "@mui/icons-material/DeleteForever";

import NewStory from "./NewStory.js";

import theme from "../theme";
import "./project.scss";

const NewProject = (props) => {
  const initialState = {
    name: "",
    description: "",
    startYear: moment().format("YYYY"),
    startMonth: moment().format("MM"),
    startDay: moment().format("DD"),
    storyPointHours: 0,
    stories: [],
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const columns = [
    {
      field: "portion",
      headerName: "Portion",
      width: 180,
      preProcessEditCellProps: (params) => {
        const index = state.stories.findIndex((s) => s.id === params.id);
        setState({
          stories: [
            ...state.stories.slice(0, index),
            {
              ...state.stories[index],
              portion: params.props.value,
            },
            ...state.stories.slice(index + 1),
          ],
        });
        const hasError = !params.props.value;
        return { ...params.props, error: hasError };
      },
      editable: true,
      sortable: false,
    },

    {
      field: "priority",
      headerName: "Priority",
      type: "singleSelect",
      valueOptions: ["High", "Medium", "Low"],
      editable: true,
      width: 180,
      preProcessEditCellProps: (params) => {
        const index = state.stories.findIndex((s) => s.id === params.id);
        setState({
          stories: [
            ...state.stories.slice(0, index),
            {
              ...state.stories[index],
              priority: params.props.value,
            },
            ...state.stories.slice(index + 1),
          ],
        });
        const hasError = !params.props.value;
        return { ...params.props, error: hasError };
      },
      sortable: false,
    },
    {
      field: "storyPoints",
      headerName: "Story Points",
      type: "number",
      preProcessEditCellProps: (params) => {
        const index = state.stories.findIndex((s) => s.id === params.id);
        setState({
          stories: [
            ...state.stories.slice(0, index),
            {
              ...state.stories[index],
              storyPoints: params.props.value,
            },
            ...state.stories.slice(index + 1),
          ],
        });
        const hasError = !params.props.value;
        return { ...params.props, error: hasError };
      },
      editable: true,
      sortable: false,
    },
  ];

  //year drop down
  var startYear = moment().clone().year();
  const endYear = moment().clone().year() + 10;
  const SelectYears = [];
  const SelectEYears = [];
  while (startYear <= endYear) {
    SelectYears.push(startYear);
    SelectEYears.push(startYear);
    startYear++;
  }
  //month drop down
  const startMonth = moment().clone().startOf("year");
  const endMonth = moment().clone().endOf("year");
  const mon = startMonth.subtract(1, "month");
  const months = [];
  while (startMonth.isBefore(endMonth, "month")) {
    months.push(mon.add(1, "month").clone());
  }

  //day drop down
  const startEDay = moment(state.startYear + "-" + state.startMonth, "YYYY-MM")
    .clone()
    .startOf("month");
  const lastEDay = moment(state.startYear + "-" + state.startMonth, "YYYY-MM")
    .clone()
    .endOf("month");
  const test = startEDay.subtract(1, "day");
  const dates = [];
  while (startEDay.isBefore(lastEDay, "day")) {
    dates.push(test.add(1, "day").clone());
  }
  const [addStory, setAddStory] = useState(false);
  const handleStories = (s) => {
    setState({ stories: [...state.stories, s] });
  };

  const onAddStory = () => {
    props.onAdd({
      name: state.name,
      description: state.description,
      startDate:
        state.startYear + "-" + state.startMonth + "-" + state.startDay,
      storyPointHours: state.storyPointHours,
      stories: state.stories,
    });

    setState({
      name: "",
      description: "",
      startYear: moment().format("YYYY"),
      startMonth: moment().format("MM"),
      startDay: moment().format("DD"),
      storyPointHours: 0,
      stories: [],
    });
  };
  const requiredEntry =
    state.name === null ||
    state.name === "" ||
    state.description === null ||
    state.description === "" ||
    state.storyPointHours === 0 ||
    state.storyPointHours === null ||
    state.stories.length === 0;
  const [deletable, setDeletable] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Card className="new-project">
        <CardContent
          component="form"
          style={{
            backgroundColor: theme.palette.secondary.dark,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifySelf: "center",

              "& .MuiTextField-root": { mt: 1.5, mr: 1 },
            }}
          >
            <TextField
              sx={{ width: "100%", fontColor: "red" }}
              label="Project Name"
              required={true}
              error={state.name === null || state.name === ""}
              defaultValue={""}
              onChange={(e) => setState({ name: e.target.value })}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
                paddingLeft: "5px",
                paddingBottom: "5px",
              }}
            >
              <TextField
                required={true}
                sx={{ width: "30%" }}
                select
                label="Month"
                defaultValue={
                  props.selectedDate
                    ? moment(props.selectedDate).format("MM")
                    : state.startMonth
                }
                onChange={(e) => setState({ startMonth: e.target.value })}
              >
                <MenuItem disabled={true} value="">
                  MONTH
                </MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month.format("MM")}>
                    {month.format("MM")}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required={true}
                sx={{ width: "30%" }}
                select
                label="Day"
                defaultValue={
                  props.selectedDate
                    ? moment(props.selectedDate).format("DD")
                    : state.startDay
                }
                onChange={(e) => setState({ startDay: e.target.value })}
              >
                <MenuItem value="" disabled={true}>
                  DAY
                </MenuItem>
                {dates.map((day) => (
                  <MenuItem key={day} value={day.format("DD")}>
                    {day.format("DD")}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required={true}
                sx={{ width: "30%" }}
                label="Year"
                select
                defaultValue={
                  props.selectedDate
                    ? moment(props.selectedDate).format("YYYY")
                    : state.startYear
                }
                onChange={(e) => setState({ startYear: e.target.value })}
              >
                <MenuItem value="" disabled={true}>
                  YEAR
                </MenuItem>
                {SelectYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "block" }}>
              <TextField
                sx={{ width: "100%" }}
                multiline
                required={true}
                rows={4}
                label="Description"
                defaultValue={""}
                onChange={(e) => setState({ description: e.target.value })}
              />
            </Box>
            <Box sx={{ display: "block" }}>
              <TextField
                type="number"
                required={true}
                label="Hours / Story Point"
                defaultValue="0"
                sx={{ width: "25ch" }}
                size="small"
                onChange={(e) => setState({ storyPointHours: e.target.value })}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: (
                    <InputAdornment position="end">Hr</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Box>
          </CardContent>
          <CardContent>
            <Box>
              <CardActions>
                <Button
                  color="primary"
                  disableRipple
                  onClick={(el) => setAddStory(!addStory)}
                  startIcon={
                    <AddIcon
                      className={addStory ? "add-button-rotated" : "add-button"}
                    />
                  }
                >
                  Add Story
                </Button>
              </CardActions>
              {addStory && (
                <NewStory
                  stories={state.stories}
                  newStory={handleStories}
                ></NewStory>
              )}
            </Box>

            {state.stories.length !== 0 ? (
              <Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={() => setDeletable(!deletable)}
                    startIcon={<TrashIcon />}
                  >
                    {deletable ? "Cancel" : "Delete Story"}
                  </Button>
                  {deletable && (
                    <Button disabled style={{ color: "salmon" }}>
                      Click a Story to Delete!
                    </Button>
                  )}
                </Box>
                <Box>
                  <div style={{ height: 300, width: "100%" }}>
                    <DataGrid
                      style={{
                        color: deletable ? "rgb(255, 33, 70)" : "",
                      }}
                      hideFooter={true}
                      rows={state.stories}
                      columns={columns}
                      getRowId={(r) => r.id}
                      isRowSelectable={(param) => deletable}
                      experimentalFeatures={{ newEditingApi: true }}
                      onSelectionModelChange={(selectionModel) => {
                        let rowsToDelete = [];
                        selectionModel.forEach((rowId) => {
                          rowsToDelete = state.stories.filter(
                            (a) => a.id !== rowId
                          );
                          setTimeout(() => {
                            setState({ stories: rowsToDelete });
                          });
                        });
                      }}
                    />
                  </div>
                </Box>
              </Box>
            ) : (
              ""
            )}
          </CardContent>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              disabled={requiredEntry}
              size="large"
              variant="outlined"
              color="primary"
              disableRipple
              onClick={(e) => onAddStory()}
            >
              CREATE PROJECT
            </Button>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};
export default NewProject;
