import React from "react";
import "./project.scss";
const CircularProgress = ({ size, strokeWidth, percent, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const progress = (percent * circumference) / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>
        <circle
          fill="none"
          stroke="#2b2b2b"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          fill="none"
          stroke={color}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={[progress, circumference - progress]}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          strokeLinecap={"round"}
        />
      </g>
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={radius / 2}
        fill={color}
      >
        {size >= 50 ? percent + "%" : ""}
      </text>
    </svg>
  );
};
export default CircularProgress;
