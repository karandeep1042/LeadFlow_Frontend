import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Stack, Chip, Divider, CircularProgress,
  useTheme, useMediaQuery,
} from '@mui/material';
import {
  ShieldAlert, FolderUp, CheckCircle2, Lock, ArrowRight,
  ShieldCheck, FileCheck, Clock, CheckSquare, Sparkles,
  AlertTriangle, Award, RotateCcw, Eye,
} from 'lucide-react';
import axiosInstance from '../../../services/api/axiosInstance';
import BankRevisionContent from './BankRevisionContent';
import { STAGE_META, getStageDisplayName } from '../../../utils/automationConstants';

export const StageTransitionConfirmModal = ({
  open,
  data = {},
  loading = false,
  onConfirm,
  onCancel,
  onOpenDossier,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [leadDocs, setLeadDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [revisionReason, setRevisionReason] = useState('');
  const [validationError, setValidationError] = useState('');

  const { type, leadName, previousStage, targetStage, docsSummary, pendingTask, leadObj } = data || {};
  const isDeactivating = type === 'deactivate_portal';
  const isComplianceBlocked = type === 'compliance_blocked';
  const isTaskPending = type === 'task_pending_advance';
  const isBankRevision = type === 'bank_revision_regression';

  const targetStageLabel = getStageDisplayName(targetStage);
  const prevStageLabel = getStageDisplayName(previousStage);
  const targetMeta = STAGE_META[targetStage] || { color: '#2563eb', bgColor: '#eff6ff', label: targetStageLabel };

  useEffect(() => {
    if (!open || !isBankRevision) {
      setLeadDocs([]);
      setSelectedDocIds([]);
      setRevisionReason('');
      setValidationError('');
      return;
    }

    const fetchLeadDocs = async () => {
      const targetLeadId = data.leadId || leadObj?._id;
      const targetClientId = leadObj?.clientId?._id || (typeof leadObj?.clientId === 'string' ? leadObj?.clientId : undefined);
      if (!targetLeadId && !targetClientId) return;

      try {
        setDocsLoading(true);
        const res = await axiosInstance.get('/api/documents', {
          params: { leadId: targetLeadId, clientId: targetClientId },
        });
        const docs = res.data?.data?.documents || res.data?.data || [];
        setLeadDocs(docs);
        setSelectedDocIds([]);
        setRevisionReason('');
        setValidationError('');
      } catch (err) {
        console.error('[StageTransitionConfirmModal] Failed fetching lead docs for revision:', err);
      } finally {
        setDocsLoading(false);
      }
    };

    fetchLeadDocs();
  }, [open, isBankRevision, data.leadId, leadObj]);

  if (!open || !data) return null;

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('de-DE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getHeaderInfo = () => {
    if (isBankRevision) {
      return {
        title: 'Bank Underwriting Revision Request',
        subtitle: 'Lender Feedback & Document Re-upload Request',
        icon: <RotateCcw size={24} />,
        bg: '#fff7ed',
        color: '#ea580c',
      };
    }
    if (isComplianceBlocked) {
      return {
        title: 'Document Verification Incomplete',
        subtitle: 'German Underwriting & Compliance Gate',
        icon: <ShieldAlert size={24} />,
        bg: '#fef2f2',
        color: '#dc2626',
      };
    }
    if (isTaskPending) {
      return {
        title: 'Stage Task Still Incomplete',
        subtitle: 'Advisor Task Completion & Stage Advancement Gate',
        icon: <CheckSquare size={24} />,
        bg: '#eff6ff',
        color: '#2563eb',
      };
    }
    if (isDeactivating) {
      return {
        title: 'Deactivate Client Portal Access?',
        subtitle: 'Stage Regression Security Check',
        icon: <ShieldAlert size={24} />,
        bg: '#fef3c7',
        color: '#d97706',
      };
    }
    if (targetStage === 'Bank Submission') {
      return {
        title: 'Advance to Bank Submission?',
        subtitle: 'Lender Underwriting Dispatch & Document Vault Freeze',
        icon: <Lock size={24} />,
        bg: '#f0fdf4',
        color: '#059669',
      };
    }
    if (targetStage === 'Document Collection') {
      return {
        title: 'Enable Client Portal Access?',
        subtitle: 'Stage Transition & Portal Access Activation',
        icon: <FolderUp size={24} />,
        bg: '#eff6ff',
        color: '#2563eb',
      };
    }
    if (targetStage === 'Won') {
      return {
        title: 'Advance to Loan Offer & Approval?',
        subtitle: 'Lender Loan Terms Approved & Binding Contract Preparation',
        icon: <Award size={24} />,
        bg: '#ecfdf5',
        color: '#059669',
      };
    }
    if (targetStage === 'Lost') {
      return {
        title: 'Advance to Notary & Closing?',
        subtitle: 'Notary Appointment Preparation & Deed Registration',
        icon: <Sparkles size={24} />,
        bg: '#f0fdfa',
        color: '#0d9488',
      };
    }
    return {
      title: `Advance Deal to ${targetStageLabel}?`,
      subtitle: 'Pipeline Stage Progression',
      icon: <Sparkles size={24} />,
      bg: '#eff6ff',
      color: '#2563eb',
    };
  };

  const header = getHeaderInfo();

  const handleConfirmRevision = () => {
    if (selectedDocIds.length === 0) {
      setValidationError('Please select at least one document to request revision for, or click "Move Stage Only".');
      return;
    }
    if (!revisionReason.trim()) {
      setValidationError('Please provide rejection instructions so the borrower knows what to revise.');
      return;
    }
    onConfirm({
      isRevision: true,
      selectedDocIds,
      reason: revisionReason.trim(),
    });
  };

  const handleConfirmMoveOnly = () => {
    onConfirm({
      isRevision: false,
      selectedDocIds: [],
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth={isBankRevision ? 'md' : 'sm'}
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3.5,
          p: 0.5,
          boxShadow: isMobile ? 'none' : '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: header.bg,
              color: header.color,
              flexShrink: 0,
            }}
          >
            {header.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
              {header.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              {header.subtitle}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>FROM STAGE</Typography>
              <Chip label={prevStageLabel || 'Current'} size="small" sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }} />
            </Box>
            <ArrowRight size={18} color="#94a3b8" />
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>TO STAGE</Typography>
              <Chip
                label={targetStageLabel || 'Target'}
                size="small"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  backgroundColor: isComplianceBlocked ? '#fef2f2' : (isDeactivating ? '#fef2f2' : (targetMeta.bgColor || '#ecfdf5')),
                  color: isComplianceBlocked ? '#dc2626' : (isDeactivating ? '#dc2626' : (targetMeta.color || '#059669')),
                  border: `1px solid ${isComplianceBlocked ? '#fca5a5' : (isDeactivating ? '#fca5a5' : (targetMeta.color ? `${targetMeta.color}40` : '#a7f3d0'))}`,
                }}
              />
            </Box>
          </Box>

          {isBankRevision ? (
            <BankRevisionContent
              leadName={leadName}
              leadDocs={leadDocs}
              docsLoading={docsLoading}
              selectedDocIds={selectedDocIds}
              setSelectedDocIds={setSelectedDocIds}
              revisionReason={revisionReason}
              setRevisionReason={setRevisionReason}
              validationError={validationError}
              setValidationError={setValidationError}
            />
          ) : (
            <>
              {isTaskPending && pendingTask && (
                <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f0f9ff', border: '1.5px solid #bae6fd' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Sparkles size={16} color="#0284c7" />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Active Stage Action Item
                      </Typography>
                    </Box>
                    <Chip
                      label={pendingTask.priority ? `${pendingTask.priority.toUpperCase()} PRIORITY` : 'MEDIUM PRIORITY'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        backgroundColor: pendingTask.priority === 'high' ? '#fee2e2' : '#e0f2fe',
                        color: pendingTask.priority === 'high' ? '#dc2626' : '#0369a1',
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                    {pendingTask.title || `Complete ${prevStageLabel} workflow`}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b', fontSize: '0.78rem' }}>
                      <Clock size={13} />
                      <span>SLA Due: {formatDueDate(pendingTask.dueAt)}</span>
                    </Box>
                    <Chip
                      label="Incomplete"
                      size="small"
                      sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309' }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5, borderColor: '#bae6fd' }} />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircle2 size={16} color="#0284c7" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600, lineHeight: 1.4 }}>
                      Advancing to <strong>{targetStageLabel}</strong> will automatically mark this task as <strong>Completed</strong> in the audit trail and launch the next stage's SLA timers.
                    </Typography>
                  </Box>
                </Box>
              )}

          {isComplianceBlocked ? (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <AlertTriangle size={22} color="#e11d48" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9f1239', mb: 0.5 }}>
                    Underwriting Compliance Check Failed
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#881337', fontSize: '0.84rem', lineHeight: 1.5, mb: 1.5 }}>
                    German mortgage underwriting rules require <strong>all 18 mandatory compliance documents</strong> to be uploaded and verified before submitting <strong>{leadName || 'this case'}</strong> to partner banks.
                  </Typography>

                  {/* Document Metrics Breakdown */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, p: 1.5, borderRadius: 2, backgroundColor: '#ffffff', border: '1px solid #fda4af' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 800, display: 'block', fontSize: '0.7rem', letterSpacing: '0.02em' }}>UPLOADED</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e40af', lineHeight: 1.1, my: 0.25 }}>
                        {docsSummary?.uploadedCount ?? 0} / 18
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem', fontWeight: 600 }}>
                        Client Documents
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', borderLeft: '1px solid #fecdd3', borderRight: '1px solid #fecdd3' }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, display: 'block', fontSize: '0.7rem', letterSpacing: '0.02em' }}>VERIFIED</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#059669', lineHeight: 1.1, my: 0.25 }}>
                        {docsSummary?.verifiedCount ?? 0} / 18
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem', fontWeight: 600 }}>
                        Lender-Approved
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 800, display: 'block', fontSize: '0.7rem', letterSpacing: '0.02em' }}>REJECTED</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#dc2626', lineHeight: 1.1, my: 0.25 }}>
                        {docsSummary?.rejectedCount ?? 0} / 18
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.66rem', fontWeight: 600 }}>
                        Action Required
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : isDeactivating ? (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400e', mb: 0.5 }}>Borrower Portal Will Be Deactivated</Typography>
                  <Typography variant="body2" sx={{ color: '#78350f', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Moving <strong>{leadName || 'this borrower'}</strong> to <strong>Initial Consultation</strong> will automatically <strong>deactivate</strong> their Client Portal and freeze document uploads.
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : targetStage === 'Bank Submission' ? (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Lock size={20} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#065f46', mb: 0.5 }}>Document Vault Locked for Underwriting</Typography>
                  <Typography variant="body2" sx={{ color: '#047857', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Advancing <strong>{leadName || 'this borrower'}</strong> to <strong>Bank Submission</strong> locks the Document Vault to freeze verified files for lender underwriting. The client retains full portal access to track status.
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : targetStage === 'Document Collection' ? (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <ShieldCheck size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e40af', mb: 0.5 }}>Document Vault Access Will Be Enabled</Typography>
                  <Typography variant="body2" sx={{ color: '#1e3a8a', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Moving <strong>{leadName || 'this borrower'}</strong> to <strong>Document Collection</strong> will grant the client access to their portal to upload German mortgage documents.
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : targetStage === 'Won' ? (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Award size={20} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#065f46', mb: 0.5 }}>Loan Offer & Approval Secured</Typography>
                  <Typography variant="body2" sx={{ color: '#047857', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Advancing <strong>{leadName || 'this borrower'}</strong> to <strong>Loan Offer & Approval</strong> secures the bank commitment, locks the case against backward regressions, and initiates binding loan agreement preparation.
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : targetStage === 'Lost' ? (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#f0fdfa', border: '1px solid #99f6e4' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Sparkles size={20} color="#0d9488" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#115e59', mb: 0.5 }}>Final Closing Milestone: Notary & Closing</Typography>
                  <Typography variant="body2" sx={{ color: '#134e4a', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Advancing <strong>{leadName || 'this borrower'}</strong> to <strong>Notary & Closing</strong> activates the notary appointment guide, Grundschuld registration verification, and closing disbursement workflows.
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Sparkles size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e40af', mb: 0.5 }}>Stage Transition: {targetStageLabel}</Typography>
                  <Typography variant="body2" sx={{ color: '#1e3a8a', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Advancing <strong>{leadName || 'this borrower'}</strong> to <strong>{targetStageLabel}</strong> will update pipeline status and sync relevant stage tasks.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ pl: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
              Workflow Details
            </Typography>
            <Stack spacing={1}>
              {isComplianceBlocked ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileCheck size={15} color="#059669" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>
                      Required documents include: ID, 3x Payslips, Tax Return, SCHUFA, 3x Bank Statements, Equity proof, and Property Exposé.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={15} color="#2563eb" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>
                      Review uploaded files in Document Inbox or Dossier and verify them to unlock Bank Submission.
                    </Typography>
                  </Box>
                </>
              ) : isDeactivating ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock size={15} color="#dc2626" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Client Portal logins and new document uploads will be locked.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileCheck size={15} color="#059669" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Previously uploaded documents remain safely archived in the case dossier.</Typography>
                  </Box>
                </>
              ) : targetStage === 'Bank Submission' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock size={15} color="#059669" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Document Vault uploads locked to preserve verified underwriting package.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Eye size={15} color="#2563eb" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Client retains active portal access to monitor lender review progress & status.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RotateCcw size={15} color="#4f46e5" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>If lender requests document changes, moving case back unlocks revision requests.</Typography>
                  </Box>
                </>
              ) : targetStage === 'Document Collection' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle2 size={15} color="#2563eb" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Borrower can upload income payslips, ID, SCHUFA, and property files.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldCheck size={15} color="#4f46e5" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Portal access invitation is activated for the borrower.</Typography>
                  </Box>
                </>
              ) : targetStage === 'Won' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Award size={15} color="#059669" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Binding loan agreements (Darlehensvertrag) will be dispatched to client.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock size={15} color="#059669" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Case stage is locked with approved bank terms.</Typography>
                  </Box>
                </>
              ) : targetStage === 'Lost' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle2 size={15} color="#0d9488" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Notary preparation checklist & signing guide sent to client.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sparkles size={15} color="#0d9488" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Advisor task created to verify Grundschuld land charge registration.</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle2 size={15} color="#2563eb" />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', color: '#334155' }}>Stage SLAs and automated workflows will update accordingly.</Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexDirection: { xs: 'column', sm: 'row' }, '& > :not(:first-of-type)': { ml: { xs: '0 !important', sm: 'auto' } } }}>
        {isBankRevision ? (
          <>
            <Button
              onClick={onCancel}
              disabled={loading}
              fullWidth={isMobile}
              sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none', borderRadius: 2, px: 2, minHeight: { xs: 44, sm: 'auto' }, order: { xs: 3, sm: 0 } }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmMoveOnly}
              disabled={loading}
              variant="outlined"
              fullWidth={isMobile}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                minHeight: { xs: 44, sm: 'auto' },
                order: { xs: 2, sm: 0 },
                color: '#475569',
                borderColor: '#cbd5e1',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
              }}
            >
              Move Stage Only
            </Button>
            <Button
              onClick={handleConfirmRevision}
              disabled={loading}
              variant="contained"
              fullWidth={isMobile}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AlertTriangle size={16} />}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                px: 2.5,
                minHeight: { xs: 48, sm: 'auto' },
                order: { xs: 1, sm: 0 },
                backgroundColor: '#ea580c',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#c2410c' },
              }}
            >
              {loading ? 'Processing...' : (selectedDocIds.length > 0 ? `Request Revision (${selectedDocIds.length}) & Move Stage` : 'Request Revision & Move Stage')}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onCancel} disabled={loading} fullWidth={isMobile} sx={{ fontWeight: 700, color: '#64748b', textTransform: 'none', borderRadius: 2, px: 2, minHeight: { xs: 44, sm: 'auto' }, order: { xs: 2, sm: 0 } }}>
              {isComplianceBlocked ? 'Dismiss' : 'Cancel'}
            </Button>
            {isComplianceBlocked ? (
              <Button
                onClick={() => {
                  if (onOpenDossier && (leadObj || data.leadId)) {
                    const targetObj = leadObj || { _id: data.leadId };
                    onOpenDossier({ ...targetObj, initialTab: 'documents' });
                  }
                  onCancel();
                }}
                variant="contained"
                fullWidth={isMobile}
                startIcon={<FileCheck size={16} />}
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  minHeight: { xs: 48, sm: 'auto' },
                  order: { xs: 1, sm: 0 },
                  backgroundColor: '#18181b',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#27272a' },
                }}
              >
                Open Dossier to Review Docs
              </Button>
            ) : isTaskPending ? (
              <Button
                onClick={() => onConfirm({ resolvePendingTask: true, pendingTaskId: pendingTask?._id })}
                disabled={loading}
                variant="contained"
                fullWidth={isMobile}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircle2 size={16} />}
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  minHeight: { xs: 48, sm: 'auto' },
                  order: { xs: 1, sm: 0 },
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                }}
              >
                {loading ? 'Processing...' : 'Mark Task Complete & Advance Stage'}
              </Button>
            ) : (
              <Button
                onClick={onConfirm}
                disabled={loading}
                variant="contained"
                fullWidth={isMobile}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : (isDeactivating ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />)}
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  minHeight: { xs: 48, sm: 'auto' },
                  order: { xs: 1, sm: 0 },
                  backgroundColor: isDeactivating ? '#18181b' : '#2563eb',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: isDeactivating ? '#27272a' : '#1d4ed8' },
                }}
              >
                {loading ? 'Processing...' : (
                  isDeactivating
                    ? 'Deactivate Portal & Move Stage'
                    : targetStage === 'Bank Submission'
                    ? 'Confirm Bank Submission'
                    : targetStage === 'Won'
                    ? 'Confirm Loan Approval'
                    : targetStage === 'Lost'
                    ? 'Confirm Advance to Notary & Closing'
                    : 'Enable Access & Proceed'
                )}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StageTransitionConfirmModal;
