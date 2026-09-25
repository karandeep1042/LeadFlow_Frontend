import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Paper, Divider, Stack, Chip,
} from '@mui/material';
import { Mail, ShieldCheck, ExternalLink } from 'lucide-react';
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Mail size={20} color="#2563eb" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Borrower Email Live Preview</Typography>
        </Box>
        <Chip label="Rendered with Sample Expat Lead" size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, backgroundColor: '#f8fafc' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', maxWidth: 640, mx: 'auto' }}>
          {/* Email Header */}
          <Box sx={{ pb: 2, mb: 2, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              <strong>From:</strong> HypoExpat Berlin &lt;notifications@hypoexpat.de&gt;
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              <strong>To:</strong> Rahul Sharma &lt;rahul.sharma@example.com&gt;
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
              <strong>Stage Trigger:</strong> {trigger.stage}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Subject: {renderedSubject}
            </Typography>
          </Box>

          {/* Email Body */}
          <Box sx={{ py: 1 }}>
            <Typography variant="body1" sx={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {renderedBody}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Email Footer */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ShieldCheck size={14} />
              <span>LeadFlow German Mortgage Engine • 256-bit TLS Encrypted</span>
            </Box>
            <span>HypoExpat GmbH, Friedrichstraße 100, 10117 Berlin</span>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2, px: 3 }}>
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailPreviewModal;
