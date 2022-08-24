import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import types from "./types";

const Student = ({
  classes = [],
  isDragging,
  text,
  student,
  idx,
  seatsPerRow,

  populateGutter,
  color_print,
}) => {
  /*  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: types.STUDENT,
      item: { student, idx, seatsPerRow, populateGutter, color_print },
      collect: (monitor) => ({ opacity: monitor.isDragging() ? 0.5 : 1 }),
    }),
    []
  );

  const [collectedProps, drop] = useDrop(() => ({ accept: types.STUDENT }));

  console.log("DROPS WITH : ", collectedProps, drop);*/

  let borderColor = "";

  const rows = {
    one: "orange red red red",
    two: "yellow orange orange orange",
    three: "green yellow yellow yellow",
    four: "black green green green",
  };

  const _classes = ["student-container", ...classes];

  if (populateGutter && idx % 7 === 0) {
    borderColor = "gray";
  } else if (color_print) {
    if (idx < seatsPerRow) {
      borderColor = rows.one;
      _classes.push("lastRow");
    } else if (idx >= 1 * seatsPerRow && idx < 2 * seatsPerRow) {
      borderColor = rows.two;
    } else if (idx >= 2 * seatsPerRow && idx < 3 * seatsPerRow) {
      borderColor = rows.three;
    } else if (idx >= 3 * seatsPerRow) {
      borderColor = rows.four;
    }
  } else if (idx !== 99) {
    borderColor = "black";
  }

  if (idx % seatsPerRow === seatsPerRow - 1) {
    _classes.push("firstStudent");
  } else if (idx % seatsPerRow === 0) {
    _classes.push("lastStudent");
  }
  const isOver = false;
  const canDrop = false;
  return (
    <div
      className={_classes.join(" ")}
      style={{
        opacity: isDragging ? 0.5 : 1.0,
        cursor: idx === 99 || student[0] === undefined ? "" : "move",
        backgroundColor: isOver && canDrop ? "lightgreen" : "",
      }}
    >
      <div className="student" style={{ borderColor }}>
        <div className="name">{student[0]}</div>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
          <div className={`grade`} key={g}></div>
        ))}
      </div>
    </div>
  );
};

export default Student;
