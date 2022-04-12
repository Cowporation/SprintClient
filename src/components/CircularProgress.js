import React from "react";

const CircularProgress = () => {
  return (
    <svg width={500} height={500} viewBox="0 0 500 500">
      <circle
        fill="none"
        stroke="#ccc"
        cx={250}
        cy={250}
        r={25}
        strokeWidth="5px"
      />
      <circle
        fill="none"
        stroke="rgb(255,127,0)"
        cx={250}
        cy={250}
        strokeDasharray={250}
        strokeDashoffset={125}
        r={25}
        strokeWidth="5px"
      />
    </svg>
  );
};
export default CircularProgress;
