import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
import { statesContext } from "./StoryLists";
const DragDropContextContainer = styled.div`
  padding: 20px;
  border: 0px solid indianred;
  border-radius: 6px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.numberOfCol};
  grid-gap: 8px;
`;

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const SERVER = "http://localhost:5001/";
const DragList = (props) => {
  const { state, setState } = useContext(statesContext);
  //const [elements, setElements] = React.useState();
  //const lists = props.lists;
  const numberOfCol = () => {
    let col = "";
    for (let i = 0; i < state.lists.length; ++i) {
      col += "1fr ";
    }
    return col;
  };
  useEffect(() => {
    //setElements(props.elements);
  }, []);

  const updateStory = async (story, destination) => {
    let sprintId;
    let id = story._id;
    if (destination === "Backlog") {
      sprintId = "Backlog";
      story.belongsToID = null;
      story.belongsTo = "Backlog";
    } else {
      state.lists.forEach((list) => {
        if (list.name === destination) {
          sprintId = list._id;
        }
      });
      story.belongsToID = sprintId;
      story.belongsTo = destination;
    }

    try {
      let data = {
        id: id,
        sprintId: sprintId,
      };
      let response = await fetch(SERVER + `task/movetolist`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      let json = await response.json();
      console.log(json);

      return story;
    } catch (error) {
      console.log(error);
    }
  };
  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    console.log(result.source.droppableId);
    console.log(result.destination.droppableId);

    const listCopy = { ...state.listedStories };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );

    //console.log(state.lists);
    console.log(removedElement);
    updateStory(removedElement, result.destination.droppableId);
    console.log(removedElement);
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    console.log(listCopy);
    setState({ listedStories: listCopy });
    //setElements(listCopy);
  };

  return (
    <DragDropContextContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <ListGrid
          numberOfCol={numberOfCol()}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
          }}
        >
          {state.lists.map((listKey, index) => (
            <DraggableElement
              elements={
                state.listedStories ? state.listedStories[listKey.name] : null
              }
              key={index}
              prefix={listKey.name}
            />
          ))}
        </ListGrid>
      </DragDropContext>
    </DragDropContextContainer>
  );
};

export default DragList;
