import React from 'react';
import { Box, Typography, Paper, LinearProgress, CircularProgress } from '@mui/material';
import { Layers } from 'lucide-react';

export const AuthLoadingScreen = ({ message = 'Verifying secure session...' }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        px: 2.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 390,
          width: '100%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 4,
          p: { xs: 3.5, sm: 4.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* LeadFlow Brand Logo Badge */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.35)',
            mb: 2,
          }}
        >
          <Layers size={26} />
        </Box>

        {/* Product Headline */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#0f172a',
            fontSize: '1.35rem',
            lineHeight: 1.2,
          }}
        >
          LeadFlow
        </Typography>

        {/* Dynamic Status Text */}
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            mt: 0.75,
            mb: 3,
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>

        {/* Modern Progress Indicator */}
        <Box sx={{ width: '100%', maxWidth: 220, mb: 1 }}>
          <LinearProgress
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: '#eff6ff',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#2563eb',
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Subtitle / Footer Note */}
        <Typography
          variant="caption"
          sx={{
            color: '#94a3b8',
            fontSize: '0.75rem',
            mt: 2.5,
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          German Mortgage CRM & Expat Pipeline
        </Typography>
      </Paper>
    </Box>
  );
};

export default AuthLoadingScreen;

