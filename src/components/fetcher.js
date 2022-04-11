export const postProject = async (project) =>
  fetch("http://localhost:5000/project", {
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
export const fetchProjects = () =>
  fetch("http://localhost:5000/project").then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) return "ERROR";
    else return null;
  });
