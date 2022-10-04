import React from "react";

export const AssignmentsGrid = ({ numLines = 5 }) => {
  const lines = new Array(numLines * 2).fill(0);
  if (!numLines) {
    return null;
  }
  return (
    <div className="assignments-grid">
      {lines.map((_, i) => (
        <div key={i}></div>
      ))}
    </div>
  );
};
