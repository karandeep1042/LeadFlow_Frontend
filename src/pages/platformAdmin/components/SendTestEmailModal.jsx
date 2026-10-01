import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Alert, CircularProgress, Stack,
} from '@mui/material';
import { Mail, Send } from 'lucide-react';

export default function SendTestEmailModal({
  isOpen,
  onClose,
  template,
  currentSubject,
  currentBody,
  onSendTest,
  loading,
}) {
  const [targetEmail, setTargetEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!template) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!targetEmail) {
      setError('Please provide a recipient email address.');
      return;
    }

    const res = await onSendTest({
      key: template.key,
      targetEmail,
      subject: currentSubject,
      body: currentBody,
    });

    if (res?.success) {
      setSuccess(`Test email successfully dispatched to ${targetEmail}`);
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } else {
      setError(res?.error || 'Failed to dispatch test email.');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <form onSubmit={handleSend}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2.5, backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Send Test Email</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>{template.name}</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>}

            <TextField
              label="Recipient Email Address *"
              type="email"
              size="small"
              fullWidth
              required
              placeholder="admin@example.com"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              helperText="Sample merge tags (brokerage name, password, OTPs) will be inserted dynamically."
            />

            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block' }}>Subject Preview:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mt: 0.25 }}>{currentSubject}</Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={loading} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
            sx={{ fontWeight: 800, borderRadius: 2, px: 3, backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#4338ca' } }}
          >
            {loading ? 'Dispatching...' : 'Dispatch Test Email'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

