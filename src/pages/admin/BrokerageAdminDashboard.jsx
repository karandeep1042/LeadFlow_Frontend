import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Stack, Divider, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Skeleton, Alert, Snackbar, IconButton, Tooltip,
} from '@mui/material';
import {
  Users, Webhook, Zap, TrendingUp, UserCheck, FileCheck, Plus, UserPlus,
  ArrowRight, Radio, Sparkles, Kanban, RefreshCw, Clock,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ROUTES } from '../../utils/constants/routes';
import { fetchBrokerageDashboard } from '../../redux/thunks/brokerageDashboardThunk';
import { clearDashboardError } from '../../redux/slices/brokerageDashboardSlice';
import { subscribeToSocketEvent } from '../../services/socket/socketService';

export const BrokerageAdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useSelector((state) => state.brokerageDashboard);

  useEffect(() => {
    dispatch(fetchBrokerageDashboard());
  }, [dispatch]);

  // Real-time auto-refresh on organization updates
  useEffect(() => {
    const unsub1 = subscribeToSocketEvent('lead:stage_updated', () => {
      dispatch(fetchBrokerageDashboard());
    });
    const unsub2 = subscribeToSocketEvent('lead:created', () => {
      dispatch(fetchBrokerageDashboard());
    });
    const unsub3 = subscribeToSocketEvent('lead:updated', () => {
      dispatch(fetchBrokerageDashboard());
    });
    const unsub4 = subscribeToSocketEvent('task:created', () => {
      dispatch(fetchBrokerageDashboard());
    });
    const unsub5 = subscribeToSocketEvent('task:updated', () => {
      dispatch(fetchBrokerageDashboard());
    });
    const unsub6 = subscribeToSocketEvent('task:deleted', () => {
      dispatch(fetchBrokerageDashboard());
    });
    const unsub7 = subscribeToSocketEvent('task:synced', () => {
      dispatch(fetchBrokerageDashboard());
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
      unsub7();
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchBrokerageDashboard());
  };

  const kpis = data?.kpis || {};
  const brokerage = data?.brokerage || {};
  const advisors = data?.advisors || [];
  const webhooks = data?.webhooks || [];
  const stageAutomations = data?.stageAutomations || [];
  const recentLeads = data?.recentLeads || [];
  const tasksSummary = data?.tasksSummary || {};

  const stats = [
    {
      title: 'Ingested Leads',
      value: loading && !data ? '...' : String(kpis.totalLeads ?? 0),
      change: kpis.leadsChange ? `${kpis.leadsChange} this mo` : '+0',
      period: 'total in system',
      icon: Users,
      color: '#2563eb',
      bg: '#eff6ff',
    },
    {
      title: 'Converted Clients',
      value: loading && !data ? '...' : String(kpis.convertedClients ?? 0),
      change: kpis.conversionRate || '0.0%',
      period: 'conversion rate',
      icon: UserCheck,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      title: 'Verified Docs',
      value: loading && !data ? '...' : String(kpis.verifiedDocs ?? 0),
      change: kpis.docVerificationRate || '0.0%',
      period: 'compliance rate',
      icon: FileCheck,
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
    {
      title: 'Pipeline Volume',
      value: loading && !data ? '...' : (kpis.pipelineVolumeFormatted || '€0.0M'),
      change: kpis.averageLoanFormatted ? `Avg ${kpis.averageLoanFormatted}` : '€0',
      period: `${kpis.activeDealsCount ?? 0} active deals`,
      icon: TrendingUp,
      color: '#d97706',
      bg: '#fffbeb',
    },
  ];

  return (
    <DashboardLayout>
      {/* Top Header */}
      <Box
        sx={{
          mb: { xs: 2.5, md: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Sparkles size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                Brokerage Control Center
              </Typography>
              <Chip
                label={brokerage.status ? brokerage.status.toUpperCase() : 'ACTIVE'}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  borderRadius: 1,
                }}
              />
            </Box>

            {/* Mobile Inline Refresh Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Tooltip title="Refresh real-time data">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 2,
                    p: 0.75,
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.1rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {brokerage.name || user?.brokerage?.name || 'Brokerage Dashboard'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              mt: 0.5,
              maxWidth: 620,
            }}
          >
            Real-time multi-channel lead ingestion, advisor pipeline tracking, and email automation rules.
          </Typography>
        </Box>

        {/* Action Buttons */}
        {/* Desktop View (>= md) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.25,
            flexShrink: 0,
          }}
        >
          <Tooltip title="Refresh real-time data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                p: 1.1,
                backgroundColor: '#ffffff',
                color: '#475569',
                '&:hover': { backgroundColor: '#f8fafc' },
              }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Users size={16} />}
            onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_TEAM)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2,
              whiteSpace: 'nowrap',
            }}
          >
            Manage Advisors
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<UserCheck size={16} />}
            onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_CLIENTS)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2,
              whiteSpace: 'nowrap',
            }}
          >
            Manage Clients
          </Button>
          <Button
            variant="contained"
            startIcon={<Kanban size={16} />}
            onClick={() => navigate(ROUTES.ADVISOR_PIPELINE)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#18181b',
              color: '#ffffff',
              px: 2.5,
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Open Live Pipeline
          </Button>
        </Box>

        {/* Mobile View (< md) */}
        <Box
          sx={{
            display: { xs: 'grid', md: 'none' },
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
            gap: 1,
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<Users size={15} />}
            onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_TEAM)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: { xs: '0.78rem', sm: '0.82rem' },
              py: 0.85,
              borderColor: '#cbd5e1',
              color: '#334155',
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
            }}
          >
            Manage Advisors
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<UserCheck size={15} />}
            onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_CLIENTS)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: { xs: '0.78rem', sm: '0.82rem' },
              py: 0.85,
              borderColor: '#cbd5e1',
              color: '#2563eb',
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: '#93c5fd', backgroundColor: '#eff6ff' },
            }}
          >
            Manage Clients
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Kanban size={15} />}
            onClick={() => navigate(ROUTES.ADVISOR_PIPELINE)}
            sx={{
              gridColumn: { xs: 'span 2', sm: 'span 1' },
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.82rem' },
              py: 0.85,
              backgroundColor: '#18181b',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Open Live Pipeline
          </Button>
        </Box>
      </Box>

      {/* Top-Right Floating Notification Alert */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => dispatch(clearDashboardError())}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity="error"
          onClose={() => dispatch(clearDashboardError())}
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            alignItems: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: { xs: '90vw', sm: 480 },
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* SLA Alert Strip */}
      {tasksSummary.pendingTasks > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 3,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: tasksSummary.overdueTasks > 0 ? '#fecaca' : '#bfdbfe',
            backgroundColor: tasksSummary.overdueTasks > 0 ? '#fef2f2' : '#eff6ff',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: tasksSummary.overdueTasks > 0 ? '#fee2e2' : '#dbeafe',
                color: tasksSummary.overdueTasks > 0 ? '#dc2626' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {tasksSummary.overdueTasks > 0 ? <AlertTriangle size={18} /> : <Clock size={18} />}
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: tasksSummary.overdueTasks > 0 ? '#991b1b' : '#1e40af',
                  fontSize: { xs: '0.825rem', sm: '0.875rem' },
                }}
              >
                {tasksSummary.overdueTasks > 0
                  ? `${tasksSummary.overdueTasks} Task SLA Breaches Detected`
                  : `${tasksSummary.pendingTasks} Pending Due Diligence Tasks Active`}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: tasksSummary.overdueTasks > 0 ? '#b91c1c' : '#3b82f6',
                  fontSize: { xs: '0.72rem', sm: '0.78rem' },
                }}
              >
                {tasksSummary.overdueTasks > 0
                  ? 'Urgent attention required. German mortgage bank submission deadlines may be delayed.'
                  : `${tasksSummary.dueTodayTasks ?? 0} due today, ${tasksSummary.upcomingTasks ?? 0} upcoming in the queue.`}
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(ROUTES.ADVISOR_TASKS)}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              alignSelf: { xs: 'stretch', sm: 'center' },
              backgroundColor: tasksSummary.overdueTasks > 0 ? '#dc2626' : '#2563eb',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: tasksSummary.overdueTasks > 0 ? '#b91c1c' : '#1d4ed8',
              },
            }}
          >
            Review Tasks & SLAs →
          </Button>
        </Paper>
      )}

      {/* KPI Stats Strip - Responsive 2x2 on Mobile, 4x1 on Desktop */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: { xs: 1.25, sm: 1.5, md: 2 },
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Paper
              key={i}
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2, md: 2.25 },
                borderRadius: { xs: 2, md: 2.5 },
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minWidth: 0,
                '&:hover': {
                  borderColor: '#cbd5e1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 0.75, sm: 1 } }}>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontSize: { xs: '0.62rem', sm: '0.68rem', md: '0.72rem' },
                  }}
                >
                  {stat.title}
                </Typography>
                <Box
                  sx={{
                    width: { xs: 28, sm: 32, md: 36 },
                    height: { xs: 28, sm: 32, md: 36 },
                    borderRadius: 1.75,
                    backgroundColor: stat.bg,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    ml: 0.5,
                  }}
                >
                  <Icon size={16} />
                </Box>
              </Box>

              {loading && !data ? (
                <Skeleton variant="text" width="60%" height={32} sx={{ my: 0.5 }} />
              ) : (
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.75rem', lg: '1.85rem' },
                    lineHeight: 1.1,
                    my: { xs: 0.35, sm: 0.5 },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stat.value}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75 }, flexWrap: 'wrap', mt: { xs: 0.25, sm: 0.5 } }}>
                <Chip
                  label={stat.change}
                  size="small"
                  sx={{
                    height: { xs: 18, sm: 20 },
                    fontSize: { xs: '0.62rem', sm: '0.68rem' },
                    fontWeight: 700,
                    backgroundColor: stat.bg,
                    color: stat.color,
                    borderRadius: 1,
                    px: 0.25,
                  }}
                />
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: '#94a3b8',
                    fontSize: { xs: '0.62rem', sm: '0.7rem' },
                    fontWeight: 500,
                  }}
                >
                  {stat.period}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px', xl: '2fr 1fr' },
          gap: { xs: 2, sm: 2.5, md: 3 },
          mb: 4,
        }}
      >
        <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Active Webhook Sources */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2.5, md: 3 },
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                  Lead Ingestion Webhook Endpoints
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
                  Active REST endpoints receiving incoming expat borrower leads.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Webhook size={14} />}
                onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_INTEGRATIONS)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
              >
                Configure
              </Button>
            </Box>

            {loading && !data ? (
              <Stack spacing={1.5}>
                <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
              </Stack>
            ) : webhooks.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>No webhook sources configured yet.</Typography>
                <Button size="small" onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_INTEGRATIONS)} sx={{ mt: 1, fontWeight: 700, textTransform: 'none' }}>
                  + Create Webhook
                </Button>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {webhooks.map((w, idx) => (
                  <Box
                    key={w.id || idx}
                    sx={{
                      p: { xs: 1.25, sm: 1.5 },
                      borderRadius: 2,
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: { xs: 1.25, sm: 2 },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Radio size={16} />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}
                        >
                          {w.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{ color: '#64748b', display: 'block', fontFamily: 'monospace' }}
                        >
                          Key: {w.apiKeyPrefix || 'lf_live_...'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                        gap: 2,
                        flexShrink: 0,
                        pt: { xs: 1, sm: 0 },
                        borderTop: { xs: '1px solid #e2e8f0', sm: 'none' },
                      }}
                    >
                      <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', lineHeight: 1.1 }}>
                          {w.events} leads
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                          {w.latency}
                        </Typography>
                      </Box>
                      <Chip
                        label={w.status}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          backgroundColor: w.status === 'Healthy' ? '#ecfdf5' : '#fef2f2',
                          color: w.status === 'Healthy' ? '#059669' : '#dc2626',
                          fontWeight: 700,
                          borderRadius: 1.5,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Mortgage Advisors Team */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2.5, md: 3 },
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                  Mortgage Advisors Team
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
                  Active capacity, pipeline volume, and staff roster.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<UserPlus size={14} />}
                onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_TEAM)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Invite Advisor
              </Button>
            </Box>

            {/* Desktop Table View (>= sm) */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                    <TableCell>Advisor</TableCell>
                    <TableCell>Active Cases</TableCell>
                    <TableCell>Volume</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && !data ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={40} />
                      </TableCell>
                    </TableRow>
                  ) : advisors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#64748b' }}>
                        No advisors added yet. Click "+ Invite Advisor" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    advisors.map((adv, idx) => (
                      <TableRow key={adv.id || idx} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem' }}>
                              {(adv.name || 'A').charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem' }}>{adv.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>{adv.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{adv.activeCases} active</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#2563eb' }}>{adv.volumeFormatted || adv.volume}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={adv.status}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.68rem',
                              backgroundColor: adv.status === 'Active' ? '#ecfdf5' : '#f8fafc',
                              color: adv.status === 'Active' ? '#059669' : '#64748b',
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View (< sm) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.25 }}>
            {loading && !data ? (
              <Stack spacing={1}>
                <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />
              </Stack>
            ) : advisors.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>No advisors added yet.</Typography>
              </Box>
            ) : (
              advisors.map((adv, idx) => (
                <Box
                  key={adv.id || idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.8rem' }}>
                        {(adv.name || 'A').charAt(0)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                          {adv.name}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                          {adv.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={adv.status}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        backgroundColor: adv.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                        color: adv.status === 'Active' ? '#059669' : '#64748b',
                        fontWeight: 700,
                        borderRadius: 1,
                        flexShrink: 0,
                        ml: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pt: 1,
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                      Active: <strong style={{ color: '#0f172a' }}>{adv.activeCases} cases</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700 }}>
                      Volume: {adv.volumeFormatted || adv.volume}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Paper>
          {/* Recent Live Lead Ingestion Activity Stream */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2.5, md: 3 },
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                  Recent Ingested Leads
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
                  Real-time feed of borrower applications across channels.
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => navigate(ROUTES.ADVISOR_PIPELINE)}
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
              >
                Full Pipeline <ArrowRight size={14} style={{ marginLeft: 4 }} />
              </Button>
            </Box>

            {/* Desktop Table View (>= sm) */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                    <TableCell>Borrower</TableCell>
                    <TableCell>Location & Loan</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Source Channel</TableCell>
                    <TableCell align="right">Advisor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && !data ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Skeleton variant="text" height={36} />
                        <Skeleton variant="text" height={36} />
                      </TableCell>
                    </TableRow>
                  ) : recentLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#64748b' }}>
                        No recent leads found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentLeads.map((ld, idx) => (
                      <TableRow key={ld.id || idx} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem' }}>{ld.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{ld.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem' }}>{ld.loanAmount}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{ld.city}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ld.stage}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
                            {ld.sourceName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>
                            {ld.advisorName}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View (< sm) */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.25 }}>
            {loading && !data ? (
              <Stack spacing={1}>
                <Skeleton variant="rounded" height={70} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={70} sx={{ borderRadius: 2 }} />
              </Stack>
            ) : recentLeads.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>No recent leads found.</Typography>
              </Box>
            ) : (
              recentLeads.map((ld, idx) => (
                <Box
                  key={ld.id || idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                      {ld.name}
                    </Typography>
                    <Chip
                      label={ld.stage}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontSize: '0.72rem' }}>
                    {ld.email}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pt: 1,
                      borderTop: '1px solid #e2e8f0',
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', display: 'block' }}>
                        {ld.loanAmount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                        {ld.city}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', display: 'block', fontSize: '0.72rem' }}>
                        {ld.sourceName}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', fontSize: '0.72rem' }}>
                        {ld.advisorName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Paper>
        </Stack>
        {/* Right Sidebar Stack */}
        <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Stage Email Triggers */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2.5, md: 3 },
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                Stage Email Triggers
              </Typography>
              <Button
                size="small"
                onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_AUTOMATIONS)}
                sx={{ fontWeight: 700, p: 0, textTransform: 'none', whiteSpace: 'nowrap' }}
              >
                Rules <ArrowRight size={14} style={{ marginLeft: 4 }} />
              </Button>
            </Box>

            {loading && !data ? (
              <Stack spacing={1.5}>
                <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />
              </Stack>
            ) : stageAutomations.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>No automation triggers configured.</Typography>
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {stageAutomations.map((stg, idx) => (
                  <Box
                    key={stg.id || idx}
                    sx={{
                      p: { xs: 1.25, sm: 1.5 },
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', fontSize: '0.72rem' }}>
                        {stg.stage}
                      </Typography>
                      <Chip
                        label={stg.status}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          backgroundColor: stg.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                          color: stg.status === 'Active' ? '#059669' : '#dc2626',
                          fontWeight: 700,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', wordBreak: 'break-word' }}>
                      {stg.template}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                      Trigger: {stg.trigger}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Brokerage Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2.5, md: 3 },
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
              Brokerage Details
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.825rem' }}>Brokerage Entity</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'right', fontSize: '0.825rem' }}>
                  {brokerage.name || 'HypoExpat Berlin GmbH'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.825rem' }}>HQ Location</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'right', fontSize: '0.825rem' }}>
                  {brokerage.city || 'Berlin'}, Germany
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.825rem' }}>Subdomain</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textAlign: 'right', fontSize: '0.825rem' }}>
                  {brokerage.subdomain || 'hypo-expat-berlin'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.825rem' }}>Advisor Seats</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2563eb', textAlign: 'right', fontSize: '0.825rem' }}>
                  {brokerage.advisorSeatsActive ?? advisors.length} of {brokerage.advisorSeatsLimit ?? 10} Active
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </DashboardLayout>
  );
};

export default BrokerageAdminDashboard;
