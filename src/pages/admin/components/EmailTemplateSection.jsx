import React from 'react';
import { Box, Typography, Stack, TextField, Chip } from '@mui/material';
import { Mail, Tag } from 'lucide-react';
import { MERGE_TAGS } from '../../../utils/automationConstants';

export const EmailTemplateSection = ({ subject, body, onChange, onInsertTag }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Mail size={18} color="#2563eb" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>1. Borrower Email Notification</Typography>
      </Box>
      <Stack spacing={1.5}>
        <TextField
          label="Email Subject Line"
          value={subject}
          onChange={(e) => onChange('subject', e.target.value)}
          fullWidth
          required
          size="small"
        />
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 0.5, display: 'block' }}>
            Available Merge Tags (Click to append):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
            {MERGE_TAGS.map((t) => (
              <Chip
                key={t.tag}
                label={t.tag}
                size="small"
                clickable
                onClick={() => onInsertTag(t.tag)}
                icon={<Tag size={12} />}
                sx={{ fontWeight: 600, fontSize: '0.75rem', backgroundColor: '#f1f5f9' }}
              />
            ))}
          </Stack>
          <TextField
            label="Email Body Template"
            value={body}
            onChange={(e) => onChange('body', e.target.value)}
            multiline
            rows={6}
            fullWidth
            required
            sx={{ fontFamily: 'monospace' }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EmailTemplateSection;
