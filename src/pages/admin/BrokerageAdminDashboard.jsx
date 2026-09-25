import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Stack, Divider, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  Users, Webhook, Zap, TrendingUp, UserCheck, FileCheck, Plus,
  ArrowRight, Radio, Sparkles, Kanban,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ROUTES } from '../../utils/constants/routes';

export const BrokerageAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Ingested Leads', value: '84', change: '+18.4%', period: 'vs last month', icon: Users, color: '#2563eb', bg: '#eff6ff' },
    { title: 'Converted Clients', value: '28', change: '33.3%', period: 'conversion', icon: UserCheck, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Verified Docs', value: '420', change: '91.7%', period: 'accepted', icon: FileCheck, color: '#7c3aed', bg: '#f5f3ff' },
    { title: 'Pipeline Volume', value: '€14.2M', change: '+€2.4M', period: 'active', icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
  ];

  const advisors = [
    { name: 'Sarah Jenkins', email: 'mortgageadvisor@gmail.com', activeCases: 12, volume: '€4.8M', status: 'Active' },
    { name: 'Maximilian Weber', email: 'm.weber@hypo.de', activeCases: 9, volume: '€3.6M', status: 'Active' },
    { name: 'Chloe Dubois', email: 'c.dubois@hypo.de', activeCases: 7, volume: '€3.1M', status: 'Active' },
    { name: 'Jan Novák', email: 'j.novak@hypo.de', activeCases: 0, volume: '€0.0M', status: 'Invited' },
  ];

  const webhooks = [
    { name: 'Immobilienscout24 Expat Webhook', slug: 'immoscout-expat-v1', events: 42, status: 'Healthy', latency: '120ms' },
    { name: 'Facebook & IG Expat Lead Ads', slug: 'fb-lead-ads-de', events: 28, status: 'Healthy', latency: '95ms' },
    { name: 'Google Ads Expat Mortgage Calc', slug: 'gads-calc-de', events: 14, status: 'Healthy', latency: '140ms' },
  ];

  const stageAutomations = [
    { stage: 'Stage 01: Lead Ingestion', template: 'Expat Welcome & Initial Questionnaire', status: 'Active', trigger: 'Instant upon POST' },
    { stage: 'Stage 02: Initial Consultation', template: 'Meeting Confirmation & Advisor Link', status: 'Active', trigger: 'On stage move' },
    { stage: 'Stage 03: Document Collection', template: 'German Mortgage Document Checklist', status: 'Active', trigger: 'On stage move' },
    { stage: 'Stage 04: Bank Submission', template: 'Application Dispatched to Partner Banks', status: 'Active', trigger: 'On stage move' },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Sparkles size={18} style={{ color: '#2563eb' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Brokerage Control Center
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' } }}>
            HypoExpat Berlin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
            Real-time multi-channel lead ingestion, advisor pipeline tracking, and email automation rules.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="secondary" startIcon={<Users size={16} />} onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_TEAM)} sx={{ borderRadius: 2.5, fontWeight: 700 }}>
            Manage Advisors
          </Button>
          <Button variant="contained" startIcon={<Kanban size={16} />} onClick={() => navigate(ROUTES.ADVISOR_PIPELINE)} sx={{ borderRadius: 2.5, fontWeight: 700, backgroundColor: '#18181b', color: '#ffffff', '&:hover': { backgroundColor: '#09090b' } }}>
            Open Live Pipeline
          </Button>
        </Stack>
      </Box>

      {/* KPI Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5, mb: 4 }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Paper key={i} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.title}</Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>{stat.value}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={stat.change} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, backgroundColor: stat.bg, color: stat.color, borderRadius: '6px' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>{stat.period}</Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
        <Stack spacing={3}>
          {/* Active Webhook Sources */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Lead Ingestion Webhook Endpoints</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Active REST endpoints receiving incoming expat borrower leads.</Typography>
              </Box>
              <Button variant="outlined" size="small" startIcon={<Webhook size={14} />} onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_INTEGRATIONS)} sx={{ borderRadius: 2 }}>
                Configure
              </Button>
            </Box>

            <Stack spacing={1.5}>
              {webhooks.map((w, idx) => (
                <Box key={idx} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Radio size={16} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{w.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>/api/integrations/webhook/{w.slug}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>{w.events} leads</Typography>
                      <Typography variant="caption" sx={{ color: '#10b981' }}>{w.latency}</Typography>
                    </Box>
                    <Chip label={w.status} size="small" sx={{ backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700 }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Advisors Team Performance */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Mortgage Advisors Team</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Active capacity, pipeline volume, and staff roster.</Typography>
              </Box>
              <Button variant="outlined" size="small" startIcon={<Plus size={14} />} onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_TEAM)} sx={{ borderRadius: 2 }}>
                + Invite Advisor
              </Button>
            </Box>

            <TableContainer>
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
                  {advisors.map((adv, idx) => (
                    <TableRow key={idx} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem' }}>{adv.name.charAt(0)}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem' }}>{adv.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>{adv.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem' }}>{adv.activeCases} active</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontSize: '0.8125rem' }}>{adv.volume}</TableCell>
                      <TableCell align="right">
                        <Chip label={adv.status} size="small" sx={{ backgroundColor: adv.status === 'Active' ? '#ecfdf5' : '#fffbeb', color: adv.status === 'Active' ? '#059669' : '#d97706', fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
        <Stack spacing={3}>
          {/* Stage Email Triggers */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Stage Email Triggers</Typography>
              <Button size="small" onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_AUTOMATIONS)} sx={{ fontWeight: 700, p: 0, textTransform: 'none' }}>
                Rules <ArrowRight size={14} style={{ marginLeft: 4 }} />
              </Button>
            </Box>

            <Stack spacing={1.5}>
              {stageAutomations.map((stg, idx) => (
                <Box key={idx} sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb' }}>{stg.stage}</Typography>
                    <Chip label={stg.status} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700 }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>{stg.template}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Trigger: {stg.trigger}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Brokerage Profile Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>Brokerage Details</Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Brokerage Entity</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>HypoExpat Berlin GmbH</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>HQ Location</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Berlin, Germany</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Subdomain</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>hypo-expat-berlin</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Advisor Seats</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2563eb' }}>4 of 10 Active</Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </DashboardLayout>
  );
};

export default BrokerageAdminDashboard;
