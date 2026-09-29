import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
} from 'lucide-react';
import PhoneInputField from '../../../components/common/PhoneInputField';

const CITIES = ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Cologne', 'Düsseldorf', 'Other'];

export default function ProvisionTenantModal({ isOpen, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    city: 'Berlin',
    phone: '',
    adminName: '',
    adminEmail: '',
    adminPassword: 'Password@123',
  });
  const [customCity, setCustomCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (loading) return;
    setError('');
    setSuccess('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Organization name is required.');
      return;
    }
    if (!form.adminName.trim()) {
      setError('Primary administrator full name is required.');
      return;
    }
    if (!form.adminEmail.trim()) {
      setError('Admin email address is required.');
      return;
    }
    if (!form.adminPassword) {
      setError('Temporary master password is required.');
      return;
    }
    if (form.city === 'Other' && !customCity.trim()) {
      setError('Please specify the city name.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      city: form.city === 'Other' ? customCity.trim() : form.city,
      phone: form.phone.trim(),
      adminName: form.adminName.trim(),
      adminEmail: form.adminEmail.trim(),
      adminPassword: form.adminPassword,
    };

    const res = await onSubmit(payload);
    if (res?.success) {
      setSuccess('Brokerage workspace added successfully!');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } else {
      setError(res?.error || 'Failed to add brokerage workspace.');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: { xs: 1, sm: 1.5 },
          backgroundColor: '#ffffff',
        },
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5, pt: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Building2 size={24} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Add New Brokerage
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              Creates workspace, auto-verifies admin, and seeds default automations.
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: 1.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* Brokerage Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              Brokerage / Organization Name *
            </Typography>
            <TextField
              id="provision-name"
              name="name"
              fullWidth
              required
              placeholder="e.g. HypoExpat GmbH"
              value={form.name}
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

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
                Business Location
              </Typography>
              <TextField
                select
                id="provision-city"
                name="city"
                fullWidth
                value={form.city}
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
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
                Phone Number
              </Typography>
              <PhoneInputField
                id="provision-phone"
                name="phone"
                fullWidth
                placeholder="170 1234567"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
                showPhoneIcon
              />
            </Box>
          </Box>

          {form.city === 'Other' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
                Specify City *
              </Typography>
              <TextField
                id="provision-customCity"
                name="customCity"
                fullWidth
                required
                placeholder="e.g. Stuttgart, Leipzig, Bremen"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
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

          <Divider sx={{ my: 2.5, borderColor: '#e2e8f0' }} />

          {/* Primary Admin Credentials */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontWeight: 800,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1.5,
              fontSize: '0.725rem',
            }}
          >
            Primary Administrator Credentials
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
                Admin Full Name *
              </Typography>
              <TextField
                id="provision-adminName"
                name="adminName"
                fullWidth
                required
                placeholder="e.g. Hans Gruber"
                value={form.adminName}
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

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
                Admin Email Address *
              </Typography>
              <TextField
                id="provision-adminEmail"
                name="adminEmail"
                type="email"
                fullWidth
                required
                placeholder="e.g. hans@hypobroker.de"
                value={form.adminEmail}
                onChange={handleChange}
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
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>
              Temporary Master Password *
            </Typography>
            <TextField
              id="provision-adminPassword"
              name="adminPassword"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              placeholder="e.g. Password@123"
              value={form.adminPassword}
              onChange={handleChange}
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
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              backgroundColor: '#4f46e5',
              '&:hover': { backgroundColor: '#4338ca' },
            }}
          >
            {loading ? 'Adding...' : 'Add Brokerage'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

