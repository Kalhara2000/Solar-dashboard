import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#fb8c00' }, // solar/orange
    success: { main: '#43a047' },
    error: { main: '#e53935' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;