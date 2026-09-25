import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Stack, Alert,
  CircularProgress, IconButton, Tooltip, Switch,
} from '@mui/material';
import { Webhook, Radio, Copy, Check, Edit3, Trash2, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WebhookTester from './components/WebhookTester';
import SourceFormDialog from './components/SourceFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
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
  const [banner, setBanner] = useState('');

  useEffect(() => {
    dispatch(fetchIngestionSources());
  }, [dispatch]);

  useEffect(() => {
    if (sources.length > 0 && !selectedSourceId) {
      setSelectedSourceId(sources[0]._id || sources[0].id);
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
      setBanner('Webhook source created successfully!');
      setTimeout(() => setBanner(''), 5000);
    } catch (err) {
      console.error(err);
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
      setBanner('Webhook source updated successfully!');
      setTimeout(() => setBanner(''), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await dispatch(deleteIngestionSource(deletingSource._id || deletingSource.id)).unwrap();
      setDeletingSource(null);
      setBanner('Webhook source deleted.');
      setTimeout(() => setBanner(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = (source) => {
    const nextStatus = source.status === 'active' ? 'inactive' : 'active';
    dispatch(toggleSourceStatus({ sourceId: source._id || source.id, status: nextStatus }));
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' } }}>
            Lead Ingestion & Webhooks
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Configure inbound REST endpoints to ingest expat leads from marketing portals automatically.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" onClick={() => dispatch(fetchIngestionSources())} disabled={loading} startIcon={<RefreshCw size={16} />} sx={{ borderRadius: 2.5, borderColor: '#cbd5e1', color: '#475569' }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Webhook size={16} />} onClick={() => setOpenCreate(true)} sx={{ borderRadius: 2.5, fontWeight: 700, backgroundColor: '#18181b', color: '#ffffff' }}>
            + Add Webhook Source
          </Button>
        </Box>
      </Box>

      {banner && <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }} onClose={() => setBanner('')}>{banner}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{error}</Alert>}

      {latestGeneratedKey && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5 }} onClose={() => dispatch(clearLatestGeneratedKey())}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>New Webhook Configured: {latestGeneratedKey.sourceName}</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>URL: {latestGeneratedKey.webhookUrl}</Typography>
          {latestGeneratedKey.rawApiKey && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Secret API Key: <strong>{latestGeneratedKey.rawApiKey}</strong>
            </Typography>
          )}
        </Alert>
      )}

      {/* Webhook Test Studio */}
      <WebhookTester sources={sources} selectedSourceId={selectedSourceId} onSelectSource={setSelectedSourceId} />

      {/* Webhook Sources List */}
      <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', mb: 2 }}>
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
              <Paper key={id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: isActive ? '#eff6ff' : '#f8fafc', color: isActive ? '#2563eb' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Radio size={18} />
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>{src.name}</Typography>
                        <Chip label={src.provider ? src.provider.toUpperCase() : 'CUSTOM'} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', display: 'block' }}>
                        POST {fullUrl}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' }, justifyContent: 'space-between' }}>
                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{src.totalLeadsIngested ?? 0} Ingested</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Last: {src.lastPayloadReceivedAt ? new Date(src.lastPayloadReceivedAt).toLocaleTimeString() : 'Never'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={copiedId === id ? 'Copied URL!' : 'Copy Webhook URL'}>
                        <IconButton size="small" onClick={() => handleCopyUrl(id)}>
                          {copiedId === id ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Source">
                        <IconButton size="small" onClick={() => setEditingSource(src)}><Edit3 size={16} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Source">
                        <IconButton size="small" color="error" onClick={() => setDeletingSource(src)}><Trash2 size={16} /></IconButton>
                      </Tooltip>
                      <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
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
    </DashboardLayout>
  );
};

export default IntegrationsPage;
