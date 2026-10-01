import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { X, AlertTriangle } from 'lucide-react';

const COMMON_REASONS = [
  'Document scan is blurry or unreadable. Please upload a clear PDF.',
  'SCHUFA Bonitätsauskunft is older than 60 days.',
  'Payslip is missing net income breakdown (Nettolohn).',
  'Passport / Aufenthaltstitel scan is missing the reverse side / Zusatzblatt.',
  'Bank statement does not show official account holder name matching application.',
  'Property expose missing official Grundbuch extract.',
];

export const DocumentRejectModal = ({
  open,
  onClose,
  document,
  onConfirmReject,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleChipClick = (preset) => {
    setReason(preset);
    setError('');
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide a reason so the borrower knows what to revise.');
      return;
    }
    onConfirmReject(document._id, reason.trim());
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: { xs: 2.5, sm: 3 }, p: { xs: 0.5, sm: 1 }, m: { xs: 1.5, sm: 2 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Request Document Revision
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {document?.title || 'Document Audit'}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" sx={{ color: '#475569', mb: 2, fontSize: '0.85rem' }}>
          Select a standard compliance reason or write custom feedback. The client will be notified to re-upload:
        </Typography>

        {/* Reason Presets */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
          {COMMON_REASONS.map((preset, idx) => (
            <Chip
              key={idx}
              label={preset}
              size="small"
              onClick={() => handleChipClick(preset)}
              sx={{
                fontSize: '0.75rem',
                backgroundColor: reason === preset ? '#fee2e2' : '#f1f5f9',
                color: reason === preset ? '#991b1b' : '#475569',
                border: `1px solid ${reason === preset ? '#fca5a5' : '#e2e8f0'}`,
                fontWeight: reason === preset ? 700 : 500,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#fee2e2' },
              }}
            />
          ))}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Rejection Reason / Client Instructions"
          placeholder="e.g. Please upload the complete 3-page PDF with clear wage deductions."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '0.875rem',
            },
          }}
        />

        {document?.leadId && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2, fontSize: '0.75rem', py: 0.5 }}>
            This note will be automatically added to the lead audit trail for {document.leadId.firstName} {document.leadId.lastName}.
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: 1.25,
        }}
      >
        <Button onClick={onClose} disabled={loading} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#64748b', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          fullWidth
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            backgroundColor: '#dc2626',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': { backgroundColor: '#b91c1c' },
          }}
        >
          {loading ? 'Submitting...' : 'Reject & Request Revision'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentRejectModal;
