import React from 'react';
import { Paper, Box, Typography, Stack, Chip } from '@mui/material';
import { Euro, TrendingUp, Users, AlertTriangle, UserX, CheckCircle2 } from 'lucide-react';

export const PipelineMetricsBar = ({ leads = [] }) => {
  const totalLeads = leads.length;
  const totalVolume = leads.reduce((sum, l) => sum + (Number(l.loanAmount) || 0), 0);
  const avgTicket = totalLeads > 0 ? Math.round(totalVolume / totalLeads) : 0;
  const duplicateCount = leads.filter((l) => l.isDuplicate && !l.duplicateResolved).length;
  const unassignedCount = leads.filter((l) => !l.assignedAdvisorId).length;
  const wonCount = leads.filter((l) => l.stage === 'Won').length;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
      {/* Total Volume */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>ACTIVE PIPELINE VOLUME</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              €{totalVolume.toLocaleString('de-DE')}
            </Typography>
          </Box>
          <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Euro size={20} />
          </Box>
        </Box>
      </Paper>

      {/* Total Deals & Avg Ticket */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>TOTAL DEALS / AVG TICKET</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
              {totalLeads} Deals <Typography component="span" variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>(Avg €{(avgTicket / 1000).toFixed(0)}k)</Typography>
            </Typography>
          </Box>
          <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} />
          </Box>
        </Box>
      </Paper>

      {/* Won Approval Rate */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>LOAN APPROVALS (WON)</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669', mt: 0.5 }}>
              {wonCount} Closed
            </Typography>
          </Box>
          <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </Box>
        </Box>
      </Paper>

      {/* Attention & Alerts */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: duplicateCount > 0 || unassignedCount > 0 ? '#fffbeb' : '#ffffff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: duplicateCount > 0 || unassignedCount > 0 ? '#b45309' : '#64748b' }}>
              OPERATIONAL ALERTS
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              {unassignedCount > 0 && (
                <Chip label={`${unassignedCount} Unassigned`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e' }} />
              )}
              {duplicateCount > 0 && (
                <Chip label={`${duplicateCount} Duplicates`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#fee2e2', color: '#991b1b' }} />
              )}
              {unassignedCount === 0 && duplicateCount === 0 && (
                <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 700 }}>All Leads Assigned</Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: duplicateCount > 0 ? '#fef2f2' : '#f8fafc', color: duplicateCount > 0 ? '#dc2626' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PipelineMetricsBar;
