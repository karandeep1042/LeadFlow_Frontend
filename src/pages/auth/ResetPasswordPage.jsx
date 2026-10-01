import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import NotificationAlert from '../../components/common/NotificationAlert';
import leadflowLogo from '../../assets/leadflow-logo.png';
import { resetPassword, verifyResetCode } from '../../redux/thunks/authThunk';
import { clearAuthError } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get('email') || location.state?.email || '';
  const initialCode = queryParams.get('code') || '';
  const initialSuccessMessage = location.state?.message || location.state?.successMessage || '';

  // Email is stored in state/app for API calls, but not rendered as an input field
  const [email, setEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState(initialCode);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Floating notification toast state
  const [toast, setToast] = useState({
    open: Boolean(initialSuccessMessage),
    message: initialSuccessMessage || '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Sync state if navigation state changes
  useEffect(() => {
    if (initialEmail && initialEmail !== email) {
      setEmail(initialEmail);
    }
    if (initialSuccessMessage) {
      setToast({
        open: true,
        message: initialSuccessMessage,
        severity: 'success',
      });
    }
  }, [initialEmail, initialSuccessMessage]);

  // Sync Redux error into floating alert
  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        message: error,
        severity: 'error',
      });
    }
  }, [error]);

  // Password criteria computation
  const passwordCriteria = {
    minLength: newPassword.length >= 6,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
  };

  const fulfilledCount = Object.values(passwordCriteria).filter(Boolean).length;
  const isPasswordValid = fulfilledCount === 5;
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  // Handle Verify Code (Step 1)
  const handleVerifyCode = useCallback(
    async (codeToVerify, emailToVerify) => {
      const targetEmail = (emailToVerify || email).trim();
      const targetCode = (codeToVerify || resetCode).trim();

      if (!targetEmail) {
        setToast({
          open: true,
          message: 'No email address found. Please request a verification code from Forgot Password.',
          severity: 'error',
        });
        return;
      }
      if (!targetCode || targetCode.length < 6) {
        setToast({
          open: true,
          message: 'Please enter a valid 6-digit verification code.',
          severity: 'error',
        });
        return;
      }

      setIsVerifyingCode(true);
      try {
        const result = await dispatch(
          verifyResetCode({ email: targetEmail, resetCode: targetCode })
        );
        if (verifyResetCode.fulfilled.match(result)) {
          setIsCodeVerified(true);
          setToast({
            open: true,
            message: 'Verification code confirmed. You can now set your new password.',
            severity: 'success',
          });
        } else {
          setToast({
            open: true,
            message: result.payload || 'Invalid or expired verification code.',
            severity: 'error',
          });
        }
      } catch (err) {
        setToast({
          open: true,
          message: 'Failed to verify reset code. Please try again.',
          severity: 'error',
        });
      } finally {
        setIsVerifyingCode(false);
      }
    },
    [dispatch, email, resetCode]
  );

  // If user came via email link containing code and email, verify automatically on mount
  useEffect(() => {
    if (initialCode && initialCode.trim().length === 6 && initialEmail && !isCodeVerified) {
      handleVerifyCode(initialCode.trim(), initialEmail.trim());
    }
  }, [initialCode, initialEmail, handleVerifyCode, isCodeVerified]);

  // Handle Set New Password Submission (Step 2)
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setToast({
        open: true,
        message: 'Missing email address. Please start from the Forgot Password page.',
        severity: 'error',
      });
      return;
    }
    if (!resetCode.trim()) {
      setToast({
        open: true,
        message: 'Please enter the 6-digit verification code.',
        severity: 'error',
      });
      return;
    }
    if (!isPasswordValid) {
      setToast({
        open: true,
        message: 'Please meet all password requirements before submitting.',
        severity: 'error',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({
        open: true,
        message: 'Passwords do not match.',
        severity: 'error',
      });
      return;
    }

    const result = await dispatch(
      resetPassword({
        email: email.trim(),
        resetCode: resetCode.trim(),
        newPassword,
      })
    );

    if (resetPassword.fulfilled.match(result)) {
      setToast({
        open: true,
        message: 'Password reset successfully! Redirecting to sign in...',
        severity: 'success',
      });
      setTimeout(() => {
        navigate(ROUTES.SIGNIN);
      }, 1800);
    } else {
      setToast({
        open: true,
        message: result.payload || 'Failed to reset password. Please try again.',
        severity: 'error',
      });
    }
  };

  // Get strength color and label
  const getStrengthInfo = () => {
    if (fulfilledCount === 0) return { label: '', color: '#cbd5e1', percent: 0 };
    if (fulfilledCount <= 2) return { label: 'Weak', color: '#ef4444', percent: 35 };
    if (fulfilledCount <= 4) return { label: 'Medium', color: '#f59e0b', percent: 75 };
    return { label: 'Strong', color: '#16a34a', percent: 100 };
  };
  const strengthInfo = getStrengthInfo();

  return (
    <AuthLayout headline="Set New Password" subtext="Choose a secure password for your LeadFlow account.">
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

      <Box component={RouterLink} to={ROUTES.HOME} sx={{ display: 'inline-block', mb: 3.5, textDecoration: 'none' }}>
        <Box
          component="img"
          src={leadflowLogo}
          alt="LeadFlow"
          sx={{
            height: { xs: 34, sm: 38 },
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, letterSpacing: '-0.03em', color: '#0f172a', mb: 1 }}>
          {isCodeVerified ? 'Set New Password' : 'Enter Verification Code'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
          {isCodeVerified
            ? 'Create a strong, secure password for your LeadFlow account.'
            : 'Enter the 6-digit verification code sent to your email to verify your identity.'}
        </Typography>
      </Box>

      {/* Account Info Pill (No editable email input) */}
      {email && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            mb: 3,
            backgroundColor: '#f1f5f9',
            borderRadius: 2,
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
            Account:
          </Typography>
          <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700 }}>
            {email}
          </Typography>
        </Box>
      )}

      {/* STEP 1: Code Verification */}
      {!isCodeVerified ? (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyCode();
          }}
          noValidate
        >
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
              6-Digit Verification Code
            </Typography>
            <TextField
              id="resetCode"
              placeholder="e.g. 808904"
              value={resetCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setResetCode(val);
              }}
              disabled={isVerifyingCode}
              inputProps={{ maxLength: 6, style: { letterSpacing: '0.25em', fontSize: '1.25rem', fontWeight: 700 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRound size={20} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.75 }}>
              Check your email inbox and spam folder for the 6-digit code.
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isVerifyingCode || resetCode.length < 6}
            sx={{
              py: 1.45,
              backgroundColor: '#18181b',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              mb: 2,
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            {isVerifyingCode ? <CircularProgress size={22} color="inherit" /> : 'Verify Code & Proceed'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography
              component={RouterLink}
              to={ROUTES.FORGOT_PASSWORD}
              sx={{ color: '#2563eb', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Didn't receive code? Request a new one
            </Typography>
          </Box>
        </Box>
      ) : (

        /* STEP 2: Password Setting (Only shown when code is verified) */
        <Box component="form" onSubmit={handleResetSubmit} noValidate>
          {/* New Password Input with floating criteria popover */}
          <Box sx={{ position: 'relative', mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              New Password
            </Typography>
            <TextField
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Floating Live Password Requirements Checklist (Hovering Popover) */}
            {isPasswordFocused && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  zIndex: 40,
                  p: 2,
                  backgroundColor: '#ffffff',
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Password Requirements
                  </Typography>
                  {strengthInfo.label && (
                    <Typography variant="caption" sx={{ fontWeight: 700, color: strengthInfo.color }}>
                      {strengthInfo.label}
                    </Typography>
                  )}
                </Box>

                {/* Strength Bar */}
                <LinearProgress
                  variant="determinate"
                  value={strengthInfo.percent}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    mb: 1.5,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: strengthInfo.color,
                      borderRadius: 2,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <RequirementItem fulfilled={passwordCriteria.minLength} label="At least 6 characters" />
                  <RequirementItem fulfilled={passwordCriteria.hasUpper} label="One uppercase letter (A-Z)" />
                  <RequirementItem fulfilled={passwordCriteria.hasLower} label="One lowercase letter (a-z)" />
                  <RequirementItem fulfilled={passwordCriteria.hasNumber} label="One number (0-9)" />
                  <RequirementItem fulfilled={passwordCriteria.hasSpecial} label="One special character (!@#$%&*...)" />
                </Box>
              </Box>
            )}
          </Box>

          {/* Confirm Password Input */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              Confirm New Password
            </Typography>
            <TextField
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {confirmPassword && (
              <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600 }}>
                      Passwords match
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                    Passwords do not match
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !isPasswordValid || !passwordsMatch}
            sx={{
              py: 1.45,
              backgroundColor: '#18181b',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              mb: 2,
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Save New Password & Sign In'}
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography component={RouterLink} to={ROUTES.SIGNIN} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#64748b', fontWeight: 600, fontSize: '0.875rem', '&:hover': { color: '#0f172a' } }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Typography>
      </Box>
    </AuthLayout>
  );
};

// Requirement Item Helper
const RequirementItem = ({ fulfilled, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {fulfilled ? (
      <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
    ) : (
      <Circle size={15} style={{ color: '#cbd5e1', flexShrink: 0 }} />
    )}
    <Typography
      variant="caption"
      sx={{
        color: fulfilled ? '#15803d' : '#64748b',
        fontWeight: fulfilled ? 600 : 500,
        transition: 'color 0.2s ease',
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default ResetPasswordPage;

