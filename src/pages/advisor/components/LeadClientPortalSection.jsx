import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Paper, CircularProgress } from '@mui/material';
import { UserCheck, ShieldAlert, ShieldCheck, UserX, Lock, CheckCircle2 } from 'lucide-react';
import ClientStatusModal from '../../admin/components/ClientStatusModal';

export const LeadClientPortalSection = ({
  lead,
  userRole = 'advisor',
  currentUserId = null,
  onConvertToClient,
  onToggleClientStatus,
  converting = false,
}) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!lead) return null;

  const clientUserObj = typeof lead.clientId === 'object' && lead.clientId !== null ? lead.clientId : null;
  const rawStatus = clientUserObj?.status || lead.clientStatus;
  const isExplicitlySuspended = rawStatus === 'suspended';
  const isConverted = Boolean(lead.isConverted || clientUserObj);

  const isPortalSuspended = isConverted && isExplicitlySuspended;
  const isPortalActive = isConverted && !isExplicitlySuspended;
  const isPortalInactive = !isConverted;

  const isAdmin = userRole === 'brokerage_admin' || userRole === 'platform_admin' || userRole === 'admin';
  const isAdvisor = userRole === 'advisor';
  const assignedAdvisorId = lead.assignedAdvisorId?._id || lead.assignedAdvisorId?.id || (typeof lead.assignedAdvisorId === 'string' ? lead.assignedAdvisorId : null);
  const isAssignedToCurrentUser = Boolean(currentUserId && assignedAdvisorId && String(assignedAdvisorId) === String(currentUserId));

  const canManagePortal = Boolean(isAdmin || (isAdvisor && isAssignedToCurrentUser));

  const clientModalData = {
    id: clientUserObj?._id || (typeof lead.clientId === 'string' ? lead.clientId : null) || lead._id || lead.id,
    name: `${lead.firstName} ${lead.lastName || ''}`.trim() || 'Valued Client',
    email: lead.email,
    status: isPortalSuspended ? 'suspended' : 'active',
  };

  const handleConfirmToggle = async (clientId, targetStatus, reason) => {
    if (!onToggleClientStatus) return;
    setActionLoading(true);
    try {
      await onToggleClientStatus(clientId, targetStatus, reason);
      setStatusModalOpen(false);
    } catch (err) {
      console.error('Failed to toggle client portal status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* State 1: Active Client Portal */}
      {isPortalActive && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldCheck size={18} color="#16a34a" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#14532d' }}>
                Client Portal Account Active
              </Typography>
            </Box>
            <Chip label="Portal Active" size="small" icon={<CheckCircle2 size={12} />} sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d' }} />
          </Box>
          <Typography variant="caption" sx={{ color: '#166534', fontSize: '0.75rem', lineHeight: 1.4 }}>
            Borrower has active portal access to upload verification documents and track loan approval roadmap.
          </Typography>
          {canManagePortal ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
              <Button size="small" variant="outlined" color="error" startIcon={<ShieldAlert size={14} />} onClick={() => setStatusModalOpen(true)} disabled={actionLoading || converting} sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', borderColor: '#fca5a5', color: '#dc2626', backgroundColor: '#ffffff', '&:hover': { borderColor: '#ef4444', backgroundColor: '#fef2f2' } }}>
                Deactivate Portal
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
              <Lock size={12} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                Client portal status changes are restricted to the assigned advisor or brokerage admin.
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* State 2: Suspended Client Portal */}
      {isPortalSuspended && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#fef2f2', border: '1px solid #fecaca', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldAlert size={18} color="#dc2626" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991b1b' }}>
                Client Portal Deactivated
              </Typography>
            </Box>
            <Chip label="Suspended" size="small" icon={<ShieldAlert size={12} />} sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#b91c1c' }} />
          </Box>
          <Typography variant="caption" sx={{ color: '#991b1b', fontSize: '0.75rem', lineHeight: 1.4 }}>
            Borrower portal access is temporarily disabled. Document submission and portal logins are blocked until reactivated.
          </Typography>
          {canManagePortal ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
              <Button size="small" variant="contained" startIcon={<CheckCircle2 size={14} />} onClick={() => setStatusModalOpen(true)} disabled={actionLoading || converting} sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', backgroundColor: '#059669', color: '#ffffff', '&:hover': { backgroundColor: '#047857' } }}>
                Reactivate Portal
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
              <Lock size={12} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                Client portal status changes are restricted to the assigned advisor or brokerage admin.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
      {/* State 3: Not Activated */}
      {isPortalInactive && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UserCheck size={18} color="#2563eb" />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Client Portal: Not Activated
              </Typography>
            </Box>
            <Chip label="Inactive" size="small" icon={<UserX size={12} />} sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b' }} />
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.4 }}>
            Converting this lead generates client portal login credentials and automatically sends an onboarding invitation.
          </Typography>
          {canManagePortal ? (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={converting ? <CircularProgress size={14} color="inherit" /> : <UserCheck size={15} />}
              onClick={() => onConvertToClient && onConvertToClient(lead._id || lead.id)}
              disabled={converting || actionLoading}
              sx={{
                py: 0.9,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
                '&:hover': { backgroundColor: '#eff6ff' },
              }}
            >
              {converting ? 'Provisioning Portal...' : 'Convert to Client Portal Account'}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b' }}>
              <Lock size={12} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                Only the assigned case advisor or brokerage admin can initialize portal credentials.
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Confirmation Modal */}
      <ClientStatusModal
        open={statusModalOpen}
        client={clientModalData}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleConfirmToggle}
        loading={actionLoading}
      />
    </Box>
  );
};

export default LeadClientPortalSection;
