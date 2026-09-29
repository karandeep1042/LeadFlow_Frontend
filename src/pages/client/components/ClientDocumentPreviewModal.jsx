import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { FileText, CheckCircle2, AlertCircle, Clock, ExternalLink, Calendar, HardDrive } from 'lucide-react';

const ClientDocumentPreviewModal = ({ open, document, onClose }) => {
  if (!document) return null;

  const getStatusChip = (status) => {
    switch (status) {
      case 'verified':
        return <Chip icon={<CheckCircle2 size={14} color="#059669" />} label="Verified & Bank-Ready" size="small" sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700 }} />;
      case 'rejected':
        return <Chip icon={<AlertCircle size={14} color="#dc2626" />} label="Revision Needed" size="small" sx={{ bgcolor: '#fef2f2', color: '#991b1b', fontWeight: 700 }} />;
      case 'processing':
        return <Chip icon={<Clock size={14} color="#2563eb" />} label="Async Verification In Progress..." size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }} />;
      default:
        return <Chip label="Pending" size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700 }} />;
    }
  };

  const formattedSize = document.fileSize ? `${(document.fileSize / 1024).toFixed(1)} KB` : '142.5 KB';
  const formattedDate = document.createdAt ? new Date(document.createdAt).toLocaleString() : 'Just now';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2.5, sm: 3.5 },
          p: { xs: 0.5, sm: 1 },
          m: { xs: 1.5, sm: 2 },
          width: { xs: 'calc(100% - 24px)', sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
          Document Details
        </Typography>
        {getStatusChip(document.status)}
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.75} alignItems="center">
              <Box
                sx={{
                  width: { xs: 42, sm: 48 },
                  height: { xs: 42, sm: 48 },
                  borderRadius: 2,
                  bgcolor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={22} />
              </Box>
              <Box sx={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    fontSize: { xs: '0.92rem', sm: '1rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {document.title || document.fileName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.78rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  File: {document.fileName || 'uploaded_document.pdf'}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {document.status === 'rejected' && (
            <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fee2e2' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>
                Advisor / OCR Feedback
              </Typography>
              <Typography variant="body2" sx={{ color: '#b91c1c', mt: 0.5, fontWeight: 500, fontSize: '0.84rem' }}>
                {document.rejectionReason || 'Please upload a clearer or more up-to-date version of this document.'}
              </Typography>
            </Box>
          )}

          <Stack spacing={1.5} sx={{ bgcolor: '#ffffff', p: { xs: 1.75, sm: 2 }, borderRadius: 2, border: '1px solid #f1f5f9' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <HardDrive size={15} color="#64748b" />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>File Size</Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.84rem' }}>{formattedSize}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Calendar size={15} color="#64748b" />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>Uploaded At</Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.84rem' }}>{formattedDate}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>Document Category</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2563eb', textTransform: 'capitalize', fontSize: '0.84rem' }}>
                {document.category || 'General'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2.5 }, pt: 1, gap: 1, flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#64748b',
            fontWeight: 700,
            borderRadius: 2,
            width: { xs: '100%', sm: 'auto' },
            height: { xs: 44, sm: 38 },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          endIcon={<ExternalLink size={15} />}
          onClick={() => window.open(document.fileUrl || '#', '_blank')}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' },
            width: { xs: '100%', sm: 'auto' },
            height: { xs: 44, sm: 38 },
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
          }}
        >
          Open Original File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDocumentPreviewModal;
