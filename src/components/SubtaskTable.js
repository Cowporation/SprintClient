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
import SubtaskRow from "./SubtaskRow";
const SERVER = "http://localhost:5001/";

const SubtaskTable = (props) => {
  const { state, setState } = useContext(statesContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = [
    { id: "name", label: "Name", minWidth: 25 },
    { id: "esthour", label: "Hours Estimate", minWidth: 20 },
    { id: "acthour", label: "Actual Hours", minWidth: 20 },
    { id: "reesthour", label: "Re-estimate", minWidth: 20 },
    { id: "action", label: "Action", minWidth: 5 },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(state.selectedStory.subtasks || [])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <SubtaskRow
                    index={index}
                    row={row}
                    key={index}
                    refresh={props.refresh}
                  ></SubtaskRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={
          state.selectedStory.subtasks ? state.selectedStory.subtasks.length : 0
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
export default SubtaskTable;
