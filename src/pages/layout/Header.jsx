import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SideBar from "./SideBar";
import { Button, Divider, List, useTheme } from "@mui/material";
import { Logout } from "@mui/icons-material";
import SubMenu from "../components/SubMenu";
import {
    DrawerHeader,
    Drawer as StyledDrawer,
  } from "../../style/sidebarStyles";
import { APIRequestWithHeaders } from "../../api/post";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Menus } from "../../data/structuremenu";


export default function Header() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
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
    const Response = await APIRequestWithHeaders.post("/logout/", data);
    localStorage.clear();
    navigate("/login");
  };

  console.log("Component rendered"); // Add this line
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      handleLoadData(role);
    } else {
      console.error("No role found in localStorage");
    }
  }, []);
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nurse Pro
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <StyledDrawer
        variant="temporary"
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
    </Box>
  );
}
