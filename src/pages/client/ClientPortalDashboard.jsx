import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { RefreshCw, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { fetchClientPortalOverview } from '../../redux/thunks/clientThunk';
import { useSocket } from '../../hooks/useSocket';
import ActionAlertBanner from './components/ActionAlertBanner';
import MortgageRoadmapStepper from './components/MortgageRoadmapStepper';
import MortgageCaseSummaryCard from './components/MortgageCaseSummaryCard';
import DocumentProgressCard from './components/DocumentProgressCard';
import AssignedAdvisorCard from './components/AssignedAdvisorCard';
import { ROUTES } from '../../utils/constants/routes';

const ClientPortalDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { portalData, portalLoading, portalError } = useSelector((state) => state.client);

  // Activate WebSocket connection for real-time verification and stage updates
  useSocket();

  useEffect(() => {
    dispatch(fetchClientPortalOverview());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchClientPortalOverview());
  };

  if (portalLoading && !portalData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={42} thickness={4} />
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            Loading Your Mortgage Case...
          </Typography>
        </Stack>
      </Box>
    );
  }

  const clientName = portalData?.lead
    ? `${portalData.lead.firstName} ${portalData.lead.lastName || ''}`.trim()
    : (user?.name || 'Borrower');

  const rejectedDocs = (portalData?.documents || []).filter((d) => d.status === 'rejected');

  return (
    <Box>
      {/* Top Banner Header - Android Native Card Style */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: { xs: 3, md: 3.5 },
          p: { xs: 2.25, sm: 3, md: 3.5 },
          mb: { xs: 2.5, md: 3.5 },
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.75, flexWrap: 'wrap' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.35rem', sm: '1.65rem', md: '1.95rem' },
                lineHeight: 1.25,
              }}
            >
              Welcome back, {clientName}!
            </Typography>
            <Chip
              icon={<Sparkles size={13} color="#2563eb" />}
              label="German Mortgage Hub"
              size="small"
              sx={{
                bgcolor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 700,
                fontSize: '0.725rem',
                border: '1px solid #dbeafe',
                height: 24,
              }}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.85rem', sm: '0.925rem' },
              lineHeight: 1.5,
            }}
          >
            Track your mortgage application, upload German compliance documents, and coordinate with your advisor.
          </Typography>
        </Box>

        {/* Action Controls: full-width Android action bar on mobile, inline on desktop */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: { xs: '100%', md: 'auto' },
            flexShrink: 0,
          }}
        >
          <Tooltip title="Refresh Case Data" arrow>
            <IconButton
              onClick={handleRefresh}
              disabled={portalLoading}
              aria-label="Refresh Case Data"
              sx={{
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                width: { xs: 46, sm: 44 },
                height: { xs: 46, sm: 44 },
                minWidth: { xs: 46, sm: 44 },
                flexShrink: 0,
                p: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#e2e8f0', borderColor: '#cbd5e1' },
              }}
            >
              <RefreshCw size={18} className={portalLoading ? 'animate-spin' : ''} style={{ color: '#475569' }} />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<FileText size={17} />}
            endIcon={<ArrowRight size={17} />}
            onClick={() => navigate(ROUTES.CLIENT_DOCUMENTS || '/client/documents')}
            sx={{
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '0.925rem' },
              borderRadius: 2.5,
              px: { xs: 2.5, md: 3 },
              height: { xs: 46, sm: 44 },
              flex: { xs: 1, md: 'none' },
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            Upload Documents
          </Button>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Stack spacing={{ xs: 2.5, md: 3.5 }}>
        {/* Action Alert Banner */}
        <ActionAlertBanner
          rejectedDocs={rejectedDocs}
          currentStage={portalData?.lead?.stage}
          isDeclined={portalData?.lead?.isDeclined}
          declineReason={portalData?.lead?.declineReason}
          isArchived={portalData?.lead?.isArchived}
          finalDisbursedAmount={portalData?.lead?.finalDisbursedAmount}
        />

        {/* Mortgage Roadmap Stepper */}
        <MortgageRoadmapStepper stages={portalData?.stages || []} currentStage={portalData?.lead?.stage} />

        {/* KPI and Info Grid: 100% full width stack on Mobile & Tablet (<1200px), 3 equal columns on Desktop (>=1200px) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2.5, md: 3.5 },
            width: '100%',
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ display: 'flex', width: '100%', minWidth: 0 }}>
            <MortgageCaseSummaryCard lead={portalData?.lead} />
          </Box>

          <Box sx={{ display: 'flex', width: '100%', minWidth: 0 }}>
            <DocumentProgressCard metrics={portalData?.metrics} documents={portalData?.documents || []} />
          </Box>

          <Box sx={{ display: 'flex', width: '100%', minWidth: 0 }}>
            <AssignedAdvisorCard advisor={portalData?.advisor} brokerage={portalData?.brokerage} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default ClientPortalDashboard;
