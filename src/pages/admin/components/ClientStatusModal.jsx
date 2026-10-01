import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AlertTriangle, CheckCircle2, ShieldAlert, Mail } from 'lucide-react';

export const ClientStatusModal = ({ open, client, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');

  if (!client) return null;

  const isCurrentActive = client.status === 'active';
  const targetStatus = isCurrentActive ? 'suspended' : 'active';
  const isSuspending = targetStatus === 'suspended';

  const handleConfirm = () => {
    onConfirm(client.id || client._id, targetStatus, reason);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: isSuspending ? '#fef2f2' : '#ecfdf5',
            color: isSuspending ? '#dc2626' : '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSuspending ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {isSuspending ? 'Deactivate Client Account' : 'Reactivate Client Account'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {client.name} &bull; {client.email}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Alert
          severity={isSuspending ? 'warning' : 'success'}
          icon={isSuspending ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          sx={{ mb: 2.5, borderRadius: 2 }}
        >
          {isSuspending
            ? 'Deactivating this client account will temporarily restrict their portal login and async document uploads. An automated email with your reason will be sent.'
            : 'Reactivating this account will immediately restore portal access for the borrower and notify them via email.'}
        </Alert>

        {isSuspending && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 0.75 }}>
              Reason for Deactivation (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="e.g. Borrower requested temporary pause, pending compliance verification, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' },
              }}
            />
          </Box>
        )}

        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Mail size={18} style={{ color: '#2563eb' }} />
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
            Automated email template <strong>"{isSuspending ? 'Client Account Deactivated & Suspended' : 'Client Account Reactivated & Restored'}"</strong> configured in Email Automations will be dispatched.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading} sx={{ fontWeight: 700, color: '#64748b' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            fontWeight: 800,
            borderRadius: 2,
            px: 3,
            backgroundColor: isSuspending ? '#dc2626' : '#059669',
            '&:hover': {
              backgroundColor: isSuspending ? '#b91c1c' : '#047857',
            },
          }}
        >
          {loading
            ? 'Updating...'
            : isSuspending
            ? 'Confirm Deactivation'
            : 'Confirm Reactivation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientStatusModal;
