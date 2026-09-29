import React from 'react';
import { Paper, Box, Typography, Chip, Avatar, Tooltip, IconButton, CircularProgress } from '@mui/material';
import {
  MapPin, ShieldAlert, ChevronRight, Lock, Sparkles, CheckCircle2, Clock, AlertCircle, FileText, RotateCcw,
} from 'lucide-react';

const VISA_BADGES = {
  'EU Blue Card': { color: '#2563eb', bg: '#eff6ff' },
  'Permanent Residence (Niederlassungserlaubnis)': { color: '#059669', bg: '#ecfdf5' },
  'EU Citizen': { color: '#7c3aed', bg: '#f5f3ff' },
  'Freelance / Self-Employed (Freiberufler)': { color: '#d97706', bg: '#fffbeb' },
};

export const LeadCard = ({
  lead,
  onClick,
  onAdvanceStage,
  onRegressToDocs,
  nextStageLabel,
  canChangeStage = true,
  currentUserId = null,
  userRole = 'advisor',
  updatingStageLeadId = null,
}) => {
  const ltv = lead.purchasePrice > 0 ? Math.round((lead.loanAmount / lead.purchasePrice) * 100) : null;
  const visaStyle = VISA_BADGES[lead.visaType] || { color: '#475569', bg: '#f1f5f9' };
  const advisor = lead.assignedAdvisorId;
  const docsSummary = lead.docsSummary;
  const isDocsComplete = Boolean(docsSummary?.isComplianceComplete);
  const showDocStatus = lead.stage === 'Document Collection' || lead.stage === 'Bank Submission' || (docsSummary && docsSummary.uploadedCount > 0);

  const assignedAdvisorId = advisor?._id || advisor?.id || (typeof advisor === 'string' ? advisor : null);
  const isAssignedToCurrentUser = Boolean(currentUserId && assignedAdvisorId && String(assignedAdvisorId) === String(currentUserId));
  const isUnassigned = !assignedAdvisorId;

  const isAdvisor = userRole === 'advisor';
  const isAdmin = userRole === 'brokerage_admin' || userRole === 'platform_admin' || userRole === 'admin';

  const isThisLeadUpdating = Boolean(
    (updatingStageLeadId && String(updatingStageLeadId) === String(lead._id || lead.id)) ||
    lead.isClaiming
  );

  // Stage readiness detection across the entire mortgage pipeline
  const getStageReadiness = () => {
    if (lead.isDeclined || lead.isArchived) return null;

    if (lead.stage === 'New') {
      if (assignedAdvisorId) {
        return {
          isReady: true,
          hint: 'Advisor Assigned • Ready for Consultation',
          color: '#047857',
          borderColor: '#10b981',
          bgColor: '#ffffff',
          badgeBg: '#ecfdf5',
          isHero: false,
        };
      }
      return null;
    }

    if (lead.stage === 'Contacted') {
      const hasClientPortal = Boolean(lead.isConverted || lead.clientId);
      const hasNotes = Boolean(lead.notesList && lead.notesList.length > 0);
      if (hasClientPortal || hasNotes) {
        return {
          isReady: true,
          hint: hasClientPortal ? 'Client Portal Active • Ready for Docs' : 'Consultation Logged • Ready for Docs',
          color: '#047857',
          borderColor: '#10b981',
          bgColor: '#ffffff',
          badgeBg: '#ecfdf5',
          isHero: false,
        };
      }
      return null;
    }

    if (lead.stage === 'Document Collection') {
      if (isDocsComplete) {
        return {
          isReady: true,
          hint: '18/18 Verified • Ready for Bank Submission!',
          color: '#065f46',
          borderColor: '#059669',
          bgColor: '#f0fdf4',
          badgeBg: '#dcfce7',
          isHero: true,
        };
      }
      return null;
    }

    if (lead.stage === 'Bank Submission') {
      if (isDocsComplete) {
        return {
          isReady: true,
          hint: 'Lender Underwriting • Awaiting Decision',
          color: '#1e40af',
          borderColor: '#3b82f6',
          bgColor: '#eff6ff',
          badgeBg: '#dbeafe',
          isHero: false,
        };
      }
      return null;
    }

    if (lead.stage === 'Won') {
      return {
        isReady: true,
        hint: 'Loan Approved • Ready for Closing',
        color: '#047857',
        borderColor: '#10b981',
        bgColor: '#f0fdf4',
        badgeBg: '#ecfdf5',
        isHero: false,
      };
    }

    return null;
  };

  const readiness = getStageReadiness();

  // An advisor can drag/advance if:
  // 1. They are an advisor (not admin)
  // 2. The lead is unassigned (claiming it) OR the lead is assigned to them
  const canDragLead = Boolean(canChangeStage && isAdvisor && (isAssignedToCurrentUser || isUnassigned));
  const isOwnedByColleague = Boolean(!isUnassigned && !isAssignedToCurrentUser && isAdvisor);
  const isLockedForAdmin = Boolean(isAdmin);
  const isCardLocked = Boolean(isOwnedByColleague || isLockedForAdmin);

  const handleDragStart = (e) => {
    if (!canDragLead) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('leadId', lead._id || lead.id);
    e.dataTransfer.setData('currentStage', lead.stage);
  };

  return (
    <Paper
      elevation={0}
      draggable={canDragLead && !isThisLeadUpdating}
      onDragStart={handleDragStart}
      onClick={() => onClick(lead)}
      sx={{
        p: 2,
        position: 'relative',
        borderRadius: 2.5,
        border: isThisLeadUpdating
          ? '1.5px solid #3b82f6'
          : (readiness?.isReady
            ? (readiness.isHero ? '2px solid #059669' : `1.5px solid ${readiness.borderColor}`)
            : '1px solid'),
        borderColor: isThisLeadUpdating
          ? '#3b82f6'
          : (readiness?.isReady
            ? readiness.borderColor
            : (isCardLocked
              ? '#e2e8f0'
              : (lead.isDuplicate && !lead.duplicateResolved ? '#fca5a5' : '#e2e8f0'))),
        backgroundColor: isThisLeadUpdating
          ? '#f8faff'
          : (readiness?.isReady
            ? readiness.bgColor
            : (isCardLocked ? '#fbfcfe' : '#ffffff')),
        boxShadow: isThisLeadUpdating
          ? '0 4px 14px rgba(37, 99, 235, 0.16)'
          : (readiness?.isHero
            ? '0 4px 14px rgba(5, 150, 105, 0.16)'
            : (readiness?.isReady ? '0 2px 8px rgba(16, 185, 129, 0.08)' : 'none')),
        cursor: isThisLeadUpdating ? 'wait' : (canDragLead ? 'grab' : 'pointer'),
        transition: 'all 0.18s ease',
        opacity: isThisLeadUpdating ? 0.92 : (isOwnedByColleague ? 0.88 : (isLockedForAdmin ? 0.95 : 1)),
        '&:hover': {
          borderColor: isThisLeadUpdating
            ? '#3b82f6'
            : (readiness?.isReady
              ? readiness.borderColor
              : (canDragLead ? '#2563eb' : '#94a3b8')),
          boxShadow: isThisLeadUpdating
            ? '0 4px 14px rgba(37, 99, 235, 0.16)'
            : (readiness?.isHero
              ? '0 6px 18px rgba(5, 150, 105, 0.22)'
              : (canDragLead
                ? '0 4px 14px -2px rgba(37, 99, 235, 0.12)'
                : '0 2px 8px -2px rgba(15, 23, 42, 0.08)')),
          transform: isThisLeadUpdating ? 'none' : 'translateY(-2px)',
          opacity: 1,
        },
        '&:active': { cursor: isThisLeadUpdating ? 'wait' : (canDragLead ? 'grabbing' : 'pointer') },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {/* Name & City & Ownership Flag */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {lead.firstName} {lead.lastName}
              </Typography>
              {isThisLeadUpdating && (
                <Chip
                  icon={<CircularProgress size={10} color="inherit" thickness={6} />}
                  label="Claiming..."
                  size="small"
                  sx={{ height: 16, fontSize: '0.58rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb', '& .MuiChip-icon': { ml: 0.5 } }}
                />
              )}
              {!isThisLeadUpdating && isAssignedToCurrentUser && (
                <Chip
                  label="My Deal"
                  size="small"
                  sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb' }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
              <MapPin size={12} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{lead.city || 'Berlin'}</Typography>
              {lead.sourceName && (
                <>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>•</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{lead.sourceName.split(' ')[0]}</Typography>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isOwnedByColleague && (
              <Tooltip title={`Assigned to ${advisor?.name || 'another advisor'} (Read-Only deal)`}>
                <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', p: 0.25 }}>
                  <Lock size={14} />
                </Box>
              </Tooltip>
            )}

            {isLockedForAdmin && (
              <Tooltip
                title={
                  advisor?.name
                    ? `Advisor-Managed Case: ${advisor.name} (Pipeline stage changes are advisor-driven)`
                    : 'Unassigned Pool: Click card to assign an advisor in Lead Dossier'
                }
              >
                <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', p: 0.25 }}>
                  <Lock size={14} />
                </Box>
              </Tooltip>
            )}

            {lead.isDuplicate && !lead.duplicateResolved && (
              <Tooltip title="Potential duplicate inquiry detected">
                <Chip label="Duplicate" size="small" icon={<ShieldAlert size={12} />} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#fef2f2', color: '#dc2626' }} />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Loan Request Banner */}
        <Box sx={{ p: 1, borderRadius: 1.5, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block', fontWeight: 700 }}>LOAN REQUEST</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
              €{(Number(lead.loanAmount) || 0).toLocaleString('de-DE')}
            </Typography>
          </Box>
          {ltv && (
            <Chip label={`${ltv}% LTV`} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, backgroundColor: ltv > 90 ? '#fff1f2' : '#f0fdf4', color: ltv > 90 ? '#e11d48' : '#16a34a' }} />
          )}
        </Box>

        {/* Visa Tag & Compliance Badge */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
          <Chip label={lead.visaType || 'EU Blue Card'} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: visaStyle.bg, color: visaStyle.color }} />

          {showDocStatus && (
            <>
              {docsSummary?.rejectedCount > 0 ? (
                <Tooltip title={`${docsSummary.rejectedCount} document(s) rejected - revision required from borrower`}>
                  <Chip
                    size="small"
                    icon={<AlertCircle size={11} />}
                    label={`Docs: ${docsSummary.verifiedCount}/18 (${docsSummary.rejectedCount} Rejected)`}
                    sx={{
                      height: 20,
                      fontSize: '0.67rem',
                      fontWeight: 800,
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                    }}
                  />
                </Tooltip>
              ) : isDocsComplete ? (
                <Tooltip title="All 18 required German mortgage documents verified. Ready for Bank Submission!">
                  <Chip
                    size="small"
                    icon={<CheckCircle2 size={11} />}
                    label="Docs: 18/18 Verified (Ready)"
                    sx={{
                      height: 20,
                      fontSize: '0.67rem',
                      fontWeight: 800,
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                    }}
                  />
                </Tooltip>
              ) : lead.stage === 'Document Collection' ? (
                <Tooltip title={`${docsSummary?.verifiedCount || 0}/18 verified. ${docsSummary?.unverifiedCount ?? 18} missing or pending review.`}>
                  <Chip
                    size="small"
                    icon={<Clock size={11} />}
                    label={`Docs: ${docsSummary?.verifiedCount || 0}/18 Verified`}
                    sx={{
                      height: 20,
                      fontSize: '0.67rem',
                      fontWeight: 700,
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </Tooltip>
              ) : null}
            </>
          )}
        </Box>

        {/* Stage Readiness Advancement Banner */}
        {readiness?.isReady && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1,
              py: 0.6,
              borderRadius: 1.75,
              backgroundColor: readiness.badgeBg,
              border: `1px solid ${readiness.borderColor}`,
              color: readiness.color,
            }}
          >
            <Sparkles size={13} style={{ flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem', lineHeight: 1.2 }}>
              {readiness.hint}
            </Typography>
          </Box>
        )}

        {/* Advisor & Move Action */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #f1f5f9' }}>
          {isThisLeadUpdating ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} thickness={5} sx={{ color: '#2563eb' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb', fontSize: '0.72rem' }}>
                {lead.isClaiming || (!assignedAdvisorId && lead.stage === 'Contacted')
                  ? 'Claiming Case...'
                  : 'Updating Stage...'}
              </Typography>
            </Box>
          ) : advisor ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Avatar sx={{ width: 22, height: 22, fontSize: '0.7rem', bgcolor: isAssignedToCurrentUser ? '#2563eb' : '#64748b', fontWeight: 700 }}>
                {advisor.name ? advisor.name.charAt(0) : 'A'}
              </Avatar>
              <Typography variant="caption" sx={{ fontWeight: 700, color: isAssignedToCurrentUser ? '#0f172a' : '#64748b' }}>
                {advisor.name}
              </Typography>
            </Box>
          ) : (
            <Tooltip title={isAdvisor ? "Unassigned case: Drag or advance to claim deal" : "Unassigned case: Click card to allocate an advisor in Lead Dossier"}>
              <Chip
                label={isAdvisor ? "Unassigned (Claim)" : "Unassigned"}
                size="small"
                icon={<Sparkles size={12} />}
                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#fffbeb', color: '#b45309' }}
              />
            </Tooltip>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {isThisLeadUpdating ? (
              <Chip
                label="Syncing"
                size="small"
                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb' }}
              />
            ) : (
              <>
                {canDragLead && lead.stage === 'Bank Submission' && onRegressToDocs ? (
                  <Tooltip title="Bank Underwriting Revision (Request Documents & Move to Document Collection)">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegressToDocs(lead);
                      }}
                      sx={{
                        p: 0.5,
                        borderRadius: 1.5,
                        backgroundColor: '#fff7ed',
                        color: '#ea580c',
                        border: '1px solid #fed7aa',
                        '&:hover': {
                          backgroundColor: '#ffedd5',
                        },
                      }}
                    >
                      <RotateCcw size={15} />
                    </IconButton>
                  </Tooltip>
                ) : null}

                {nextStageLabel && canDragLead ? (
                  <Tooltip
                    title={
                      lead.stage === 'Document Collection' && !isDocsComplete
                        ? `Document Compliance Incomplete: ${docsSummary?.verifiedCount || 0}/18 verified (Click to review)`
                        : readiness?.isReady
                        ? `Ready! Advance to ${nextStageLabel}`
                        : `Advance to ${nextStageLabel}`
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdvanceStage(lead);
                      }}
                      sx={{
                        p: 0.5,
                        borderRadius: 1.5,
                        backgroundColor: lead.stage === 'Document Collection' && !isDocsComplete
                          ? '#fff1f2'
                          : (readiness?.isReady ? '#ecfdf5' : '#f1f5f9'),
                        color: lead.stage === 'Document Collection' && !isDocsComplete
                          ? '#e11d48'
                          : (readiness?.isReady ? '#059669' : '#2563eb'),
                        border: readiness?.isReady ? '1px solid #a7f3d0' : 'none',
                        '&:hover': {
                          backgroundColor: lead.stage === 'Document Collection' && !isDocsComplete
                            ? '#ffe4e6'
                            : (readiness?.isReady ? '#d1fae5' : '#eff6ff'),
                        },
                      }}
                    >
                      <ChevronRight size={16} />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </>
            )}

            {!isThisLeadUpdating && isLockedForAdmin && (
              <Tooltip title="Advisor-managed stage: Click to open full Lead Dossier">
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.72rem', gap: 0.5, fontWeight: 600 }}>
                  <Lock size={12} />
                  <span>Dossier</span>
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default LeadCard;
