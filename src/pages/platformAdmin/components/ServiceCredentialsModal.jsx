import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Alert, CircularProgress,
  IconButton, InputAdornment, MenuItem, FormControlLabel, Switch, Stack,
} from '@mui/material';
import { Database, Zap, Mail, Lock, Eye, EyeOff, Server, RefreshCw } from 'lucide-react';

export default function ServiceCredentialsModal({
  isOpen, onClose, serviceType, currentHealth, onTest, onSave, loading,
}) {
  const [dbForm, setDbForm] = useState({ mongoUri: '' });
  const [redisForm, setRedisForm] = useState({ redisUrl: '' });
  const [smtpForm, setSmtpForm] = useState({
    service: 'gmail', host: 'smtp.gmail.com', port: 587, secure: false, user: '', pass: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (currentHealth) {
      if (serviceType === 'database') setDbForm({ mongoUri: currentHealth.database?.rawUri || '' });
      else if (serviceType === 'redis') setRedisForm({ redisUrl: currentHealth.redis?.rawUrl || '' });
      else if (serviceType === 'smtp') {
        setSmtpForm({
          service: currentHealth.smtp?.service || 'gmail',
          host: currentHealth.smtp?.host || 'smtp.gmail.com',
          port: currentHealth.smtp?.port || 587,
          secure: Boolean(currentHealth.smtp?.secure),
          user: currentHealth.smtp?.user || '',
          pass: '',
        });
      }
    }
    setTestResult(null);
  }, [serviceType, currentHealth, isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const p = serviceType === 'database' ? dbForm : (serviceType === 'redis' ? redisForm : smtpForm);
    const res = await onTest(serviceType, p);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const p = serviceType === 'database' ? dbForm : (serviceType === 'redis' ? redisForm : smtpForm);
    const res = await onSave(serviceType, p);
    if (res?.success) onClose();
    else setTestResult({ success: false, message: res?.error || 'Failed to save configuration.' });
  };

  const info = serviceType === 'database'
    ? { title: 'MongoDB Credentials', subtitle: 'Update database connection string URI & credentials', icon: <Database size={22} />, color: '#059669', bg: '#ecfdf5' }
    : serviceType === 'redis'
    ? { title: 'Redis Cache Configuration', subtitle: 'Set REDIS_URL for cache cluster or leave blank for memory mode', icon: <Zap size={22} />, color: '#d97706', bg: '#fffbeb' }
    : { title: 'SMTP Email Configuration', subtitle: 'Setup Gmail App Password or custom SMTP relay credentials', icon: <Mail size={22} />, color: '#4f46e5', bg: '#eef2ff' };

  return (
    <Dialog open={isOpen} onClose={loading || testing ? undefined : onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <form onSubmit={handleSave}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, backgroundColor: info.bg, color: info.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {info.icon}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>{info.title}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>{info.subtitle}</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {testResult && (
              <Alert severity={testResult.success ? 'success' : 'error'} sx={{ borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{testResult.message}</Typography>
                {testResult.latencyMs > 0 && <Typography variant="caption" sx={{ display: 'block', opacity: 0.85 }}>Latency: {testResult.latencyMs}ms</Typography>}
              </Alert>
            )}

            {serviceType === 'database' && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>MongoDB Connection URI *</Typography>
                <TextField fullWidth required placeholder="mongodb://127.0.0.1:27017/leadflow" value={dbForm.mongoUri} onChange={(e) => setDbForm({ mongoUri: e.target.value })} disabled={loading || testing} />
              </Box>
            )}

            {serviceType === 'redis' && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>Redis Connection URL</Typography>
                <TextField fullWidth placeholder="rediss://default:password@eu-central-1.upstash.io:6379" value={redisForm.redisUrl} onChange={(e) => setRedisForm({ redisUrl: e.target.value })} disabled={loading || testing} />
              </Box>
            )}
            {serviceType === 'smtp' && (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>Service</Typography>
                    <TextField select fullWidth value={smtpForm.service} onChange={(e) => setSmtpForm({ ...smtpForm, service: e.target.value })} disabled={loading || testing}>
                      <MenuItem value="gmail">Gmail / Google Workspace</MenuItem>
                      <MenuItem value="custom">Custom SMTP Server</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>Port</Typography>
                    <TextField fullWidth type="number" value={smtpForm.port} onChange={(e) => setSmtpForm({ ...smtpForm, port: Number(e.target.value) })} disabled={loading || testing || smtpForm.service === 'gmail'} />
                  </Box>
                </Box>
                {smtpForm.service === 'custom' && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>SMTP Host *</Typography>
                    <TextField fullWidth required placeholder="mail.leadflow.de" value={smtpForm.host} onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })} disabled={loading || testing} />
                  </Box>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>User / Email *</Typography>
                    <TextField fullWidth required type="email" placeholder="notifications@leadflow.de" value={smtpForm.user} onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })} disabled={loading || testing} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75, fontSize: '0.85rem' }}>Password / App Password</Typography>
                    <TextField fullWidth type={showPass ? 'text' : 'password'} placeholder={currentHealth?.smtp?.hasPass ? '••••••••••••••••' : 'Enter password'} value={smtpForm.pass} onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })} disabled={loading || testing} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass((p) => !p)} size="small">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</IconButton></InputAdornment> } }} />
                  </Box>
                </Box>
                <FormControlLabel control={<Switch checked={smtpForm.secure} onChange={(e) => setSmtpForm({ ...smtpForm, secure: e.target.checked })} disabled={loading || testing} />} label={<Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>Enable Secure SSL/TLS</Typography>} />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleTest} disabled={loading || testing} startIcon={<RefreshCw size={16} className={testing ? 'animate-spin' : ''} />} sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose} disabled={loading || testing} sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading || testing} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null} sx={{ fontWeight: 800, borderRadius: 2, px: 3, textTransform: 'none', backgroundColor: info.color, '&:hover': { opacity: 0.9 } }}>
              {loading ? 'Saving...' : 'Save & Reload'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}

