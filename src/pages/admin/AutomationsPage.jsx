import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Stack, Alert, CircularProgress, Chip, Button,
} from '@mui/material';
import { Zap, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StageTriggerCard from './components/StageTriggerCard';
import AutomationEditModal from './components/AutomationEditModal';
import EmailPreviewModal from './components/EmailPreviewModal';
import {
  fetchStageTriggers,
  updateStageTrigger,
  toggleTriggerStatus,
} from '../../redux/thunks/automationThunk';
import { clearAutomationError } from '../../redux/slices/automationSlice';

export const AutomationsPage = () => {
  const dispatch = useDispatch();
  const { triggers, loading, error } = useSelector((state) => state.automation);

  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [previewTrigger, setPreviewTrigger] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchStageTriggers());
  }, [dispatch]);

  const handleToggleStatus = async (trigger) => {
    const newStatus = !(trigger.isActive !== undefined ? trigger.isActive : true);
    try {
      await dispatch(
        toggleTriggerStatus({
          triggerId: trigger._id || trigger.id,
          isActive: newStatus,
        })
      ).unwrap();
      setSuccessMsg(`Stage ${trigger.stage} trigger ${newStatus ? 'activated' : 'paused'} successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      // Handled via redux error
    }
  };

  const handleOpenEdit = (trigger) => {
    setSelectedTrigger(trigger);
  };

  const handleOpenPreview = (trigger) => {
    setPreviewTrigger(trigger);
  };

  const handleSaveAutomation = async (formData) => {
    setSaving(true);
    try {
      await dispatch(updateStageTrigger(formData)).unwrap();
      setSelectedTrigger(null);
      setSuccessMsg(`Automation rule for ${formData.stage} updated successfully.`);
      dispatch(fetchStageTriggers());
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      // Error handled by redux
    } finally {
      setSaving(false);
    }
  };

  const activeCount = (triggers || []).filter((t) => t.isActive !== false).length;

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' } }}>
              Stage Email & Task Automations
            </Typography>
            <Chip
              label={`${activeCount} / ${(triggers || []).length} Active`}
              color="primary"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Configure automated client emails and mortgage advisor tasks triggered when leads advance through stages.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => dispatch(fetchStageTriggers())}
          disabled={loading}
          sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1' }}
        >
          Refresh Rules
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }} icon={<CheckCircle2 size={20} />} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }} icon={<AlertCircle size={20} />} onClose={() => dispatch(clearAutomationError())}>
          {error}
        </Alert>
      )}

      {loading && triggers.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 280 }}>
          <CircularProgress size={36} sx={{ color: '#2563eb' }} />
        </Box>
      ) : (
        <Stack spacing={2.5}>
          {triggers.map((trigger) => (
            <StageTriggerCard
              key={trigger._id || trigger.id || trigger.stage}
              trigger={trigger}
              onToggle={handleToggleStatus}
              onEdit={handleOpenEdit}
              onPreview={handleOpenPreview}
            />
          ))}
        </Stack>
      )}

      {/* Edit Automation Modal */}
      {selectedTrigger && (
        <AutomationEditModal
          open={Boolean(selectedTrigger)}
          onClose={() => setSelectedTrigger(null)}
          trigger={selectedTrigger}
          onSave={handleSaveAutomation}
          saving={saving}
        />
      )}

      {/* Email Preview Modal */}
      {previewTrigger && (
        <EmailPreviewModal
          open={Boolean(previewTrigger)}
          onClose={() => setPreviewTrigger(null)}
          trigger={previewTrigger}
        />
      )}
    </DashboardLayout>
  );
};

export default AutomationsPage;

