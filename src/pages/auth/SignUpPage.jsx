import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, Button, IconButton, InputAdornment, Alert, MenuItem,
} from '@mui/material';
import { Mail, Lock, Building2, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { registerBrokerage } from '../../redux/thunks/authThunk';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    if (!formData.brokerageName.trim()) return setValidationError('Brokerage name is required.');
    if (!formData.name.trim()) return setValidationError('Full name is required.');
    if (!formData.email.trim()) return setValidationError('Business email is required.');
    if (!formData.password || formData.password.length < 6) {
      return setValidationError('Password must be at least 6 characters.');
    }
    dispatch(registerBrokerage(formData));
  };

  return (
    <AuthLayout headline="Join LeadFlow!" subtext="Empower your German brokerage with automated expat workflows and async document orchestration.">
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

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }} onClose={() => { setValidationError(''); dispatch(clearAuthError()); }}>
          {validationError || error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2 }}>
          <TextField
            id="brokerageName"
            name="brokerageName"
            placeholder="Brokerage Name (e.g. HypoExpat GmbH)"
            value={formData.brokerageName}
            onChange={handleChange}
            disabled={loading}
            InputProps={{ startAdornment: <InputAdornment position="start"><Building2 size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            id="name"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            id="email"
            name="email"
            type="email"
            placeholder="Business Email (e.g. hans@hypobroker.de)"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
          <TextField
            select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={loading}
            InputProps={{ startAdornment: <InputAdornment position="start"><MapPin size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          >
            {CITIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField
            id="phone"
            name="phone"
            placeholder="Phone (Optional)"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={18} style={{ color: '#94a3b8' }} /></InputAdornment> }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
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
          sx={{ py: 1.4, backgroundColor: '#18181b', color: '#ffffff', borderRadius: '10px', fontWeight: 700, fontSize: '0.975rem', mb: 2, '&:hover': { backgroundColor: '#09090b' } }}
        >
          {loading ? 'Creating Workspace...' : 'Register Brokerage'}
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default SignUpPage;

