import React from 'react';
import {
  Drawer, Box, Typography, IconButton, Button, Chip, Divider,
  MenuItem, FormControl, InputLabel, Select, Alert, Paper, Avatar,
  CircularProgress, LinearProgress,
} from '@mui/material';
import {
  X, UserCheck, ShieldAlert, Mail, Phone,
  MapPin, Briefcase, CreditCard, Share2, UserX,
} from 'lucide-react';
import LeadNotesTimeline from './LeadNotesTimeline';
import LeadFinanceSummary from './LeadFinanceSummary';
import { STAGE_META } from '../../../utils/automationConstants';

const ALL_STAGES = [
  { key: 'New', label: '01: Ingestion' },
  { key: 'Contacted', label: '02: Consultation' },
  { key: 'Document Collection', label: '03: Documents' },
  { key: 'Bank Submission', label: '04: Bank Sub' },
  { key: 'Won', label: '05: Approval' },
  { key: 'Lost', label: '06: Closing' },
];

export const LeadDossierDrawer = ({
  open,
  onClose,
  lead,
  advisors = [],
  userRole = 'advisor',
  isAssigningAdvisor = false,
  onStageChange,
  onAssignAdvisor,
  onConvertToClient,
  onResolveDuplicate,
  onAddNote,
}) => {
  if (!lead) return null;

  const canChangeStage = userRole === 'advisor';
  const meta = STAGE_META[lead.stage] || { color: '#2563eb', bgColor: '#eff6ff', label: lead.stage };
  const currentAdvisorId = lead.assignedAdvisorId?._id || lead.assignedAdvisorId || '';
  const currentAdvisorObj = typeof lead.assignedAdvisorId === 'object' && lead.assignedAdvisorId !== null
    ? lead.assignedAdvisorId
    : advisors.find((a) => String(a._id || a.id) === String(currentAdvisorId));
  const displayAdvisor = currentAdvisorObj || (currentAdvisorId ? { name: 'Assigned Advisor', email: String(currentAdvisorId) } : null);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 490, md: 540 },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          boxSizing: 'border-box',
          boxShadow: '-6px 0 28px rgba(15, 23, 42, 0.12)',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={meta.label}
              size="small"
              sx={{ fontWeight: 800, backgroundColor: meta.bgColor, color: meta.color, height: 24, borderRadius: 1.5 }}
            />
            {lead.isConverted && (
              <Chip
                label="Client Portal Active"
                size="small"
                color="success"
                icon={<UserCheck size={13} />}
                sx={{ height: 24, fontWeight: 700, borderRadius: 1.5 }}
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
              <Button size="small" color="inherit" onClick={() => onResolveDuplicate(lead._id || lead.id)} sx={{ fontWeight: 700 }}>
                Mark Unique
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Pipeline Stage Progression
          </Typography>
          {!canChangeStage && (
            <Chip
              label="Advisor Managed"
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, backgroundColor: '#e2e8f0', color: '#475569' }}
            />
          )}
        </Box>

        {!canChangeStage && (
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.73rem', display: 'block', mb: 1.25 }}>
            Stage progression is handled by Mortgage Advisors. As Brokerage Admin, you can assign or switch the advisor below.
          </Typography>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {ALL_STAGES.map((s) => {
            const isCurrent = lead.stage === s.key;
            return (
              <Button
                key={s.key}
                size="small"
                variant={isCurrent ? 'contained' : 'outlined'}
                disabled={!canChangeStage && !isCurrent}
                onClick={() => canChangeStage && onStageChange(lead._id || lead.id, s.key, lead.stage)}
                sx={{
                  borderRadius: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: isCurrent ? '#18181b' : '#ffffff',
                  borderColor: isCurrent ? '#18181b' : '#cbd5e1',
                  color: isCurrent ? '#ffffff' : '#334155',
                  boxShadow: 'none',
                  opacity: (!canChangeStage && !isCurrent) ? 0.6 : 1,
                  cursor: canChangeStage ? 'pointer' : (isCurrent ? 'default' : 'not-allowed'),
                  '&:hover': {
                    backgroundColor: isCurrent ? '#27272a' : (canChangeStage ? '#f1f5f9' : '#ffffff'),
                    borderColor: isCurrent ? '#27272a' : (canChangeStage ? '#94a3b8' : '#cbd5e1'),
                  },
                }}
              >
                {s.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Scrollable Details Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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

        {/* Mortgage Advisor Assignment */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            backgroundColor: '#ffffff',
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
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Mortgage Advisor Assignment
            </Typography>
            {isAssigningAdvisor ? (
              <Chip
                icon={<CircularProgress size={11} thickness={5} sx={{ color: '#2563eb' }} />}
                label="Assigning & Notifying..."
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                }}
              />
            ) : displayAdvisor ? (
              <Chip
                label="Assigned"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
              />
            ) : null}
          </Box>

          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel id="drawer-advisor-label" sx={{ fontWeight: 600, color: '#475569' }}>
              Assigned Mortgage Advisor
            </InputLabel>
            <Select
              labelId="drawer-advisor-label"
              value={String(currentAdvisorId || '')}
              label="Assigned Mortgage Advisor"
              disabled={isAssigningAdvisor}
              onChange={(e) => onAssignAdvisor(lead._id || lead.id, e.target.value)}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f8fafc',
                fontWeight: 600,
                color: '#0f172a',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#94a3b8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2563eb',
                },
              }}
              MenuProps={{
                sx: { zIndex: (theme) => theme.zIndex.modal + 200 },
                PaperProps: {
                  sx: {
                    maxHeight: 280,
                    borderRadius: 2,
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
                  },
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
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={28} thickness={4.5} sx={{ color: '#2563eb' }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e40af', fontSize: '0.84rem', lineHeight: 1.2 }}>
                  Updating Advisor Allocation...
                </Typography>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontSize: '0.72rem', display: 'block', mt: 0.25 }}>
                  Reassigning open tasks and dispatching intro email to borrower
                </Typography>
              </Box>
            </Box>
          ) : displayAdvisor ? (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb', fontWeight: 700, fontSize: '0.85rem' }}>
                {displayAdvisor.name ? displayAdvisor.name.charAt(0) : 'A'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e3a8a', lineHeight: 1.2 }}>
                  {displayAdvisor.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#3b82f6', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {displayAdvisor.email} {displayAdvisor.phone ? `• ${displayAdvisor.phone}` : ''}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#fffbeb', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: 1 }}>
              <UserX size={16} color="#b45309" />
              <Typography variant="caption" sx={{ color: '#b45309', fontWeight: 600 }}>
                This lead is unassigned. Select an advisor to allocate this case and trigger borrower email notification.
              </Typography>
            </Box>
          )}

          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1.4 }}>
            Assigning or transferring an advisor retains current pipeline stage ({lead.stage}), moves active tasks, and automatically emails the borrower with advisor introduction.
          </Typography>
        </Paper>

        {!lead.isConverted ? (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<UserCheck size={16} />}
            onClick={() => onConvertToClient(lead._id || lead.id)}
            sx={{
              py: 1.2,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            Convert to Client Portal Account
          </Button>
        ) : (
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <UserCheck size={18} color="#059669" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065f46' }}>
                Client Portal Account Active
              </Typography>
              <Typography variant="caption" sx={{ color: '#047857' }}>
                Borrower has access to client portal and document checklist.
              </Typography>
            </Box>
          </Paper>
        )}

        <Divider />

        <LeadNotesTimeline
          notesList={lead.notesList || []}
          onAddNote={(text) => onAddNote(lead._id || lead.id, text)}
        />
      </Box>
    </Drawer>
  );
};

export default LeadDossierDrawer;
