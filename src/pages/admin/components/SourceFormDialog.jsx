import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, MenuItem, Box, Typography, Alert,
} from '@mui/material';

export const SourceFormDialog = ({ open, onClose, initialData, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    provider: 'custom',
    status: 'active',
    fieldMapping: {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      phone: 'phone',
      loanAmount: 'loan_amount',
      notes: 'notes',
    },
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        provider: initialData.provider || 'custom',
        status: initialData.status || 'active',
        fieldMapping: initialData.fieldMapping || {
          firstName: 'first_name',
          lastName: 'last_name',
          email: 'email',
          phone: 'phone',
          loanAmount: 'loan_amount',
          notes: 'notes',
        },
      });
    } else {
      setFormData({
        name: '',
        provider: 'custom',
        status: 'active',
        fieldMapping: {
          firstName: 'first_name',
          lastName: 'last_name',
          email: 'email',
          phone: 'phone',
          loanAmount: 'loan_amount',
          notes: 'notes',
        },
      });
    }
    setError('');
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return setError('Source name is required.');
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={() => !submitting && onClose()} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {initialData ? 'Edit Webhook Ingestion Source' : 'Create Webhook Ingestion Source'}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
          <TextField
            label="Source Name *"
            placeholder="e.g. Immobilienscout24 Expat Funnel"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={submitting}
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Lead Provider Preset"
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            disabled={submitting}
            fullWidth
            size="small"
          >
            <MenuItem value="custom">Custom REST Webhook</MenuItem>
            <MenuItem value="typeform">Typeform</MenuItem>
            <MenuItem value="calendly">Calendly Booking</MenuItem>
            <MenuItem value="meta">Meta / Facebook Lead Ads</MenuItem>
            <MenuItem value="zapier">Zapier / Make Ingestion</MenuItem>
          </TextField>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Inbound payload keys will automatically map to mortgage fields: firstName, lastName, email, phone, loanAmount.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting} sx={{ backgroundColor: '#18181b', color: '#fff', borderRadius: 2, fontWeight: 700 }}>
            {submitting ? 'Saving...' : initialData ? 'Update Source' : 'Create Webhook Endpoint'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SourceFormDialog;
