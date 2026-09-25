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
  Alert,
  CircularProgress,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import DemoAccountsBar from '../../components/auth/DemoAccountsBar';
import { loginUser } from '../../redux/thunks/authThunk';
import { clearAuthError } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants/routes';

export const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, role } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'platform_admin') navigate(ROUTES.PLATFORM_ADMIN_TENANTS);
      else if (role === 'brokerage_admin') navigate(ROUTES.BROKERAGE_ADMIN_DASHBOARD);
      else if (role === 'advisor') navigate(ROUTES.ADVISOR_PIPELINE);
      else if (role === 'client') navigate(ROUTES.CLIENT_PORTAL);
      else navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    if (!email.trim()) return setValidationError('Please enter your email address.');
    if (!password) return setValidationError('Please enter your password.');
    dispatch(loginUser({ email: email.trim(), password }));
  };

  const handleSelectDemoAccount = (demoAcc) => {
    setEmail(demoAcc.email);
    setPassword(demoAcc.password);
    setValidationError('');
    dispatch(loginUser({ email: demoAcc.email, password: demoAcc.password }));
  };

  return (
    <AuthLayout headline="Hello LeadFlow!" subtext="Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of time!">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#0f172a' }}>
          LeadFlow
        </Typography>
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

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }} onClose={() => { setValidationError(''); dispatch(clearAuthError()); }}>
          {validationError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2.5 }}>
          <TextField
            id="email"
            placeholder="hisalim.ux@gmail.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setValidationError(''); }}
            disabled={loading}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Mail size={18} style={{ color: '#94a3b8' }} /></InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setValidationError(''); }}
            disabled={loading}
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

      <DemoAccountsBar onSelectDemoAccount={handleSelectDemoAccount} activeEmail={email} />
    </AuthLayout>
  );
};

export default SignInPage;

