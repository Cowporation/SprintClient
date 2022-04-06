import React from "react";
import "./home.css";

export const Home = () => {
  return (
    <div>
      <canvas
        height="720"
        width="1280"
        style={{
          position: "absolute",
          left: "1rem",
          top: "4rem",
          border: "1px solid rgb(255, 216, 157)",
        }}
      ></canvas>
    </div>
  );
};

export default Home;
