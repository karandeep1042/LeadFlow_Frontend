import React from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function AnalyticsFunnel({
  funnel = [],
  verifiedDocs = 0,
  rejectedDocs = 0,
  pendingDocs = 0,
  documentAcceptedRate = 94.2,
  documentRejectedRate = 5.8,
  totalDocs = 0,
}) {
  const barColors = ['#4f46e5', '#2563eb', '#d97706', '#0d9488', '#059669'];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
      {/* Mortgage Conversion Funnel */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              German Mortgage Conversion Funnel
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Pipeline progression from initial webhook lead to bank funding.
            </Typography>
          </Box>
          <Chip label="5 Stages" size="small" sx={{ fontWeight: 800, fontSize: '0.725rem', backgroundColor: '#eef2ff', color: '#4f46e5' }} />
        </Box>

        <Stack spacing={2}>
          {funnel.map((item, idx) => {
            const stagePercent = Number(item.percent) || 0;
            const barColor = barColors[idx % barColors.length];

            return (
              <Box key={idx} sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                    {item.stage}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      {item.count} leads
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                      ({stagePercent}%)
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ width: '100%', height: 8, backgroundColor: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${Math.max(stagePercent, 3)}%`, backgroundColor: barColor, borderRadius: 999, transition: 'width 0.5s ease' }} />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* Document Underwriting Health */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2.5 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Document Underwriting Health
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Accuracy across borrower KYC and income proofs.
          </Typography>

          <Stack spacing={2} sx={{ my: 2.5 }}>
            <Box sx={{ p: 2, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle2 size={22} color="#059669" />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#065f46', textTransform: 'uppercase', fontSize: '0.675rem', display: 'block' }}>ACCEPTED RATE</Typography>
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>{verifiedDocs} verified files</Typography>
                </Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669' }}>{documentAcceptedRate}%</Typography>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AlertCircle size={22} color="#dc2626" />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', fontSize: '0.675rem', display: 'block' }}>REVISIONS NEEDED</Typography>
                  <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 600 }}>{rejectedDocs} rejected files</Typography>
                </Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#dc2626' }}>{documentRejectedRate}%</Typography>
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FileText size={22} color="#64748b" />
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.675rem', display: 'block' }}>PENDING REVIEW</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>In advisor inbox</Typography>
                </Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>{pendingDocs}</Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 1.75, backgroundColor: '#f1f5f9', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
            <strong>Total Processed:</strong> {totalDocs} compliance items platform-wide.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
