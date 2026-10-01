import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer, Box, Typography, IconButton, Button, Chip, Divider,
  MenuItem, FormControl, InputLabel, Select, Alert, Paper, Avatar,
  CircularProgress, LinearProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, Tabs, Tab,
} from '@mui/material';
import {
  X, UserCheck, ShieldAlert, Mail, Phone,
  MapPin, Briefcase, CreditCard, Share2, UserX,
  Lock, Sparkles, User, CheckCircle2, XCircle, Award, RotateCcw,
  FileCheck, FolderOpen, CheckSquare, Square, Clock, Info,
} from 'lucide-react';
import { completeTask } from '../../../redux/thunks/taskThunk';
import LeadNotesTimeline from './LeadNotesTimeline';
import LeadFinanceSummary from './LeadFinanceSummary';
import LeadAdvisorSection from './LeadAdvisorSection';
import LeadClientPortalSection from './LeadClientPortalSection';
import LeadDocumentsVault from './LeadDocumentsVault';
import { STAGE_META } from '../../../utils/automationConstants';

const ALL_STAGES = [
  { key: 'New', label: '01: Ingestion', shortLabel: 'Ingestion', step: '01' },
  { key: 'Contacted', label: '02: Consultation', shortLabel: 'Consultation', step: '02' },
  { key: 'Document Collection', label: '03: Documents', shortLabel: 'Documents', step: '03' },
  { key: 'Bank Submission', label: '04: Bank Sub', shortLabel: 'Bank Sub', step: '04' },
  { key: 'Won', label: '05: Approval', shortLabel: 'Approval', step: '05' },
  { key: 'Lost', label: '06: Closing', shortLabel: 'Closing', step: '06' },
];

