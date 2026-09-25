import React from 'react';
import { Paper, Box, Typography, Button, Switch, Chip } from '@mui/material';
import { Zap, Mail, CheckSquare, Edit3, Eye, Clock } from 'lucide-react';
import { STAGE_META } from '../../../utils/automationConstants';

export const StageTriggerCard = ({ trigger, onToggle, onEdit, onPreview }) => {
  const meta = STAGE_META[trigger.stage] || {
    code: 'Stage',
    label: trigger.stage,
    color: '#2563eb',
    bgColor: '#eff6ff',
  };

  const template = trigger.emailTemplateId || {};
  const subject = template.subject || trigger.subject || '(No subject)';
  const body = template.body || trigger.body || '';
  const isActive = trigger.isActive !== undefined ? trigger.isActive : true;

  const priorityColors = {
    high: { color: '#dc2626', bg: '#fef2f2' },
    medium: { color: '#d97706', bg: '#fffbeb' },
    low: { color: '#475569', bg: '#f1f5f9' },
  };

  const currentPriority = priorityColors[trigger.taskPriority || 'medium'] || priorityColors.medium;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: isActive ? '#e2e8f0' : '#f1f5f9',
        backgroundColor: isActive ? '#ffffff' : '#fafafa',
        opacity: isActive ? 1 : 0.8,
        transition: 'all 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '10px', backgroundColor: isActive ? meta.bgColor : '#f1f5f9', color: isActive ? meta.color : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: meta.color }}>{meta.code}</Typography>
                <Chip label={isActive ? 'Active' : 'Paused'} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, backgroundColor: isActive ? '#ecfdf5' : '#f1f5f9', color: isActive ? '#059669' : '#64748b' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{meta.label}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button size="small" variant="outlined" startIcon={<Eye size={14} />} onClick={() => onPreview(trigger)} sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1' }}>
              Preview Email
            </Button>
            <Button size="small" variant="contained" startIcon={<Edit3 size={14} />} onClick={() => onEdit(trigger)} sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: '#18181b', color: '#ffffff' }}>
              Edit Rule
            </Button>
            <Switch checked={isActive} onChange={() => onToggle(trigger)} color="primary" />
          </Box>
        </Box>

        {/* Content Details Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, gap: 2, pt: 1, borderTop: '1px solid #f1f5f9' }}>
          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Mail size={15} color="#2563eb" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>Borrower Email Notification</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Subject: {subject}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {body || '(No body copy configured)'}
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckSquare size={15} color="#059669" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>Advisor Task Generation</Typography>
              </Box>
              <Chip label={(trigger.taskPriority || 'medium').toUpperCase()} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, backgroundColor: currentPriority.bg, color: currentPriority.color }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
              {trigger.taskTitle || 'Standard stage follow-up checklist'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b', fontSize: '0.75rem' }}>
              <Clock size={13} />
              <span>Due within {trigger.taskDueHours || 24} hours of stage entry</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StageTriggerCard;
