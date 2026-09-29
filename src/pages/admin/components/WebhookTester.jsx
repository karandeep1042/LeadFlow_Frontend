import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem,
  Alert, CircularProgress, Chip, Stack, Divider,
} from '@mui/material';
import { Play, CheckCircle2, AlertTriangle, FileCode2, Zap } from 'lucide-react';
import { testWebhookPayload } from '../../../redux/thunks/integrationThunk';

const PRESETS = {
  immoscout: {
    name: 'Immobilienscout24 (German Expat Inquiry)',
    payload: {
      first_name: 'Raj',
      last_name: 'Patel',
      email: 'raj.patel.berlin@gmail.com',
      phone: '+49 170 1234567',
      loan_amount: 420000,
      city: 'Berlin - Mitte',
      visa_type: 'EU Blue Card',
      notes: 'Looking for 10-year fixed rate mortgage.',
    },
  },
  typeform: {
    name: 'Typeform (Pre-Qual Funnel)',
    payload: {
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.rostova@techcorp.de',
      phone: '+49 176 9876543',
      loanAmount: 350000,
      city: 'Frankfurt',
      visaType: 'Permanent Residence',
      notes: 'Equity deposit: €70,000.',
    },
  },
};

export const WebhookTester = ({ sources, selectedSourceId, onSelectSource }) => {
  const dispatch = useDispatch();
  const { testRunnerLoading, testRunnerResult } = useSelector((state) => state.integration);
  const [presetKey, setPresetKey] = useState('immoscout');
  const [jsonText, setJsonText] = useState(JSON.stringify(PRESETS.immoscout.payload, null, 2));
  const [error, setError] = useState('');

  const handlePresetSelect = (key) => {
    setPresetKey(key);
    setJsonText(JSON.stringify(PRESETS[key].payload, null, 2));
    setError('');
  };

  const runTest = (dryRun) => {
    if (!selectedSourceId) return setError('Please select a target webhook source.');
    try {
      const parsed = JSON.parse(jsonText);
      setError('');
      dispatch(testWebhookPayload({ sourceId: selectedSourceId, payload: parsed, dryRun }));
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.75, md: 3.25 },
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        mb: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Zap size={18} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '1.05rem', sm: '1.2rem' },
              lineHeight: 1.25,
            }}
          >
            Live Ingestion Test Studio
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              mt: 0.25,
            }}
          >
            Simulate portal webhook payloads and verify field mapping in real time.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.75, borderColor: '#f1f5f9' }} />

      <Stack spacing={2}>
        {/* Source & Preset Dropdowns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <TextField
            select
            label="Target Source"
            value={selectedSourceId || ''}
            onChange={(e) => onSelectSource(e.target.value)}
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' } }}
          >
            {sources.map((s) => (
              <MenuItem key={s._id || s.id} value={s._id || s.id}>
                {s.name} ({s.provider})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Sample Preset"
            value={presetKey}
            onChange={(e) => handlePresetSelect(e.target.value)}
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' } }}
          >
            <MenuItem value="immoscout">{PRESETS.immoscout.name}</MenuItem>
            <MenuItem value="typeform">{PRESETS.typeform.name}</MenuItem>
          </TextField>
        </Box>

        {/* JSON Editor Header Strip */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <FileCode2 size={15} style={{ color: '#64748b' }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.72rem',
                }}
              >
                JSON Payload (POST Body)
              </Typography>
            </Box>
            <Chip
              label="application/json"
              size="small"
              sx={{ height: 18, fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b' }}
            />
          </Box>

          <TextField
            multiline
            rows={7}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              if (error) setError('');
            }}
            fullWidth
            slotProps={{
              input: {
                sx: {
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: { xs: '0.78rem', sm: '0.82rem' },
                  lineHeight: 1.5,
                  backgroundColor: '#0f172a',
                  color: '#38bdf8',
                  borderRadius: 2.5,
                  p: { xs: 1.5, sm: 2 },
                  '& textarea': {
                    color: '#38bdf8',
                  },
                  '& fieldset': { borderColor: '#1e293b' },
                  '&:hover fieldset': { borderColor: '#334155' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
              },
            }}
          />
        </Box>
        {error && (
          <Alert severity="error" icon={<AlertTriangle size={18} />} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Action Buttons (Stacked on mobile, side-by-side on tablet/desktop) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.25, sm: 2 },
            pt: 0.5,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Play size={15} />}
            onClick={() => runTest(true)}
            disabled={testRunnerLoading || !selectedSourceId}
            fullWidth
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              py: { xs: 1, sm: 1.15 },
              fontSize: { xs: '0.825rem', sm: '0.875rem' },
              borderColor: '#cbd5e1',
              color: '#334155',
              flex: { sm: 1 },
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#94a3b8' },
            }}
          >
            Dry Run (Validate Only)
          </Button>

          <Button
            variant="contained"
            startIcon={testRunnerLoading ? <CircularProgress size={15} color="inherit" /> : <Zap size={15} />}
            onClick={() => runTest(false)}
            disabled={testRunnerLoading || !selectedSourceId}
            fullWidth
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              py: { xs: 1, sm: 1.15 },
              fontSize: { xs: '0.825rem', sm: '0.875rem' },
              backgroundColor: '#2563eb',
              color: '#ffffff',
              flex: { sm: 1 },
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Live Ingest (Save to CRM)
          </Button>
        </Box>

        {/* Test Result Display */}
        {testRunnerResult && (
          <Box
            sx={{
              p: { xs: 1.75, sm: 2 },
              borderRadius: 2.5,
              backgroundColor: testRunnerResult.success !== false ? '#f0fdf4' : '#fef2f2',
              border: '1px solid',
              borderColor: testRunnerResult.success !== false ? '#bbf7d0' : '#fecaca',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {testRunnerResult.success !== false ? (
                <CheckCircle2 size={18} color="#16a34a" />
              ) : (
                <AlertTriangle size={18} color="#dc2626" />
              )}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: testRunnerResult.success !== false ? '#15803d' : '#b91c1c',
                  fontSize: '0.875rem',
                }}
              >
                {testRunnerResult.dryRun ? 'Dry Run Validation Completed' : 'Lead Ingested into Database!'}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: { xs: '0.72rem', sm: '0.78rem' },
                maxHeight: 160,
                overflow: 'auto',
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(testRunnerResult.parsedLead || testRunnerResult.lead || testRunnerResult, null, 2)}
              </pre>
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default WebhookTester;
