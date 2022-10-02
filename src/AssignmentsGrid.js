import React from "react";

export const AssignmentsGrid = () => (
  <div className="assignments-grid">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <div key={i}></div>
    ))}
  </div>
);
