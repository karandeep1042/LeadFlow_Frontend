import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Stack, CircularProgress,
} from '@mui/material';
import { Building2 } from 'lucide-react';
import PhoneInputField from '../../../components/common/PhoneInputField';

export default function EditTenantModal({ isOpen, onClose, tenant, onSave }) {
  const [form, setForm] = useState({ name: '', city: '', phone: '', subdomain: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name || '',
        city: tenant.city || 'Berlin',
        phone: tenant.phone || '',
        subdomain: tenant.subdomain || '',
      });
    }
  }, [tenant]);

  if (!tenant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => !submitting && onClose()} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2.5, backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Edit Organization</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Update workspace branding and contact information.</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Organization Name *" size="small" fullWidth required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="City" size="small" fullWidth value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <TextField label="Subdomain" size="small" fullWidth value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })} />
            </Box>
            <PhoneInputField
              id="edit-tenant-phone"
              name="phone"
              label="Phone"
              size="small"
              fullWidth
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={submitting} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ fontWeight: 800, borderRadius: 2, px: 3, backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#4338ca' } }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}


