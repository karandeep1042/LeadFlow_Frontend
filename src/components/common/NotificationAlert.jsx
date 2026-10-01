import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  success: {
    icon: <CheckCircle2 size={20} color="#059669" />,
    borderColor: '#a7f3d0',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
  },
  error: {
    icon: <AlertCircle size={20} color="#dc2626" />,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    color: '#991b1b',
  },
  warning: {
    icon: <AlertTriangle size={20} color="#d97706" />,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
    color: '#92400e',
  },
  info: {
    icon: <Info size={20} color="#2563eb" />,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    color: '#1e40af',
  },
};

/**
 * Reusable LeadFlow Top-Right Floating Notification Alert (Toast)
 */
export const NotificationAlert = ({
  open,
  message,
  severity = 'info',
  autoHideDuration = 5000,
  onClose,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
}) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={Boolean(open && message)}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      sx={{
        zIndex: 9999,
        top: '24px !important',
        right: '24px !important',
      }}
    >
      <Alert
        severity={severity}
        icon={config.icon}
        onClose={handleClose}
        sx={{
          width: '100%',
          minWidth: { xs: '280px', sm: '340px' },
          maxWidth: '480px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
          borderRadius: 2.5,
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1.45,
          border: '1px solid',
          borderColor: config.borderColor,
          backgroundColor: config.backgroundColor,
          color: config.color,
          '& .MuiAlert-icon': {
            display: 'flex',
            alignItems: 'center',
            mr: 1.5,
          },
          '& .MuiAlert-action': {
            color: config.color,
            paddingTop: 0,
            alignItems: 'center',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationAlert;
