import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Alert, CircularProgress,
} from '@mui/material';
import { Ban, CheckCircle2 } from 'lucide-react';

export function SuspendTenantModal({ isOpen, onClose, tenant, onConfirm }) {
  const [reason, setReason] = useState('Periodic subscription review and compliance verification.');
  const [submitting, setSubmitting] = useState(false);

  if (!tenant) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(reason);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => !submitting && onClose()} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2.5, backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ban size={22} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Suspend Workspace</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Revoke access for {tenant.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1.5 }}>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          <strong>WebSocket Eviction:</strong> All advisor sessions will disconnect immediately. Borrower data and documents are safely preserved.
        </Alert>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 0.75 }}>
          Reason for Suspension *
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : null}
          onClick={handleConfirm}
          sx={{ fontWeight: 800, borderRadius: 2, px: 3, backgroundColor: '#dc2626', '&:hover': { backgroundColor: '#b91c1c' } }}
        >
          {submitting ? 'Suspending...' : 'Confirm Suspension'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function ReactivateTenantModal({ isOpen, onClose, tenant, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);

  if (!tenant) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => !submitting && onClose()} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2.5, backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={22} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Reactivate Workspace</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Restore portal access for {tenant.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1.5 }}>
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Restoring access for <strong>{tenant.name}</strong> will allow advisors and admins to log back in immediately.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : null}
          onClick={handleConfirm}
          sx={{ fontWeight: 800, borderRadius: 2, px: 3, backgroundColor: '#059669', '&:hover': { backgroundColor: '#047857' } }}
        >
          {submitting ? 'Restoring...' : 'Restore Workspace'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

