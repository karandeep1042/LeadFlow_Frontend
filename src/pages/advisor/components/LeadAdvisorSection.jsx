import React from 'react';
import {
  Box, Typography, Paper, Chip, Avatar, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, LinearProgress,
} from '@mui/material';
import {
  Briefcase, UserCheck, Lock, Sparkles, UserX, CheckCircle2,
} from 'lucide-react';

const AdvisorSelfCard = ({ advisor, isDealLocked, lockReason }) => (
  <Box>
    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: 1.75 }}>
      <Avatar sx={{ width: 42, height: 42, bgcolor: '#2563eb', fontWeight: 800, fontSize: '1rem' }}>
        {advisor?.name ? advisor.name.charAt(0).toUpperCase() : 'U'}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0369a1', fontSize: '0.92rem' }}>
            {advisor?.name || 'You'}
          </Typography>
          <Chip
            label={isDealLocked ? 'Case Concluded' : 'Primary Case Owner'}
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 800,
              bgcolor: isDealLocked ? '#f1f5f9' : '#e0f2fe',
              color: isDealLocked ? '#475569' : '#0284c7',
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: '#0284c7', display: 'block', mt: 0.25 }}>
          {advisor?.email} {advisor?.phone ? `• ${advisor.phone}` : ''}
        </Typography>
      </Box>
    </Box>
    {isDealLocked ? (
      <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1.5, backgroundColor: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Lock size={15} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: '#991b1b', fontSize: '0.75rem', lineHeight: 1.45, fontWeight: 500 }}>
          {lockReason || 'This case has concluded. Advisor assignment and case allocation are locked.'}
        </Typography>
      </Box>
    ) : (
      <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <UserCheck size={16} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.45 }}>
          You are actively managing this borrower case. You can advance pipeline stages, coordinate verification documents, and add deal notes.
        </Typography>
      </Box>
    )}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
      <Lock size={12} color="#94a3b8" />
      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
        Advisor reallocation is managed exclusively by Brokerage Administration.
      </Typography>
    </Box>
  </Box>
);

const AdvisorColleagueCard = ({ advisor, isDealLocked, lockReason }) => (
  <Box>
    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.75 }}>
      <Avatar sx={{ width: 40, height: 40, bgcolor: '#64748b', fontWeight: 700, fontSize: '0.95rem' }}>
        {advisor?.name ? advisor.name.charAt(0).toUpperCase() : 'A'}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>
          {advisor?.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.25 }}>
          {advisor?.email} {advisor?.phone ? `• ${advisor.phone}` : ''}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
      <Lock size={15} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />
      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.45 }}>
        {isDealLocked
          ? lockReason || `This case is concluded and was managed by ${advisor?.name}.`
          : `This case is actively managed by ${advisor?.name}. Only the assigned advisor can advance pipeline stages.`}
      </Typography>
    </Box>
  </Box>
);

const AdvisorUnassignedCard = ({ isDealLocked, lockReason }) => (
  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: isDealLocked ? '#fef2f2' : '#fffbeb', border: isDealLocked ? '1px solid #fee2e2' : '1px solid #fef3c7', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
    {isDealLocked ? (
      <Lock size={18} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
    ) : (
      <Sparkles size={18} color="#b45309" style={{ marginTop: 2, flexShrink: 0 }} />
    )}
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDealLocked ? '#991b1b' : '#92400e', fontSize: '0.85rem' }}>
        {isDealLocked ? 'Unassigned Concluded Case' : 'Unassigned Shared Lead Pool'}
      </Typography>
      <Typography variant="caption" sx={{ color: isDealLocked ? '#b91c1c' : '#b45309', display: 'block', mt: 0.5, fontSize: '0.75rem', lineHeight: 1.45 }}>
        {isDealLocked
          ? lockReason || 'This case has concluded without an assigned advisor. Reassignment is locked.'
          : 'This inquiry is currently unassigned in your brokerage pool. Advancing this case or moving it on the Kanban board will automatically claim it and allocate it directly to you.'}
      </Typography>
    </Box>
  </Box>
);

