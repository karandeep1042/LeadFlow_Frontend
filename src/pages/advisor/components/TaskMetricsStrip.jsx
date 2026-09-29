import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { AlertCircle, Clock, Calendar, CheckCircle2, Archive } from 'lucide-react';

export const TaskMetricsStrip = ({
  counts = { overdue: 0, dueToday: 0, upcoming: 0, completed: 0, archive: 0, total: 0 },
  analytics,
  activeTab = 'all',
  onTabChange,
}) => {
  const onTimeRate = analytics?.onTimeRate ?? (counts.total > 0
    ? Math.round((counts.completed / Math.max(1, counts.completed + counts.overdue)) * 100)
    : 100);

  const cards = [
    {
      id: 'overdue',
      label: 'SLA Breached',
      count: counts.overdue,
      icon: AlertCircle,
      color: '#ef4444',
      bgColor: counts.overdue > 0 ? '#fef2f2' : '#ffffff',
      borderColor: counts.overdue > 0 ? '#fecaca' : '#e2e8f0',
      textColor: '#991b1b',
      subtitle: counts.overdue > 0 ? 'Requires immediate action' : 'Zero overdue items',
    },
    {
      id: 'due_today',
      label: 'Due Today',
      count: counts.dueToday,
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#ffffff',
      borderColor: activeTab === 'due_today' ? '#f59e0b' : '#e2e8f0',
      textColor: '#92400e',
      subtitle: 'To be resolved today',
    },
    {
      id: 'upcoming',
      label: 'Upcoming Queue',
      count: counts.upcoming,
      icon: Calendar,
      color: '#3b82f6',
      bgColor: '#ffffff',
      borderColor: activeTab === 'upcoming' ? '#3b82f6' : '#e2e8f0',
      textColor: '#1e40af',
      subtitle: 'Scheduled milestones',
    },
    {
      id: 'completed',
      label: 'Completed (7d)',
      count: counts.completed,
      icon: CheckCircle2,
      color: '#10b981',
      bgColor: '#ffffff',
      borderColor: activeTab === 'completed' ? '#10b981' : '#e2e8f0',
      textColor: '#065f46',
      subtitle: `${onTimeRate}% SLA On-Time`,
    },
    {
      id: 'archive',
      label: 'Task Archive',
      count: counts.archive,
      icon: Archive,
      color: '#6366f1',
      bgColor: '#ffffff',
      borderColor: activeTab === 'archive' ? '#6366f1' : '#e2e8f0',
      textColor: '#4338ca',
      subtitle: 'Historical audit trail',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(5, 1fr)',
        },
        gap: { xs: 1, sm: 1.5, md: 2 },
        mb: { xs: 2, md: 3 },
      }}
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;

        return (
          <Paper
            key={card.id}
            elevation={0}
            onClick={() => onTabChange(card.id)}
            sx={{
              p: { xs: 1.25, sm: 1.5, md: 2 },
              borderRadius: { xs: 2, md: 3 },
              backgroundColor: card.bgColor,
              border: '1.5px solid',
              borderColor: isActive ? card.color : card.borderColor,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 4px 14px ${card.color}25` : '0 1px 3px rgba(0,0,0,0.04)',
              ...(index === 4 && {
                gridColumn: { xs: 'span 2', sm: 'auto' },
              }),
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: card.color,
                boxShadow: `0 6px 18px ${card.color}20`,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 0.75, sm: 1, md: 1.25 } }}>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: { xs: '0.62rem', sm: '0.68rem', md: '0.72rem' },
                }}
              >
                {card.label}
              </Typography>
              <Box
                sx={{
                  width: { xs: 24, sm: 28, md: 32 },
                  height: { xs: 24, sm: 28, md: 32 },
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${card.color}15`,
                  color: card.color,
                  flexShrink: 0,
                  ml: 0.5,
                }}
              >
                <Icon size={16} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.85rem' },
                }}
              >
                {card.count}
              </Typography>
            </Box>

            <Typography
              variant="caption"
              noWrap
              sx={{
                color: '#64748b',
                mt: { xs: 0.35, sm: 0.5, md: 0.75 },
                display: 'block',
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                fontWeight: 500,
              }}
            >
              {card.subtitle}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default TaskMetricsStrip;