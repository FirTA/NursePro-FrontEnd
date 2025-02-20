import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
} from "@mui/material";
import { Menus } from "../../data/structuremenu";
import {
  DrawerHeader,
  Drawer as StyledDrawer,
} from "../../style/sidebarStyles";
import MenuIcon from "@mui/icons-material/Menu";
import SubMenu from "../components/SubMenu";
import { Logout } from "@mui/icons-material";
import { API } from "../../api/post";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();

  const handleLoadData = (role) => {
    console.log(role);
    const filteredData = Menus.find((item) => item.Role === role);
    setMenuItems(filteredData.Menu);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleOnLogout = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    const data = {
      refresh_token: refresh_token,
    };
    const Response = await API.post("/logout/", data);
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      handleLoadData(role);
    } else {
      console.error("No role found in localStorage");
    }
  }, []);

  return (
    <>
      {/* Toggle Button for Mobile */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: theme.zIndex.drawer + 1,
            display: open ? "none" : "inline",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer Component */}
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleDrawerToggle}
        className={open ? "" : "MuiDrawer-paperCollapsed"}
      >
        <DrawerHeader>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            NursePro
          </Typography>
          {!isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />

        <Box sx={{ p: 2 }}>
          {/* Menu Items */}
          <List>
            {menuItems.map((section, index) => (
              <SubMenu
                key={index}
                title={section.title}
                icon={section.icon}
                menupath={section.urlpath}
                submenu={section.submenu || []}
              />
            ))}
          </List>
        </Box>
        {/* Logout button at bottom */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={handleOnLogout}>
            <Logout />
            <Typography>Logout</Typography>
          </Button>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default SideBar;
