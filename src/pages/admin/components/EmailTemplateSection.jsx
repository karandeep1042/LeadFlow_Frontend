import React from 'react';
import { Box, Typography, TextField, Chip } from '@mui/material';
import { Mail, Tag } from 'lucide-react';
import { MERGE_TAGS } from '../../../utils/automationConstants';

export const EmailTemplateSection = ({ subject, body, onChange, onInsertTag }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Mail size={18} color="#2563eb" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '0.925rem', sm: '1rem' } }}>
          1. Borrower Email Notification
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
        <TextField
          label="Email Subject Line *"
          value={subject}
          onChange={(e) => onChange('subject', e.target.value)}
          fullWidth
          required
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' },
          }}
        />

        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block' }}>
              Available Merge Tags (Click to append):
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
              Appends tag to body
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
              mb: 1.5,
              p: 1.25,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {MERGE_TAGS.map((t) => (
              <Chip
                key={t.tag}
                label={t.tag}
                size="small"
                clickable
                onClick={() => onInsertTag(t.tag)}
                icon={<Tag size={11} />}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  height: 25,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  maxWidth: '100%',
                  '& .MuiChip-label': {
                    px: 0.75,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '&:hover': {
                    backgroundColor: '#eff6ff',
                    borderColor: '#93c5fd',
                    color: '#1d4ed8',
                  },
                  '&:active': {
                    transform: 'scale(0.97)',
                  },
                }}
              />
            ))}
          </Box>

          <TextField
            label="Email Body Template *"
            value={body}
            onChange={(e) => onChange('body', e.target.value)}
            multiline
            rows={6}
            fullWidth
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
      </Box>
    </Box>
  );
};

export default EmailTemplateSection;
