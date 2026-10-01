import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Paper, Divider, Chip, IconButton,
} from '@mui/material';
import { Mail, ShieldCheck, X } from 'lucide-react';
import { MERGE_TAGS } from '../../../utils/automationConstants';

export const EmailPreviewModal = ({ open, onClose, trigger }) => {
  if (!trigger) return null;

  const template = trigger.emailTemplateId || {};
  const rawSubject = template.subject || trigger.subject || '';
  const rawBody = template.body || trigger.body || '';

  // Replace merge tags with sample values
  let renderedSubject = rawSubject;
  let renderedBody = rawBody;

  MERGE_TAGS.forEach((m) => {
    const regex = new RegExp(m.tag.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g');
    renderedSubject = renderedSubject.replace(regex, m.sample);
    renderedBody = renderedBody.replace(regex, m.sample);
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2.5, sm: 3 },
          m: { xs: 1.5, sm: 3 },
          width: { xs: 'calc(100% - 24px)', sm: 'auto' },
          maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
          overflowX: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          pt: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 1.25,
          borderBottom: '1px solid #f1f5f9',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pr: { xs: 4, sm: 0 } }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Mail size={18} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.25rem' }, color: '#0f172a' }}>
            Borrower Email Live Preview
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label="Sample Expat Lead Preview"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24 }}
          />
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: '#94a3b8',
            '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          backgroundColor: '#f8fafc',
          overflowX: 'hidden',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderRadius: 2.5,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            maxWidth: 640,
            mx: 'auto',
          }}
        >
          {/* Email Header */}
          <Box sx={{ pb: 2, mb: 2, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, wordBreak: 'break-word', fontSize: '0.78rem' }}>
              <strong>From:</strong> HypoExpat Berlin &lt;notifications@hypoexpat.de&gt;
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, wordBreak: 'break-word', fontSize: '0.78rem' }}>
              <strong>To:</strong> Rahul Sharma &lt;rahul.sharma@example.com&gt;
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontSize: '0.78rem' }}>
              <strong>Stage Trigger:</strong> {trigger.stage}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '0.95rem', sm: '1.05rem' }, wordBreak: 'break-word', lineHeight: 1.35 }}>
              Subject: {renderedSubject}
            </Typography>
          </Box>

          {/* Email Body */}
          <Box sx={{ py: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#334155',
                whiteSpace: 'pre-line',
                lineHeight: 1.7,
                fontSize: { xs: '0.85rem', sm: '0.925rem' },
                wordBreak: 'break-word',
              }}
            >
              {renderedBody}
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 2, sm: 2.5 } }} />

          {/* Email Footer */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1,
              color: '#94a3b8',
              fontSize: '0.72rem',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ShieldCheck size={14} style={{ flexShrink: 0 }} />
              <span>LeadFlow German Mortgage Engine • 256-bit TLS Encrypted</span>
            </Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>
              HypoExpat GmbH, Friedrichstraße 100, 10117 Berlin
            </Typography>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid #f1f5f9' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#18181b',
            color: '#ffffff',
            borderRadius: 2,
            px: 3,
            py: { xs: 1, sm: 0.75 },
            width: { xs: '100%', sm: 'auto' },
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#09090b', boxShadow: 'none' },
          }}
        >
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailPreviewModal;
