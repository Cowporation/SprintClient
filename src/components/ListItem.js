import { Draggable } from "react-beautiful-dnd";
import React, { useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { statesContext } from "./StoryLists";

const Avatar = styled.div`
  height: 20px;
  width: 20px;
  border: 1px solid white;
  border-radius: 50%;
  margin-left: 10px;
  background: ${(props) => props.getPriorityColor};
`;

const CardHeader = styled.div`
  font-weight: 500;
  color: #fff;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;
const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
`;

const DragItem = styled.div`
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: #64748b;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
  color: #fff;
`;

const ListItem = ({ item, index }) => {
  const randomHeader = "header";
  const { state, setState } = useContext(statesContext);
  const getPriorityColor = (priority) =>{
    if(priority.toLowerCase() === "high" ) return "red";
    if(priority.toLowerCase() === "medium" ) return "yellow";
    if(priority.toLowerCase() === "low" ) return "green";
  }
  const handleOpenStoryDialog = (item) => {
    console.log(item);
    let userIDs = [];
    let users = [];
    state.projects.forEach((project) =>{
      if(project._id === item.projectID){
        userIDs = project.users;
      }
    })
    state.users.forEach((user)=>{
      if(userIDs.includes(user._id)){
        users.push(user);
      }
    })
    console.log(users);
    setState({ storyDialogOpen: true, selectedStory: item, selectedStoryUsers: users });
  };

  return (
    <Draggable draggableId={item._id} index={index}>
      {(provided, snapshot) => {
        return (
          <DragItem
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => handleOpenStoryDialog(item)}
          >
            <CardHeader>{item.portion}</CardHeader>
            <span>Story Points: {item.storyPoints}</span>
            <span>Estimated Cost: ${item.estimatedCost}</span>
            <CardFooter>
              <span>Project: {item.projectName}</span>
              <Author>
                Priority: {item.priority}
                <Avatar getPriorityColor = {()=>getPriorityColor(item.priority)} />
              </Author>
            </CardFooter>
          </DragItem>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
