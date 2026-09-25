import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { AlertCircle, Clock, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

export const TaskMetricsStrip = ({
  counts = { overdue: 0, dueToday: 0, upcoming: 0, completed: 0, total: 0 },
  activeTab = 'all',
  onTabChange,
}) => {
  const complianceRate = counts.total > 0
    ? Math.round(((counts.completed) / (counts.total)) * 100)
    : 100;

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
      label: 'Completed Tasks',
      count: counts.completed,
      icon: CheckCircle2,
      color: '#10b981',
      bgColor: '#ffffff',
      borderColor: activeTab === 'completed' ? '#10b981' : '#e2e8f0',
      textColor: '#065f46',
      subtitle: `${complianceRate}% Resolution rate`,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeTab === card.id;

        return (
          <Paper
            key={card.id}
            elevation={0}
            onClick={() => onTabChange(card.id)}
            sx={{
              p: 2.25,
              borderRadius: 3,
              backgroundColor: card.bgColor,
              border: '1.5px solid',
              borderColor: isActive ? card.color : card.borderColor,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 4px 14px ${card.color}25` : '0 1px 3px rgba(0,0,0,0.04)',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: card.color,
                boxShadow: `0 6px 18px ${card.color}20`,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.72rem' }}>
                {card.label}
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${card.color}15`,
                  color: card.color,
                }}
              >
                <Icon size={18} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {card.count}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.75, display: 'block', fontSize: '0.75rem', fontWeight: 500 }}>
              {card.subtitle}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default TaskMetricsStrip;