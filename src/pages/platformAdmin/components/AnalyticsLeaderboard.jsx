import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from '@mui/material';
import { Award } from 'lucide-react';

export default function AnalyticsLeaderboard({ leaderboard = [] }) {
  const rankStyles = [
    { bg: '#fef3c7', color: '#92400e', border: '#fde68a' }, // Gold
    { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' }, // Silver
    { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' }, // Bronze
  ];

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Award size={20} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Brokerage Leaderboard</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Ranked by closed mortgage volume & conversion.</Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>RANK</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>BROKERAGE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>ADVISORS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>WON DEALS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>CONVERSION</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>MORTGAGE VOLUME</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>No leaderboard data available.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              leaderboard.map((item, idx) => {
                const rank = idx + 1;
                const style = rankStyles[idx] || { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
                return (
                  <TableRow key={item.id || idx} hover>
                    <TableCell sx={{ py: 2 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          backgroundColor: style.bg,
                          color: style.color,
                          border: `1px solid ${style.border}`,
                        }}
                      >
                        #{rank}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{item.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{item.city || 'Germany'}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip label={`${item.advisorsCount || 0} Adv`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#334155' }} />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#059669' }}>{item.wonCases}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#4f46e5' }}>{item.conversionRate}%</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>€{((item.wonVolumeEur || 0) / 1000).toLocaleString()}k</Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

