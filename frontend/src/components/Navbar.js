import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  // Avatar, // Already commented out, was used for user menu
  Button,
  // Tooltip, // Already commented out, was used for user menu
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';

const pages = [
  { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { title: 'Report Crime', path: '/report', icon: <ReportIcon /> },
  { title: 'Subscribe', path: '/subscribe', icon: <NotificationsIcon /> },
];

// // const settings = ['Profile', 'Account', 'Dashboard', 'Logout']; // Already commented out

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    // setAnchorElNav(event.currentTarget); // Part of main navigation, not auth-specific
  };
  // const handleOpenUserMenu = (event) => { // Auth-related user menu
    // setAnchorElUser(event.currentTarget);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // // // const handleMenuClick = (setting) => { // Auth-related user menu actions
  // // //   handleCloseUserMenu();
  // // //   switch (setting) {
  // // //     case 'Logout':
  // // //       // Handle logout
  // // //       navigate('/login');
  // // //       break;
  // // //     case 'Profile':
  // // //       navigate('/profile');
  // // //       break;
  // // //     case 'Dashboard':
  // // //       navigate('/');
  // // //       break;
  // // //     default:
  // // //       break;
  // // //   }
  // // // };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Crime Alert
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Crime Alert
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
              >
                {page.icon}
                <Typography sx={{ ml: 1 }}>{page.title}</Typography>
              </Button>
            ))}
          </Box>

          
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 