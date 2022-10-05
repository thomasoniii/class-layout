import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Typography from "@mui/material/Typography";

export const Instructions = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Instructions
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            Click on the hamburger menu in the upper left. Select an existing
            classroom, or add a new one. Delete a classroom to get rid of it.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Add a list of students, one student per line. Optionally may list
            gender after semi-colon. i.e., 'Jim Thomason' or 'Jim Thomason;M'
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            As students are added, they appear on the class layout. If the list
            is not reversed, they show up in the upper left and fill in the grid
            as added. If the list is reversed, they start in the lower right.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Fill in the class name and Time/Days at the top.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            You can re-arrange students by dragging and dropping them in the
            interface. Drag one student onto another to move them. No need to
            edit the list directly!
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            If the "swap students" checkbox is enabled, the students will swap.
            If it{"'"}s not enabled, then the student will insert before the one
            it is dropped on. The student dropped on will not move.
          </ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText>
            Click the randomize button to randomize the layout.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Options are available in the gear menu. You can change whether
            students are swapped on drag and drop, the number of rows and
            columns, if seats are auto adjusted to fit the layout when
            randomized, if you randomize with girl/boy seating, if the layout is
            reversed, how many extra lines to place at the bottom, and whether
            to show the grade grid per student.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Color options are available in the color palette menu. You can
            choose the row colors, as well as whether coloring is applied to the
            row, column, or nothing.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Clicking on a student once will keep the desk available (but in
            gray), but will not place a child into it. Clicking a gray desk will
            remove it from the layout. Clicking an empty space will put it back
            in.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            When you are satisfied, click the "Save" button to save it to your
            computer under the class name.
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
};
