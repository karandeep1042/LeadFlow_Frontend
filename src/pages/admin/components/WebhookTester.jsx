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
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Live Ingestion Test Studio</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Simulate portal webhook payloads.</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1.5, borderColor: '#f1f5f9' }} />
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField select label="Target Source" value={selectedSourceId || ''} onChange={(e) => onSelectSource(e.target.value)} fullWidth size="small">
            {sources.map((s) => (
              <MenuItem key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.provider})</MenuItem>
            ))}
          </TextField>
          <TextField select label="Sample Preset" value={presetKey} onChange={(e) => handlePresetSelect(e.target.value)} fullWidth size="small">
            <MenuItem value="immoscout">{PRESETS.immoscout.name}</MenuItem>
            <MenuItem value="typeform">{PRESETS.typeform.name}</MenuItem>
          </TextField>
        </Box>
        <TextField multiline rows={5} value={jsonText} onChange={(e) => { setJsonText(e.target.value); if (error) setError(''); }} fullWidth InputProps={{ sx: { fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#0f172a', color: '#38bdf8', borderRadius: 2 } }} />
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => runTest(true)} disabled={testRunnerLoading || !selectedSourceId} sx={{ borderRadius: 2, fontWeight: 700 }}>Dry Run (Validate Only)</Button>
          <Button variant="contained" onClick={() => runTest(false)} disabled={testRunnerLoading || !selectedSourceId} sx={{ borderRadius: 2, fontWeight: 700, backgroundColor: '#2563eb', color: '#fff' }}>Live Ingest (Save to CRM)</Button>
        </Box>
        {testRunnerResult && (
          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: testRunnerResult.success !== false ? '#f0fdf4' : '#fef2f2', border: '1px solid #bbf7d0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: testRunnerResult.success !== false ? '#15803d' : '#b91c1c' }}>
              {testRunnerResult.dryRun ? 'Dry Run Completed' : 'Lead Ingested into Database!'}
            </Typography>
            <Box sx={{ p: 1, mt: 1, backgroundColor: '#ffffff', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.75rem', maxHeight: 110, overflow: 'auto' }}>
              <pre style={{ margin: 0 }}>{JSON.stringify(testRunnerResult.parsedLead || testRunnerResult.lead || testRunnerResult, null, 2)}</pre>
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default WebhookTester;
