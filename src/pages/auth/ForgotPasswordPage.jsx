import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import NotificationAlert from '../../components/common/NotificationAlert';
import { forgotPassword } from '../../redux/thunks/authThunk';
import { clearAuthError, resetForgotPasswordState } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(resetForgotPasswordState());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        message: error,
        severity: 'error',
      });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setToast({
        open: true,
        message: 'Please enter your registered email address.',
        severity: 'error',
      });
      return;
    }

    const result = await dispatch(forgotPassword({ email: trimmedEmail }));
    if (forgotPassword.fulfilled.match(result)) {
      navigate(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(trimmedEmail)}`, {
        state: {
          email: trimmedEmail,
          message: `A 6-digit verification code and reset instructions have been emailed to ${trimmedEmail}. Please check your inbox (and spam folder) to find your verification code.`,
        },
      });
    } else {
      setToast({
        open: true,
        message: result.payload || error || 'Failed to dispatch verification code.',
        severity: 'error',
      });
    }
  };

  return (
    <AuthLayout
      headline="Password Recovery"
      subtext="Fast, secure account recovery for brokers, advisors, and clients on LeadFlow."
    >
      {/* Top-Right Floating Notification Alert */}
      <NotificationAlert
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => {
          setToast((prev) => ({ ...prev, open: false }));
          dispatch(clearAuthError());
        }}
        autoHideDuration={5000}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#0f172a' }}>
          LeadFlow
        </Typography>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, letterSpacing: '-0.03em', color: '#0f172a', mb: 1 }}>
          Reset Password
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Remember your password?{' '}
          <Typography component={RouterLink} to={ROUTES.SIGNIN} sx={{ color: '#0f172a', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#2563eb' } }}>
            Back to Sign In
          </Typography>
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Registered Email Address
          </Typography>
          <TextField
            id="email"
            placeholder="e.g. hans@hypobroker.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} style={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ py: 1.45, backgroundColor: '#18181b', color: '#ffffff', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', mb: 2, '&:hover': { backgroundColor: '#09090b' } }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Send Verification Code'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography
          component={RouterLink}
          to={ROUTES.SIGNIN}
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#64748b', fontWeight: 600, fontSize: '0.875rem', '&:hover': { color: '#0f172a' } }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

