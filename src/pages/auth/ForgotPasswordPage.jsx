import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { forgotPassword } from '../../redux/thunks/authThunk';
import { clearAuthError, resetForgotPasswordState } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, resetCodeSent, resetCodePreview } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    if (!email.trim()) return setValidationError('Please enter your email address.');
    dispatch(forgotPassword({ email: email.trim() }));
  };

  const handleProceedToReset = () => {
    navigate(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}&code=${resetCodePreview || ''}`);
  };

  return (
    <AuthLayout
      headline="Password Recovery"
      subtext="Fast, secure account recovery for brokers, advisors, and clients on LeadFlow."
    >
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

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }} onClose={() => { setValidationError(''); dispatch(clearAuthError()); }}>
          {validationError || error}
        </Alert>
      )}

      {resetCodeSent ? (
        <Box sx={{ p: 3, backgroundColor: '#f0fdf4', borderRadius: 3, border: '1px solid #bbf7d0', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <CheckCircle2 size={24} style={{ color: '#16a34a' }} />
            <Typography variant="h6" sx={{ color: '#15803d', fontWeight: 700 }}>
              Verification Code Dispatched
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#166534', mb: 2 }}>
            A 6-digit verification code has been dispatched for <strong>{email}</strong>.
          </Typography>

          {resetCodePreview && (
            <Box sx={{ p: 1.5, backgroundColor: '#ffffff', borderRadius: 2, border: '1px dashed #16a34a', mb: 2.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                DEMO / PREVIEW CODE
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '0.2em', color: '#15803d' }}>
                {resetCodePreview}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleProceedToReset}
            sx={{ py: 1.4, backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700, '&:hover': { backgroundColor: '#15803d' } }}
          >
            Enter Code & Reset Password
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ mb: 3 }}>
            <TextField
              id="email"
              placeholder="Enter your registered email (e.g. hans@hypobroker.de)"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setValidationError(''); }}
              disabled={loading}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Mail size={18} style={{ color: '#94a3b8' }} /></InputAdornment>,
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
            {loading ? 'Sending Code...' : 'Send Verification Code'}
          </Button>
        </Box>
      )}

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
