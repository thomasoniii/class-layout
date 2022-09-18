import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export const ClassList = ({ classes, selectCallback, deleteCallback }) => {
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
    <List>
      {classes.map((k, v) => {
        return (
          <ListItem
            key={k}
            secondaryAction={
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => deleteCallback(k)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton
              role={undefined}
              onClick={() => selectCallback(k)}
              dense
            >
              <ListItemText primary={k} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
