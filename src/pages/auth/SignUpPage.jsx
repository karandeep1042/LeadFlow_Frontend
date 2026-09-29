import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Mail,
  Lock,
  Building2,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  KeyRound,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import NotificationAlert from '../../components/common/NotificationAlert';
import PhoneInputField from '../../components/common/PhoneInputField';
import {
  registerBrokerage,
  sendSignupVerificationCode,
  verifySignupCode,
} from '../../redux/thunks/authThunk';
import { clearAuthError } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

const CITIES = ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Cologne', 'Düsseldorf', 'Other'];

export const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, role } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    brokerageName: '',
    name: '',
    email: '',
    password: '',
    city: 'Berlin',
    phone: '',
  });
  const [customCity, setCustomCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Email verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Toast alert state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    dispatch(clearAuthError());
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

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'platform_admin') navigate(ROUTES.PLATFORM_ADMIN_TENANTS);
      else if (role === 'brokerage_admin') navigate(ROUTES.BROKERAGE_ADMIN_DASHBOARD);
      else if (role === 'advisor') navigate(ROUTES.ADVISOR_PIPELINE);
      else if (role === 'client') navigate(ROUTES.CLIENT_PORTAL);
      else navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, role, navigate]);

  // Password criteria computation
  const password = formData.password || '';
  const passwordCriteria = {
    minLength: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const fulfilledCount = Object.values(passwordCriteria).filter(Boolean).length;
  const isPasswordValid = fulfilledCount === 5;

  const getStrengthInfo = () => {
    if (fulfilledCount === 0) return { label: '', color: '#cbd5e1', percent: 0 };
    if (fulfilledCount <= 2) return { label: 'Weak', color: '#ef4444', percent: 35 };
    if (fulfilledCount <= 4) return { label: 'Medium', color: '#f59e0b', percent: 75 };
    return { label: 'Strong', color: '#16a34a', percent: 100 };
  };
  const strengthInfo = getStrengthInfo();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'email') {
      // If user changes their email, reset verification state
      if (isEmailVerified || codeSent) {
        setIsEmailVerified(false);
        setCodeSent(false);
        setVerificationCode('');
      }
    }
  };

  const handleSendVerificationCode = async () => {
    const emailToVerify = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailToVerify || !emailRegex.test(emailToVerify)) {
      setToast({
        open: true,
        message: 'Please enter a valid business email address before verifying.',
        severity: 'error',
      });
      return;
    }
    setIsSendingCode(true);

    try {
      const result = await dispatch(
        sendSignupVerificationCode({
          email: emailToVerify,
          name: formData.name.trim() || 'Valued Broker',
        })
      );
      if (sendSignupVerificationCode.fulfilled.match(result)) {
        setCodeSent(true);
        setToast({
          open: true,
          message: `A 6-digit verification code was sent to ${emailToVerify}.`,
          severity: 'success',
        });
      } else {
        setToast({
          open: true,
          message: result.payload || 'Failed to send verification code. This email may already be in use.',
          severity: 'error',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: 'An unexpected error occurred while sending the code.',
        severity: 'error',
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.trim().length < 6) {
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
        verifySignupCode({
          email: formData.email.trim(),
          code: verificationCode.trim(),
        })
      );
      if (verifySignupCode.fulfilled.match(result)) {
        setIsEmailVerified(true);
        setToast({
          open: true,
          message: 'Business email verified successfully!',
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
        message: 'Failed to verify code. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.brokerageName.trim()) {
      setToast({ open: true, message: 'Brokerage name is required.', severity: 'error' });
      return;
    }
    if (!formData.name.trim()) {
      setToast({ open: true, message: 'Full name is required.', severity: 'error' });
      return;
    }
    if (!formData.email.trim()) {
      setToast({ open: true, message: 'Business email is required.', severity: 'error' });
      return;
    }
    if (!isEmailVerified) {
      setToast({ open: true, message: 'Please verify your business email address before registering.', severity: 'error' });
      return;
    }
    if (formData.city === 'Other' && !customCity.trim()) {
      setToast({ open: true, message: 'Please specify your business location city.', severity: 'error' });
      return;
    }
    if (!formData.password || !isPasswordValid) {
      setToast({ open: true, message: 'Please meet all password requirements before registering.', severity: 'error' });
      return;
    }
    const payload = {
      ...formData,
      city: formData.city === 'Other' ? customCity.trim() : formData.city,
    };
    dispatch(registerBrokerage(payload));
  };

  return (
    <AuthLayout headline="Join LeadFlow!" subtext="Empower your German brokerage with automated expat workflows and async document orchestration.">
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#0f172a' }}>
          LeadFlow
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.65rem', md: '1.95rem' }, letterSpacing: '-0.03em', color: '#0f172a', mb: 0.75 }}>
          Create your Account
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Typography component={RouterLink} to={ROUTES.SIGNIN} sx={{ color: '#0f172a', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#2563eb' } }}>
            Sign in to your workspace
          </Typography>
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Brokerage Name
          </Typography>
          <TextField
            id="brokerageName"
            name="brokerageName"
            placeholder="e.g. HypoExpat GmbH"
            value={formData.brokerageName}
            onChange={handleChange}
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Building2 size={18} style={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Full Name
          </Typography>
          <TextField
            id="name"
            name="name"
            placeholder="e.g. Hans Gruber"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} style={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Business Email with End Verification Button */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Business Email
          </Typography>
          <TextField
            id="email"
            name="email"
            type="email"
            placeholder="e.g. hans@hypobroker.de"
            value={formData.email}
            onChange={handleChange}
            disabled={loading || isVerifyingCode}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} style={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isEmailVerified ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.25,
                          py: 0.4,
                          backgroundColor: '#f0fdf4',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                        }}
                      >
                        <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, fontSize: '0.75rem' }}>
                          Verified
                        </Typography>
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSendVerificationCode}
                        disabled={isSendingCode || !formData.email.trim() || loading}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          py: 0.5,
                          px: 1.5,
                          borderRadius: '8px',
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          boxShadow: 'none',
                          minWidth: 'auto',
                          '&:hover': { backgroundColor: '#09090b', boxShadow: 'none' },
                        }}
                      >
                        {isSendingCode ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : codeSent ? (
                          'Resend'
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Verification Code Input Card (Shown when code is sent and email is not yet verified) */}
        {codeSent && !isEmailVerified && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: '#f8fafc',
              borderRadius: 2.5,
              border: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Enter Verification Code
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Code sent to email
              </Typography>
            </Box>

            <TextField
              id="emailVerificationCode"
              placeholder="6-digit code (e.g. 849201)"
              value={verificationCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(val);
              }}
              disabled={isVerifyingCode}
              inputProps={{ maxLength: 6, style: { letterSpacing: '0.15em', fontWeight: 700 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRound size={18} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleVerifyCode}
                        disabled={isVerifyingCode || verificationCode.length < 6}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          py: 0.5,
                          px: 1.75,
                          borderRadius: '8px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          boxShadow: 'none',
                          minWidth: 'auto',
                          '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' },
                        }}
                      >
                        {isVerifyingCode ? <CircularProgress size={16} color="inherit" /> : 'Verify Code'}
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.75, fontSize: '0.75rem' }}>
              Check your inbox and spam folder for the 6-digit code. Valid for 15 minutes.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              Business Location
            </Typography>
            <TextField
              select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={18} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {CITIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              Phone Number
            </Typography>
            <PhoneInputField
              id="phone"
              name="phone"
              placeholder="170 1234567"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              showPhoneIcon
            />
          </Box>
        </Box>

        {formData.city === 'Other' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              Specify City
            </Typography>
            <TextField
              id="customCity"
              name="customCity"
              placeholder="e.g. Stuttgart, Leipzig, Bremen"
              value={customCity}
              onChange={(e) => {
                setCustomCity(e.target.value);
              }}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={18} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ position: 'relative', mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Password
          </Typography>
          <TextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.4,
            backgroundColor: '#18181b',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.975rem',
            mb: 2,
            '&:hover': { backgroundColor: '#09090b' },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Register Brokerage'}
        </Button>
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
        fontSize: '0.775rem',
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default SignUpPage;

