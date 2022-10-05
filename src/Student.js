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

  colorOptions,
  numRows,
  hasGradeGrid,
  colorList,
}) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: types.STUDENT,
      item: { student, idx, seatsPerRow, colorOptions, onMove },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => Array.isArray(student) && student[0] && idx !== 99,
    }),
    [student, idx, seatsPerRow, colorOptions, onMove]
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
    [student, idx, onMove]
  );

  let borderColor = "";

  const _classes = ["student", ...classes];

  const studentStyles = {};

  if (colorOptions !== "none") {
    const ridx =
      colorOptions === "rows"
        ? Math.floor(idx / seatsPerRow)
        : idx % seatsPerRow;

    const rowColor = ridx >= colorList.length ? "black" : colorList[ridx];

    studentStyles.borderColor = rowColor;
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
        gridTemplateColumns: hasGradeGrid ? "75% 25%" : "100%",
        ...studentStyles,
      }}
    >
      <div className="student-name">
        {student[0]}
        {idx}
      </div>
      {hasGradeGrid && (
        <ul className="student-grades">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
            <li className={`grade`} key={g}></li>
          ))}
        </ul>
      )}
    </li>
  );
};
