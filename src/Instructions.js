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
            Add a list of students, one student per line. Optionally may list
            gender after semi-colon. i.e., 'Jim Thomason' or 'Jim Thomason;M'
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            As students are added, they appear on the class layout. Students at
            the top show up in the front rows at the bottom.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Fill in the class name and Time/Days on the right.
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
            The color print checkbox toggles coloring for color printers.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            You can randomize the layout, and optionally choose to do a boy/girl
            layout. Just click the randomize button.
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
