// src/components/dashboard/index.jsx

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
import PartyGenerator from '../partyGenerator';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const NavItems = ['Home', 'Profile', 'Settings', 'Logout'];

function Dashboard() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavItemClick = item => {
    handleCloseNavMenu();
    if (item === 'Logout') {
      handleLogout();
    }
    // Handle other nav items as needed
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, show an error message to the user
    }
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
                {NavItems.map(item => (
                  <MenuItem key={item} onClick={() => handleNavItemClick(item)}>
                    <Typography textAlign='center'>{item}</Typography>
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
              {NavItems.map(item => (
                <Button
                  key={item}
                  onClick={() => handleNavItemClick(item)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
      <Container component='main' sx={{ mt: 8, mb: 2 }} maxWidth='lg'>
        <Box sx={{ mt: 4 }}>
          <PartyGenerator />
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
