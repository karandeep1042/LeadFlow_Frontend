import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Euro, PieChart, Wallet, Home } from 'lucide-react';

export const LeadFinanceSummary = ({ lead }) => {
  const loan = Number(lead.loanAmount) || 0;
  const purchase = Number(lead.purchasePrice) || 0;
  const ltv = purchase > 0 ? Math.round((loan / purchase) * 100) : null;
  const income = Number(lead.monthlyNetIncome) || 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
        German Mortgage Parameters
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Euro size={14} color="#2563eb" />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Loan Request</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            €{loan.toLocaleString('de-DE')}
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Home size={14} color="#64748b" />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Purchase Price</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {purchase > 0 ? `€${purchase.toLocaleString('de-DE')}` : 'Not Specified'}
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <PieChart size={14} color={ltv && ltv > 90 ? '#e11d48' : '#16a34a'} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Financing Ratio (LTV)</Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: ltv && ltv > 90 ? '#e11d48' : ltv ? '#16a34a' : '#64748b' }}>
            {ltv ? `${ltv}% LTV` : 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <Wallet size={14} color="#64748b" />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Monthly Net Income</Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {income > 0 ? `€${income.toLocaleString('de-DE')}` : 'Not Specified'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LeadFinanceSummary;

