import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Stack, Alert, Snackbar,
  CircularProgress, IconButton, Tooltip, Switch,
} from '@mui/material';
import { Webhook, Radio, Copy, Check, Edit3, Trash2, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WebhookTester from './components/WebhookTester';
import SourceFormDialog from './components/SourceFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import WebhookCreatedDialog from './components/WebhookCreatedDialog';
import {
  fetchIngestionSources,
  createIngestionSource,
  updateIngestionSource,
  deleteIngestionSource,
  toggleSourceStatus,
} from '../../redux/thunks/integrationThunk';
import { clearLatestGeneratedKey } from '../../redux/slices/integrationSlice';

export const IntegrationsPage = () => {
  const dispatch = useDispatch();
  const { sources, loading, error, latestGeneratedKey } = useSelector((state) => state.integration);

  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [deletingSource, setDeletingSource] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [banner, setBanner] = useState(null); // { open: boolean, message: string, severity: 'success' | 'info' | 'warning' | 'error' }

  useEffect(() => {
    dispatch(fetchIngestionSources());
  }, [dispatch]);

  useEffect(() => {
    if (sources && sources.length > 0) {
      const exists = sources.some((s) => (s._id || s.id) === selectedSourceId);
      if (!selectedSourceId || !exists) {
        setSelectedSourceId(sources[0]._id || sources[0].id);
      }
    } else {
      setSelectedSourceId('');
    }
  }, [sources, selectedSourceId]);

  const handleCopyUrl = (id) => {
    const fullUrl = `${window.location.origin.replace('5173', '5000')}/api/integrations/webhook/${id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2500);
  };

  const handleCreateSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await dispatch(createIngestionSource(formData)).unwrap();
      setOpenCreate(false);
      setBanner({ open: true, message: 'Webhook source created successfully!', severity: 'success' });
      setTimeout(() => setBanner(null), 5000);
    } catch (err) {
      setBanner({ open: true, message: err?.message || 'Failed to create webhook source.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await dispatch(
        updateIngestionSource({ sourceId: editingSource._id || editingSource.id, sourceData: formData })
      ).unwrap();
      setEditingSource(null);
      setBanner({ open: true, message: 'Webhook source updated successfully!', severity: 'success' });
      setTimeout(() => setBanner(null), 5000);
    } catch (err) {
      setBanner({ open: true, message: err?.message || 'Failed to update webhook source.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await dispatch(deleteIngestionSource(deletingSource._id || deletingSource.id)).unwrap();
      setDeletingSource(null);
      setBanner({ open: true, message: 'Webhook source deleted.', severity: 'info' });
      setTimeout(() => setBanner(null), 4000);
    } catch (err) {
      setBanner({ open: true, message: err?.message || 'Failed to delete webhook source.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = (source) => {
    const nextStatus = source.status === 'active' ? 'inactive' : 'active';
    dispatch(toggleSourceStatus({ sourceId: source._id || source.id, status: nextStatus }));
  };

  const activeCount = useMemo(() => {
    return (sources || []).filter((s) => s.status === 'active').length;
  }, [sources]);

  return (
    <DashboardLayout>
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 2.5, md: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Webhook size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                Lead Ingestion
              </Typography>
              <Chip
                label={`${sources.length} Total`}
                size="small"
                sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb' }}
              />
              <Chip
                label={`${activeCount} Active`}
                size="small"
                sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#059669' }}
              />
            </Box>

            {/* Mobile Inline Refresh Button (< md) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Tooltip title="Refresh ingestion sources">
                <IconButton
                  size="small"
                  onClick={() => dispatch(fetchIngestionSources())}
                  disabled={loading}
                  sx={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 2,
                    p: 0.75,
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.1rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Lead Ingestion & Webhooks
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              mt: 0.5,
              maxWidth: 620,
            }}
          >
            Configure inbound REST endpoints to ingest expat leads from marketing portals automatically.
          </Typography>
        </Box>

        {/* Desktop Actions View (>= md) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <Tooltip title="Refresh ingestion sources">
            <IconButton
              onClick={() => dispatch(fetchIngestionSources())}
              disabled={loading}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                p: 1.1,
                backgroundColor: '#ffffff',
                color: '#475569',
                '&:hover': { backgroundColor: '#f8fafc' },
              }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Webhook size={16} />}
            onClick={() => setOpenCreate(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#18181b',
              color: '#ffffff',
              px: 2.5,
              py: 1,
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Add Webhook Source
          </Button>
        </Box>

        {/* Mobile Actions View (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Webhook size={16} />}
            onClick={() => setOpenCreate(true)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#18181b',
              color: '#ffffff',
              py: 1,
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Add Webhook Source
          </Button>
        </Box>
      </Box>

      {/* Top-Right Floating Notification Alert */}
      <Snackbar
        open={Boolean(banner?.open || error)}
        autoHideDuration={5000}
        onClose={() => setBanner(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={error ? 'error' : (banner?.severity || 'info')}
          onClose={() => setBanner(null)}
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            alignItems: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: { xs: '90vw', sm: 480 },
          }}
        >
          {error || banner?.message}
        </Alert>
      </Snackbar>

      {/* Webhook Test Studio */}
      <WebhookTester sources={sources} selectedSourceId={selectedSourceId} onSelectSource={setSelectedSourceId} />

      {/* Webhook Sources List */}
      <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.35rem' }, color: '#0f172a', mb: 2 }}>
        Active Webhook Endpoints ({sources.length})
      </Typography>

      {loading && sources.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : sources.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>No webhook sources configured</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Click "+ Add Webhook Source" to connect marketing portals.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {sources.map((src) => {
            const id = src._id || src.id;
            const fullUrl = `${window.location.origin.replace('5173', '5000')}/api/integrations/webhook/${id}`;
            const isActive = src.status === 'active';

            return (
              <Paper
                key={id}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                {/* Top Row: Source Info & Status Chip */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#eff6ff' : '#f8fafc',
                        color: isActive ? '#2563eb' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Radio size={18} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                          {src.name}
                        </Typography>
                        <Chip
                          label={src.provider ? src.provider.toUpperCase() : 'CUSTOM'}
                          size="small"
                          sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#475569' }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Chip
                    label={isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      backgroundColor: isActive ? '#ecfdf5' : '#fef2f2',
                      color: isActive ? '#059669' : '#dc2626',
                    }}
                  />
                </Box>

                {/* URL Code Block (Responsive with word break & copy) */}
                <Box
                  sx={{
                    my: 1.5,
                    p: { xs: 1.25, sm: 1.5 },
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    minWidth: 0,
                    width: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                    <Chip
                      label="POST"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        color: '#334155',
                        fontWeight: 600,
                        fontSize: { xs: '0.72rem', sm: '0.8rem' },
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                        minWidth: 0,
                      }}
                    >
                      {fullUrl}
                    </Typography>
                  </Box>

                  <Tooltip title={copiedId === id ? 'Copied URL!' : 'Copy Webhook URL'}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopyUrl(id)}
                      sx={{
                        flexShrink: 0,
                        p: 0.75,
                        backgroundColor: copiedId === id ? '#ecfdf5' : '#ffffff',
                        border: '1px solid',
                        borderColor: copiedId === id ? '#bbf7d0' : '#cbd5e1',
                      }}
                    >
                      {copiedId === id ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#64748b" />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Footer: Stats & Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: { xs: 1.25, sm: 2 },
                    pt: 1,
                    borderTop: '1px dashed #e2e8f0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem' }}>
                      {src.totalLeadsIngested ?? 0} Ingested
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>&bull;</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Last: {src.lastPayloadReceivedAt ? new Date(src.lastPayloadReceivedAt).toLocaleTimeString() : 'Never'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-end', sm: 'flex-end' }, gap: 1 }}>
                    <Tooltip title="Edit Source">
                      <IconButton
                        size="small"
                        onClick={() => setEditingSource(src)}
                        sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5, p: 0.75, color: '#475569', '&:hover': { backgroundColor: '#f8fafc' } }}
                      >
                        <Edit3 size={15} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Source">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeletingSource(src)}
                        sx={{ border: '1px solid #fee2e2', borderRadius: 1.5, p: 0.75, color: '#dc2626', '&:hover': { backgroundColor: '#fef2f2' } }}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </Tooltip>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 0.75, borderLeft: '1px solid #e2e8f0' }}>
                      <Tooltip title={isActive ? 'Deactivate endpoint' : 'Activate endpoint'}>
                        <Switch size="small" checked={isActive} onChange={() => handleToggle(src)} color="primary" />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}

      <SourceFormDialog open={openCreate} onClose={() => setOpenCreate(false)} initialData={null} onSubmit={handleCreateSubmit} submitting={submitting} />
      <SourceFormDialog open={Boolean(editingSource)} onClose={() => setEditingSource(null)} initialData={editingSource} onSubmit={handleEditSubmit} submitting={submitting} />
      <DeleteConfirmDialog open={Boolean(deletingSource)} onClose={() => setDeletingSource(null)} onConfirm={handleDeleteConfirm} source={deletingSource} deleting={submitting} />
      <WebhookCreatedDialog
        open={Boolean(latestGeneratedKey)}
        webhookData={latestGeneratedKey}
        onClose={() => dispatch(clearLatestGeneratedKey())}
      />
    </DashboardLayout>
  );
};

export default IntegrationsPage;
