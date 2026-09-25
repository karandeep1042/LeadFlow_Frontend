import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../utils/constants/routes';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          maxWidth: 480,
          textAlign: 'center',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <ShieldAlert size={32} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Access Restricted
        </Typography>

        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
          You do not have the required permissions or role clearance to view this workspace.
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(ROUTES.SIGNIN)}
          sx={{
            backgroundColor: '#18181b',
            color: '#ffffff',
            borderRadius: 2.5,
            fontWeight: 700,
            py: 1.2,
            px: 3,
            '&:hover': { backgroundColor: '#09090b' },
          }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;
