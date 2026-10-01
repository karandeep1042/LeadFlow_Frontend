import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Stack, Alert, Snackbar, CircularProgress, Chip, Button, Tabs, Tab,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Zap, CheckCircle2, AlertCircle, RefreshCw, Mail, Edit, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StageTriggerCard from './components/StageTriggerCard';
import AutomationEditModal from './components/AutomationEditModal';
import EmailPreviewModal from './components/EmailPreviewModal';
import AccountTemplateEditModal from './components/AccountTemplateEditModal';
import {
  fetchStageTriggers,
  updateStageTrigger,
  toggleTriggerStatus,
  fetchEmailTemplates,
  saveEmailTemplate,
} from '../../redux/thunks/automationThunk';
import { clearAutomationError } from '../../redux/slices/automationSlice';

export const AutomationsPage = () => {
  const dispatch = useDispatch();
  const { triggers, templates, loading, error } = useSelector((state) => state.automation);

  const [activeTab, setActiveTab] = useState('triggers');
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [previewTrigger, setPreviewTrigger] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    dispatch(fetchStageTriggers());
    dispatch(fetchEmailTemplates());
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
      setErrorMsg('');
      setSuccessMsg(`Stage ${trigger.stage} trigger ${newStatus ? 'activated' : 'paused'} successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || err?.error || 'Failed to toggle trigger status.');
    }
  };

  const handleSaveAutomation = async (formData) => {
    setSaving(true);
    try {
      await dispatch(updateStageTrigger(formData)).unwrap();
      setSelectedTrigger(null);
      setErrorMsg('');
      setSuccessMsg(`Automation rule for ${formData.stage} updated successfully.`);
      dispatch(fetchStageTriggers());
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || err?.error || 'Failed to update automation trigger.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAccountTemplate = async (templateData) => {
    setSaving(true);
    try {
      await dispatch(saveEmailTemplate(templateData)).unwrap();
      setSelectedTemplate(null);
      setErrorMsg('');
      setSuccessMsg(`Email template "${templateData.name}" updated successfully.`);
      dispatch(fetchEmailTemplates());
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || err?.error || 'Failed to update email template.');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = (triggers || []).filter((t) => t.isActive !== false).length;
  const stageTemplateIds = new Set((triggers || []).map((t) => t.emailTemplateId?._id || t.emailTemplateId).filter(Boolean));
  const accountTemplates = (templates || []).filter((tpl) => !stageTemplateIds.has(tpl._id));

  const getTemplateBadgeInfo = (name = '') => {
    if (/deactivated|suspended/i.test(name)) {
      return { label: 'Account Deactivation', bg: '#fef2f2', color: '#dc2626' };
    }
    if (/reactivated|restored/i.test(name)) {
      return { label: 'Account Reactivation', bg: '#ecfdf5', color: '#059669' };
    }
    if (/welcome|onboarding|portal/i.test(name)) {
      return { label: 'Portal Onboarding & Credentials', bg: '#eff6ff', color: '#2563eb' };
    }
    if (/document|verification|revision|rejected|failed/i.test(name)) {
      return { label: 'Document Compliance & Revision', bg: '#fff7ed', color: '#c2410c' };
    }
    if (/advisor/i.test(name)) {
      return { label: 'Advisor Assignment Notice', bg: '#faf5ff', color: '#7e22ce' };
    }
    return { label: 'System Action Template', bg: '#f1f5f9', color: '#475569' };
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.1rem' }, letterSpacing: '-0.02em' }}>
                Email & Task Automations
              </Typography>
              <Chip
                label={`${activeCount} / ${(triggers || []).length} Active`}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }}
              />
            </Box>

            {/* Mobile Inline Refresh Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Tooltip title="Refresh rules">
                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch(fetchStageTriggers());
                    dispatch(fetchEmailTemplates());
                  }}
                  disabled={loading}
                  sx={{ border: '1px solid #cbd5e1', borderRadius: 2, p: 0.75, backgroundColor: '#ffffff', color: '#475569', '&:hover': { backgroundColor: '#f8fafc' } }}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5 }}>
            Configure stage pipeline triggers and custom notification templates for client account activation/deactivation.
          </Typography>
        </Box>

        {/* Desktop Refresh Button */}
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={15} />}
          onClick={() => {
            dispatch(fetchStageTriggers());
            dispatch(fetchEmailTemplates());
          }}
          disabled={loading}
          sx={{ display: { xs: 'none', md: 'inline-flex' }, borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', fontWeight: 700 }}
        >
          Refresh Rules
        </Button>
      </Box>

      {/* Top-Right Floating Notification Alert */}
      <Snackbar
        open={Boolean(successMsg || errorMsg || error)}
        autoHideDuration={5000}
        onClose={() => {
          setSuccessMsg('');
          setErrorMsg('');
          if (error) dispatch(clearAutomationError());
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={errorMsg || error ? 'error' : 'success'}
          icon={errorMsg || error ? <AlertCircle size={20} color="#dc2626" /> : <CheckCircle2 size={20} color="#059669" />}
          onClose={() => {
            setSuccessMsg('');
            setErrorMsg('');
            if (error) dispatch(clearAutomationError());
          }}
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
          {errorMsg || error || successMsg}
        </Alert>
      </Snackbar>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', mb: 3, px: { xs: 1, sm: 2 } }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              fontWeight: 700,
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minHeight: { xs: 44, sm: 48 },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1.5, sm: 2 },
              whiteSpace: 'nowrap',
            },
          }}
        >
          <Tab value="triggers" label={`Stage Pipeline Rules (${(triggers || []).length})`} icon={<Zap size={16} />} iconPosition="start" />
          <Tab value="account_templates" label={`Account Lifecycle & Security Templates (${accountTemplates.length})`} icon={<Mail size={16} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {activeTab === 'triggers' && (
        loading && triggers.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 280 }}>
            <CircularProgress size={36} sx={{ color: '#2563eb' }} />
          </Box>
        ) : (
          <Stack spacing={{ xs: 2, sm: 2.5 }}>
            {triggers.map((trigger) => (
              <StageTriggerCard
                key={trigger._id || trigger.id || trigger.stage}
                trigger={trigger}
                onToggle={handleToggleStatus}
                onEdit={(trig) => setSelectedTrigger(trig)}
                onPreview={(trig) => setPreviewTrigger(trig)}
              />
            ))}
          </Stack>
        )
      )}
      {activeTab === 'account_templates' && (
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          {accountTemplates.length === 0 ? (
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                No account action templates found.
              </Typography>
            </Paper>
          ) : (
            accountTemplates.map((tpl) => (
              <Paper
                key={tpl._id || tpl.id}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: { xs: 2.5, sm: 3 },
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', md: 'center' },
                  gap: { xs: 1.75, md: 2 },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1, flexWrap: 'wrap' }}>
                    {(() => {
                      const badge = getTemplateBadgeInfo(tpl.name);
                      return (
                        <Chip
                          label={badge.label}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            height: 22,
                            backgroundColor: badge.bg,
                            color: badge.color,
                          }}
                        />
                      );
                    })()}
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '0.975rem', sm: '1.05rem' } }}>
                      {tpl.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#475569', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                    <strong>Subject:</strong> {tpl.subject}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', wordBreak: 'break-word' }}>
                    {tpl.description}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' }, pt: { xs: 0.5, md: 0 } }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Eye size={15} />}
                    onClick={() => setPreviewTrigger({ stage: tpl.name, emailTemplateId: tpl })}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      py: 0.75,
                      borderColor: '#cbd5e1',
                      color: '#475569',
                      whiteSpace: 'nowrap',
                      flex: { xs: 1, md: 'initial' },
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Edit size={15} />}
                    onClick={() => setSelectedTemplate(tpl)}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      py: 0.75,
                      backgroundColor: '#18181b',
                      color: '#ffffff',
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      flex: { xs: 1, md: 'initial' },
                      '&:hover': { backgroundColor: '#09090b', boxShadow: 'none' },
                    }}
                  >
                    Edit Template
                  </Button>
                </Stack>
              </Paper>
            ))
          )}
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

      {/* Account Template Edit Modal */}
      {selectedTemplate && (
        <AccountTemplateEditModal
          open={Boolean(selectedTemplate)}
          onClose={() => setSelectedTemplate(null)}
          template={selectedTemplate}
          onSave={handleSaveAccountTemplate}
          saving={saving}
        />
      )}
    </DashboardLayout>
  );
};

export default AutomationsPage;

