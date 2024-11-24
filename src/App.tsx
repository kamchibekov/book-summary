import React, { useEffect, useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { AlertProvider } from './providers/AlertProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BrowserRouter, createBrowserRouter, Route, Routes, RouterProvider } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { getAuth, User } from "firebase/auth"
import RegisterPage from "./pages/Register.page"
import Dashboard from "./pages/Dashboard.page"

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

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          ...(prefersDarkMode ? {
            // palette values for dark mode
            background: {
              default: grey[900],
              paper: grey[800],
            },
            // text: {
            //   primary: '#fff',
            //   secondary: grey[500],
            // },
          } : {
            // palette values for light mode
            background: {
              default: grey[100],
              paper: '#fff',
            },
            // text: {
            //   primary: grey[900],
            //   secondary: grey[800],
            // },
          }
          ),
        },
      }),
    [prefersDarkMode],
  );

  return (
    <StrictMode>
      <CssBaseline />
      <BrowserRouter
        future={{
          v7_startTransition: true,
        }}
        basename="/book-summary"
      > {/* basename="/book-summary" */}
        <ThemeProvider theme={theme}>

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