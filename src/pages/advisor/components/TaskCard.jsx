import React, { useState } from 'react';
import {
  Paper, Box, Typography, Checkbox, Chip, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, Avatar, Button,
} from '@mui/material';
import {
  Clock, AlertCircle, CheckCircle2, MoreVertical, Edit2, Trash2,
  ExternalLink, User, Layers, Sparkles, Archive,
} from 'lucide-react';
import { STAGE_META } from '../../../utils/automationConstants';

export const TaskCard = ({
  task,
  onToggleComplete,
  onOpenLead,
  onEditTask,
  onDeleteTask,
  userRole = 'advisor',
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [toggling, setToggling] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isAdmin = userRole === 'brokerage_admin' || userRole === 'admin';

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

  const handleCheckboxChange = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggleComplete(task._id || task.id, !task.isCompleted);
    } finally {
      setToggling(false);
    }
  };

  const now = new Date();
  const due = new Date(task.dueAt);
  const diffMs = due - now;
  const isOverdue = !task.isCompleted && diffMs < 0;
  const isUrgent = !task.isCompleted && diffMs >= 0 && diffMs < 2 * 60 * 60 * 1000;

  const getSlaLabel = () => {
    if (task.status === 'superseded') {
      return {
        label: 'Superseded',
        color: '#64748b',
        bgColor: '#f1f5f9',
        borderColor: '#cbd5e1',
        icon: CheckCircle2,
      };
    }
    if (task.isCompleted) {
      const completedDate = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt || task.createdAt || Date.now());
      const wasOnTime = task.completedAt && task.dueAt ? new Date(task.completedAt) <= new Date(task.dueAt) : true;
      const formattedDate = completedDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return {
        label: wasOnTime ? `Completed On-Time (${formattedDate})` : `Completed Past SLA (${formattedDate})`,
        color: wasOnTime ? '#059669' : '#b45309',
        bgColor: wasOnTime ? '#ecfdf5' : '#fffbeb',
        borderColor: wasOnTime ? '#a7f3d0' : '#fde68a',
        icon: wasOnTime ? CheckCircle2 : AlertCircle,
      };
    }
    if (isOverdue) {
      const breachedMins = Math.floor(Math.abs(diffMs) / (60 * 1000));
      const hours = Math.floor(breachedMins / 60);
      const mins = breachedMins % 60;
      return {
        label: `Breached by ${hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}`,
        color: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        icon: AlertCircle,
      };
    }
    if (isUrgent) {
      const mins = Math.max(1, Math.floor(diffMs / (60 * 1000)));
      return {
        label: `${mins}m remaining`,
        color: '#b45309',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        icon: Clock,
      };
    }
    const totalHours = Math.floor(diffMs / (60 * 60 * 1000));
    if (totalHours > 24) {
      return {
        label: `${Math.floor(totalHours / 24)}d ${totalHours % 24}h left`,
        color: '#2563eb',
        bgColor: '#eff6ff',
        borderColor: '#bfdbfe',
        icon: Clock,
      };
    }
    return {
      label: `${totalHours}h ${Math.floor((diffMs % 3600000) / 60000)}m left`,
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
  const taskStageMeta = task.stage ? (STAGE_META[task.stage] || { color: '#6366f1', bgColor: '#eef2ff', label: task.stage }) : null;
  const advisor = task.assignedAdvisorId;
  const PRIORITY_META = {
    high: { label: 'High', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca' },
    medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fef3c7' },
    low: { label: 'Low', color: '#10b981', bgColor: '#ecfdf5', borderColor: '#d1fae5' },
  };
  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const isArchived = Boolean(task.isCompleted && task.completedAt && (now - new Date(task.completedAt) > 7 * 24 * 60 * 60 * 1000));

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2, md: 2.25 },
        borderRadius: 2.5,
        backgroundColor: task.isCompleted ? '#fafafa' : '#ffffff',
        border: '1.5px solid',
        borderColor: isOverdue ? '#fca5a5' : '#e2e8f0',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: isOverdue ? '#ef4444' : '#cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 1.5 } }}>
        <Checkbox
          checked={Boolean(task.isCompleted)}
          disabled={toggling}
          onChange={handleCheckboxChange}
          sx={{ p: 0.5, mt: 0.25, '&.Mui-checked': { color: '#10b981' }, opacity: toggling ? 0.5 : 1 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* 1. Task Title & Admin Action Menu */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                color: task.isCompleted ? '#64748b' : '#0f172a',
                textDecoration: task.isCompleted ? 'line-through' : 'none',
                lineHeight: 1.35,
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </Typography>

            {isAdmin && (
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ color: '#94a3b8', p: 0.5, flexShrink: 0, mt: -0.5 }}
              >
                <MoreVertical size={16} />
              </IconButton>
            )}
          </Box>

          {/* 2. Metadata Chips & SLA Badge Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { xs: 0.5, sm: 0.75 },
              mb: 1.25,
            }}
          >
            {/* Priority */}
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

            {/* Task Stage */}
            {taskStageMeta && (
              <Chip
                icon={<Layers size={10} style={{ color: taskStageMeta.color }} />}
                label={taskStageMeta.label}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: taskStageMeta.bgColor,
                  color: taskStageMeta.color,
                }}
              />
            )}

            {/* Auto SLA */}
            {task.isAutoGenerated && (
              <Chip
                icon={<Sparkles size={10} style={{ color: '#059669' }} />}
                label="Auto SLA"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                }}
              />
            )}

            {/* Archived indicator */}
            {isArchived && (
              <Chip
                icon={<Archive size={10} style={{ color: '#4338ca' }} />}
                label="Archived (7d+)"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#eef2ff',
                  color: '#4338ca',
                  border: '1px solid #c7d2fe',
                }}
              />
            )}

            {/* SLA Time Chip */}
            <Chip
              icon={<SlaIcon size={12} />}
              label={sla.label}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: sla.bgColor,
                color: sla.color,
                border: `1px solid ${sla.borderColor}`,
              }}
            />
          </Box>
          {/* Description */}
          {task.description && (
            <Typography
              variant="body2"
              sx={{ color: '#475569', fontSize: { xs: '0.78rem', sm: '0.825rem' }, mb: 1.25, lineHeight: 1.4 }}
            >
              {task.description}
            </Typography>
          )}
          {task.completedReason && (
            <Typography
              variant="caption"
              sx={{ display: 'block', color: '#64748b', fontSize: '0.72rem', fontStyle: 'italic', mb: 1 }}
            >
              Reason: {task.completedReason}
            </Typography>
          )}

          {/* 3. Footer: Borrower dossier link + Advisor avatar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 1.5 },
              pt: 1,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            {lead ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 0.75, sm: 1 },
                  p: { xs: '4px 8px', sm: '4px 10px' },
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <User size={12} color="#64748b" />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: '0.75rem', sm: '0.78rem' } }}
                  >
                    {lead.firstName} {lead.lastName}
                  </Typography>
                </Box>

                {leadStageMeta && (
                  <Chip
                    label={leadStageMeta.label}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      backgroundColor: leadStageMeta.bgColor,
                      color: leadStageMeta.color,
                    }}
                  />
                )}

                <Button
                  size="small"
                  onClick={() => onOpenLead(lead)}
                  endIcon={<ExternalLink size={11} />}
                  sx={{
                    p: 0,
                    minWidth: 0,
                    ml: { xs: 'auto', sm: 0.5 },
                    textTransform: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
                  }}
                >
                  Open Dossier
                </Button>
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.75rem' }}>
                General Brokerage Task
              </Typography>
            )}

            {advisor && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                }}
              >
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    fontSize: '0.65rem',
                    bgcolor: '#2563eb',
                    fontWeight: 700,
                  }}
                >
                  {advisor.name ? advisor.name.charAt(0) : 'A'}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{ color: '#475569', fontWeight: 600, fontSize: '0.75rem' }}
                >
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