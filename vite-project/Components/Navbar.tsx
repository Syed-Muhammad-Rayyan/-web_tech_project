import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Chip
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockState } from "../src/mockState";
import SecurityIcon from "@mui/icons-material/Security";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useMockState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderBottom: "1px solid #e5e7eb",
        zIndex: 1000
      }}
    >
      <Container maxWidth="lg">
        <Toolbar className="flex justify-between items-center py-2">
          {/* Logo */}
          <Box
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(currentUser ? "/home" : "/")}
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-650 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/10">
              NH
            </div>

            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ display: { xs: "none", sm: "block" } }}>
              NeighbourHub
            </Typography>
          </Box>

          {/* Role Badging */}
          {currentUser && (
            <Chip
              label={`${currentUser.role} Dashboard`}
              color={
                currentUser.role === "Admin"
                  ? "error"
                  : currentUser.role === "Moderator"
                  ? "secondary"
                  : currentUser.role === "Provider"
                  ? "warning"
                  : "success"
              }
              size="small"
              className="font-bold text-[10px]"
            />
          )}

          {/* Navigation Links */}
          {currentUser && (
            <Box className="hidden md:flex items-center gap-6">
              {/* Resident/Provider Common Home */}
              {(currentUser.role === "Resident" || currentUser.role === "Provider") && (
                <>
                  <Typography
                    className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                    onClick={() => navigate("/home")}
                  >
                    Home
                  </Typography>
                  <Typography
                    className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                    onClick={() => navigate("/services")}
                  >
                    Services
                  </Typography>
                  <Typography
                    className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                    onClick={() => navigate("/myrequests")}
                  >
                    My Requests
                  </Typography>
                </>
              )}

              {/* Moderator specific */}
              {currentUser.role === "Moderator" && (
                <Typography
                  className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600 flex items-center gap-1"
                  onClick={() => navigate("/moderator")}
                >
                  <SecurityIcon sx={{ fontSize: 16 }} /> Mediate Disputes
                </Typography>
              )}

              {/* Admin specific */}
              {currentUser.role === "Admin" && (
                <Typography
                  className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600 flex items-center gap-1"
                  onClick={() => navigate("/admin")}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 16 }} /> Admin Console
                </Typography>
              )}

              {/* Noticeboard (Everyone) */}
              <Typography
                className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                onClick={() => navigate("/noticeboard")}
              >
                Noticeboard
              </Typography>

              {/* Messaging (Residents, Providers, Mods for mediation check) */}
              <Typography
                className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                onClick={() => navigate("/messages")}
              >
                Messages
              </Typography>

              <Typography
                className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Typography>

              <Typography
                className="cursor-pointer font-semibold text-sm hover:text-indigo-600 transition text-gray-600"
                onClick={() => navigate("/aboutus")}
              >
                About Us
              </Typography>
            </Box>
          )}

          {/* User Section / Login Button */}
          {currentUser ? (
            <div>
              <Box className="flex items-center gap-2 cursor-pointer" onClick={handleMenu}>
                <Avatar sx={{ bgcolor: "#4f46e5", width: 36, height: 36, fontSize: 14, fontWeight: "bold" }}>
                  {currentUser.avatar || currentUser.name[0]}
                </Avatar>
                <Typography variant="body2" fontWeight="bold" sx={{ display: { xs: "none", md: "block" } }}>
                  {currentUser.name}
                </Typography>
              </Box>
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
                <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>My Profile</MenuItem>
                {currentUser.role === "Moderator" && (
                  <MenuItem onClick={() => { handleClose(); navigate("/moderator"); }}>Disputes Centre</MenuItem>
                )}
                {currentUser.role === "Admin" && (
                  <MenuItem onClick={() => { handleClose(); navigate("/admin"); }}>Admin Panel</MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="contained"
              startIcon={<HomeRoundedIcon />}
              onClick={() => navigate("/")}
              sx={{
                borderRadius: "30px",
                textTransform: "none",
                px: 3,
                fontWeight: 650,
                background: "linear-gradient(to right, #4f46e5, #2563eb)"
              }}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

