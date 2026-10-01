import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Alert, Chip, Stack,
  Table, TableHead, TableBody, TableRow, TableCell, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab,
} from '@mui/material';
import {
  Zap, Mail, RefreshCw, Sliders, Activity, RotateCcw,
  Trash2, AlertTriangle, CheckCircle, Layers,
} from 'lucide-react';
import {
  fetchPlatformHealth,
  testPlatformService,
  updatePlatformCredentials,
  fetchEmailQueueItems,
  flushEmailQueueThunk,
  retryEmailQueueJob,
  retryAllEmailQueueJobs,
  deleteEmailQueueJob,
} from '../../../redux/thunks/tenantThunk';
import ServiceCredentialsModal from './ServiceCredentialsModal';
import EmailQueueModal from './EmailQueueModal';

export default function SmtpDiagnosticsCard() {
  const dispatch = useDispatch();
  const platformHealth = useSelector((state) => state.tenant?.platformHealth);
  const emailQueue = useSelector((state) => state.tenant?.emailQueue);

  const [loading, setLoading] = useState(false);
  const [testingService, setTestingService] = useState(null);
  const [diagnosticNotice, setDiagnosticNotice] = useState(null);
  const [configModal, setConfigModal] = useState({ open: false, service: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Email Queue & DLQ Modal State
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queueFilterStatus, setQueueFilterStatus] = useState('all');
  const [queueActionLoading, setQueueActionLoading] = useState(false);

  useEffect(() => {
    loadHealth();
  }, [dispatch]);

  const loadHealth = async () => {
    setLoading(true);
    await Promise.all([
      dispatch(fetchPlatformHealth()),
      dispatch(fetchEmailQueueItems({ limit: 50 })),
    ]);
    setLoading(false);
  };

  const handleTestService = async (serviceType, customPayload) => {
    setTestingService(serviceType);
    const res = await dispatch(testPlatformService({ type: serviceType, payload: customPayload }));
    setTestingService(null);
    if (testPlatformService.fulfilled.match(res)) {
      const msg = res.payload.message || `${serviceType.toUpperCase()} test succeeded.`;
      setDiagnosticNotice({ success: true, service: serviceType, message: msg, latencyMs: res.payload.latencyMs });
      dispatch(fetchPlatformHealth());
      return { success: true, message: msg, latencyMs: res.payload.latencyMs };
    } else {
      const errMsg = res.payload || `${serviceType.toUpperCase()} connection test failed.`;
      setDiagnosticNotice({ success: false, service: serviceType, message: errMsg });
      return { success: false, message: errMsg };
    }
  };

  const handleSaveCredentials = async (serviceType, payload) => {
    setActionLoading(true);
    const res = await dispatch(updatePlatformCredentials({ type: serviceType, payload }));
    setActionLoading(false);
    if (updatePlatformCredentials.fulfilled.match(res)) {
      setDiagnosticNotice({ success: true, service: serviceType, message: res.payload.message });
      dispatch(fetchPlatformHealth());
      return { success: true };
    } else {
      return { success: false, error: res.payload || 'Failed to update credentials.' };
    }
  };

  const handleFlushQueue = async () => {
    setQueueActionLoading(true);
    const res = await dispatch(flushEmailQueueThunk());
    setQueueActionLoading(false);
    if (flushEmailQueueThunk.fulfilled.match(res)) {
      setDiagnosticNotice({ success: true, message: res.payload?.message || 'Email queue flush triggered.' });
      dispatch(fetchEmailQueueItems({ limit: 50, status: queueFilterStatus === 'all' ? undefined : queueFilterStatus }));
      dispatch(fetchPlatformHealth());
    } else {
      setDiagnosticNotice({ success: false, message: res.payload || 'Failed to flush email queue.' });
    }
  };

  const handleRetryJob = async (jobId) => {
    setQueueActionLoading(true);
    const res = await dispatch(retryEmailQueueJob(jobId));
    setQueueActionLoading(false);
    if (retryEmailQueueJob.fulfilled.match(res)) {
      setDiagnosticNotice({ success: true, message: res.payload?.message || 'Job scheduled for immediate retry.' });
      dispatch(fetchEmailQueueItems({ limit: 50, status: queueFilterStatus === 'all' ? undefined : queueFilterStatus }));
      dispatch(fetchPlatformHealth());
    } else {
      setDiagnosticNotice({ success: false, message: res.payload || 'Failed to retry email job.' });
    }
  };

  const handleRetryAllFailed = async () => {
    setQueueActionLoading(true);
    const res = await dispatch(retryAllEmailQueueJobs());
    setQueueActionLoading(false);
    if (retryAllEmailQueueJobs.fulfilled.match(res)) {
      setDiagnosticNotice({ success: true, message: res.payload?.message || 'All failed emails scheduled for retry.' });
      dispatch(fetchEmailQueueItems({ limit: 50, status: queueFilterStatus === 'all' ? undefined : queueFilterStatus }));
      dispatch(fetchPlatformHealth());
    } else {
      setDiagnosticNotice({ success: false, message: res.payload || 'Failed to retry DLQ jobs.' });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this queue item?')) return;
    setQueueActionLoading(true);
    const res = await dispatch(deleteEmailQueueJob(jobId));
    setQueueActionLoading(false);
    if (deleteEmailQueueJob.fulfilled.match(res)) {
      setDiagnosticNotice({ success: true, message: 'Queue item deleted.' });
      dispatch(fetchEmailQueueItems({ limit: 50, status: queueFilterStatus === 'all' ? undefined : queueFilterStatus }));
      dispatch(fetchPlatformHealth());
    } else {
      setDiagnosticNotice({ success: false, message: res.payload || 'Failed to delete job.' });
    }
  };

  const handleFilterChange = (_, newStatus) => {
    setQueueFilterStatus(newStatus);
    dispatch(fetchEmailQueueItems({ limit: 50, status: newStatus === 'all' ? undefined : newStatus }));
  };

  const redis = platformHealth?.redis;
  const smtp = platformHealth?.smtp;
  const queueCounts = emailQueue?.counts || platformHealth?.emailQueue?.counts || { pending: 0, processing: 0, sent: 0, failed: 0, total: 0 };
  const queueItems = emailQueue?.items || platformHealth?.emailQueue?.recentItems || [];
  const failedCount = queueCounts.failed || 0;

  const renderCard = (title, icon, color, bg, chipLabel, chipColor, chipBg, metrics, testKey, testLabel, testColor, testBorder, onConfigClick) => (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 2, backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{title}</Typography>
          </Box>
          <Chip label={chipLabel} size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', backgroundColor: chipBg, color: chipColor }} />
        </Box>
        <Stack spacing={1} sx={{ backgroundColor: '#f8fafc', p: 1.5, borderRadius: 2, border: '1px solid #f1f5f9' }}>
          {metrics.map((m, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{m.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: m.bold ? 800 : 700, color: m.color || '#0f172a', fontFamily: m.mono ? 'monospace' : 'inherit' }}>{m.value}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid #f1f5f9' }}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={() => (testKey === 'queue' ? handleFlushQueue() : handleTestService(testKey))}
          disabled={testingService === testKey || (testKey === 'queue' && queueActionLoading)}
          startIcon={<RefreshCw size={14} className={(testingService === testKey || (testKey === 'queue' && queueActionLoading)) ? 'animate-spin' : ''} />}
          sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', color: testColor, borderColor: testBorder }}
        >
          {testingService === testKey ? 'Testing...' : testLabel}
        </Button>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={onConfigClick || (() => setConfigModal({ open: true, service: testKey }))}
          startIcon={<Sliders size={14} />}
          sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', backgroundColor: '#0f172a' }}
        >
          {testKey === 'queue' ? 'Inspect' : 'Config'}
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2.5, backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Platform Infrastructure & Diagnostics</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Live health verification, latency diagnostics, and credentials configuration.</Typography>
          </Box>
        </Box>
        <Button variant="outlined" onClick={loadHealth} disabled={loading} startIcon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }}>
          Refresh Status
        </Button>
      </Box>

      {diagnosticNotice && (
        <Alert severity={diagnosticNotice.success ? 'success' : 'error'} onClose={() => setDiagnosticNotice(null)} sx={{ borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{diagnosticNotice.message}</Typography>
          {diagnosticNotice.latencyMs !== undefined && <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>Latency: {diagnosticNotice.latencyMs}ms</Typography>}
        </Alert>
      )}

      {/* 3 Infrastructure Cards: Redis Cache, SMTP Relay & Email Retry Queue (DLQ) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
        {renderCard(
          'Redis Cache', <Zap size={18} />, '#d97706', '#fffbeb',
          redis?.status === 'connected' ? 'Connected' : 'In-Memory',
          redis?.status === 'connected' ? '#059669' : '#b45309',
          redis?.status === 'connected' ? '#ecfdf5' : '#fef3c7',
          [
            { label: 'Host Name', value: redis?.hostName || (redis?.status === 'connected' ? (redis?.host || 'Redis Active Instance') : 'In-Memory Fallback'), bold: true },
            { label: 'Keys Stored', value: `${redis?.keyCount || 0} keys` },
            { label: 'Ping Latency', value: `${redis?.latencyMs || 0} ms`, color: '#d97706', bold: true },
          ],
          'redis', 'Test Ping', '#d97706', '#fde68a'
        )}

        {renderCard(
          'SMTP Relay', <Mail size={18} />, '#4f46e5', '#eef2ff',
          smtp?.status === 'connected' ? 'Verified' : (smtp?.status === 'mock_ethereal' ? 'Ethereal Mock' : 'Offline'),
          smtp?.status === 'connected' ? '#059669' : '#4f46e5',
          smtp?.status === 'connected' ? '#ecfdf5' : '#eef2ff',
          [
            { label: 'Host', value: smtp?.host || 'smtp.gmail.com', mono: true },
            { label: 'Sender User', value: smtp?.user || 'Mock' },
            { label: 'Verify Latency', value: `${smtp?.latencyMs || 0} ms`, color: '#4f46e5', bold: true },
          ],
          'smtp', 'Test SMTP', '#4f46e5', '#c7d2fe'
        )}

        {renderCard(
          'Email Queue & DLQ', <Layers size={18} />, '#0284c7', '#f0f9ff',
          failedCount > 0 ? `${failedCount} DLQ Alert` : (queueCounts.pending > 0 ? `${queueCounts.pending} Pending` : 'All Dispatched'),
          failedCount > 0 ? '#b91c1c' : (queueCounts.pending > 0 ? '#d97706' : '#059669'),
          failedCount > 0 ? '#fef2f2' : (queueCounts.pending > 0 ? '#fffbeb' : '#ecfdf5'),
          [
            { label: 'Pending Retries', value: `${queueCounts.pending || 0} jobs`, bold: true, color: queueCounts.pending > 0 ? '#d97706' : '#64748b' },
            { label: 'Dispatched (Sent)', value: `${queueCounts.sent || 0} emails`, color: '#059669' },
            { label: 'Dead Letter Queue', value: `${failedCount} failed`, color: failedCount > 0 ? '#b91c1c' : '#64748b', bold: true },
          ],
          'queue', 'Flush Queue', '#0284c7', '#bae6fd',
          () => setQueueModalOpen(true)
        )}
      </Box>

      {/* Email Queue & Dead Letter Queue Modal */}
      <EmailQueueModal
        open={queueModalOpen}
        onClose={() => setQueueModalOpen(false)}
        queueCounts={queueCounts}
        queueItems={queueItems}
        filterStatus={queueFilterStatus}
        onFilterChange={handleFilterChange}
        onFlush={handleFlushQueue}
        onRetryJob={handleRetryJob}
        onRetryAll={handleRetryAllFailed}
        onDeleteJob={handleDeleteJob}
        loading={queueActionLoading}
      />

      {/* Credentials Modal */}
      <ServiceCredentialsModal
        isOpen={configModal.open}
        onClose={() => setConfigModal({ open: false, service: null })}
        serviceType={configModal.service}
        currentHealth={platformHealth}
        onTest={(type, payload) => handleTestService(type, payload)}
        onSave={(type, payload) => handleSaveCredentials(type, payload)}
        loading={actionLoading}
      />
    </Paper>
  );
}

