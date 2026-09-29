import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Building2, CheckCircle2, Ban, DollarSign } from 'lucide-react';

export default function TenantsKpiStrip({ totalCount, activeCount, suspendedCount, totalVolume }) {
  const cards = [
    {
      title: 'TOTAL BROKERAGES',
      value: totalCount,
      sub: `${activeCount} active • ${suspendedCount} suspended`,
      icon: Building2,
      color: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      title: 'ACTIVE TENANTS',
      value: activeCount,
      sub: `${totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(0) : 100}% operational`,
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ecfdf5',
    },
    {
      title: 'SUSPENDED WORKSPACES',
      value: suspendedCount,
      sub: suspendedCount > 0 ? 'Access revoked' : 'All compliant',
      icon: Ban,
      color: suspendedCount > 0 ? '#dc2626' : '#64748b',
      bg: suspendedCount > 0 ? '#fef2f2' : '#f1f5f9',
    },
    {
      title: 'PLATFORM VOLUME',
      value: `€${(totalVolume / 1000000).toFixed(1)}M`,
      sub: 'Mortgage volume',
      icon: DollarSign,
      color: '#d97706',
      bg: '#fffbeb',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2.5,
      }}
    >
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconComponent size={24} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.05em',
                  fontSize: '0.7rem',
                  display: 'block',
                }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  mt: 0.25,
                }}
              >
                {card.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: card.color,
                  fontWeight: 600,
                  display: 'block',
                  mt: 0.25,
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {card.sub}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
}

