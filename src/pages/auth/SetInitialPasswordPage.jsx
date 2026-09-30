import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Circle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import NotificationAlert from '../../components/common/NotificationAlert';
import { setInitialPassword } from '../../redux/thunks/authThunk';
import { clearAuthError } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

const RequirementItem = ({ fulfilled, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {fulfilled ? (
      <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
    ) : (
      <Circle size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
    )}
    <Typography
      variant="caption"
      sx={{
        color: fulfilled ? '#15803d' : '#64748b',
        fontWeight: fulfilled ? 600 : 500,
        fontSize: '0.78rem',
      }}
    >
      {label}
    </Typography>
  </Box>
);

export const SetInitialPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user, role, isAuthenticated } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToast({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.SIGNIN, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user && !user.mustChangePassword) {
      if (role === 'platform_admin') navigate(ROUTES.PLATFORM_ADMIN_TENANTS, { replace: true });
      else if (role === 'brokerage_admin') navigate(ROUTES.BROKERAGE_ADMIN_DASHBOARD, { replace: true });
      else if (role === 'advisor') navigate(ROUTES.ADVISOR_PIPELINE, { replace: true });
      else if (role === 'client') navigate(ROUTES.CLIENT_PORTAL, { replace: true });
      else navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, user, role, navigate]);

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

  const getStrengthInfo = () => {
    if (fulfilledCount === 0) return { label: '', color: '#cbd5e1', percent: 0 };
    if (fulfilledCount <= 2) return { label: 'Weak', color: '#ef4444', percent: 35 };
    if (fulfilledCount <= 4) return { label: 'Medium', color: '#f59e0b', percent: 75 };
    return { label: 'Strong', color: '#16a34a', percent: 100 };
  };
  const strengthInfo = getStrengthInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setToast({ open: true, message: 'Please meet all password requirements.', severity: 'error' });
      return;
    }
    if (!passwordsMatch) {
      setToast({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }

    const result = await dispatch(
      setInitialPassword({ currentPassword: currentPassword.trim(), newPassword })
    );

    if (setInitialPassword.fulfilled.match(result)) {
      setToast({ open: true, message: 'Password updated! Entering dashboard...', severity: 'success' });
      setTimeout(() => {
        if (role === 'platform_admin') navigate(ROUTES.PLATFORM_ADMIN_TENANTS, { replace: true });
        else if (role === 'brokerage_admin') navigate(ROUTES.BROKERAGE_ADMIN_DASHBOARD, { replace: true });
        else if (role === 'advisor') navigate(ROUTES.ADVISOR_PIPELINE, { replace: true });
        else if (role === 'client') navigate(ROUTES.CLIENT_PORTAL, { replace: true });
        else navigate(ROUTES.HOME, { replace: true });
      }, 1000);
    } else {
      setToast({ open: true, message: result.payload || 'Failed to update password.', severity: 'error' });
    }
  };

  return (
    <AuthLayout headline="Security Setup" subtext="Create a secure permanent password for your LeadFlow workspace.">
      <NotificationAlert
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => { setToast((p) => ({ ...p, open: false })); dispatch(clearAuthError()); }}
        autoHideDuration={5000}
      />
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: '#eff6ff', color: '#2563eb', mb: 1.5 }}>
          <ShieldCheck size={16} />
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>First-Time Password Setup</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', sm: '1.65rem' }, color: '#0f172a', mb: 1 }}>
          Set Your Permanent Password
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
          You logged in with a temporary password. Please set a personal password to proceed.
        </Typography>
      </Box>
      <Paper elevation={0} sx={{ p: 1.5, mb: 3, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', gap: 1.25, alignItems: 'center' }}>
        <KeyRound size={18} style={{ color: '#2563eb' }} />
        <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.8rem' }}>Signed in as <strong>{user?.email || 'User'}</strong></Typography>
      </Paper>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Temporary Password (Used to Sign In)
          </Typography>
          <TextField
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Enter temporary password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            fullWidth
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><Lock size={18} style={{ color: '#94a3b8' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrentPassword((p) => !p)} edge="end" size="small">
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ position: 'relative', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            New Password
          </Typography>
          <TextField
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            disabled={loading}
            fullWidth
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><Lock size={18} style={{ color: '#94a3b8' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword((p) => !p)} edge="end" size="small">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {isPasswordFocused && (
            <Box sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 40, p: 2, backgroundColor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Requirements</Typography>
                {strengthInfo.label && <Typography variant="caption" sx={{ fontWeight: 700, color: strengthInfo.color }}>{strengthInfo.label}</Typography>}
              </Box>
              <LinearProgress variant="determinate" value={strengthInfo.percent} sx={{ height: 4, borderRadius: 2, mb: 1.5, backgroundColor: '#e2e8f0', '& .MuiLinearProgress-bar': { backgroundColor: strengthInfo.color, borderRadius: 2 } }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <RequirementItem fulfilled={passwordCriteria.minLength} label="At least 6 characters" />
                <RequirementItem fulfilled={passwordCriteria.hasUpper} label="One uppercase letter (A-Z)" />
                <RequirementItem fulfilled={passwordCriteria.hasLower} label="One lowercase letter (a-z)" />
                <RequirementItem fulfilled={passwordCriteria.hasNumber} label="One number (0-9)" />
                <RequirementItem fulfilled={passwordCriteria.hasSpecial} label="One special character (!@#$%&*...)" />
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Confirm New Password
          </Typography>
          <TextField
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            fullWidth
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><Lock size={18} style={{ color: '#94a3b8' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((p) => !p)} edge="end" size="small">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {confirmPassword.length > 0 && (
            <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {passwordsMatch ? (
                <>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600 }}>Passwords match</Typography>
                </>
              ) : (
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 500 }}>Passwords do not match</Typography>
              )}
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !isPasswordValid || !passwordsMatch}
          sx={{ py: 1.3, fontSize: '0.95rem', fontWeight: 700, borderRadius: 2, textTransform: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' } }}
        >
          {loading ? 'Updating Password...' : 'Save Password & Enter Workspace'}
          {!loading && <ArrowRight size={18} />}
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default SetInitialPasswordPage;