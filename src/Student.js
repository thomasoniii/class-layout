import React from "react";
import { useDrag, useDrop } from "react-dnd";

import types from "./types";

export const Student = ({
  classes = [],

  text,
  student,
  idx,
  seatsPerRow,
  onMove,

  color_print,
  numRows,
}) => {
  console.log("STUDENT : NUMROWS", numRows, idx);
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: types.STUDENT,
      item: { student, idx, seatsPerRow, color_print, onMove },
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
    "black",
  ];

  const _classes = ["student", ...classes];

  const studentStyles = {};

  if (color_print) {
    const ridx = Math.floor(idx / seatsPerRow);

    if (ridx < numRows) {
      const rowColor = ridx >= rows.length ? "black" : rows[ridx];
      console.log(idx, seatsPerRow, ridx, numRows, ridx < numRows, rowColor);
      studentStyles.borderColor = rowColor;
      /* studentStyles.borderBottomColor = rowColor;
      studentStyles.borderLeftColor = rowColor;
      studentStyles.borderRightColor = rowColor;
      studentStyles.borderTopColor = ridx === numRows - 1 ? "black" : rowColor; */
    } else if (idx !== 99) {
      studentStyles.borderColor = "black";
    } else {
      studentStyles.borderColor = "gray";
    }
  }

  if (idx % seatsPerRow === seatsPerRow - 1) {
    _classes.push("first-student");
  } else if (idx % seatsPerRow === 0) {
    _classes.push("last-student");
  }

  return (
    <li
      key={idx}
      ref={(node) => dragRef(dropRef(node))}
      className={_classes.join(" ")}
      style={{
        opacity: isDragging ? 0.5 : 1.0,
        cursor: idx === 99 || student[0] === undefined ? "" : "move",
        backgroundColor: isOver && canDrop ? "lightgreen" : "",
        ...studentStyles,
      }}
    >
      <div className="student-name">{student[0]}</div>
      <ul className="student-grades">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
          <li className={`grade`} key={g}></li>
        ))}
      </ul>
    </li>
  );
};
