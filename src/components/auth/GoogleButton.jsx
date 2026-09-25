import React from 'react';
import { Button, Box, Typography } from '@mui/material';

export const GoogleButton = ({ text = 'Login with Google', onClick, disabled = false }) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      sx={{
        py: 1.35,
        px: 2,
        borderRadius: '10px',
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9375rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#cbd5e1',
          backgroundColor: '#f8fafc',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 20, height: 20, flexShrink: 0 }}
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.15C3.27 21.36 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.41l4.02-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.59l4.02 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
        />
      </Box>
      <Typography component="span" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0f172a' }}>
        {text}
      </Typography>
    </Button>
  );
};

export default GoogleButton;
