import { createTheme, type ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customBorder?: string;
  }
  interface PaletteOptions {
    customBorder?: string;
  }
}

const commonSettings: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.15)',
            transform: 'translateY(-1px)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '10px'
          },
          scrollbarWidth: 'thin'
        }
      }
    }
  }
};

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' }, // Royal/Sky Blue
    secondary: { main: '#0f172a' }, // Slate 900
    background: {
      default: '#f8fafc', // Very soft blue-tinted white
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b'
    },
    customBorder: '#e2e8f0',
    info: { main: '#0ea5e9' }
  }
});

export const darkTheme = createTheme({
  ...commonSettings,
  components: {
    ...commonSettings.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(51, 65, 85, 0.8)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        ...commonSettings.components?.MuiButton?.styleOverrides,
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            boxShadow: '0 6px 16px rgba(96, 165, 250, 0.2)'
          }
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' }, // Lighter blue for dark mode
    secondary: { main: '#94a3b8' },
    background: {
      default: '#0f172a', // Deep slate background
      paper: '#1e293b'   // Slightly lighter slate for cards
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1'
    },
    customBorder: '#334155',
    info: { main: '#38bdf8' }
  }
});
