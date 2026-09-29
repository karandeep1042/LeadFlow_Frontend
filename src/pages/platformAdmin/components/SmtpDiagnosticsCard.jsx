import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Alert, Chip, Stack,
} from '@mui/material';
import {
  Database, Zap, Mail, RefreshCw, Sliders, Activity,
} from 'lucide-react';
import {
  fetchPlatformHealth,
  testPlatformService,
  updatePlatformCredentials,
} from '../../../redux/thunks/tenantThunk';
import ServiceCredentialsModal from './ServiceCredentialsModal';

export default function SmtpDiagnosticsCard() {
  const dispatch = useDispatch();
  const platformHealth = useSelector((state) => state.tenant?.platformHealth);

  const [loading, setLoading] = useState(false);
  const [testingService, setTestingService] = useState(null);
  const [diagnosticNotice, setDiagnosticNotice] = useState(null);
  const [configModal, setConfigModal] = useState({ open: false, service: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadHealth();
  }, [dispatch]);

  const loadHealth = async () => {
    setLoading(true);
    await dispatch(fetchPlatformHealth());
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

  const db = platformHealth?.database;
  const redis = platformHealth?.redis;
  const smtp = platformHealth?.smtp;


  const renderCard = (title, icon, color, bg, chipLabel, chipColor, chipBg, metrics, testKey, testLabel, testColor, testBorder) => (
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
        <Button size="small" variant="outlined" fullWidth onClick={() => handleTestService(testKey)} disabled={testingService === testKey} startIcon={<RefreshCw size={14} className={testingService === testKey ? 'animate-spin' : ''} />} sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', color: testColor, borderColor: testBorder }}>
          {testingService === testKey ? 'Testing...' : testLabel}
        </Button>
        <Button size="small" variant="contained" fullWidth onClick={() => setConfigModal({ open: true, service: testKey })} startIcon={<Sliders size={14} />} sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', backgroundColor: '#0f172a' }}>
          Config
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

      {/* 3 Infrastructure Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
        {renderCard(
          'MongoDB Database', <Database size={18} />, '#059669', '#ecfdf5',
          db?.status === 'connected' ? 'Connected' : 'Disconnected',
          db?.status === 'connected' ? '#059669' : '#e11d48',
          db?.status === 'connected' ? '#ecfdf5' : '#fff1f2',
          [
            { label: 'Host / DB', value: db?.host ? `${db.host}/${db.databaseName}` : '127.0.0.1/leadflow', mono: true },
            { label: 'Collections', value: `${db?.collectionsCount || 0} collections` },
            { label: 'Ping Latency', value: `${db?.latencyMs || 0} ms`, color: '#059669', bold: true },
          ],
          'database', 'Test Ping', '#059669', '#a7f3d0'
        )}

        {renderCard(
          'Redis Cache', <Zap size={18} />, '#d97706', '#fffbeb',
          redis?.status === 'connected' ? 'Connected' : 'In-Memory',
          redis?.status === 'connected' ? '#059669' : '#b45309',
          redis?.status === 'connected' ? '#ecfdf5' : '#fef3c7',
          [
            { label: 'Cache Mode', value: redis?.mode || 'In-Memory Fallback' },
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
      </Box>

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

