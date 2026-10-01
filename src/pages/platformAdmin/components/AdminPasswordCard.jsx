import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, Chip, Stack, Alert, CircularProgress,
} from '@mui/material';
import { Key } from 'lucide-react';
import { updateSuperAdminPassword } from '../../../redux/thunks/tenantThunk';

export default function AdminPasswordCard() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notice, setNotice] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ error: '', success: '' });
    if (form.newPassword !== form.confirmPassword) {
      setNotice({ error: 'New password and confirmation do not match.', success: '' });
      return;
    }
    setLoading(true);
    const res = await dispatch(updateSuperAdminPassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }));
    setLoading(false);
    if (updateSuperAdminPassword.fulfilled.match(res)) {
      setNotice({ error: '', success: 'Master password updated successfully.' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setNotice({ error: '', success: '' }), 3000);
    } else {
      setNotice({ error: res.payload || 'Failed to update password.', success: '' });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid #e2e8f0', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Master Password</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>BCrypt hashed credentials</Typography>
            </Box>
          </Box>
          <Chip label="Encrypted" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#334155' }} />
        </Box>

        <Stack spacing={2}>
          {notice.error && <Alert severity="error" sx={{ borderRadius: 2 }}>{notice.error}</Alert>}
          {notice.success && <Alert severity="success" sx={{ borderRadius: 2 }}>{notice.success}</Alert>}

          <TextField label="Current Master Password *" type="password" size="small" fullWidth required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          <TextField label="New Master Password *" type="password" size="small" fullWidth required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          <TextField label="Confirm New Password *" type="password" size="small" fullWidth required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3, textTransform: 'none', backgroundColor: '#0f172a', '&:hover': { backgroundColor: '#1e293b' } }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}

