import React from 'react';
import { Paper, Box, Typography, Chip, Avatar, Tooltip, IconButton } from '@mui/material';
import { MapPin, ShieldAlert, UserX, ChevronRight } from 'lucide-react';

const VISA_BADGES = {
  'EU Blue Card': { color: '#2563eb', bg: '#eff6ff' },
  'Permanent Residence (Niederlassungserlaubnis)': { color: '#059669', bg: '#ecfdf5' },
  'EU Citizen': { color: '#7c3aed', bg: '#f5f3ff' },
  'Freelance / Self-Employed (Freiberufler)': { color: '#d97706', bg: '#fffbeb' },
};

export const LeadCard = ({ lead, onClick, onAdvanceStage, nextStageLabel, canChangeStage = true }) => {
  const ltv = lead.purchasePrice > 0 ? Math.round((lead.loanAmount / lead.purchasePrice) * 100) : null;
  const visaStyle = VISA_BADGES[lead.visaType] || { color: '#475569', bg: '#f1f5f9' };
  const advisor = lead.assignedAdvisorId;

  const handleDragStart = (e) => {
    if (!canChangeStage) return;
    e.dataTransfer.setData('leadId', lead._id || lead.id);
    e.dataTransfer.setData('currentStage', lead.stage);
  };

  return (
    <Paper
      elevation={0}
      draggable={canChangeStage}
      onDragStart={handleDragStart}
      onClick={() => onClick(lead)}
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: lead.isDuplicate && !lead.duplicateResolved ? '#fca5a5' : '#e2e8f0',
        backgroundColor: '#ffffff',
        cursor: canChangeStage ? 'grab' : 'pointer',
        transition: 'all 0.18s ease',
        '&:hover': {
          borderColor: '#2563eb',
          boxShadow: '0 4px 14px -2px rgba(37, 99, 235, 0.12)',
          transform: 'translateY(-2px)',
        },
        '&:active': { cursor: canChangeStage ? 'grabbing' : 'pointer' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {/* Name & City */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {lead.firstName} {lead.lastName}
            </Typography>
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
          {lead.isDuplicate && !lead.duplicateResolved && (
            <Tooltip title="Potential duplicate inquiry detected">
              <Chip label="Duplicate" size="small" icon={<ShieldAlert size={12} />} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#fef2f2', color: '#dc2626' }} />
            </Tooltip>
          )}
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

        {/* Visa Tag */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip label={lead.visaType || 'EU Blue Card'} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: visaStyle.bg, color: visaStyle.color }} />
        </Box>

        {/* Advisor & Move Action */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #f1f5f9' }}>
          {advisor ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Avatar sx={{ width: 22, height: 22, fontSize: '0.7rem', bgcolor: '#2563eb', fontWeight: 700 }}>
                {advisor.name ? advisor.name.charAt(0) : 'A'}
              </Avatar>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>{advisor.name}</Typography>
            </Box>
          ) : (
            <Chip label="Unassigned" size="small" icon={<UserX size={12} />} sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#fffbeb', color: '#b45309' }} />
          )}

          {nextStageLabel && canChangeStage && (
            <Tooltip title={`Advance to ${nextStageLabel}`}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onAdvanceStage(lead); }} sx={{ p: 0.5, borderRadius: 1.5, backgroundColor: '#f1f5f9', color: '#2563eb', '&:hover': { backgroundColor: '#eff6ff' } }}>
                <ChevronRight size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default LeadCard;
