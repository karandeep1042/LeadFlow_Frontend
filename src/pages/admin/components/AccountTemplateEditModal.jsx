import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Chip,
  Stack,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Mail, Tag, X } from 'lucide-react';

const ACCOUNT_MERGE_TAGS = [
  { tag: '{{client_name}}', desc: 'Borrower Name' },
  { tag: '{{client_email}}', desc: 'Borrower Email' },
  { tag: '{{temporary_password}}', desc: 'Temp Password' },
  { tag: '{{brokerage_name}}', desc: 'Brokerage Name' },
  { tag: '{{advisor_name}}', desc: 'Advisor Name' },
  { tag: '{{advisor_email}}', desc: 'Advisor Email' },
  { tag: '{{advisor_phone}}', desc: 'Advisor Phone' },
  { tag: '{{city}}', desc: 'Property City' },
  { tag: '{{loan_amount}}', desc: 'Loan Amount' },
  { tag: '{{portal_link}}', desc: 'Portal Link' },
  { tag: '{{vault_link}}', desc: 'Vault Link' },
  { tag: '{{reason}}', desc: 'Reason' },
  { tag: '{{rejected_docs}}', desc: 'Flagged Docs' },
  { tag: '{{stage_label}}', desc: 'Stage Label' },
  { tag: '{{support_email}}', desc: 'Support Contact' },
];

export const AccountTemplateEditModal = ({ open, onClose, template, onSave, saving }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (template) {
      setSubject(template.subject || '');
      setBody(template.body || '');
    }
  }, [template]);

  if (!template) return null;

  const handleInsertTag = (tag) => {
    setBody((prev) => `${prev} ${tag} `);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      _id: template._id || template.id,
      id: template._id || template.id,
      name: template.name,
      description: template.description,
      subject,
      body,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DialogTitle
          sx={{
            pb: 1.5,
            pt: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: { xs: 4, sm: 0 } }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Mail size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                Edit Account Email Template
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>
                {template.name} &bull; {template.description}
              </Typography>
            </Box>
          </Box>

          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={saving}
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
            p: { xs: 2, sm: 3 },
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                Email Subject Line *
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' } }}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                  Email Body Content *
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                  Dynamic placeholders replace automatically
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                <Tag size={15} color="#2563eb" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.825rem' }}>
                  Available Placeholders (Click to insert)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, width: '100%', boxSizing: 'border-box' }}>
                {ACCOUNT_MERGE_TAGS.map((m) => (
                  <Chip
                    key={m.tag}
                    label={`${m.tag} (${m.desc})`}
                    size="small"
                    onClick={() => handleInsertTag(m.tag)}
                    clickable
                    sx={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      height: 25,
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        px: 0.75,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                      '&:hover': { backgroundColor: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' },
                      '&:active': { transform: 'scale(0.97)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            gap: { xs: 1, sm: 1.5 },
            justifyContent: 'space-between',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <Button
            onClick={onClose}
            disabled={saving}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              fontWeight: 600,
              color: '#64748b',
              borderRadius: 2,
              py: { xs: 1, sm: 0.75 },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: { xs: 1, sm: 0.75 },
              backgroundColor: '#18181b',
              color: '#ffffff',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#09090b', boxShadow: 'none' },
            }}
          >
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountTemplateEditModal;
