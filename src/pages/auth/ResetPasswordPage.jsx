import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { resetPassword } from '../../redux/thunks/authThunk';
import { clearAuthError } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(location.search);
  const [email, setEmail] = useState(queryParams.get('email') || '');
  const [resetCode, setResetCode] = useState(queryParams.get('code') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!email.trim()) return setValidationError('Please enter your email address.');
    if (!resetCode.trim()) return setValidationError('Please enter the 6-digit verification code.');
    if (!newPassword || newPassword.length < 6) {
      return setValidationError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setValidationError('Passwords do not match.');
    }

    const result = await dispatch(
      resetPassword({
        email: email.trim(),
        resetCode: resetCode.trim(),
        newPassword,
      })
    );

    if (resetPassword.fulfilled.match(result)) {
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(ROUTES.SIGNIN);
      }, 1800);
    }
  };

  return (
    <AuthLayout headline="Set New Password" subtext="Choose a secure password for your LeadFlow account.">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#0f172a' }}>
          LeadFlow
        </Typography>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, letterSpacing: '-0.03em', color: '#0f172a', mb: 1 }}>
          Set New Password
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Enter the verification code and your new password below.
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }} icon={<CheckCircle2 size={20} />}>
          {successMessage}
        </Alert>
      )}

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }} onClose={() => { setValidationError(''); dispatch(clearAuthError()); }}>
          {validationError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2 }}>
          <TextField
            id="email"
            placeholder="Account Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setValidationError(''); }}
            disabled={loading || !!successMessage}
            InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            id="resetCode"
            placeholder="6-Digit Verification Code"
            value={resetCode}
            onChange={(e) => { setResetCode(e.target.value); setValidationError(''); }}
            disabled={loading || !!successMessage}
            InputProps={{ startAdornment: <InputAdornment position="start"><KeyRound size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password (min 6 chars)"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setValidationError(''); }}
            disabled={loading || !!successMessage}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock size={18} style={{ color: '#94a3b8' }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setValidationError(''); }}
            disabled={loading || !!successMessage}
            InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading || !!successMessage}
          sx={{ py: 1.45, backgroundColor: '#18181b', color: '#ffffff', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', mb: 2, '&:hover': { backgroundColor: '#09090b' } }}
        >
          {loading ? 'Resetting Password...' : 'Save New Password & Sign In'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography component={RouterLink} to={ROUTES.SIGNIN} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#64748b', fontWeight: 600, fontSize: '0.875rem', '&:hover': { color: '#0f172a' } }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;

