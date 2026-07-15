import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockState } from "../src/mockState";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useMockState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const toggleDrawer = (open: boolean) => {
    setMobileOpen(open);
  };

  // Nav link style
  const navLinkStyle = {
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#4b5563", // Gray-600
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: "#4f46e5", // Indigo-600
    },
    whiteSpace: "nowrap" as const,
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          borderBottom: "1px solid #e5e7eb",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              minHeight: "64px",
            }}
          >
            {/* Left Group: Logo & Desktop Navigation Links */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { md: 4, lg: 6 } }}>
              {/* Logo */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
                onClick={() => navigate(currentUser ? "/home" : "/")}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    backgroundColor: "#4f46e5",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1.25rem",
                  }}
                >
                  NH
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    background: "linear-gradient(to right, #4f46e5, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  NeighbourHub
                </Typography>
              </Box>

              {/* Desktop Navigation Links */}
              {currentUser && (
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: { md: 2.5, lg: 4 },
                  }}
                >
                  {(currentUser.role === "Resident" ||
                    currentUser.role === "Provider") && (
                    <>
                      <Typography sx={navLinkStyle} onClick={() => navigate("/home")}>
                        Home
                      </Typography>
                      <Typography sx={navLinkStyle} onClick={() => navigate("/services")}>
                        Services
                      </Typography>
                      <Typography sx={navLinkStyle} onClick={() => navigate("/myrequests")}>
                        My Requests
                      </Typography>
                    </>
                  )}

                  {currentUser.role === "Moderator" && (
                    <Typography sx={navLinkStyle} onClick={() => navigate("/moderator")}>
                      Mediate Disputes
                    </Typography>
                  )}

                  {currentUser.role === "Admin" && (
                    <Typography sx={navLinkStyle} onClick={() => navigate("/admin")}>
                      Admin Console
                    </Typography>
                  )}

                  <Typography sx={navLinkStyle} onClick={() => navigate("/noticeboard")}>
                    Noticeboard
                  </Typography>
                  <Typography sx={navLinkStyle} onClick={() => navigate("/messages")}>
                    Messages
                  </Typography>
                  <Typography sx={navLinkStyle} onClick={() => navigate("/profile")}>
                    Profile
                  </Typography>
                  <Typography sx={navLinkStyle} onClick={() => navigate("/aboutus")}>
                    About Us
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Right Section: User Avatar & Mobile Hamburger */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  sx={{ display: { xs: "none", md: "flex" }, fontWeight: "bold" }}
                />
              )}

              {/* Desktop User Avatar */}
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {currentUser ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                    }}
                    onClick={handleMenu}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#4f46e5",
                        width: 36,
                        height: 36,
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      {currentUser.avatar || currentUser.name[0]}
                    </Avatar>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {currentUser.name}
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>

              {/* Mobile Hamburger Menu Icon */}
              <IconButton
                onClick={() => toggleDrawer(true)}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Navigation Menu
            </Typography>
            <IconButton onClick={() => toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List onClick={() => toggleDrawer(false)}>
            {currentUser ? (
              <>
                {(currentUser.role === "Resident" ||
                  currentUser.role === "Provider") && (
                  <>
                    <ListItemButton onClick={() => navigate("/home")}>
                      <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/services")}>
                      <ListItemText primary="Services" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate("/myrequests")}>
                      <ListItemText primary="My Requests" />
                    </ListItemButton>
                  </>
                )}

                {currentUser.role === "Moderator" && (
                  <ListItemButton onClick={() => navigate("/moderator")}>
                    <ListItemText primary="Mediate Disputes" />
                  </ListItemButton>
                )}

                {currentUser.role === "Admin" && (
                  <ListItemButton onClick={() => navigate("/admin")}>
                    <ListItemText primary="Admin Console" />
                  </ListItemButton>
                )}

                <ListItemButton onClick={() => navigate("/noticeboard")}>
                  <ListItemText primary="Noticeboard" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/messages")}>
                  <ListItemText primary="Messages" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/profile")}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/aboutus")}>
                  <ListItemText primary="About Us" />
                </ListItemButton>

                <Box sx={{ p: 2, mt: 2 }}>
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
                    sx={{ width: "100%", mb: 2, fontWeight: "bold" }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    sx={{ borderRadius: "20px", textTransform: "none", fontWeight: "bold" }}
                  >
                    Logout
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{ borderRadius: "20px", textTransform: "none", fontWeight: "bold" }}
                >
                  Sign In
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>

      {/* User Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile");
          }}
        >
          My Profile
        </MenuItem>
        {currentUser?.role === "Moderator" && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/moderator");
            }}
          >
            Disputes Centre
          </MenuItem>
        )}
        {currentUser?.role === "Admin" && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/admin");
            }}
          >
            Admin Panel
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
