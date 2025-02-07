import React, { useEffect, useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { AlertProvider } from './providers/AlertProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BrowserRouter } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { getAuth, User } from "firebase/auth"
import RegisterPage from "./pages/Register.page"
import Dashboard from "./pages/Dashboard.page"
import warmTheme from './hooks/design-colors';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in. Show the sign in page.
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <StrictMode>
      <BrowserRouter
        basename="/book-summary"
      >
        <ThemeProvider theme={warmTheme(prefersDarkMode)}>
          <CssBaseline />
          <AlertProvider>
            {loading ? (
              <Box
                sx={{
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : user ? (
              <Dashboard user={user} />
            ) : (
              <RegisterPage />
            )}
          </AlertProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode >
  );
}

const rootElement = document.getElementById('root') || document.createElement('div');
const root = createRoot(rootElement);

root.render(<App />);