// src/components/auth/login/index.jsx

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  CssBaseline,
  Grid,
  Link,
} from '@mui/material';

import { useAuth } from '../../../contexts/authContext';
import {
  doSignInWithGoogle,
  doSignInWithWithEmailAndPassword,
} from '../../../firebase/auth';

function LoginPage() {
  const { userLoggedIn } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userLoggedIn) {
      window.location.href = '/dashboard'; // Redirect to dashboard if the user is already logged in
    }
  }, [userLoggedIn]);

  const handleSubmit = async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithWithEmailAndPassword(email, password);
        window.location.href = '/dashboard'; // Redirect to dashboard after successful login
      } catch (error) {
        setIsSigningIn(false);
        setErrorMessage(error.message);
        console.log(error);
      }
    }
  };

  const onGoogleSignIn = async event => {
    event.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        window.location.href = '/dashboard'; // Redirect to dashboard after successful Google sign-in
      } catch (error) {
        setIsSigningIn(false);
        setErrorMessage(error.message);
        console.log(error);
      }
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>LOCK ICON</Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        {errorMessage && (
          <Typography color='error' variant='body2'>
            {errorMessage}
          </Typography>
        )}
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={isSigningIn}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant='contained'
            sx={{ mb: 2 }}
            onClick={onGoogleSignIn}
            disabled={isSigningIn}
          >
            Sign In with Google
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
