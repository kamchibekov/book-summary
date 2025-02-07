import { createTheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const warmTheme = (prefersDarkMode: boolean) => {
  const theme = useTheme();

  return createTheme({
    components: prefersDarkMode
      ? theme.components
      : {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundImage: `radial-gradient(ellipse at center,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 61%,rgba(238,226,195,1) 100%);`,
              },
            },
          },
        },
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      ...(prefersDarkMode
        ? {
            // Dark theme: Warm dark blue background with warm light text
            background: {
              default: grey[900],
              paper: grey[900],
            },
          }
        : {
            // Light theme: Warm gradient surrounding white text background

            text: {
              primary: '#5D4037', // Warm dark brown text
              secondary: '#8D6E63', // Lighter warm brown for secondary text
            },
          }),
    },
  });
};
export default warmTheme;
