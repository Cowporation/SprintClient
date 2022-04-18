import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React, { useState } from "react";
import styled from "styled-components";
import OutputIcon from "@mui/icons-material/Output";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { exportRetrospective, exportWorkSummary } from "./ExportHelpers";

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 6px;
  background: #7e7e7e;
`;

const DraggableElement = ({ prefix, elements }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleWorkSummaryClick = ()=>{
    exportWorkSummary(elements, prefix);
    handleExportClose();
  }
  const handleRetroSpectiveClick = ()=>{
    exportRetrospective(elements, prefix);
    handleExportClose();
  }
  return (
    <DroppableStyles>
      <Box
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ColumnHeader>{prefix}</ColumnHeader>
        <IconButton
          color="primary"
          onClick={handleExportClick}
          style={{ marginBottom: "20px" }}
        >
          <OutputIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleExportClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleWorkSummaryClick}>Export Member Work Summary</MenuItem>
          <MenuItem onClick={handleRetroSpectiveClick}>Export Retrospective</MenuItem>
        </Menu>
      </Box>
      <Droppable droppableId={`${prefix}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements?.map((item, index) => (
              <ListItem key={item._id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DroppableStyles>
  );
};
export default DraggableElement;
