import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { Mail, RefreshCw } from 'lucide-react';
import {
  fetchPlatformTemplates,
  updatePlatformTemplate,
  resetPlatformTemplate,
  sendTestPlatformEmail,
} from '../../redux/thunks/tenantThunk';
import TemplateEditorPane from './components/TemplateEditorPane';
import SendTestEmailModal from './components/SendTestEmailModal';

export default function PlatformEmailTemplatesPage() {
  const dispatch = useDispatch();
  const { platformTemplates, templateLoading } = useSelector((state) => state.tenant);
  const [selectedKey, setSelectedKey] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testPayload, setTestPayload] = useState({ subject: '', body: '' });
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => { dispatch(fetchPlatformTemplates()); }, [dispatch]);

  useEffect(() => {
    if (platformTemplates.length > 0 && !selectedKey) {
      setSelectedKey(platformTemplates[0].key);
    }
  }, [platformTemplates, selectedKey]);

  const categories = ['all', 'Onboarding', 'Account Status', 'Authentication & Security'];

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return platformTemplates;
    return platformTemplates.filter((t) => t.category === categoryFilter);
  }, [platformTemplates, categoryFilter]);

  const selectedTemplate = useMemo(() => {
    return platformTemplates.find((t) => t.key === selectedKey) || platformTemplates[0];
  }, [platformTemplates, selectedKey]);

  const handleSave = async ({ key, subject, body }) => {
    const res = await dispatch(updatePlatformTemplate({ key, subject, body }));
    return { success: updatePlatformTemplate.fulfilled.match(res), error: res.payload };
  };

  const handleTest = async ({ key, targetEmail, subject, body }) => {
    setTestLoading(true);
    const res = await dispatch(sendTestPlatformEmail({ key, targetEmail, subject, body }));
    setTestLoading(false);
    return { success: sendTestPlatformEmail.fulfilled.match(res), error: res.payload };
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5', mb: 0.5 }}>
              <Mail size={16} />
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Global Dispatch
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Platform Email Templates
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Configure system-wide notifications for brokerages, onboarding, and security OTPs.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => dispatch(fetchPlatformTemplates())}
            disabled={templateLoading}
            startIcon={<RefreshCw size={16} className={templateLoading ? 'animate-spin' : ''} />}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', backgroundColor: '#ffffff', '&:hover': { backgroundColor: '#f8fafc' } }}
          >
            Refresh Templates
          </Button>
        </Box>

        {/* Category Filters */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="small"
              variant={categoryFilter === cat ? 'contained' : 'outlined'}
              onClick={() => setCategoryFilter(cat)}
              sx={{
                borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.75rem',
                backgroundColor: categoryFilter === cat ? '#4f46e5' : '#ffffff',
                color: categoryFilter === cat ? '#ffffff' : '#475569',
                borderColor: categoryFilter === cat ? '#4f46e5' : '#cbd5e1',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: categoryFilter === cat ? '#4338ca' : '#f8fafc',
                  borderColor: categoryFilter === cat ? '#4338ca' : '#94a3b8',
                },
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </Button>
          ))}
        </Stack>

        {/* 2-Column Split: Template List & Editor Pane */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 3, minHeight: 620 }}>
          {/* List */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Templates ({filteredTemplates.length})
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredTemplates.map((tpl) => {
                const isSelected = tpl.key === selectedTemplate?.key;
                return (
                  <Box
                    key={tpl.key}
                    onClick={() => setSelectedKey(tpl.key)}
                    sx={{
                      p: 2,
                      borderBottom: '1px solid #f1f5f9',
                      borderLeft: isSelected ? '4px solid #4f46e5' : '4px solid transparent',
                      backgroundColor: isSelected ? '#eef2ff' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { backgroundColor: isSelected ? '#eef2ff' : '#f8fafc' },
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 700, display: 'block' }}>
                      {tpl.category}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.25 }}>
                      {tpl.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Editor Pane */}
          <Box sx={{ minHeight: 620 }}>
            <TemplateEditorPane
              selectedTemplate={selectedTemplate}
              onSave={handleSave}
              onReset={(k) => dispatch(resetPlatformTemplate(k))}
              onOpenTestModal={(s, b) => { setTestPayload({ subject: s, body: b }); setIsTestModalOpen(true); }}
              saveLoading={templateLoading}
            />
          </Box>
        </Box>

        <SendTestEmailModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          template={selectedTemplate}
          currentSubject={testPayload.subject}
          currentBody={testPayload.body}
          onSendTest={handleTest}
          loading={testLoading}
        />
      </Box>
    </Box>
  );
}