export const LeadDossierDrawer = ({
  open,
  onClose,
  lead,
  advisors = [],
  userRole = 'advisor',
  currentUserId = null,
  isAssigningAdvisor = false,
  convertingClient = false,
  onStageChange,
  onAssignAdvisor,
  onConvertToClient,
  onToggleClientStatus,
  onResolveDuplicate,
  onAddNote,
  onDeclineLead,
  onArchiveLead,
  onUnarchiveLead,
  initialTab = 'overview',
}) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);

  const [activeDossierTab, setActiveDossierTab] = useState(lead?.initialTab || initialTab || 'overview');
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('SCHUFA credit score did not meet lender threshold');
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  const [submittingDecline, setSubmittingDecline] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [disbursedAmount, setDisbursedAmount] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const [submittingArchive, setSubmittingArchive] = useState(false);
  const [resolvingDuplicate, setResolvingDuplicate] = useState(false);
  const [togglingTask, setTogglingTask] = useState(false);
  const [restoringLead, setRestoringLead] = useState(false);

  const activeStageTask = tasks?.find((t) => {
    const tLeadId = t.leadId?._id || t.leadId;
    const matchesLead = String(tLeadId) === String(lead?._id || lead?.id);
    const matchesStage = t.stage === lead?.stage || (!t.stage && t.status === 'pending');
    return matchesLead && matchesStage && t.status !== 'superseded';
  });

  const formatSlaDue = (dueAt) => {
    if (!dueAt) return 'No due date';
    const due = new Date(dueAt);
    const now = new Date();
    const diffHours = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffHours < 0) return `${Math.abs(diffHours)}h overdue`;
    if (diffHours === 0) return 'Due now';
    if (diffHours < 24) return `${diffHours}h remaining`;
    const days = Math.round(diffHours / 24);
    return `${days}d remaining`;
  };

  useEffect(() => {
    if (lead?.initialTab) {
      setActiveDossierTab(lead.initialTab);
    } else if (initialTab) {
      setActiveDossierTab(initialTab);
    }
  }, [lead, initialTab]);

  if (!lead) return null;

  const meta = STAGE_META[lead.stage] || { color: '#2563eb', bgColor: '#eff6ff', label: lead.stage };
  const currentAdvisorId = lead.assignedAdvisorId?._id || lead.assignedAdvisorId || '';
  const currentAdvisorObj = typeof lead.assignedAdvisorId === 'object' && lead.assignedAdvisorId !== null
    ? lead.assignedAdvisorId
    : advisors.find((a) => String(a._id || a.id) === String(currentAdvisorId));
  const displayAdvisor = currentAdvisorObj || (currentAdvisorId ? { name: 'Assigned Advisor', email: String(currentAdvisorId) } : null);

  const isAdvisor = userRole === 'advisor';
  const isAdmin = userRole === 'brokerage_admin' || userRole === 'platform_admin' || userRole === 'admin';
  const isAssignedToCurrentUser = Boolean(currentUserId && currentAdvisorId && String(currentAdvisorId) === String(currentUserId));
  const isUnassigned = !currentAdvisorId;
  const canChangeStage = isAdvisor && (isAssignedToCurrentUser || isUnassigned);
  const isColleagueDeal = isAdvisor && !isUnassigned && !isAssignedToCurrentUser;

  // Compute exact client portal status
  const clientUserObj = typeof lead.clientId === 'object' && lead.clientId !== null ? lead.clientId : null;
  const rawStatus = clientUserObj?.status || lead.clientStatus;
  const isExplicitlySuspended = rawStatus === 'suspended';
  const isConverted = Boolean(lead.isConverted || clientUserObj);

  const isPortalSuspended = isConverted && isExplicitlySuspended;
  const isPortalActive = isConverted && !isExplicitlySuspended;
  const isPortalInactive = !isConverted;

  const currentStageIndex = Math.max(0, ALL_STAGES.findIndex((s) => s.key === lead.stage));
  const currentStageObj = ALL_STAGES[currentStageIndex] || ALL_STAGES[0];
  const progressPercent = Math.min(100, Math.round(((currentStageIndex + 1) / ALL_STAGES.length) * 100));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        '& .MuiDrawer-paper': {
          width: { xs: '100vw', sm: 660, md: 720 },
          minWidth: { xs: '100vw', sm: 660, md: 720 },
          maxWidth: { xs: '100vw', sm: 660, md: 720 },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          boxSizing: 'border-box',
          boxShadow: '-6px 0 28px rgba(15, 23, 42, 0.12)',
          overflowX: 'hidden',
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 660, md: 720 },
          minWidth: { xs: '100vw', sm: 660, md: 720 },
          maxWidth: { xs: '100vw', sm: 660, md: 720 },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          boxSizing: 'border-box',
          boxShadow: '-6px 0 28px rgba(15, 23, 42, 0.12)',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Sticky Top Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={meta.label}
              size="small"
              sx={{ fontWeight: 800, backgroundColor: meta.bgColor, color: meta.color, height: 24, borderRadius: 1.5 }}
            />
            {isPortalActive && (
              <Chip
                label="Portal Active"
                size="small"
                icon={<CheckCircle2 size={12} />}
                sx={{ height: 24, fontWeight: 800, backgroundColor: '#ecfdf5', color: '#059669', borderRadius: 1.5 }}
              />
            )}
            {isPortalSuspended && (
              <Chip
                label="Portal Deactivated"
                size="small"
                icon={<ShieldAlert size={12} />}
                sx={{ height: 24, fontWeight: 800, backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: 1.5 }}
              />
            )}
            {isPortalInactive && (
              <Chip
                label="Portal Inactive"
                size="small"
                icon={<UserX size={12} />}
                sx={{ height: 24, fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: 1.5 }}
              />
            )}
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              p: 0.75,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              '&:hover': { backgroundColor: '#f1f5f9' },
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
          {lead.firstName} {lead.lastName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', color: '#64748b', fontSize: '0.85rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Mail size={14} color="#94a3b8" />
            <span>{lead.email}</span>
          </Box>
          {lead.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone size={14} color="#94a3b8" />
              <span>{lead.phone}</span>
            </Box>
          )}
        </Box>

        {lead.isDuplicate && !lead.duplicateResolved && (
          <Alert
            severity="warning"
            icon={<ShieldAlert size={18} />}
            action={
              <Button
                size="small"
                color="inherit"
                disabled={resolvingDuplicate}
                startIcon={resolvingDuplicate ? <CircularProgress size={12} color="inherit" /> : null}
                onClick={async () => {
                  if (onResolveDuplicate) {
                    setResolvingDuplicate(true);
                    try {
                      await onResolveDuplicate(lead._id || lead.id);
                    } finally {
                      setResolvingDuplicate(false);
                    }
                  }
                }}
                sx={{ fontWeight: 700 }}
              >
                {resolvingDuplicate ? 'Resolving...' : 'Mark Unique'}
              </Button>
            }
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Duplicate inquiry detected with matching email address.
          </Alert>
        )}
      </Box>

      {/* Stage Progression Bar */}
      <Box sx={{ p: 2.5, pb: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pipeline Progress
            </Typography>
            <Chip
              label={`${currentStageObj.label} (${progressPercent}%)`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: meta.bgColor || '#eff6ff',
                color: meta.color || '#2563eb',
              }}
            />
          </Box>

          {isColleagueDeal ? (
            <Chip
              icon={<Lock size={11} />}
              label={`Managed by ${displayAdvisor?.name || 'Colleague'}`}
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#fef2f2', color: '#dc2626' }}
            />
          ) : isUnassigned ? (
            <Chip
              icon={<Sparkles size={11} />}
              label="Unassigned Pool"
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#fffbeb', color: '#b45309' }}
            />
          ) : isAdmin ? (
            <Chip
              icon={<Lock size={11} />}
              label="Advisor-Managed Stage"
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569' }}
            />
          ) : (
            <Chip
              label="Your Active Lead"
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#059669' }}
            />
          )}
        </Box>

        {/* 6-Stage Progress Indicator Steps (Occupies 100% equal width) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.75, mb: 1.5 }}>
          {ALL_STAGES.map((s, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <Box
                key={s.key}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 0.75,
                  px: 0.5,
                  borderRadius: 2,
                  textAlign: 'center',
                  backgroundColor: isCurrent
                    ? '#18181b'
                    : isCompleted
                    ? '#ecfdf5'
                    : '#ffffff',
                  border: isCurrent
                    ? '1.5px solid #18181b'
                    : isCompleted
                    ? '1.5px solid #a7f3d0'
                    : '1px solid #e2e8f0',
                  color: isCurrent
                    ? '#ffffff'
                    : isCompleted
                    ? '#065f46'
                    : '#94a3b8',
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent ? '0 2px 8px rgba(24, 24, 27, 0.15)' : 'none',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    lineHeight: 1.2,
                    color: isCurrent ? '#ffffff' : (isCompleted ? '#059669' : '#64748b'),
                  }}
                >
                  {s.step}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    fontWeight: isCurrent ? 800 : 600,
                    fontSize: '0.62rem',
                    maxWidth: '100%',
                    color: isCurrent ? '#ffffff' : (isCompleted ? '#065f46' : '#94a3b8'),
                  }}
                >
                  {s.shortLabel}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Linear Stage Track */}
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 5,
            borderRadius: 3,
            backgroundColor: '#e2e8f0',
            mb: 1,
            '& .MuiLinearProgress-bar': {
              backgroundColor: currentStageIndex >= 4 ? '#059669' : '#2563eb',
              borderRadius: 3,
            },
          }}
        />

        {/* Active Stage Action Item & SLA Card */}
        {activeStageTask && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 2.5,
              backgroundColor: activeStageTask.isCompleted ? '#f0fdf4' : '#ffffff',
              border: '1.5px solid',
              borderColor: activeStageTask.isCompleted ? '#bbf7d0' : '#e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Sparkles size={14} color={activeStageTask.isCompleted ? '#059669' : '#2563eb'} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: activeStageTask.isCompleted ? '#065f46' : '#1e40af', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>
                  Stage Action Item
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Chip
                  label={activeStageTask.priority ? `${activeStageTask.priority.toUpperCase()}` : 'MEDIUM'}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    backgroundColor: activeStageTask.priority === 'high' ? '#fee2e2' : '#f1f5f9',
                    color: activeStageTask.priority === 'high' ? '#dc2626' : '#475569',
                  }}
                />
                <Chip
                  icon={activeStageTask.isCompleted ? <CheckCircle2 size={11} /> : undefined}
                  label={activeStageTask.isCompleted ? 'Completed' : formatSlaDue(activeStageTask.dueAt)}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    backgroundColor: activeStageTask.isCompleted ? '#dcfce7' : (new Date(activeStageTask.dueAt) < new Date() ? '#fee2e2' : '#eff6ff'),
                    color: activeStageTask.isCompleted ? '#166534' : (new Date(activeStageTask.dueAt) < new Date() ? '#dc2626' : '#2563eb'),
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: activeStageTask.isCompleted ? '#166534' : '#0f172a',
                  textDecoration: activeStageTask.isCompleted ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {activeStageTask.title}
              </Typography>
              {canChangeStage && (
                <Button
                  size="small"
                  variant={activeStageTask.isCompleted ? 'outlined' : 'contained'}
                  color={activeStageTask.isCompleted ? 'inherit' : 'primary'}
                  disabled={togglingTask}
                  startIcon={togglingTask ? <CircularProgress size={12} color="inherit" /> : null}
                  onClick={async () => {
                    setTogglingTask(true);
                    try {
                      await dispatch(completeTask({ taskId: activeStageTask._id, isCompleted: !activeStageTask.isCompleted }));
                    } finally {
                      setTogglingTask(false);
                    }
                  }}
                  sx={{
                    minWidth: 'auto',
                    py: 0.35,
                    px: 1.25,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'none',
                    borderRadius: 1.5,
                  }}
                >
                  {togglingTask ? 'Saving...' : activeStageTask.isCompleted ? 'Reopen' : 'Mark Done'}
                </Button>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
          <Info size={13} color="#64748b" style={{ flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
            Stage progression is managed via Kanban Board drag-and-drop & Task Workflows.
          </Typography>
        </Box>

        {/* Case Finalization & Outcome Actions */}
        {lead.stage === 'Lost' && !lead.isArchived && !lead.isDeclined && canChangeStage && (
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="small"
            startIcon={<Award size={15} />}
            onClick={() => {
              setDisbursedAmount(lead.loanAmount || '');
              setArchiveOpen(true);
            }}
            sx={{ mt: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none', py: 0.9, boxShadow: 'none' }}
          >
            Finalize Payout & Archive Deal (€)
          </Button>
        )}

        {lead.isArchived && (
          <Box sx={{ mt: 1.5, p: 1.25, bgcolor: '#ecfdf5', borderRadius: 2, border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CheckCircle2 size={13} color="#065f46" />
              <Typography variant="caption" sx={{ color: '#065f46', fontWeight: 700 }}>
                Archived in Closed Portfolio (€{(lead.finalDisbursedAmount || lead.loanAmount)?.toLocaleString('de-DE')})
              </Typography>
            </Box>
            {(canChangeStage || isAdmin) && (
              <Button
                size="small"
                disabled={restoringLead}
                startIcon={restoringLead ? <CircularProgress size={12} color="inherit" /> : <RotateCcw size={12} />}
                onClick={async () => {
                  if (onUnarchiveLead) {
                    setRestoringLead(true);
                    try {
                      await onUnarchiveLead(lead._id || lead.id);
                    } finally {
                      setRestoringLead(false);
                    }
                  }
                }}
                sx={{ textTransform: 'none', fontSize: '0.72rem', color: '#047857', minWidth: 'auto', p: 0.5 }}
              >
                {restoringLead ? 'Restoring...' : 'Restore'}
              </Button>
            )}
          </Box>
        )}

        {!lead.isDeclined && !lead.isArchived && canChangeStage && (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<XCircle size={14} />}
            onClick={() => setDeclineOpen(true)}
            sx={{ mt: 1, borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.75rem', borderColor: '#fca5a5', color: '#dc2626' }}
          >
            Decline Case (Irreversible)
          </Button>
        )}

        {lead.isDeclined && (
          <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 600 }}>
            Case Permanently Declined: {lead.declineReason || 'Criteria not met.'}
          </Alert>
        )}
      </Box>

      {/* Dossier Navigation Tabs */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 1, pb: 0, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Tabs
          value={activeDossierTab}
          onChange={(e, val) => setActiveDossierTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 42,
            '& .MuiTab-root': {
              minHeight: 42,
              py: 0.75,
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8rem', sm: '0.84rem' },
              fontWeight: 700,
              textTransform: 'none',
              gap: 1,
            },
          }}
        >
          <Tab
            icon={<User size={15} />}
            iconPosition="start"
            label="Deal Overview & Profile"
            value="overview"
          />
          <Tab
            icon={<FileCheck size={15} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <span>Document Vault</span>
                <Chip
                  size="small"
                  label={`${lead.docsSummary?.verifiedCount ?? 0}/18`}
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: lead.docsSummary?.isComplianceComplete
                      ? '#ecfdf5'
                      : ((lead.docsSummary?.rejectedCount > 0) ? '#fef2f2' : '#eff6ff'),
                    color: lead.docsSummary?.isComplianceComplete
                      ? '#059669'
                      : ((lead.docsSummary?.rejectedCount > 0) ? '#dc2626' : '#2563eb'),
                    border: '1px solid',
                    borderColor: lead.docsSummary?.isComplianceComplete
                      ? '#a7f3d0'
                      : ((lead.docsSummary?.rejectedCount > 0) ? '#fecaca' : '#bfdbfe'),
                  }}
                />
              </Box>
            }
            value="documents"
          />
        </Tabs>
      </Box>

      {/* Scrollable Details Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: { xs: 1.75, sm: 2.5, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {activeDossierTab === 'documents' ? (
          <LeadDocumentsVault lead={lead} userRole={userRole} />
        ) : (
          <>
            {/* Quick Document Status summary strip in overview */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: lead.docsSummary?.isComplianceComplete ? '#ecfdf5' : '#eff6ff',
                    color: lead.docsSummary?.isComplianceComplete ? '#059669' : '#2563eb',
                  }}
                >
                  <FileCheck size={18} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Document Underwriting Checklist
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {lead.docsSummary?.verifiedCount ?? 0} of 18 documents verified • {lead.docsSummary?.rejectedCount ?? 0} rejected
                  </Typography>
                </Box>
              </Box>

              <Button
                size="small"
                variant="outlined"
                onClick={() => setActiveDossierTab('documents')}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, fontSize: '0.75rem' }}
              >
                Open Document Vault ({lead.docsSummary?.verifiedCount ?? 0}/18)
              </Button>
            </Paper>

            <LeadFinanceSummary lead={lead} />

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
            Expat Borrower Profile
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box sx={{ p: 1.25, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                <CreditCard size={13} color="#2563eb" />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Visa Category</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{lead.visaType || 'EU Blue Card'}</Typography>
            </Box>

            <Box sx={{ p: 1.25, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                <Briefcase size={13} color="#059669" />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Employment</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{lead.employmentType || 'Employed'}</Typography>
            </Box>

            <Box sx={{ p: 1.25, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                <MapPin size={13} color="#dc2626" />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Target City</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{lead.city || 'Berlin'}</Typography>
            </Box>

            <Box sx={{ p: 1.25, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                <Share2 size={13} color="#7c3aed" />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Source</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{lead.sourceName || 'Direct Entry'}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Assigned Mortgage Advisor Section */}
        <LeadAdvisorSection
          lead={lead}
          advisors={advisors}
          userRole={userRole}
          currentUserId={currentUserId}
          isAssigningAdvisor={isAssigningAdvisor}
          onAssignAdvisor={onAssignAdvisor}
        />

        {/* Client Portal Account Management Section */}
        <LeadClientPortalSection
          lead={lead}
          userRole={userRole}
          currentUserId={currentUserId}
          onConvertToClient={onConvertToClient}
          onToggleClientStatus={onToggleClientStatus}
          converting={convertingClient}
        />

        <Divider />

        <LeadNotesTimeline
          notesList={lead.notesList || []}
        />
      </>
    )}
  </Box>

      {/* Decline Case Dialog Modal */}
      <Dialog open={declineOpen} onClose={() => setDeclineOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <XCircle size={22} color="#dc2626" /> Decline Financing Case
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Irreversible Action
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Declining this case will permanently close the mortgage application, mark it as Lost/Declined, and freeze the client vault in read-only mode.
              </Typography>
            </Alert>

            <FormControl fullWidth size="small">
              <InputLabel>Primary Bank Rejection Reason</InputLabel>
              <Select
                value={declineReason}
                label="Primary Bank Rejection Reason"
                onChange={(e) => setDeclineReason(e.target.value)}
              >
                <MenuItem value="SCHUFA credit score did not meet lender threshold">SCHUFA credit score did not meet lender threshold</MenuItem>
                <MenuItem value="Borrower debt-to-income / Haushaltsrechnung shortfall">Borrower debt-to-income / Haushaltsrechnung shortfall</MenuItem>
                <MenuItem value="Property valuation gap / structural appraisal decline">Property valuation gap / structural appraisal decline</MenuItem>
                <MenuItem value="Visa validity or German residency duration insufficient">Visa validity or German residency duration insufficient</MenuItem>
                <MenuItem value="Borrower withdrew / decided not to proceed">Borrower withdrew / decided not to proceed</MenuItem>
                <MenuItem value="Other custom reason">Other custom reason</MenuItem>
              </Select>
            </FormControl>

            {declineReason === 'Other custom reason' && (
              <TextField
                fullWidth
                size="small"
                label="Specify Decline Reason"
                placeholder="Enter specific bank decline feedback..."
                value={customDeclineReason}
                onChange={(e) => setCustomDeclineReason(e.target.value)}
                multiline
                rows={2}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeclineOpen(false)} disabled={submittingDecline} sx={{ textTransform: 'none', color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={submittingDecline}
            startIcon={submittingDecline ? <CircularProgress size={14} color="inherit" /> : null}
            onClick={async () => {
              const finalReason = declineReason === 'Other custom reason' ? (customDeclineReason || 'Criteria not met.') : declineReason;
              setSubmittingDecline(true);
              try {
                if (onDeclineLead) {
                  await onDeclineLead(lead._id || lead.id, finalReason);
                }
                setDeclineOpen(false);
              } finally {
                setSubmittingDecline(false);
              }
            }}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 2.5 }}
          >
            {submittingDecline ? 'Declining...' : 'Confirm & Decline Case'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Archive / Finalize Deal Dialog Modal */}
      <Dialog open={archiveOpen} onClose={() => !submittingArchive && setArchiveOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Award size={22} color="#059669" /> Finalize Payout & Archive Case
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Notary Deed Executed & Loan Disbursed
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Archiving moves this deal to your Closed Deals Portfolio, removing it from the active pipeline kanban to keep columns clean and fast.
              </Typography>
            </Alert>

            <TextField
              fullWidth
              size="small"
              label="Final Disbursed Loan Amount (€)"
              type="number"
              value={disbursedAmount}
              onChange={(e) => setDisbursedAmount(e.target.value)}
              placeholder="e.g. 480000"
            />

            <TextField
              fullWidth
              size="small"
              label="Closing & Commission Notes (Optional)"
              placeholder="Enter notary reference, lender commission confirmation, or payout date..."
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setArchiveOpen(false)} disabled={submittingArchive} sx={{ textTransform: 'none', color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={submittingArchive}
            startIcon={submittingArchive ? <CircularProgress size={14} color="inherit" /> : null}
            onClick={async () => {
              setSubmittingArchive(true);
              try {
                if (onArchiveLead) {
                  await onArchiveLead(lead._id || lead.id, {
                    finalDisbursedAmount: Number(disbursedAmount) || lead.loanAmount,
                    closingNotes,
                  });
                }
                setArchiveOpen(false);
              } finally {
                setSubmittingArchive(false);
              }
            }}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 2.5 }}
          >
            {submittingArchive ? 'Archiving...' : 'Confirm & Archive to Portfolio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default LeadDossierDrawer;
