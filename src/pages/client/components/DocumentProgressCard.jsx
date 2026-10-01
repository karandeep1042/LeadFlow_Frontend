import React from 'react';
import { Box, Paper, Typography, Button, LinearProgress, Stack, Chip } from '@mui/material';
import { FileCheck, ArrowRight, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';

const DocumentProgressCard = ({ metrics = {}, documents = [] }) => {
  const navigate = useNavigate();

  const totalRequired = metrics.totalRequired || 18;
  const verifiedCount = metrics.verifiedCount || documents.filter((d) => d.status === 'verified').length;
  const rejectedCount = metrics.rejectedCount || documents.filter((d) => d.status === 'rejected').length;
  const processingCount = metrics.processingCount || documents.filter((d) => d.status === 'processing').length;
  const progressPercent = metrics.progressPercent ?? Math.min(100, Math.round((verifiedCount / totalRequired) * 100));

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 3 },
        borderRadius: { xs: 3, md: 3.5 },
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
      }}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 1.2, fontSize: '0.75rem' }}>
            DOCUMENT READINESS SCORE
          </Typography>
          <Chip
            label={progressPercent >= 100 ? 'Bank Ready' : `${progressPercent}% Complete`}
            size="small"
            sx={{
              bgcolor: progressPercent >= 100 ? '#ecfdf5' : '#eff6ff',
              color: progressPercent >= 100 ? '#065f46' : '#1d4ed8',
              fontWeight: 800,
              fontSize: '0.725rem',
              border: '1px solid',
              borderColor: progressPercent >= 100 ? '#a7f3d0' : '#bfdbfe',
              height: 24,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="baseline" sx={{ mb: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              fontSize: { xs: '1.85rem', sm: '2.25rem' },
              letterSpacing: '-0.5px',
            }}
          >
            {progressPercent}%
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
            {verifiedCount} of {totalRequired} required docs verified
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', mb: 2.5 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: { xs: 1, sm: 1.5 },
            mb: { xs: 2.5, md: 3 },
            width: '100%',
          }}
        >
          <Box sx={{ bgcolor: '#f0fdf4', p: { xs: 1.25, sm: 1.5 }, borderRadius: 2.5, border: '1px solid #dcfce7', textAlign: 'center', minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: '#16a34a', mb: 0.25 }}>
              <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#15803d', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Verified</Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#166534', fontSize: { xs: '1rem', sm: '1.15rem' }, whiteSpace: 'nowrap' }}>
              {verifiedCount}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: '#eff6ff', p: { xs: 1.25, sm: 1.5 }, borderRadius: 2.5, border: '1px solid #dbeafe', textAlign: 'center', minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: '#2563eb', mb: 0.25 }}>
              <Clock size={13} style={{ flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Checking</Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e40af', fontSize: { xs: '1rem', sm: '1.15rem' }, whiteSpace: 'nowrap' }}>
              {processingCount}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: rejectedCount > 0 ? '#fef2f2' : '#f8fafc', p: { xs: 1.25, sm: 1.5 }, borderRadius: 2.5, border: rejectedCount > 0 ? '1px solid #fee2e2' : '1px solid #f1f5f9', textAlign: 'center', minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{ color: rejectedCount > 0 ? '#dc2626' : '#94a3b8', mb: 0.25 }}>
              <ShieldAlert size={13} style={{ flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: rejectedCount > 0 ? '#991b1b' : '#64748b', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Action</Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 900, color: rejectedCount > 0 ? '#991b1b' : '#64748b', fontSize: { xs: '1rem', sm: '1.15rem' }, whiteSpace: 'nowrap' }}>
              {rejectedCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        endIcon={<ArrowRight size={17} />}
        onClick={() => navigate(ROUTES.CLIENT_DOCUMENTS || '/client/documents')}
        sx={{
          bgcolor: '#2563eb',
          '&:hover': { bgcolor: '#1d4ed8' },
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
          borderRadius: 2.5,
          height: { xs: 46, sm: 44 },
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
        }}
      >
        Open Document Vault & Upload
      </Button>
    </Paper>
  );
};

export default DocumentProgressCard;
