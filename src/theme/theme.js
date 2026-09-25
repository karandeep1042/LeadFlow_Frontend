import { createTheme } from '@mui/material/styles';

export const leadflowTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Vibrant Brand Blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a', // Slate 900
      light: '#1e293b',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0284c7',
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    custom: {
      bannerGradient: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 100%)',
      cardShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      inputBorder: '#e2e8f0',
      inputFocusBorder: '#2563eb',
      lightGrayBg: '#f8fafc',
      hoverBg: '#f1f5f9',
    },
  },
  typography: {
    fontFamily: [
      'Plus Jakarta Sans',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#0f172a',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2rem',
      lineHeight: 1.25,
      color: '#0f172a',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#0f172a',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#0f172a',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '1.1rem',
      lineHeight: 1.4,
      color: '#0f172a',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      fontSize: '0.95rem',
      lineHeight: 1.4,
      color: '#0f172a',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
      color: '#64748b',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
      color: '#64748b',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.55,
      color: '#334155',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          color: '#0f172a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
          },
        },
        containedPrimary: {
          backgroundColor: '#18181b', // sleek high-contrast dark button like the screenshot
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#09090b',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
        },
        outlinedSecondary: {
          borderColor: '#e2e8f0',
          color: '#0f172a',
          backgroundColor: '#ffffff',
          '&:hover': {
            borderColor: '#cbd5e1',
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
          transition: 'all 0.2s ease-in-out',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f0',
            borderWidth: '1px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
            borderWidth: '1.5px',
          },
        },
        input: {
          padding: '13px 16px',
          fontSize: '0.9375rem',
          color: '#0f172a',
          '&::placeholder': {
            color: '#94a3b8',
            opacity: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
          border: '1px solid #f1f5f9',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.8125rem',
        },
      },
    },
  },
});

export default leadflowTheme;
