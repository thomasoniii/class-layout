import React, { useState, useEffect, useCallback } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Drawer from "@mui/material/Drawer";

import ClassIcon from "@mui/icons-material/Class";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import useMediaQuery from "@mui/material/useMediaQuery";

import shuffle from "lodash.shuffle";

import Student from "./Student";
import { Instructions } from "./Instructions";
import { ClassList } from "./ClassList";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
  const [boy_girl, setBoyGirl] = useState(true);
  const [swap_students, setSwapStudents] = useState(true);
  const [color_print, setColorPrint] = useState(true);
  const [list, setList] = useState("");
  const [class_name, setClassName] = useState("");
  const [date_time, setDateTime] = useState("");
  const [with_gutter, setWithGutter] = useState(false);
  const [auto_seats, setAutoSeats] = useState(true);
  const [seats_per_row, setSeatsPerRow] = useState(7);
  const [min_seats_per_row, setMinSeatsPerRow] = useState(2);
  const [saved_classes, setSavedClasses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showClassList, setShowClassList] = useState(false);

  const printing = useMediaQuery("@media print");

  const saveClass = () => {
    if (class_name) {
      localStorage.setItem(
        class_name,
        JSON.stringify({
          class_name,
          date_time,
          list,
          boy_girl: false,
        })
      );
      updateSavedClasses();
    }
  };

  const loadClass = (class_name) => {
    const newState = JSON.parse(localStorage.getItem(class_name));

    if (auto_seats) {
      const students = list?.split(/\r?\n/) || [];
      setSeatsPerRow(
        Math.max(Math.ceil(students.length / 4), min_seats_per_row)
      );
    }

    setClassName(newState?.class_name || "");
    setDateTime(newState?.date_time || "");
    setList(newState?.list || "");
    setBoyGirl(false);
    setShowClassList(false);
  };

  const deleteClass = (cn) => {
    if (window.confirm(`Really delete ${cn}?`)) {
      localStorage.removeItem(cn);
      if (cn === class_name) {
        loadClass();
      }
      updateSavedClasses();
    }
  };

  const layout = (randomize) => {
    let students = list.split(/\r?\n/).map((line) => line.split(/\s*;\s*/));

    const maxCol = seats_per_row;

    if (boy_girl && randomize) {
      students = students.filter((s) => s[0]);
      let boys = students.filter(
        (student) => !student[1] || student[1].match(/^M/i)
      );
      let girls = students.filter(
        (student) => student[1] && student[1].match(/^F/i)
      );

      if (randomize) {
        boys = shuffle(boys);
        girls = shuffle(girls);
      }
      students = [];
      let row = 0;
      let col = 0;
      while (girls.length || boys.length) {
        if (row % 2 === 0) {
          if (girls.length) {
            students.push(girls.shift());
            col++;
          }
          if (boys.length) {
            students.push(boys.shift());
            col++;
          }
        } else {
          if (boys.length) {
            students.push(boys.shift());
            col++;
          }
          if (girls.length) {
            students.push(girls.shift());
            col++;
          }
        }

        if (col === maxCol) {
          col = 0;
          row++;
        }
      }
    } else if (randomize) {
      students = students.filter((s) => s[0]);
      students = shuffle(students);
    }

    setList(
      students
        //.filter(s => s.length > 1 && s[0].length)
        .map((s) => s.join(";")) //${s[0] || ''};${s[1] || ''}`)
        .join("\n")
        .replace(/\n\n+$/, "")
    );
    console.log(
      "AUTO SEATS ? ",
      auto_seats,
      seats_per_row,
      Math.max(Math.ceil(students.length / 4), min_seats_per_row)
    );
    if (auto_seats) {
      setSeatsPerRow(
        Math.max(Math.ceil(students.length / 4), min_seats_per_row)
      );
    }
  };

  const moveStudent = useCallback(
    (movingStudent, targetStudent, to, from) => {
      let students = list.split(/\r?\n/).map((s) => s.split(/;/));

      while (to > students.length) {
        students.push([]);
      }

      if (swap_students) {
        students.splice(from, 1, targetStudent);
        students.splice(to, 1, movingStudent);
      } else {
        students.splice(from, 1);
        students.splice(to, 0, movingStudent);
      }

      setList(students.map((s) => s.join(";")).join("\n"));
    },
    [list, swap_students, setList]
  );

  const updateSavedClasses = () => {
    const new_saved_classes = [];
    //for (let c in localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      new_saved_classes.push(localStorage.key(i));
    }
    setSavedClasses(new_saved_classes.sort());
  };

  useEffect(() => updateSavedClasses(), []);

  let students = list.split(/\r?\n/).map((line) => line.split(/\s*;\s*/));

  const numSeats = seats_per_row * 4;
  const seatsPerRow = seats_per_row;

  while (students.length < numSeats) {
    students.push([]);
  }

  const tooManyKids = students.length > numSeats;

  const overflowStudents = students.slice(numSeats, students.length);
  students = students.slice(0, numSeats).reverse();

  const studentGridStyles = {
    gridTemplateColumns: `repeat(${
      ((with_gutter ? 4 : 0) + numSeats) / 4
    },1fr)`,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ display: printing ? "none" : undefined }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setShowClassList(!showClassList)}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <HelpOutlineIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Classroom Layout
            </Typography>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <LoginIcon />
            </IconButton>
            {/*<Button color="inherit">Login</Button>*/}
          </Toolbar>
        </AppBar>
      </Box>

      <Modal
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Instructions />
      </Modal>

      <Drawer
        anchor={"left"}
        open={showClassList}
        onClose={() => setShowClassList(false)}
      >
        <ClassList
          classes={saved_classes}
          closeClassList={() => setShowClassList(false)}
          selectCallback={loadClass}
          deleteCallback={deleteClass}
        />
      </Drawer>

      <div className="App">
        <div id="config">
          <div>
            <TextField
              label="Student list"
              multiline
              cols={30}
              rows={10}
              value={list}
              onChange={(e) => setList(e.target.value)}
            />
          </div>
          <div>
            <Button variant="contained" onClick={() => saveClass()}>
              Save
            </Button>
            {tooManyKids && (
              <div className="alert alert-danger">
                WARNING: TOO MANY STUDENTS FOR LAYOUT
              </div>
            )}
            {overflowStudents.length > 0 && (
              <div className="alert alert-warning">
                <div>Students not in layout:</div>
                <ul>
                  {overflowStudents.map((student) => (
                    <li>{student[0]}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="controls">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={swap_students}
                    onChange={() => setSwapStudents(!swap_students)}
                  />
                }
                label="swap students"
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={color_print}
                    onChange={() => setColorPrint(!color_print)}
                  />
                }
                label="color print"
              />
            </FormGroup>

            <TextField
              label="seats per row"
              inputProps={{ min: 1 }}
              variant="outlined"
              value={seats_per_row}
              type="number"
              onChange={(e) => setSeatsPerRow(e.target.value)}
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={auto_seats}
                    onChange={() => setAutoSeats(!auto_seats)}
                  />
                }
                label="auto adjust seats"
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={with_gutter}
                    onChange={() => setWithGutter(!with_gutter)}
                  />
                }
                label="include gray row"
              />
            </FormGroup>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={boy_girl}
                    onChange={() => setBoyGirl(!boy_girl)}
                  />
                }
                label="girl/boy"
              />
            </FormGroup>

            <Button
              variant="contained"
              onClick={() => {
                if (window.confirm("Really randomize layout?")) {
                  layout(true);
                }
              }}
            >
              Randomize
            </Button>
          </div>
        </div>

        <div className="headerGrid">
          <div>
            Class:
            <span className="ui-control">
              <TextField
                label=""
                variant="outlined"
                value={class_name}
                placeholder="Name this class"
                onChange={(e) => setClassName(e.target.value)}
              />
            </span>
            <div style={{ fontSize: "70%" }} className="print-control">
              {class_name}
            </div>
          </div>
          <div>
            Time/Days:
            <span className="ui-control">
              <TextField
                label=""
                variant="outlined"
                placeholder="When does this class meet"
                value={date_time}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </span>
            <div
              style={{ fontSize: "65%", whiteSpace: "pre" }}
              className="print-control"
            >
              {date_time}
            </div>
          </div>
        </div>

        <div className="studentGrid" style={studentGridStyles}>
          {students.map((student, i) => {
            let output = [];
            if (with_gutter && i && i % seatsPerRow === 0) {
              output.push(
                <Student
                  student={[]}
                  key={`${i}n`}
                  idx={99}
                  onMove={moveStudent}
                  classes={["gutter"]}
                />
              );
            }
            output.push(
              <Student
                student={student ? student : []}
                key={student}
                idx={numSeats - 1 - i}
                onMove={moveStudent}
                color_print={color_print}
                seatsPerRow={seatsPerRow}
              />
            );
            if (with_gutter && i === numSeats - 1) {
              output.push(
                <Student
                  student={[]}
                  key={`${i}n`}
                  idx={99}
                  onMove={moveStudent}
                  classes={["gutter"]}
                />
              );
            }

            return output;
          })}
        </div>

        <div className="assignmentsGrid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i}></div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
