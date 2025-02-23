import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { API } from "../../api/post";
import { useNavigate } from "react-router-dom";

// Custom styled components
const UserChip = styled(Chip)(({ theme }) => ({
  height: 40,
  borderRadius: 20,
  padding: theme.spacing(0.5),
  "& .MuiChip-label": {
    fontSize: "0.9rem",
    padding: theme.spacing(0, 1),
  },
  "& .MuiChip-avatar": {
    width: 32,
    height: 32,
  },
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  color: "inherit",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    minWidth: 220,
  },
}));

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await API.get("/api/user/profile");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await API.post("/logout/", { refresh_token });
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getUserTitle = () => {
    if (!userData) return "";

    if (userData.role?.name === "Nurse") {
      return `Nurse - ${userData.nurse?.level || "Nurse"}`;
    }
    return userData.management?.position || "Management";
  };

  const getUserFullName = () => {
    if (!userData) return "";
    return `${userData.first_name} ${userData.last_name}`;
  };

  const getDepartment = () => {
    if (!userData) return "";
    if (userData.role?.name === "Nurse") {
      return userData.nurse?.department?.name;
    }
    return userData.management?.department?.name;
  };

  // Get initials from name for avatar fallback
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${isSidebarOpen ? 240 : 0}px)` },
        ml: { sm: `${isSidebarOpen ? 240 : 0}px` },
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={onToggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Nurse Pro
        </Typography>

        {userData && (
          <UserChip
            onClick={handleMenu}
            avatar={
              <Avatar
                alt={getUserFullName()}
                src={
                  userData.nurse?.profile_picture
                    ? `data:image/jpeg;base64,${userData.nurse.profile_picture}`
                    : undefined
                }
                sx={{
                  bgcolor: theme.palette.primary.dark,
                }}
              >
                {getInitials(getUserFullName())}
              </Avatar>
            }
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {getUserFullName()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {getUserTitle()}
                </Typography>
              </Box>
            }
            variant="outlined"
            clickable
          />
        )}

        <StyledMenu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
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
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
              {getUserFullName()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getUserTitle()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {getDepartment()}
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 2 }} />
            Profile
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
}
