import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const DocumentMetricsBar = ({ documents = [], activeStatus, onStatusChange }) => {
  const totalDocs = documents.length;
  const processingDocs = documents.filter((d) => d.status === 'processing' || d.status === 'pending').length;
  const verifiedDocs = documents.filter((d) => d.status === 'verified').length;
  const rejectedDocs = documents.filter((d) => d.status === 'rejected').length;

  const verifiedPercent = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0;

  const cards = [
    {
      key: 'processing',
      label: 'Action Required',
      sublabel: 'Processing & Review',
      count: processingDocs,
      icon: Clock,
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      activeBorder: '#d97706',
    },
    {
      key: 'verified',
      label: 'Verified & Bank-Ready',
      sublabel: `${verifiedPercent}% compliance rate`,
      count: verifiedDocs,
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      activeBorder: '#059669',
    },
    {
      key: 'rejected',
      label: 'Revision Requested',
      sublabel: 'Requires client re-upload',
      count: rejectedDocs,
      icon: AlertTriangle,
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      activeBorder: '#dc2626',
    },
    {
      key: 'all',
      label: 'Total Documents',
      sublabel: 'Across all active cases',
      count: totalDocs,
      icon: FileText,
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      activeBorder: '#2563eb',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: { xs: 1, sm: 1.5, md: 2 },
        mb: { xs: 2, md: 3 },
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.key;
        return (
          <Paper
            key={card.key}
            onClick={() => onStatusChange(card.key)}
            elevation={0}
            sx={{
              p: { xs: 1.25, sm: 1.5, md: 2 },
              borderRadius: { xs: 2, md: 3 },
              backgroundColor: '#ffffff',
              border: '1.5px solid',
              borderColor: isSelected ? card.activeBorder : '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? `0 4px 14px ${card.color}25` : '0 1px 3px rgba(0, 0, 0, 0.03)',
              '&:hover': {
                borderColor: card.activeBorder,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 18px ${card.color}20`,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: { xs: 0.75, sm: 1, md: 1.25 },
              }}
            >
              <Typography
                variant="caption"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: '#64748b',
                  fontSize: { xs: '0.62rem', sm: '0.72rem', md: '0.8rem' },
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {card.label}
              </Typography>
              <Box
                sx={{
                  width: { xs: 24, sm: 28, md: 34 },
                  height: { xs: 24, sm: 28, md: 34 },
                  borderRadius: 1.5,
                  backgroundColor: card.bg,
                  border: `1px solid ${card.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
              {card.sublabel}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default DocumentMetricsBar;
