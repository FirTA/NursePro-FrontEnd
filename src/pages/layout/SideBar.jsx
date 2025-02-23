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
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import SubMenu from "../components/SubMenu";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/post";
import { Menus } from "../../data/structuremenu";

const DRAWER_WIDTH = 240;

const Sidebar = ({ open, onClose }) => {
  const [menuItems, setMenuItems] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleLoadData = (role) => {
    const filteredData = Menus.find((item) => item.Role === role);
    setMenuItems(filteredData?.Menu || []);
  };

  const handleOnLogout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await API.post("/logout/", { refresh_token });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: open? DRAWER_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open? DRAWER_WIDTH : 0,
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            NursePro
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
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
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            onClick={handleOnLogout}
            startIcon={<Logout />}
            sx={{ justifyContent: "flex-start" }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
