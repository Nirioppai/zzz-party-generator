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
import { useAuth } from '../../contexts/authContext';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const NavItems = ['Home', 'Logout'];

function Dashboard() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { userLoggedIn } = useAuth();
  console.log(userLoggedIn);
  const navigate = useNavigate();

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavItemClick = item => {
    if (item === 'Home') {
      navigate('/');
    } else if (item === 'Login') {
      navigate('/login');
    } else if (item === 'Logout') {
      doSignOut()
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error('Logout error', error);
        });
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
                <MenuItem onClick={() => handleNavItemClick('Home')}>
                  <Typography textAlign='center'>Home</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    handleNavItemClick(userLoggedIn ? 'Logout' : 'Login')
                  }
                >
                  <Typography textAlign='center'>
                    {userLoggedIn ? 'Logout' : 'Login'}
                  </Typography>
                </MenuItem>
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
              <Button
                onClick={() => handleNavItemClick('Home')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>
              <Button
                onClick={() =>
                  handleNavItemClick(userLoggedIn ? 'Logout' : 'Login')
                }
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {userLoggedIn ? 'Logout' : 'Login'}
              </Button>
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
