import React from "react";
import { useDrag, useDrop } from "react-dnd";

import types from "./types";

const Student = ({
  classes = [],

  text,
  student,
  idx,
  seatsPerRow,
  onMove,

  populateGutter,
  color_print,
  numRows = 4,
}) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: types.STUDENT,
      item: { student, idx, seatsPerRow, populateGutter, color_print, onMove },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => Array.isArray(student) && student[0] && idx !== 99,
    }),
    []
  );

  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: types.STUDENT,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      canDrop: (item, monitor) => item.student[0] !== student[0] && idx !== 99,
      drop: (item) => {
        onMove(item.student, student, idx, item.idx);
      },
    }),
    [onMove]
  );

  let borderColor = "";

  const orows = {
    one: "orange red red red",
    two: "yellow orange orange orange",
    three: "green yellow yellow yellow",
    four: "black green green green",
  };

  const rows = [
    "red",
    "orange",
    "yellow",
    "green",
    "black",
    "blue",
    "brown",
    "cyan",
    "gray",
    "pink",
    "magenta",
    "maroon",
    "navy",
    "olive",
    "purple",
  ];

  const _classes = ["student-container", ...classes];

  const studentStyles = {};

  if (populateGutter && idx % 7 === 0) {
  } else if (color_print) {
    const ridx = Math.floor(idx / seatsPerRow);
    console.log(idx, seatsPerRow, ridx);
    if (ridx < numRows) {
      const rowColor = ridx >= rows.length ? "black" : rows[ridx];
      studentStyles.borderBottomColor = rowColor;
      studentStyles.borderLeftColor = rowColor;
      studentStyles.borderRightColor = rowColor;
      studentStyles.borderTopColor = ridx === numRows - 1 ? "black" : rowColor;
    } else if (idx !== 99) {
      studentStyles.borderColor = "black";
    } else {
      studentStyles.borderColor = "gray";
    }
  }

  if (idx % seatsPerRow === seatsPerRow - 1) {
    _classes.push("firstStudent");
  } else if (idx % seatsPerRow === 0) {
    _classes.push("lastStudent");
  }

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={_classes.join(" ")}
      style={{
        opacity: isDragging ? 0.5 : 1.0,
        cursor: idx === 99 || student[0] === undefined ? "" : "move",
        backgroundColor: isOver && canDrop ? "lightgreen" : "",
      }}
    >
      <div className="student" style={studentStyles}>
        <div className="name">{student[0]}</div>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
          <div className={`grade`} key={g}></div>
        ))}
      </div>
    </div>
  );
};

export default Student;
