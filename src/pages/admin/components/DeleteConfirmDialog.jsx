import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Alert,
} from '@mui/material';
import { Trash2 } from 'lucide-react';

export const DeleteConfirmDialog = ({ open, onClose, onConfirm, source, deleting }) => {
  return (
    <Dialog open={open} onClose={() => !deleting && onClose()} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Trash2 size={20} /> Delete Webhook Source
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ color: '#334155', mb: 1.5 }}>
          Are you sure you want to permanently remove the webhook source <strong>{source?.name}</strong>?
        </Typography>
        <Alert severity="warning" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
          External requests sent to this endpoint URL will return 404 Not Found.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={deleting}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={deleting} sx={{ borderRadius: 2, fontWeight: 700 }}>
          {deleting ? 'Deleting...' : 'Delete Permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
