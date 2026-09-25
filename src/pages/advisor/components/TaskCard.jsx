import React, { useState } from 'react';
import {
  Paper, Box, Typography, Checkbox, Chip, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, Avatar, Button,
} from '@mui/material';
import {
  Clock, AlertCircle, CheckCircle2, MoreVertical, Edit2, Trash2,
  ExternalLink, User,
} from 'lucide-react';
import { STAGE_META } from '../../../utils/automationConstants';

export const TaskCard = ({
  task,
  onToggleComplete,
  onOpenLead,
  onEditTask,
  onDeleteTask,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    onEditTask(task);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDeleteTask(task._id || task.id);
  };

  const now = new Date();
  const due = new Date(task.dueAt);
  const diffMs = due - now;
  const isOverdue = !task.isCompleted && diffMs < 0;
  const isUrgent = !task.isCompleted && diffMs >= 0 && diffMs < 2 * 60 * 60 * 1000;

  const getSlaLabel = () => {
    if (task.isCompleted) {
      const completedDate = task.completedAt ? new Date(task.completedAt) : new Date();
      return {
        label: `Completed ${completedDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        color: '#059669',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        icon: CheckCircle2,
      };
    }
    if (isOverdue) {
      const breachedMins = Math.floor(Math.abs(diffMs) / (60 * 1000));
      const hours = Math.floor(breachedMins / 60);
      const mins = breachedMins % 60;
      return {
        label: `🚨 Breached by ${hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}`,
        color: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        icon: AlertCircle,
      };
    }
    if (isUrgent) {
      const mins = Math.max(1, Math.floor(diffMs / (60 * 1000)));
      return {
        label: `⚡ ${mins}m remaining`,
        color: '#b45309',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        icon: Clock,
      };
    }
    const totalHours = Math.floor(diffMs / (60 * 60 * 1000));
    if (totalHours > 24) {
      return {
        label: `⏱️ ${Math.floor(totalHours / 24)}d ${totalHours % 24}h left`,
        color: '#2563eb',
        bgColor: '#eff6ff',
        borderColor: '#bfdbfe',
        icon: Clock,
      };
    }
    return {
      label: `⏱️ ${totalHours}h ${Math.floor((diffMs % 3600000) / 60000)}m left`,
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      icon: Clock,
    };
  };

  const sla = getSlaLabel();
  const SlaIcon = sla.icon;
  const lead = task.leadId;
  const leadStageMeta = lead?.stage ? (STAGE_META[lead.stage] || { color: '#2563eb', bgColor: '#eff6ff', label: lead.stage }) : null;
  const advisor = task.assignedAdvisorId;
  const PRIORITY_META = {
    high: { label: 'High', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca' },
    medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fef3c7' },
    low: { label: 'Low', color: '#10b981', bgColor: '#ecfdf5', borderColor: '#d1fae5' },
  };
  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 2.5,
        backgroundColor: task.isCompleted ? '#fafafa' : '#ffffff',
        border: '1.5px solid',
        borderColor: isOverdue ? '#fca5a5' : '#e2e8f0',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: isOverdue ? '#ef4444' : '#cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Checkbox
          checked={Boolean(task.isCompleted)}
          onChange={() => onToggleComplete(task._id || task.id, !task.isCompleted)}
          sx={{ p: 0.5, mt: 0.25, '&.Mui-checked': { color: '#10b981' } }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.95rem', color: task.isCompleted ? '#64748b' : '#0f172a', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                {task.title}
              </Typography>
              <Chip
                label={priority.label}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: priority.bgColor,
                  color: priority.color,
                  border: `1px solid ${priority.borderColor}`,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip icon={<SlaIcon size={13} />} label={sla.label} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 800, backgroundColor: sla.bgColor, color: sla.color, border: `1px solid ${sla.borderColor}` }} />
              <IconButton size="small" onClick={handleMenuClick} sx={{ color: '#94a3b8' }}><MoreVertical size={16} /></IconButton>
            </Box>
          </Box>
          {task.description && (
            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.825rem', mb: 1.25, lineHeight: 1.4 }}>
              {task.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
            {lead ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '3px 8px', borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <User size={12} color="#64748b" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {lead.firstName} {lead.lastName}
                </Typography>
                {leadStageMeta && (
                  <Chip label={leadStageMeta.label} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, backgroundColor: leadStageMeta.bgColor, color: leadStageMeta.color }} />
                )}
                <Button size="small" onClick={() => onOpenLead(lead)} endIcon={<ExternalLink size={11} />} sx={{ p: 0, minWidth: 0, ml: 0.5, textTransform: 'none', fontSize: '0.72rem', fontWeight: 700, color: '#2563eb' }}>
                  Open Dossier
                </Button>
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                General Brokerage Task
              </Typography>
            )}

            {advisor && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: '#2563eb', fontWeight: 700 }}>
                  {advisor.name ? advisor.name.charAt(0) : 'A'}
                </Avatar>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                  {advisor.name}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', minWidth: 140 } }}>
        <MenuItem onClick={handleEdit} sx={{ fontSize: '0.825rem', gap: 1 }}>
          <ListItemIcon sx={{ minWidth: 24, color: '#475569' }}><Edit2 size={14} /></ListItemIcon>
          <ListItemText primary="Edit Task" primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: 600 }} />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: '0.825rem', gap: 1, color: '#ef4444' }}>
          <ListItemIcon sx={{ minWidth: 24, color: '#ef4444' }}><Trash2 size={14} /></ListItemIcon>
          <ListItemText primary="Delete Task" primaryTypographyProps={{ fontSize: '0.825rem', fontWeight: 600, color: '#ef4444' }} />
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default TaskCard;