import React, { useState, useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Autocomplete,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import theme from "../theme";
//import "../App.css";
const SERVER = "http://localhost:5000/";
const UserComponent = () => {
  const initialState = {
    msg: "",
    users: [],
    projectUsers: [{ firstName: "Select a project to view users assigned" }],
    user: null,
    registerButtonDisabled: true,
    addButtonDisabled: true,
    firstName: "",
    lastName: "",
    role: null,
    project: null,
    alert: null,
    page: 0,
    rowsPerPage: 10,
    registerUser: true,
    addUserToProject: false,
    contactServer: false,
    radio: "register",
    roles: ["Developer", "Project Manager", "UI Designer", "Quality Engineer"],
    projects: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const onChangeRadioButton = (e) => {
    if (e.target.value === "register") {
      setState({
        radio: e.target.value,
        firstName: "",
        lastName: "",
        role: null,
        registerUser: true,
      });
    } else if (e.target.value === "add") {
      setState({
        radio: e.target.value,
        firstName: "",
        lastName: "",
        role: null,
        registerUser: false,
      });
    }
  };

  const columns = [
    { id: "firstName", label: "First Name", minWidth: 180 },
    { id: "lastName", label: "Last Name", minWidth: 180 },
    { id: "role", label: "Role", minWidth: 50 },
    { id: "action", label: "Action", minWidth: 20 },
  ];
  const handleChangePage = (event, newPage) => {
    setState({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    setState({ rowsPerPage: +event.target.value, page: 0 });
  };
  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);
  const onChangeRoleAutoComplete = (e, selectedOption) => {
    if (selectedOption) {
      setState({
        //alert: state.alerts.filter((a) => a.name === selectedOption)[0],
        role: selectedOption,
      });
      if (state.firstName && state.lastName) {
        setState({ registerButtonDisabled: false });
      } else {
        setState({ registerButtonDisabled: true });
      }
    } else {
      setState({ role: null, registerButtonDisabled: true });
    }
  };
  const onChangeProjectAutoComplete = (e, selectedOption) => {
    if (selectedOption) {
      usersByProject(selectedOption);
      if (state.user) {
        setState({ addButtonDisabled: false });
      } else {
        setState({ addButtonDisabled: true });
      }
      setState({
        //alert: state.alerts.filter((a) => a.name === selectedOption)[0],
        project: selectedOption,
      });
    } else {
      setState({ project: null, addButtonDisabled: true });
    }
  };
  const onChangeUserAutoComplete = (e, selectedOption) => {
    if (selectedOption) {
      if (state.project) {
        setState({ addButtonDisabled: false });
      } else {
        setState({ addButtonDisabled: true });
      }
      setState({
        user: selectedOption,
      });
    } else {
      setState({ project: null, addButtonDisabled: true });
    }
  };
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      contactServer: false,
    });
  };
  const onChangeFirstName = (e) => {
    setState({ firstName: e.target.value });
    if (e.target.value && state.lastName && state.role) {
      setState({ registerButtonDisabled: false });
    } else {
      setState({ registerButtonDisabled: true });
    }
  };
  const onChangeLastName = (e) => {
    setState({ lastName: e.target.value });
    if (e.target.value && state.firstName && state.role) {
      setState({ registerButtonDisabled: false });
    } else {
      setState({ registerButtonDisabled: true });
    }
  };

  const registerUser = async () => {
    try {
      let timestamp = new Date().toLocaleString("sv-SE");
      let data = {
        firstName: state.firstName,
        lastName: state.lastName,
        role: state.role,
      };
      let response = await fetch(SERVER + `user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      setState({
        role: null,
        firstName: "",
        lastName: "",
        registerButtonDisabled: true,
        contactServer: true,
        msg: `user ${state.firstName} added on ${timestamp}.`,
      });
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = async () => {
    try {
      let timestamp = new Date().toLocaleString("sv-SE");
      let data = {
        projectId: state.project._id,
        userId: state.user._id,
      };
      let response = await fetch(SERVER + `project/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      setState({
        user: null,
        project: null,
        projectUsers: [
          { firstName: "Select a project to view users assigned" },
        ],
        addButtonDisabled: true,
        contactServer: true,
        msg: `user ${state.user.firstName} added on ${timestamp}.`,
      });

      await fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const removeUserFromProject = async (user) => {
    try {
      let timestamp = new Date().toLocaleString("sv-SE");
      let data = {
        projectId: state.project._id,
        userId: user._id,
      };
      let response = await fetch(SERVER + `project/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        let json = await response.json();
        setState({
          contactServer: true,
          msg: `user ${user.firstName} removed from project ${state.project.name} on ${timestamp}.`,
        });
        state.project.users = state.project.users.filter(user => user._id !=user._id);
        usersByProject(state.project);
        await fetchProjects();
      }
    } catch (error) {
      console.log(error);
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
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
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
      setState({
        projects: json.projects,
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };

  const usersByProject = (project) => {
    if (project.users && project.users.length > 0) {
      let users = [];
      project.users.forEach((userID) => {
        let user = state.users.find((user) => user._id === userID);
        users.push(user);
      });
      setState({
        projectUsers: users,
      });
    } else {
      setState({
        projectUsers: [{ firstName: "No Users assigned for selected project" }],
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        style={{ paddingTop: "5%", minHeight: "1000px", overflowY: "auto" }}
      >
        <CardHeader
          title="User Management"
          style={{ textAlign: "center" }}
          titleTypographyProps={{
            fontSize: 30,
            color: "#ffacad",
          }}
        />
        <FormControl
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={state.radio}
            defaultValue="traveler"
            onChange={onChangeRadioButton}
            style={{ alignSelf: "center" }}
          >
            <FormControlLabel
              value="register"
              control={<Radio />}
              label="Register new user"
            />
            <FormControlLabel
              value="add"
              control={<Radio />}
              label="Add user to a project"
            />
          </RadioGroup>
        </FormControl>
        {state.registerUser && (
          <CardContent
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              style={{ margin: 10 }}
              label="First Name"
              value={state.firstName}
              onChange={onChangeFirstName}
            ></TextField>
            <TextField
              style={{ margin: 10 }}
              label="Last Name"
              value={state.lastName}
              onChange={onChangeLastName}
            ></TextField>
            <Autocomplete
              data-testid="autocomplete"
              options={state.roles}
              getOptionLabel={(option) => option}
              style={{ width: 300, margin: 10 }}
              onChange={onChangeRoleAutoComplete}
              value={state.role}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Button
              style={{ margin: 10 }}
              variant="contained"
              disabled={state.registerButtonDisabled}
              onClick={registerUser}
            >
              Add User
            </Button>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.users
                      .slice(
                        state.page * state.rowsPerPage,
                        state.page * state.rowsPerPage + state.rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column, indexCol) => {
                              if (column.id === "action") {
                                return (
                                  <TableCell
                                    key={indexCol}
                                    align={column.align}
                                  >
                                    <IconButton
                                      aria-label="delete"
                                      color="primary"
                                    >
                                      <PersonRemoveIcon />
                                    </IconButton>
                                  </TableCell>
                                );
                              } else {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={indexCol}
                                    align={column.align}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={state.users.length}
                rowsPerPage={state.rowsPerPage}
                page={state.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CardContent>
        )}
        {!state.registerUser && (
          <CardContent
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Autocomplete
              data-testid="autocomplete"
              options={state.projects}
              getOptionLabel={(option) => option.name}
              style={{ width: "100%", margin: 10 }}
              onChange={onChangeProjectAutoComplete}
              value={state.project}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              data-testid="autocomplete"
              options={state.users}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              style={{ width: "100%", margin: 10 }}
              onChange={onChangeUserAutoComplete}
              value={state.user}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="User"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Button
              style={{ margin: 10 }}
              variant="contained"
              disabled={state.addButtonDisabled}
              onClick={addUser}
            >
              Add User
            </Button>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.projectUsers
                      .slice(
                        state.page * state.rowsPerPage,
                        state.page * state.rowsPerPage + state.rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            {columns.map((column, indexCol) => {
                              if (
                                column.id === "action" &&
                                state.projectUsers[0].firstName !=
                                  "Select a project to view users assigned" &&
                                state.projectUsers[0].firstName !=
                                  "No Users assigned for selected project"
                              ) {
                                return (
                                  <TableCell
                                    key={indexCol}
                                    align={column.align}
                                  >
                                    <IconButton
                                      aria-label="delete"
                                      color="primary"
                                      onClick={() => removeUserFromProject(row)}
                                    >
                                      <PersonRemoveIcon />
                                    </IconButton>
                                  </TableCell>
                                );
                              } else {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={indexCol}
                                    align={column.align}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={state.users.length}
                rowsPerPage={state.rowsPerPage}
                page={state.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </CardContent>
        )}
      </Card>
      <Snackbar
        open={state.contactServer}
        message={state.msg}
        autoHideDuration={3000}
        onClose={snackbarClose}
        TransitionComponent={Slide}
      ></Snackbar>
    </ThemeProvider>
  );
};

export default UserComponent;
