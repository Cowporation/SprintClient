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
import React, { useEffect, useContext, useState } from "react";
const SERVER = "http://localhost:5000/";

const UserHourRow = (props) => {
  const [estHours, setEstHours] = React.useState(props.user.estHours);
  const [actHours, setActHours] = React.useState(props.user.actHours);
  const [reestHours, setReestHours] = React.useState(props.user.reestHours);
  const { state, setState } = useContext(statesContext);
  const onUpdate = async () =>{
      props.user.actHours = actHours;
      props.user.estHours = estHours;
      props.user.reestHours = reestHours;
      props.update(props.user);
  }
  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {props.user.firstName + " " + props.user.lastName}
        </TableCell>
        <TableCell align="center">
          <TextField
            type="number"
            value = {estHours}
            style={{ width: "45%" }}
            onChange = {(e) => setEstHours(e.target.valueAsNumber || 0)}
            inputProps={{
              style: { textAlign: "right" },
              min: 0,
            }}
          />
        </TableCell>
        <TableCell align="center">
          <TextField
            type="number"
            value = {actHours}
            onChange = {(e) => setActHours(e.target.valueAsNumber || 0)}
            style={{ width: "45%" }}
            inputProps={{
              style: { textAlign: "right" },
              min: 0,
            }}
          />
        </TableCell>
        <TableCell align="center">
          <TextField
            type="number"
            value = {reestHours}
            onChange = {(e) => setReestHours(e.target.valueAsNumber || 0)}
            style={{ width: "45%" }}
            inputProps={{
              style: { textAlign: "right" },
              min: 0,
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Button onClick={onUpdate}>Update</Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default UserHourRow;
