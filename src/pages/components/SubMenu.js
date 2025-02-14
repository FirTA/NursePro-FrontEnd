import React, { useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";

const SubMenu = ({ title, icon, menupath,submenu }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  const handleClick = () => {
    setOpen(!open);
  };

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <>
      {/* Parent Menu Item */}
      <ListItem
        button
        onClick={()=>{menupath?handleNavigate(menupath):handleClick()}}
        sx={{
            // backgroundColor: open ? "rgba(0, 0, 0, 0.1)" : "transparent", // Active background for open menu
            "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.08)", },  // Light grey on hover
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
        {/* {open ? <ExpandLess /> : <ExpandMore />} */}
      </ListItem>

      {/* Submenu Items */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {submenu.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleNavigate(item.urlpath)} // Navigate on click
              sx={{
                pl: 4,
                backgroundColor: location.pathname === item.path ? "rgba(0, 0, 0, 0.2)" : "transparent", // Highlight active page
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Darker grey for submenu hover
                },
              }}
            >
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SubMenu;
