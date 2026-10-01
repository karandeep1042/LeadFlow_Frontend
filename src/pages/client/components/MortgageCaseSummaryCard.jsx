import React from 'react';
import { Box, Paper, Typography, Stack, Divider, Chip } from '@mui/material';
import { Euro, MapPin, Award, Briefcase, Home, Wallet, TrendingUp } from 'lucide-react';

const MortgageCaseSummaryCard = ({ lead }) => {
  const loanAmount = lead?.loanAmount || lead?.financialProfile?.targetLoanAmount || 480000;
  const purchasePrice = lead?.purchasePrice || lead?.financialProfile?.purchasePrice || 600000;
  const equity = Math.max(0, purchasePrice - loanAmount);
  const ltv = purchasePrice > 0 ? ((loanAmount / purchasePrice) * 100).toFixed(1) : '80.0';
  const city = lead?.city || lead?.propertyPreferences?.city || 'Berlin – Mitte';
  const visaType = lead?.visaType || 'EU Blue Card';
  const employmentType = lead?.employmentType || 'Employed';
  const monthlyNetIncome = lead?.monthlyNetIncome || 5500;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 3 },
        borderRadius: { xs: 3, md: 3.5 },
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Box>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 1.2, fontSize: '0.75rem' }}>
            CASE FINANCIAL SNAPSHOT
          </Typography>
          <Chip
            label={`LTV: ${ltv}%`}
            size="small"
            sx={{
              bgcolor: Number(ltv) <= 80 ? '#ecfdf5' : '#fffbeb',
              color: Number(ltv) <= 80 ? '#065f46' : '#b45309',
              fontWeight: 800,
              fontSize: '0.725rem',
              border: '1px solid',
              borderColor: Number(ltv) <= 80 ? '#a7f3d0' : '#fde68a',
              height: 24,
            }}
          />
        </Stack>

        {/* 3 Balanced Stat Tiles - Always 3 equal columns, never awkward leftover wrap */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: { xs: 1, sm: 1.5 },
            mb: 2.5,
            width: '100%',
          }}
        >
          <Box
            sx={{
              bgcolor: '#f8fafc',
              p: { xs: 1.25, sm: 1.75 },
              borderRadius: 2.5,
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.75rem' },
                lineHeight: 1.2,
                mb: 0.5,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Loan Amount
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: { xs: '0.85rem', sm: '1.05rem', md: '1.15rem' },
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              €{loanAmount.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: '#f8fafc',
              p: { xs: 1.25, sm: 1.75 },
              borderRadius: 2.5,
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.75rem' },
                lineHeight: 1.2,
                mb: 0.5,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Purchase Price
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: { xs: '0.85rem', sm: '1.05rem', md: '1.15rem' },
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              €{purchasePrice.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: '#f8fafc',
              p: { xs: 1.25, sm: 1.75 },
              borderRadius: 2.5,
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.75rem' },
                lineHeight: 1.2,
                mb: 0.5,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Down Payment
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: equity > 0 ? '#059669' : '#0f172a',
                fontSize: { xs: '0.85rem', sm: '1.05rem', md: '1.15rem' },
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              €{equity.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Borrower & Property Key Attributes */}
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <MapPin size={16} color="#64748b" style={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>
                Target City
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: '0.86rem',
                textAlign: 'right',
                maxWidth: '60%',
                wordBreak: 'break-word',
              }}
            >
              {city}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Award size={16} color="#64748b" style={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>
                German Visa / Status
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: '0.86rem',
                textAlign: 'right',
                maxWidth: '60%',
                wordBreak: 'break-word',
              }}
            >
              {visaType}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Briefcase size={16} color="#64748b" style={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>
                Employment Type
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: '0.86rem',
                textAlign: 'right',
                maxWidth: '60%',
                wordBreak: 'break-word',
              }}
            >
              {employmentType}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Euro size={16} color="#64748b" style={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.84rem' }}>
                Monthly Net Income
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: '0.86rem',
                textAlign: 'right',
              }}
            >
              €{monthlyNetIncome.toLocaleString()} / mo
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default MortgageCaseSummaryCard;