export const LeadAdvisorSection = ({
  lead,
  advisors = [],
  userRole = 'advisor',
  currentUserId = null,
  isAssigningAdvisor = false,
  onAssignAdvisor,
}) => {
  const currentAdvisorId = lead?.assignedAdvisorId?._id || lead?.assignedAdvisorId || '';
  const currentAdvisorObj = typeof lead?.assignedAdvisorId === 'object' && lead?.assignedAdvisorId !== null
    ? lead.assignedAdvisorId
    : advisors.find((a) => String(a._id || a.id) === String(currentAdvisorId));
  const displayAdvisor = currentAdvisorObj || (currentAdvisorId ? { name: 'Assigned Advisor', email: String(currentAdvisorId) } : null);

  const isLockedStage = ['Won', 'Lost', 'Approved', 'Closed Won', 'Closed Lost'].includes(lead?.stage);
  const isDealLocked = Boolean(isLockedStage || lead?.isDeclined || lead?.isArchived);

  let lockReason = '';
  if (lead?.isDeclined) {
    lockReason = 'Mortgage case declined & concluded. Advisor assignment is permanently frozen.';
  } else if (lead?.isArchived) {
    lockReason = 'Deal archived in closed portfolio ledger. Advisor reallocation is locked.';
  } else if (lead?.stage === 'Won' || lead?.stage === 'Approved' || lead?.stage === 'Closed Won') {
    lockReason = 'Loan offer approved & binding. Mortgage advisor reallocation is locked for compliance.';
  } else if (lead?.stage === 'Lost' || lead?.stage === 'Closed Lost') {
    lockReason = 'Deed signing & notary settlement concluded. Advisor assignment is locked.';
  }

  const isAdvisor = userRole === 'advisor';
  const isAssignedToCurrentUser = Boolean(currentUserId && currentAdvisorId && String(currentAdvisorId) === String(currentUserId));
  const isUnassigned = !currentAdvisorId;
  const isColleagueDeal = isAdvisor && !isUnassigned && !isAssignedToCurrentUser;

  if (isAdvisor) {
    return (
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Briefcase size={16} color={isDealLocked ? '#dc2626' : isAssignedToCurrentUser ? '#2563eb' : (isColleagueDeal ? '#64748b' : '#b45309')} />
            Assigned Mortgage Advisor
          </Typography>
          {isDealLocked ? (
            <Chip
              icon={<Lock size={12} style={{ color: '#dc2626' }} />}
              label="Case Locked"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.72rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', height: 24 }}
            />
          ) : isAssignedToCurrentUser ? (
            <Chip
              icon={<CheckCircle2 size={13} style={{ color: '#16a34a' }} />}
              label="Assigned to You"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.72rem', backgroundColor: '#ecfdf5', color: '#15803d', border: '1px solid #bbf7d0', height: 24 }}
            />
          ) : isColleagueDeal ? (
            <Chip
              icon={<Lock size={12} style={{ color: '#64748b' }} />}
              label="Colleague Deal"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.72rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', height: 24 }}
            />
          ) : (
            <Chip
              icon={<Sparkles size={12} style={{ color: '#b45309' }} />}
              label="Unassigned Pool"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.72rem', backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', height: 24 }}
            />
          )}
        </Box>

        {isAssignedToCurrentUser ? (
          <AdvisorSelfCard advisor={displayAdvisor} isDealLocked={isDealLocked} lockReason={lockReason} />
        ) : isColleagueDeal ? (
          <AdvisorColleagueCard advisor={displayAdvisor} isDealLocked={isDealLocked} lockReason={lockReason} />
        ) : (
          <AdvisorUnassignedCard isDealLocked={isDealLocked} lockReason={lockReason} />
        )}
      </Paper>
    );
  }

  // Brokerage Admin / Platform Admin View
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        backgroundColor: '#f8fafc',
        border: isAssigningAdvisor ? '1px solid #93c5fd' : '1px solid #e2e8f0',
        position: 'relative',
        transition: 'border-color 0.2s ease',
      }}
    >
      {isAssigningAdvisor && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: '#dbeafe',
            '& .MuiLinearProgress-bar': { backgroundColor: '#2563eb' },
          }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Briefcase size={16} color={isDealLocked ? '#dc2626' : '#2563eb'} /> Assign Mortgage Advisor
        </Typography>
        <Chip
          icon={isDealLocked ? <Lock size={12} style={{ color: '#dc2626' }} /> : undefined}
          label={isDealLocked ? 'Locked Deal' : 'Admin Control'}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.68rem',
            backgroundColor: isDealLocked ? '#fef2f2' : '#eff6ff',
            color: isDealLocked ? '#dc2626' : '#2563eb',
            border: isDealLocked ? '1px solid #fecaca' : 'none',
            height: 20,
          }}
        />
      </Box>

      {isDealLocked && (
        <Box sx={{ mb: 1.75, p: 1.25, borderRadius: 1.5, backgroundColor: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
          <Lock size={16} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991b1b', fontSize: '0.78rem' }}>
              Mortgage Advisor Reassignment Locked
            </Typography>
            <Typography variant="caption" sx={{ color: '#b91c1c', fontSize: '0.73rem', display: 'block', mt: 0.25, lineHeight: 1.4 }}>
              {lockReason}
            </Typography>
          </Box>
        </Box>
      )}

      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel id="drawer-advisor-label" sx={{ fontWeight: 600, color: '#475569' }}>
          Select Mortgage Advisor
        </InputLabel>
        <Select
          labelId="drawer-advisor-label"
          value={String(currentAdvisorId || '')}
          label="Select Mortgage Advisor"
          disabled={isAssigningAdvisor || isDealLocked}
          onChange={(e) => onAssignAdvisor(lead._id || lead.id, e.target.value)}
          sx={{
            borderRadius: 2,
            backgroundColor: isDealLocked ? '#f1f5f9' : '#ffffff',
            fontWeight: 600,
            color: '#0f172a',
            '&.Mui-disabled': {
              backgroundColor: '#f1f5f9',
              color: '#64748b',
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: isDealLocked ? '#e2e8f0' : '#cbd5e1' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDealLocked ? '#e2e8f0' : '#94a3b8' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
          }}
          MenuProps={{
            sx: { zIndex: (theme) => theme.zIndex.modal + 200 },
            PaperProps: {
              sx: { maxHeight: 280, borderRadius: 2, boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)' },
            },
          }}
        >
          <MenuItem value="">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#b45309' }}>
              <UserX size={15} />
              <em>-- Unassigned Lead --</em>
            </Box>
          </MenuItem>
          {advisors.map((adv) => (
            <MenuItem key={adv._id || adv.id} value={String(adv._id || adv.id)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: '#2563eb' }}>
                  {adv.name ? adv.name.charAt(0) : 'A'}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  {adv.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  ({adv.email})
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isAssigningAdvisor ? (
        <Box
          sx={{
            p: 1.75,
            borderRadius: 2,
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)',
          }}
        >
          <CircularProgress size={24} thickness={4.5} sx={{ color: '#2563eb' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e40af', fontSize: '0.84rem' }}>
              Updating Advisor Allocation...
            </Typography>
            <Typography variant="caption" sx={{ color: '#3b82f6', fontSize: '0.72rem', display: 'block' }}>
              Reassigning open tasks and dispatching intro email to borrower
            </Typography>
          </Box>
        </Box>
      ) : displayAdvisor ? (
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: isDealLocked ? '#f8fafc' : '#eff6ff', border: isDealLocked ? '1px solid #e2e8f0' : '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: isDealLocked ? '#64748b' : '#2563eb', fontWeight: 700, fontSize: '0.85rem' }}>
            {displayAdvisor.name ? displayAdvisor.name.charAt(0) : 'A'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDealLocked ? '#1e293b' : '#1e3a8a', lineHeight: 1.2 }}>
              {displayAdvisor.name}
            </Typography>
            <Typography variant="caption" sx={{ color: isDealLocked ? '#64748b' : '#3b82f6', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {displayAdvisor.email} {displayAdvisor.phone ? `• ${displayAdvisor.phone}` : ''}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: isDealLocked ? '#fef2f2' : '#fffbeb', border: isDealLocked ? '1px solid #fee2e2' : '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: 1 }}>
          <UserX size={16} color={isDealLocked ? '#dc2626' : '#b45309'} />
          <Typography variant="caption" sx={{ color: isDealLocked ? '#991b1b' : '#b45309', fontWeight: 600 }}>
            {isDealLocked
              ? 'This case concluded unassigned. Reallocation is locked.'
              : 'This lead is unassigned. Select an advisor to allocate this case and trigger borrower email notification.'}
          </Typography>
        </Box>
      )}

      {isDealLocked ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
          <Lock size={13} color="#dc2626" style={{ flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: '#dc2626', fontSize: '0.72rem', lineHeight: 1.4, fontWeight: 600 }}>
            Advisor Reallocation Frozen: Mortgage cases that are won/approved, rejected/lost, or archived cannot be reassigned.
          </Typography>
        </Box>
      ) : (
        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1.4 }}>
          Assigning or transferring an advisor retains current pipeline stage ({lead?.stage}), moves active tasks, and automatically emails the borrower with advisor introduction.
        </Typography>
      )}
    </Paper>
  );
};

export default LeadAdvisorSection;
