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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
} from '@mui/material';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  UserCheck,
  User,
  Shield,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import NotificationAlert from '../../components/common/NotificationAlert';
import leadflowLogo from '../../assets/leadflow-logo.png';
import { loginUser } from '../../redux/thunks/authThunk';
import { clearAuthError, clearPendingWorkspaces } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

export const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, role, user, pendingWorkspaces } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearPendingWorkspaces());
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
      if (user?.mustChangePassword) {
        navigate(ROUTES.SET_INITIAL_PASSWORD, { replace: true });
        return;
      }

      const fromObj = location.state?.from;
      const targetUrl = fromObj ? `${fromObj.pathname || ''}${fromObj.search || ''}${fromObj.hash || ''}` : null;

      if (
        targetUrl &&
        targetUrl !== ROUTES.SIGNIN &&
        targetUrl !== ROUTES.HOME &&
        targetUrl !== ROUTES.UNAUTHORIZED &&
        !targetUrl.startsWith('/auth')
      ) {
        navigate(targetUrl, { replace: true });
      } else if (role === 'platform_admin') {
        navigate(ROUTES.PLATFORM_ADMIN_TENANTS, { replace: true });
      } else if (role === 'brokerage_admin') {
        navigate(ROUTES.BROKERAGE_ADMIN_DASHBOARD, { replace: true });
      } else if (role === 'advisor') {
        navigate(ROUTES.ADVISOR_PIPELINE, { replace: true });
      } else if (role === 'client') {
        navigate(ROUTES.CLIENT_PORTAL, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    }
  }, [isAuthenticated, role, user, navigate, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setToast({
        open: true,
        message: 'Please enter your email address.',
        severity: 'error',
      });
      return;
    }
    if (!password) {
      setToast({
        open: true,
        message: 'Please enter your password.',
        severity: 'error',
      });
      return;
    }
    dispatch(loginUser({ email: email.trim(), password }));
  };

  const handleSelectWorkspace = (ws) => {
    dispatch(
      loginUser({
        email: email.trim(),
        password,
        brokerageId: ws.brokerageId,
        role: ws.role,
      })
    );
  };

  const getRoleBadge = (workspaceRole) => {
    switch (workspaceRole) {
      case 'platform_admin':
        return { label: 'Platform Admin', color: '#7c3aed', bg: '#f5f3ff', icon: Shield };
      case 'brokerage_admin':
        return { label: 'Brokerage Admin', color: '#2563eb', bg: '#eff6ff', icon: Building2 };
      case 'advisor':
        return { label: 'Mortgage Advisor', color: '#059669', bg: '#ecfdf5', icon: UserCheck };
      default:
        return { label: 'Client / Borrower', color: '#d97706', bg: '#fffbeb', icon: User };
    }
  };

  return (
    <AuthLayout headline="Hello LeadFlow!" subtext="Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!">
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

      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, letterSpacing: '-0.03em', color: '#0f172a', mb: 1 }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Don't have an account?{' '}
          <Typography component={RouterLink} to={ROUTES.SIGNUP} sx={{ color: '#0f172a', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#2563eb' } }}>
            Create a new account now
          </Typography>
          , it's FREE! Takes less than a minute.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Email Address
          </Typography>
          <TextField
            id="email"
            placeholder="e.g. yourname@brokerage.de"
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
            Password
          </Typography>
          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ py: 1.45, backgroundColor: '#18181b', color: '#ffffff', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', mb: 2, '&:hover': { backgroundColor: '#09090b' } }}
        >
          {loading ? 'Signing In...' : 'Login Now'}
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9375rem' }}>
            Forgot password?{' '}
            <Typography component={RouterLink} to={ROUTES.FORGOT_PASSWORD} sx={{ color: '#0f172a', fontWeight: 700, textDecoration: 'underline', '&:hover': { color: '#2563eb' } }}>
              Click here
            </Typography>
          </Typography>
        </Box>
      </Box>

      {/* Multi-Workspace Selection Modal */}
      <Dialog
        open={Boolean(pendingWorkspaces && pendingWorkspaces.length > 0)}
        onClose={() => dispatch(clearPendingWorkspaces())}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 1.5, px: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Select Your Workspace
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontSize: '0.875rem' }}>
            Your account is associated with multiple organizations. Choose where you want to sign in:
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {pendingWorkspaces?.map((ws, idx) => {
              const meta = getRoleBadge(ws.role);
              const RoleIcon = meta.icon;

              return (
                <Paper
                  key={idx}
                  onClick={() => handleSelectWorkspace(ws)}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: '#f8fafc',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '10px',
                        backgroundColor: meta.bg,
                        color: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: `1px solid ${meta.color}30`,
                      }}
                    >
                      <RoleIcon size={22} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                        {ws.brokerageName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                          {ws.city || 'Berlin'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                          •
                        </Typography>
                        <Chip
                          label={meta.label}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.color}30`,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <ChevronRight size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                </Paper>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5, pt: 0.5, justifyContent: 'space-between' }}>
          <Button
            onClick={() => dispatch(clearPendingWorkspaces())}
            startIcon={<ArrowLeft size={16} />}
            sx={{
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' },
            }}
          >
            Back to Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </AuthLayout>
  );
};

export default SignInPage;

