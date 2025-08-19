import React, { useState, useEffect, useCallback } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

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
import SettingsIcon from "@mui/icons-material/Settings";
import ColorLensIcon from "@mui/icons-material/ColorLens";

import useMediaQuery from "@mui/material/useMediaQuery";

import shuffle from "lodash.shuffle";

import { Student } from "./Student";
import { Instructions } from "./Instructions";
import { ClassList } from "./ClassList";
import { AssignmentsGrid } from "./AssignmentsGrid";

import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const defaultColors = [
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
].join("\n");

const defaultValues = {
  class_name: "",
  date_time: "",
  list: "",
  boy_girl: true,

  swap_students: true,
  colorOptions: "rows",
  auto_seats: false,
  numRows: 4,
  seats_per_row: 7,
  min_seats_per_row: 2,
  reverseLayout: true,
  extraLines: 5,
  hasGradeGrid: true,
  colorList: defaultColors,
  seatOverrides: {},
};

const App = () => {
  const [boy_girl, setBoyGirl] = useState(defaultValues.boy_girl);
  const [swap_students, setSwapStudents] = useState(
    defaultValues.swap_students,
  );
  const [colorOptions, setColorOptions] = useState(defaultValues.colorOptions);
  const [list, setList] = useState(defaultValues.list);
  const [class_name, setClassName] = useState(defaultValues.class_name);
  const [date_time, setDateTime] = useState(defaultValues.date_time);

  const [auto_seats, setAutoSeats] = useState(defaultValues.auto_seats);
  const [numRows, setNumRows] = useState(defaultValues.numRows);
  const [seats_per_row, setSeatsPerRow] = useState(defaultValues.seats_per_row);
  const [min_seats_per_row, setMinSeatsPerRow] = useState(
    defaultValues.min_seats_per_row,
  );
  const [reverseLayout, setReverseLayout] = useState(
    defaultValues.reverseLayout,
  );
  const [extraLines, setExtraLines] = useState(defaultValues.extraLines);
  const [hasGradeGrid, setHasGradeGrid] = useState(defaultValues.hasGradeGrid);
  const [colorList, setColorList] = useState(defaultValues.colorList);

  const [seatOverrides, setSeatOverrides] = useState({});

  const [saved_classes, setSavedClasses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showClassList, setShowClassList] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState(undefined);
  const [colorListAnchor, setColorListAnchor] = useState(undefined);

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

          swap_students,
          colorOptions,
          auto_seats,
          numRows,
          seats_per_row,
          min_seats_per_row,
          reverseLayout,
          extraLines,
          hasGradeGrid,
          colorList,
          seatOverrides,
        }),
      );
      updateSavedClasses();
    }
  };

  const loadClass = (class_name) => {
    const newState = JSON.parse(localStorage.getItem(class_name));

    if (auto_seats) {
      const students = list?.split(/\r?\n/) || [];
      setSeatsPerRow(
        Math.max(Math.ceil(students.length / numRows), min_seats_per_row),
      );
    }

    setClassName(newState?.class_name ?? defaultValues.class_name);
    setDateTime(newState?.date_time ?? defaultValues.date_time);
    setList(newState?.list ?? defaultValues.list);
    setBoyGirl(newState?.boy_girl ?? defaultValues.boy_girl);

    setSwapStudents(newState?.swap_students ?? defaultValues.swap_students);
    setColorOptions(newState?.colorOptions ?? defaultValues.colorOptions);
    setAutoSeats(newState?.auto_seats ?? defaultValues.auto_seats);
    setNumRows(newState?.numRows ?? defaultValues.numRows);
    setSeatsPerRow(newState?.seats_per_row ?? defaultValues.seats_per_row);
    setMinSeatsPerRow(
      newState?.min_seats_per_row ?? defaultValues.min_seats_per_row,
    );
    setReverseLayout(newState?.reverseLayout ?? defaultValues.reverseLayout);
    setExtraLines(newState?.extraLines ?? defaultValues.extraLines);
    setHasGradeGrid(newState?.hasGradeGrid ?? defaultValues.hasGradeGrid);
    setColorList(newState?.colorList ?? defaultValues.colorList);
    setSeatOverrides(newState?.seatOverrides ?? defaultValues.seatOverrides);

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
        (student) => !student[1] || student[1].match(/^M/i),
      );
      let girls = students.filter(
        (student) => student[1] && student[1].match(/^F/i),
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
        .replace(/\n\n+$/, ""),
    );

    if (auto_seats) {
      setSeatsPerRow(
        Math.max(Math.ceil(students.length / numRows), min_seats_per_row),
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
    [list, swap_students, setList],
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

  const numSeats = seats_per_row * numRows;
  const seatsPerRow = seats_per_row;

  Object.entries(seatOverrides).forEach(([idx, override]) => {
    students.splice(idx, 0, [
      "",
      "X",
      override === "overflow" ? "gray" : "white",
      override === "hidden",
    ]);
  });

  while (students.length < numSeats) {
    students.push([]);
  }

  const tooManyKids = students.length > numSeats;

  const overflowStudents = students.slice(numSeats, students.length);
  students = students.slice(0, numSeats);
  if (reverseLayout) {
    students.reverse();
  }

  const studentGridStyles = {
    gridTemplateColumns: `repeat(${numSeats / numRows},1fr)`,
    gridAutoRows: `${(6.7 - 0.2 * extraLines) / numRows}in`, // 5.4 if no margins at print
  };

  const toggleCallback = (i) => {
    const newSeatOverrides = { ...seatOverrides };
    let seatOverride = seatOverrides[i];
    if (newSeatOverrides[i] === "overflow") {
      newSeatOverrides[i] = "hidden";
    } else if (newSeatOverrides[i] === "hidden") {
      delete newSeatOverrides[i];
    } else {
      newSeatOverrides[i] = "overflow";
    }

    setSeatOverrides(newSeatOverrides);
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

            <span style={{ display: "none" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <LoginIcon />
              </IconButton>
            </span>
          </Toolbar>
        </AppBar>
      </Box>

      <Modal
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Instructions />
        </>
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

      <Popover
        className="ui-control"
        open={Boolean(settingsAnchor)}
        anchorEl={settingsAnchor}
        onClose={() => setSettingsAnchor(undefined)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography sx={{ p: 1 }}>
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
          <FormGroup sx={{ pt: 1 }}>
            <TextField
              label="number of rows"
              inputProps={{ min: 1 }}
              variant="outlined"
              value={numRows}
              type="number"
              onChange={(e) => setNumRows(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup sx={{ pt: 1 }}>
            <TextField
              label="seats per row"
              inputProps={{ min: 1 }}
              variant="outlined"
              value={seats_per_row}
              type="number"
              onChange={(e) => setSeatsPerRow(Number(e.target.value))}
            />
          </FormGroup>
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
                  checked={boy_girl}
                  onChange={() => setBoyGirl(!boy_girl)}
                />
              }
              label="girl/boy"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={reverseLayout}
                  onChange={() => setReverseLayout(!reverseLayout)}
                />
              }
              label="reverse layout"
            />
          </FormGroup>
          <FormGroup sx={{ pt: 1 }}>
            <TextField
              label="extra lines"
              inputProps={{ min: 0, max: 25 }}
              variant="outlined"
              value={extraLines}
              type="number"
              onChange={(e) => setExtraLines(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup sx={{ pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasGradeGrid}
                  onChange={() => setHasGradeGrid(!hasGradeGrid)}
                />
              }
              label="grade grid"
            />
          </FormGroup>
        </Typography>
      </Popover>

      <Popover
        className="ui-control"
        open={Boolean(colorListAnchor)}
        anchorEl={colorListAnchor}
        onClose={() => setColorListAnchor(undefined)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            label="color list"
            multiline
            cols={30}
            rows={10}
            value={colorList}
            onChange={(e) => setColorList(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="color-options-label">Color Options</InputLabel>

            <Select
              labelId="color-options-label"
              id="color-options-select"
              value={colorOptions}
              label="Color Options"
              onChange={(e) => setColorOptions(e.target.value)}
            >
              <MenuItem value={"rows"}>rows</MenuItem>
              <MenuItem value={"columns"}>columns</MenuItem>
              <MenuItem value={"none"}>none</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Popover>

      <Box>
        <div className="App">
          <Box sx={{ p: printing ? 0 : 2 }}>
            <div className="header-grid">
              {/* <div>Class:</div> */}
              <div>
                <span className="ui-control">
                  <TextField
                    label=""
                    variant="outlined"
                    value={class_name}
                    placeholder="Name this class"
                    onChange={(e) => setClassName(e.target.value)}
                    fullWidth
                  />
                </span>
                <div style={{ fontSize: "70%" }} className="print-control">
                  {class_name}
                </div>
              </div>
              {/* <div>Time/Days:</div> */}
              <div>
                <span className="ui-control">
                  <TextField
                    label=""
                    variant="outlined"
                    placeholder="When does this class meet"
                    value={date_time}
                    onChange={(e) => setDateTime(e.target.value)}
                    fullWidth
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

            <ul className="students" style={studentGridStyles}>
              {students.map((student, i) => (
                <Student
                  student={student ? student : []}
                  key={i}
                  idx={reverseLayout ? numSeats - 1 - i : i}
                  onMove={moveStudent}
                  colorOptions={colorOptions}
                  seatsPerRow={seatsPerRow}
                  numRows={numRows}
                  hasGradeGrid={hasGradeGrid}
                  colorList={colorList.split("\n")}
                  toggleCallback={toggleCallback}
                />
              ))}
            </ul>

            <AssignmentsGrid numLines={extraLines} />
          </Box>

          <Box sx={{ p: 2 }} className="config">
            <Box sx={{ pt: 1 }}>
              <Box sx={{ pb: 1 }}>
                <TextField
                  label="Student list"
                  multiline
                  cols={30}
                  rows={10}
                  value={list}
                  onChange={(e) => setList(e.target.value)}
                  fullWidth
                />
              </Box>
              <div className="button-group">
                <IconButton
                  color="primary"
                  onClick={(e) =>
                    setSettingsAnchor(
                      settingsAnchor ? undefined : e.currentTarget,
                    )
                  }
                >
                  <SettingsIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={(e) =>
                    setColorListAnchor(
                      colorListAnchor ? undefined : e.currentTarget,
                    )
                  }
                >
                  <ColorLensIcon />
                </IconButton>

                <Button
                  variant="outlined"
                  onClick={() => {
                    if (window.confirm("Really randomize layout?")) {
                      layout(true);
                    }
                  }}
                >
                  Randomize
                </Button>
                <Button
                  variant="contained"
                  onClick={() => saveClass()}
                  disabled={!class_name.length}
                >
                  Save
                </Button>
              </div>
              {tooManyKids && (
                <Box className="error">WARNING: TOO MANY STUDENTS</Box>
              )}
              {overflowStudents.length > 0 && (
                <Box className="warning">
                  <Box>Students not in layout:</Box>
                  <ul>
                    {overflowStudents.map((student) => (
                      <li key={student[0]}>{student[0]}</li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          </Box>
        </div>
      </Box>
    </DndProvider>
  );
};

export default App;
