// src/components/Layout/index.jsx

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

function LayoutSkeleton({ children }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Agents', path: '/agents' },
    { label: 'Team Drive Disks', path: '/drivedisks' },
    {
      label: userLoggedIn ? 'Logout' : 'Login',
      path: userLoggedIn ? '/logout' : '/login',
    },
    // Add more menu items here as needed
  ];

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavItemClick = path => {
    if (path === '/logout') {
      doSignOut()
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error('Logout error', error);
        });
    } else {
      navigate(path);
    }
    handleCloseNavMenu();
  };

  return (
    <>
      <CssBaseline />
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <StyledToolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              ZZZ
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
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
                {menuItems.map(item => (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleNavItemClick(item.path)}
                  >
                    <Typography textAlign='center'>{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              ZZZ
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map(item => (
                <Button
                  key={item.label}
                  onClick={() => handleNavItemClick(item.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
      <Container component='main' sx={{ mt: 8, mb: 2 }} maxWidth='lg'>
        <Box sx={{ mt: 4 }}>{children}</Box>
      </Container>
    </>
  );
}

export default LayoutSkeleton;
