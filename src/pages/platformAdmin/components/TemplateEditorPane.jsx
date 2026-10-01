import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Chip, Stack, Alert,
  CircularProgress,
} from '@mui/material';
import { Save, RotateCcw, Send, Tag, CheckCircle2, RefreshCw } from 'lucide-react';

export default function TemplateEditorPane({
  selectedTemplate,
  onSave,
  onReset,
  onOpenTestModal,
  saveLoading,
}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [tab, setTab] = useState('editor');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || '');
      setBody(selectedTemplate.body || '');
      setNotice('');
    }
  }, [selectedTemplate]);

  if (!selectedTemplate) {
    return (
      <Paper elevation={0} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>Select an email template to edit.</Typography>
      </Paper>
    );
  }

  const handleSave = async () => {
    const res = await onSave({ key: selectedTemplate.key, subject, body });
    if (res?.success) {
      setNotice('Template saved successfully!');
      setTimeout(() => setNotice(''), 3000);
    }
  };

  const sampleVars = {
    '{{brokerage_name}}': 'Demo Hypo Berlin GmbH',
    '{{admin_name}}': 'Markus Becker',
    '{{admin_email}}': 'm.becker@hypo.de',
    '{{user_name}}': 'Markus Becker',
    '{{user_email}}': 'm.becker@hypo.de',
    '{{temporary_password}}': 'Password@123',
    '{{reset_code}}': '849201',
    '{{reset_url}}': 'https://leadflow.de/reset',
    '{{login_url}}': 'https://leadflow.de/login',
    '{{support_email}}': 'support@leadflow.de',
    '{{ban_reason}}': 'Subscription review and compliance check.',
  };

  let pSubject = subject;
  let pBody = body;
  Object.keys(sampleVars).forEach((k) => {
    pSubject = pSubject.replaceAll(k, sampleVars[k]);
    pBody = pBody.replaceAll(k, sampleVars[k]);
  });

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={selectedTemplate.category} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', backgroundColor: '#eef2ff', color: '#4f46e5' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>{selectedTemplate.name}</Typography>
        </Box>
        <Stack direction="row" spacing={0.5} sx={{ backgroundColor: '#e2e8f0', p: 0.5, borderRadius: 2 }}>
          <Button
            size="small"
            onClick={() => setTab('editor')}
            sx={{
              height: 28, fontSize: '0.725rem', fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
              backgroundColor: tab === 'editor' ? '#ffffff' : 'transparent',
              color: tab === 'editor' ? '#0f172a' : '#64748b',
              boxShadow: tab === 'editor' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Editor
          </Button>
          <Button
            size="small"
            onClick={() => setTab('preview')}
            sx={{
              height: 28, fontSize: '0.725rem', fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
              backgroundColor: tab === 'preview' ? '#ffffff' : 'transparent',
              color: tab === 'preview' ? '#0f172a' : '#64748b',
              boxShadow: tab === 'preview' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Preview
          </Button>
        </Stack>
      </Box>

      {notice && <Box sx={{ px: 2.5, pt: 2 }}><Alert severity="success" sx={{ borderRadius: 2 }}>{notice}</Alert></Box>}

      {/* Content */}
      <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Dynamic Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tag size={14} /> Merge Tags:
          </Typography>
          {selectedTemplate.availableTags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onClick={() => setBody((prev) => `${prev} ${tag}`)}
              sx={{
                height: 22, fontSize: '0.675rem', fontFamily: 'monospace', fontWeight: 700,
                backgroundColor: '#f1f5f9', color: '#4338ca', cursor: 'pointer',
                '&:hover': { backgroundColor: '#eef2ff' },
              }}
            />
          ))}
        </Box>

        {tab === 'editor' ? (
          <>
            <TextField label="Subject Line" size="small" fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} />
            <TextField
              label="Email Body (Plain Text & Placeholders)"
              multiline
              rows={10}
              fullWidth
              value={body}
              onChange={(e) => setBody(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
            />
          </>
        ) : (
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: '#0f172a', color: '#ffffff' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Subject Preview</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', mt: 0.25 }}>{pSubject}</Typography>
            </Box>
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#334155', fontSize: '0.875rem' }}>
              {pBody}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          size="small"
          onClick={() => onReset(selectedTemplate.key)}
          startIcon={<RotateCcw size={14} />}
          sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b', '&:hover': { color: '#dc2626' } }}
        >
          Reset Default
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onOpenTestModal(subject, body)}
            startIcon={<Send size={14} />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, color: '#4f46e5', borderColor: '#c7d2fe', backgroundColor: '#eef2ff' }}
          >
            Send Test
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSave}
            disabled={saveLoading}
            startIcon={saveLoading ? <CircularProgress size={14} color="inherit" /> : <Save size={14} />}
            sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2, px: 2.5, backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#4338ca' } }}
          >
            {saveLoading ? 'Saving...' : 'Save Template'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
