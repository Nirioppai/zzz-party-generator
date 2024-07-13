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

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const NavItems = ['Home', 'Profile', 'Settings', 'Logout'];

function Dashboard() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
                  <MenuItem key={item} onClick={handleCloseNavMenu}>
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
                  onClick={handleCloseNavMenu}
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
