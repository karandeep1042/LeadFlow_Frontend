import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Briefcase,
} from 'lucide-react';
import teamApi from '../../../services/api/teamApi';
import { STAGE_META, getStageDisplayName } from '../../../utils/automationConstants';

export const DeleteAdvisorModal = ({
  open,
  onClose,
  advisor,
  allAdvisors = [],
  onSuccess,
}) => {
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [targetAdvisorId, setTargetAdvisorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const advisorId = advisor?.id || advisor?._id;
  const availableAdvisors = allAdvisors.filter((a) => (a.id || a._id) !== advisorId);

  useEffect(() => {
    if (open && advisorId) {
      setError('');
      setTargetAdvisorId('');
      setLoadingLeads(true);

      teamApi
        .getAdvisorLeads(advisorId)
        .then((res) => {
          setLeads(res?.data?.leads || []);
        })
        .catch((err) => {
          console.error('Failed to load advisor leads:', err);
          setError(err.response?.data?.message || 'Could not check advisor leads.');
        })
        .finally(() => {
          setLoadingLeads(false);
        });
    } else {
      setLeads([]);
      setError('');
      setTargetAdvisorId('');
    }
  }, [open, advisorId]);

  const handleDelete = async () => {
    if (!advisorId) return;

    if (leads.length > 0 && !targetAdvisorId) {
      setError('Please select a replacement advisor to reassign these active leads.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const payload = targetAdvisorId ? { reassignToAdvisorId: targetAdvisorId } : {};
      const res = await teamApi.deleteAdvisor(advisorId, payload);

      if (res?.success) {
        if (onSuccess) {
          onSuccess({
            deletedAdvisor: advisor,
            reassignedCount: leads.length,
            targetAdvisor: availableAdvisors.find((a) => (a.id || a._id) === targetAdvisorId),
            message: res.message,
          });
        }
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete advisor account.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasLeads = leads.length > 0;
  const cannotReassign = hasLeads && availableAdvisors.length === 0;

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          p: { xs: 1, sm: 1.5 },
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Trash2 size={22} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Delete Advisor Account
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              {advisor?.name} ({advisor?.email})
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        <Stack spacing={2.5}>
          {error && (
            <Alert severity="error" icon={<AlertTriangle size={18} />} sx={{ borderRadius: 2, fontSize: '0.85rem' }}>
              {error}
            </Alert>
          )}

          {loadingLeads ? (
            <Box sx={{ py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              <CircularProgress size={32} sx={{ color: '#dc2626' }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                Checking caseload and assigned leads...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Irreversible Warning Notice */}
              <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', gap: 1.5 }}>
                <ShieldAlert size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991b1b', lineHeight: 1.3 }}>
                    This action is permanent and irreversible
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b91c1c', mt: 0.5, display: 'block', lineHeight: 1.4 }}>
                    Once deleted, {advisor?.name} will permanently lose login access to this LeadFlow workspace and all credentials will be revoked.
                  </Typography>
                </Box>
              </Box>

              {hasLeads ? (
                <>
                  <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#fffbeb', border: '1px solid #fef3c7', display: 'flex', gap: 1.5 }}>
                    <Briefcase size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e', lineHeight: 1.3 }}>
                        Active Caseload: {leads.length} Lead{leads.length > 1 ? 's' : ''} Managed
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b45309', mt: 0.5, display: 'block', lineHeight: 1.4 }}>
                        This advisor is currently assigned to {leads.length} active case{leads.length > 1 ? 's' : ''}. Select a replacement advisor below to reassign all leads before deleting.
                      </Typography>
                    </Box>
                  </Box>

                  {/* List of Managed Leads */}
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1, display: 'block' }}>
                      Leads to be Reassigned ({leads.length})
                    </Typography>

                    <Box sx={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 2.5, p: 1, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {leads.map((lead) => {
                        const meta = STAGE_META[lead.stage] || { label: lead.stage || 'Lead', color: '#64748b', bgColor: '#f1f5f9' };
                        const clientFullName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Client';
                        return (
                          <Box key={lead._id} sx={{ p: 1.25, backgroundColor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', lineHeight: 1.2 }} noWrap>
                                {clientFullName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }} noWrap>
                                {lead.email || lead.phone || 'No contact email'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', fontSize: '0.78rem' }}>
                                {lead.loanAmount ? `€${Number(lead.loanAmount).toLocaleString('de-DE')}` : '€0'}
                              </Typography>
                              <Chip label={getStageDisplayName(lead.stage)} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: meta.bgColor, color: meta.color }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Reassign Target Advisor Dropdown */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                      Reassign All Leads To <span style={{ color: '#dc2626' }}>*</span>
                    </Typography>

                    {cannotReassign ? (
                      <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        No other advisors are available in your organization. You must first invite another advisor before deleting {advisor?.name}.
                      </Alert>
                    ) : (
                      <FormControl fullWidth size="small">
                        <InputLabel id="reassign-advisor-select-label">Select Replacement Advisor</InputLabel>
                        <Select
                          labelId="reassign-advisor-select-label"
                          id="reassign-advisor-select"
                          value={targetAdvisorId}
                          label="Select Replacement Advisor"
                          onChange={(e) => {
                            setTargetAdvisorId(e.target.value);
                            setError('');
                          }}
                          disabled={submitting}
                          sx={{ borderRadius: 2 }}
                        >
                          {availableAdvisors.map((adv) => (
                            <MenuItem key={adv.id || adv._id} value={adv.id || adv._id} sx={{ py: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                  <Avatar sx={{ width: 26, height: 26, fontSize: '0.75rem', fontWeight: 700, bgcolor: '#eff6ff', color: '#2563eb' }}>
                                    {adv.name ? adv.name.charAt(0).toUpperCase() : 'A'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                                      {adv.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                                      {adv.email}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip label={`${adv.activeCases ?? 0} active cases`} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569' }} />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </>
              ) : (
                <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                    <strong>{advisor?.name}</strong> currently has no assigned leads or active pipeline cases.
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Confirming will permanently remove this account from your organization's roster.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, pt: 1, gap: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={submitting || loadingLeads || (hasLeads && (!targetAdvisorId || cannotReassign))}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Trash2 size={16} />}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            px: 2.5,
            py: 0.9,
            '&:hover': { backgroundColor: '#b91c1c' },
            '&.Mui-disabled': { backgroundColor: '#fca5a5', color: '#ffffff' },
          }}
        >
          {submitting ? 'Deleting Account...' : hasLeads ? 'Reassign Leads & Delete Advisor' : 'Delete Advisor Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAdvisorModal;

