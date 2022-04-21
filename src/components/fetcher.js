//Project fetches
export const postProject = async (project) =>
  fetch("http://localhost:5001/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(project),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 405) return "ERROR: Missing Parameters";
    else return null;
  });
export const fetchProjects = async () =>
  fetch("http://localhost:5001/project").then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) return "ERROR";
    else return null;
  });
export const updateProject = (data) =>
  fetch("http://localhost:5001/project", {
    method: "PUT",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 405) return "UPDATE ERROR";
    else {
      return null;
    }
  });

export const deleteProject = (id) =>
  fetch(`http://localhost:5001/project/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
//Task fetches
export const fetchTasks = async () =>
  fetch("http://localhost:5001/task").then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) return "ERROR";
    else return null;
  });
//Subtask fetches
export const fetchSubtasks = async () =>
  fetch("http://localhost:5001/subtask").then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) return "ERROR";
    else return null;
  });
//Sprint fetches
export const fetchSprints = async () =>
  fetch("http://localhost:5001/sprint").then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) return "ERROR";
    else return null;
  });
