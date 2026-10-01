import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import {
  Key,
  Copy,
  Check,
  Globe,
  Terminal,
  FileCode2,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const WebhookCreatedDialog = ({ open, webhookData, onClose }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  if (!webhookData) return null;

  const { rawApiKey, webhookUrl, sourceName } = webhookData;

  const handleCopyKey = () => {
    if (rawApiKey) {
      navigator.clipboard.writeText(rawApiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  const handleCopyUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };
  const curlSnippet = `curl -X POST "${webhookUrl || 'http://localhost:5000/api/integrations/webhook/SOURCE_ID'}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${rawApiKey || 'YOUR_SECRET_API_KEY'}" \\
  -d '{
    "firstName": "Marcus",
    "lastName": "Vance",
    "email": "marcus.vance@expatberlin.com",
    "phone": "+49 151 23456789",
    "loanAmount": 520000,
    "city": "Munich"
  }'`;

  const nodeSnippet = `await fetch("${webhookUrl || 'http://localhost:5000/api/integrations/webhook/SOURCE_ID'}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${rawApiKey || 'YOUR_SECRET_API_KEY'}"
  },
  body: JSON.stringify({
    firstName: "Marcus",
    lastName: "Vance",
    email: "marcus.vance@expatberlin.com",
    loanAmount: 520000
  })
});`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          p: { xs: 1, sm: 2 },
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2.5,
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={24} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Webhook Configured: {sourceName || 'New Webhook Source'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Your dedicated inbound mortgage ingestion endpoint is active and ready to receive leads.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1.5 }}>
        {/* Security Alert Warning */}
        <Alert
          severity="warning"
          icon={<ShieldAlert size={22} />}
          sx={{
            borderRadius: 2.5,
            border: '1px solid #fed7aa',
            backgroundColor: '#fffbeb',
            color: '#9a3412',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9a3412', mb: 0.25 }}>
            Save this Secret API Key now — it will only be shown once!
          </Typography>
          <Typography variant="caption" sx={{ color: '#b45309', display: 'block', lineHeight: 1.4 }}>
            For maximum security, LeadFlow hashes this key with SHA-256 and never stores the plaintext in our database.
            Once you close this dialog, you will <strong>not</strong> be able to view or copy this key again.
          </Typography>
        </Alert>

        {/* Credentials Box */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Webhook Endpoint URL */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Inbound Webhook URL (POST Endpoint)
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Target destination in external platforms
              </Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 1.25,
                px: 1.75,
                borderRadius: 2.5,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                <Globe size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    color: '#0f172a',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {webhookUrl}
                </Typography>
              </Box>
              <Tooltip title={copiedUrl ? 'Copied URL!' : 'Copy Webhook URL'}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCopyUrl}
                  startIcon={copiedUrl ? <Check size={14} /> : <Copy size={14} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderColor: copiedUrl ? '#10b981' : '#cbd5e1',
                    color: copiedUrl ? '#10b981' : '#334155',
                    backgroundColor: copiedUrl ? '#f0fdf4' : '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {copiedUrl ? 'Copied' : 'Copy URL'}
                </Button>
              </Tooltip>
            </Paper>
          </Box>

          {/* Secret API Key */}
          {rawApiKey && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Secret API Key
                </Typography>
                <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700, fontSize: '0.75rem' }}>
                  Pass via header: <code style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>x-api-key</code>
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 1.25,
                  px: 1.75,
                  borderRadius: 2.5,
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                  <Key size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: '#38bdf8',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {rawApiKey}
                  </Typography>
                </Box>
                <Tooltip title={copiedKey ? 'Copied Secret Key!' : 'Copy Secret API Key'}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleCopyKey}
                    startIcon={copiedKey ? <Check size={14} /> : <Copy size={14} />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      backgroundColor: copiedKey ? '#10b981' : '#38bdf8',
                      color: copiedKey ? '#ffffff' : '#0f172a',
                      '&:hover': {
                        backgroundColor: copiedKey ? '#059669' : '#0ea5e9',
                      },
                      flexShrink: 0,
                    }}
                  >
                    {copiedKey ? 'Copied' : 'Copy Key'}
                  </Button>
                </Tooltip>
              </Paper>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Integration Instructions & Code Snippets */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            How to configure your platform:
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            sx={{
              minHeight: 36,
              mb: 1.5,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                minHeight: 36,
                py: 0.5,
              },
            }}
          >
            <Tab icon={<Zap size={14} />} iconPosition="start" label="Zapier / Make Setup" />
            <Tab icon={<Terminal size={14} />} iconPosition="start" label="cURL Command" />
            <Tab icon={<FileCode2 size={14} />} iconPosition="start" label="Node.js / Fetch" />
          </Tabs>

          {/* Zapier Guide */}
          {tabIndex === 0 && (
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', minWidth: 18 }}>1.</Typography>
                  <Typography variant="caption" sx={{ color: '#334155' }}>
                    In Zapier, add action <strong>"Webhooks by Zapier"</strong> and select <strong>"POST"</strong>.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', minWidth: 18 }}>2.</Typography>
                  <Typography variant="caption" sx={{ color: '#334155' }}>
                    Set <strong>URL</strong> to the Webhook URL above and <strong>Payload Type</strong> to <code>JSON</code>.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', minWidth: 18 }}>3.</Typography>
                  <Typography variant="caption" sx={{ color: '#334155' }}>
                    Under <strong>Headers</strong>, add custom header:
                    <br />
                    Header Name: <code style={{ fontWeight: 700, color: '#0f172a', backgroundColor: '#e2e8f0', padding: '2px 5px', borderRadius: '4px' }}>x-api-key</code>
                    &nbsp;&nbsp;→&nbsp;&nbsp;
                    Value: <code style={{ color: '#2563eb', backgroundColor: '#e2e8f0', padding: '2px 5px', borderRadius: '4px' }}>{rawApiKey || 'YOUR_SECRET_API_KEY'}</code>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', minWidth: 18 }}>4.</Typography>
                  <Typography variant="caption" sx={{ color: '#334155' }}>
                    Map your lead payload attributes (<code>firstName</code>, <code>lastName</code>, <code>email</code>, <code>phone</code>, <code>loanAmount</code>).
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          {/* cURL Snippet */}
          {tabIndex === 1 && (
            <Paper elevation={0} sx={{ p: 1.75, borderRadius: 2.5, backgroundColor: '#090d16', border: '1px solid #1e293b', position: 'relative' }}>
              <Tooltip title={copiedCurl ? 'Copied command!' : 'Copy cURL command'}>
                <IconButton
                  size="small"
                  onClick={handleCopyCurl}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: copiedCurl ? '#10b981' : '#94a3b8',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                  }}
                >
                  {copiedCurl ? <Check size={14} /> : <Copy size={14} />}
                </IconButton>
              </Tooltip>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#e2e8f0',
                  margin: 0,
                  overflowX: 'auto',
                  lineHeight: 1.5,
                  pr: 4,
                }}
              >
                {curlSnippet}
              </Typography>
            </Paper>
          )}

          {/* Node.js Snippet */}
          {tabIndex === 2 && (
            <Paper elevation={0} sx={{ p: 1.75, borderRadius: 2.5, backgroundColor: '#090d16', border: '1px solid #1e293b' }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: '#e2e8f0',
                  margin: 0,
                  overflowX: 'auto',
                  lineHeight: 1.5,
                }}
              >
                {nodeSnippet}
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform: 'none',
            backgroundColor: '#18181b',
            color: '#ffffff',
            px: 3,
            py: 1.1,
            '&:hover': { backgroundColor: '#09090b' },
          }}
        >
          I have copied and saved my Secret Key
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebhookCreatedDialog;
