import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, Chip, Stack, Alert, CircularProgress,
} from '@mui/material';
import { User, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { updateSuperAdminProfile } from '../../../redux/thunks/tenantThunk';
import PhoneInputField from '../../../components/common/PhoneInputField';

export default function AdminProfileCard() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);

  const [form, setForm] = useState({
    name: authUser?.name || 'Super Admin',
    email: authUser?.email || 'platformadmin@gmail.com',
    phone: authUser?.phone || '+49 30 99887700',
  });

  useEffect(() => {
    if (authUser) {
      setForm({
        name: authUser.name || 'Super Admin',
        email: authUser.email || 'platformadmin@gmail.com',
        phone: authUser.phone || '+49 30 99887700',
      });
    }
  }, [authUser]);

  const [notice, setNotice] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ error: '', success: '' });
    setLoading(true);
    const res = await dispatch(updateSuperAdminProfile(form));
    setLoading(false);
    if (updateSuperAdminProfile.fulfilled.match(res)) {
      setNotice({ error: '', success: 'Administrator profile updated.' });
      setTimeout(() => setNotice({ error: '', success: '' }), 3000);
    } else {
      setNotice({ error: res.payload || 'Failed to update profile.', success: '' });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid #e2e8f0', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Platform Admin Profile</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Primary root administrator identity</Typography>
            </Box>
          </Box>
          <Chip label="Platform Admin" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', backgroundColor: '#f5f3ff', color: '#7c3aed' }} />
        </Box>

        <Stack spacing={2}>
          {notice.error && <Alert severity="error" sx={{ borderRadius: 2 }}>{notice.error}</Alert>}
          {notice.success && <Alert severity="success" sx={{ borderRadius: 2 }}>{notice.success}</Alert>}

          <TextField label="Full Name *" size="small" fullWidth required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Email Address *" type="email" size="small" fullWidth required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <PhoneInputField
            id="admin-profile-phone"
            name="phone"
            label="Phone"
            size="small"
            fullWidth
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3, textTransform: 'none', backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#4338ca' } }}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}


