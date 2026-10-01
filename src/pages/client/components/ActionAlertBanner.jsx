import React from 'react';
import { Box, Paper, Typography, Button, Stack, Chip } from '@mui/material';
import { ArrowRight, CheckCircle2, ShieldAlert, XCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants/routes';

const ActionAlertBanner = ({
  rejectedDocs = [],
  currentStage = 'Document Collection',
  isDeclined = false,
  declineReason = '',
  isArchived = false,
  finalDisbursedAmount,
}) => {
  const navigate = useNavigate();

  if (isDeclined) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          borderRadius: { xs: 3, md: 3.5 },
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(185, 28, 28, 0.04) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 2.5 }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <XCircle size={24} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#991b1b', fontSize: '0.95rem' }}>
                  Financing Case Concluded
                </Typography>
                <Chip label="Application Closed" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#b91c1c', fontSize: '0.85rem', lineHeight: 1.45 }}>
                {declineReason || 'Lender criteria could not be met across our banking network for this application.'} Your advisor is available for debriefing.
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(ROUTES.CLIENT_DOCUMENTS || '/client/documents')}
            sx={{
              borderColor: '#f87171',
              color: '#b91c1c',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2.5,
              height: { xs: 44, sm: 38 },
              width: { xs: '100%', sm: 'auto' },
              flexShrink: 0,
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#dc2626',
                bgcolor: 'rgba(239, 68, 68, 0.08)',
              },
            }}
          >
            View Document Archive
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (isArchived) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          borderRadius: { xs: 3, md: 3.5 },
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 2.5 }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <Award size={24} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#065f46', fontSize: '0.95rem' }}>
                  Mortgage Finalized & Disbursed!
                </Typography>
                <Chip
                  label="Deal Closed"
                  size="small"
                  sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#047857', fontSize: '0.85rem', lineHeight: 1.45 }}>
                Congratulations! Loan amount of{' '}
                {finalDisbursedAmount ? `€${Number(finalDisbursedAmount).toLocaleString()}` : 'your sanctioned loan'}{' '}
                has been approved & notarized.
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowRight size={16} />}
            onClick={() => navigate(ROUTES.CLIENT_DOCUMENTS || '/client/documents')}
            sx={{
              bgcolor: '#059669',
              '&:hover': { bgcolor: '#047857' },
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2.5,
              height: { xs: 44, sm: 38 },
              width: { xs: '100%', sm: 'auto' },
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            View Loan Completion Dossier
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (!rejectedDocs || rejectedDocs.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, sm: 2.75 },
          borderRadius: { xs: 3, md: 3.5 },
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 2.5 }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <CheckCircle2 size={24} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#065f46', fontSize: '0.95rem' }}>
                Your Case is in Good Standing
              </Typography>
              <Typography variant="body2" sx={{ color: '#047857', fontSize: '0.85rem', mt: 0.25, lineHeight: 1.45 }}>
                No critical action items pending. Continue uploading any outstanding checklist documents to expedite bank submission.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowRight size={16} />}
            onClick={() => navigate(ROUTES.CLIENT_DOCUMENTS || '/client/documents')}
            sx={{
              borderColor: '#059669',
              color: '#059669',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2.5,
              height: { xs: 44, sm: 38 },
              width: { xs: '100%', sm: 'auto' },
              flexShrink: 0,
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: '#047857',
                bgcolor: 'rgba(16, 185, 129, 0.08)',
              },
            }}
          >
            View Checklist
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 2.75 },
        borderRadius: { xs: 3, md: 3.5 },
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.09) 0%, rgba(220, 38, 38, 0.04) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.08)',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2.5 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <ShieldAlert size={24} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#991b1b', fontSize: '0.95rem' }}>
                Action Required: {rejectedDocs.length} Document{rejectedDocs.length > 1 ? 's' : ''} Need Revision
              </Typography>
              <Chip
                label="High Priority"
                size="small"
                sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.7rem', height: 22 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#b91c1c', fontSize: '0.85rem', mt: 0.25, lineHeight: 1.45 }}>
              {rejectedDocs[0]?.title}: &ldquo;{rejectedDocs[0]?.rejectionReason || 'Please re-upload a compliant version.'}&rdquo;
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          size="medium"
          color="error"
          endIcon={<ArrowRight size={17} />}
          onClick={() => navigate(ROUTES.CLIENT_DOCUMENTS || '/client/documents')}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2.5,
            px: 2.5,
            height: { xs: 46, sm: 40 },
            width: { xs: '100%', sm: 'auto' },
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          Fix & Re-upload Now
        </Button>
      </Stack>
    </Paper>
  );
};

export default ActionAlertBanner;
