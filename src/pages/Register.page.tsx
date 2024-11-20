import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../api/auth.api';
import Strings from '../config/strings';
import RuoteEnum from '../config/routes';
import GoogleIcon from '@mui/icons-material/Google';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      // Do something with the user object (e.g., update UI)
      navigate(RuoteEnum.Dashboard);
    } catch (error) {
      // Handle sign-in error
    }
  };

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container sx={{ maxWidth: 400 }} mt={-5}>
        <Grid item xs={12}>
          <Box
            sx={{
              padding: 2,
              borderRadius: 1,
              borderColor: 'gray.300',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <img
                  src={RuoteEnum.Icon}
                  alt={Strings.app_logo_text}
                  style={{
                    maxHeight: '100%',
                    borderRadius: '6px',
                    width: '100%',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h3">{Strings.APP_NAME}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
          <Button
            variant="contained"
            onClick={handleSignIn}
            startIcon={<GoogleIcon />}
          >
            {Strings.sign_in_google}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;