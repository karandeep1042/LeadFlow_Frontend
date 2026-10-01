import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import {
  BarChart3,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  FileCheck,
  Layers,
} from 'lucide-react';
import { fetchPlatformOverviewMetrics } from '../../redux/thunks/tenantThunk';
import AnalyticsFunnel from './components/AnalyticsFunnel';
import AnalyticsLeaderboard from './components/AnalyticsLeaderboard';

export default function PlatformAnalyticsPage() {
  const dispatch = useDispatch();
  const { platformMetrics, loading } = useSelector((state) => state.tenant);

  useEffect(() => {
    dispatch(fetchPlatformOverviewMetrics());
  }, [dispatch]);

  const {
    activeBrokerages = 0,
    totalLeads = 0,
    totalMortgagesAcquired = 0,
    totalVolumeEur = 0,
    totalDocs = 0,
    verifiedDocs = 0,
    rejectedDocs = 0,
    pendingDocs = 0,
    documentAcceptedRate = 94.2,
    documentRejectedRate = 5.8,
    funnel = [],
    leaderboard = [],
  } = platformMetrics || {};

  const kpis = [
    {
      title: 'TOTAL LEADS PROCESSED',
      value: totalLeads,
      sub: `Across ${activeBrokerages} active brokerages`,
      icon: Layers,
      color: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      title: 'ACQUIRED MORTGAGES',
      value: totalMortgagesAcquired,
      sub: 'Won & Funded deals',
      icon: CheckCircle2,
      color: '#059669',
      bg: '#ecfdf5',
    },
    {
      title: 'AGGREGATED DEAL VOLUME',
      value: `€${(totalVolumeEur / 1000000).toFixed(1)}M`,
      sub: 'Originated loans in Germany',
      icon: DollarSign,
      color: '#d97706',
      bg: '#fffbeb',
    },
    {
      title: 'DOCUMENT ACCEPTANCE',
      value: `${documentAcceptedRate}%`,
      sub: `${verifiedDocs} verified • ${rejectedDocs} revisions`,
      icon: FileCheck,
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5', mb: 0.5 }}>
              <BarChart3 size={16} />
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Global Intelligence
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Platform Analytics & Funnel
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Cross-brokerage conversion funnel, mortgage deal volume rankings, and underwriting accuracy.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => dispatch(fetchPlatformOverviewMetrics())}
            disabled={loading}
            startIcon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', backgroundColor: '#ffffff', '&:hover': { backgroundColor: '#f8fafc' } }}
          >
            Refresh Analytics
          </Button>
        </Box>

        {/* Top KPI Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {kpis.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <Paper key={idx} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2.5, backgroundColor: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComponent size={24} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', fontSize: '0.7rem', display: 'block' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2, mt: 0.25 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: card.color, fontWeight: 600, display: 'block', mt: 0.25, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {card.sub}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Funnel + Document Health */}
        <AnalyticsFunnel
          funnel={funnel}
          verifiedDocs={verifiedDocs}
          rejectedDocs={rejectedDocs}
          pendingDocs={pendingDocs}
          documentAcceptedRate={documentAcceptedRate}
          documentRejectedRate={documentRejectedRate}
          totalDocs={totalDocs}
        />

        {/* Leaderboard */}
        <AnalyticsLeaderboard leaderboard={leaderboard} />
      </Box>
    </Box>
  );
}
