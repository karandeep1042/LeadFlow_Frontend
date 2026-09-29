import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Chip, Alert, Snackbar, CircularProgress, Tabs, Tab, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { Plus, RefreshCw, CheckCircle2, AlertCircle, AlertTriangle, Info, LayoutGrid, FolderArchive } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PipelineMetricsBar from './components/PipelineMetricsBar';
import PipelineFilterToolbar from './components/PipelineFilterToolbar';
import PipelineKanbanBoard from './components/PipelineKanbanBoard';
import ClosedPortfolioTable from './components/ClosedPortfolioTable';
import LeadDossierDrawer from './components/LeadDossierDrawer';
import CreateLeadModal from './components/CreateLeadModal';
import StageTransitionConfirmModal from './components/StageTransitionConfirmModal';
import { usePipelineLeads } from './hooks/usePipelineLeads';
import { fetchLeads, updateLeadStage } from '../../redux/thunks/leadThunk';
import { clearLeadError, setSelectedLead } from '../../redux/slices/leadSlice';

const PIPELINE_COLUMNS = [
  { key: 'New', label: 'Stage 01: Ingestion', nextStage: 'Contacted', nextLabel: 'Contacted' },
  { key: 'Contacted', label: 'Stage 02: Consultation', nextStage: 'Document Collection', nextLabel: 'Docs' },
  { key: 'Document Collection', label: 'Stage 03: Documents', nextStage: 'Bank Submission', nextLabel: 'Bank Sub' },
  { key: 'Bank Submission', label: 'Stage 04: Bank Submission', nextStage: 'Won', nextLabel: 'Approval' },
  { key: 'Won', label: 'Stage 05: Loan Offer', nextStage: 'Lost', nextLabel: 'Closing' },
  { key: 'Lost', label: 'Stage 06: Notary & Closing', nextStage: null, nextLabel: null },
];

export const PipelineKanbanPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, role: userRole } = useSelector((state) => state.auth);
  const canChangeStage = userRole === 'advisor';
  const isAdmin = userRole === 'brokerage_admin' || userRole === 'admin' || userRole === 'platform_admin';
  const currentUserId = user?._id || user?.id;

  const {
    leads, counts, filteredLeads, selectedLead, loading, error, assigningAdvisor, updatingStageLeadId,
    convertingClient, advisors, searchQuery, setSearchQuery, selectedAdvisor,
    setSelectedAdvisor, tagFilter, setTagFilter, activeTab, setActiveTab,
    createModalOpen, setCreateModalOpen, savingLead,
    notification, notifySuccess, notifyError, notifyWarning, notifyInfo, clearNotification,
    stageConfirmModal, handleRequestStageChange, handleConfirmStageTransition, handleCancelStageTransition,
    handleDropLead, handleCreateLead, handleAssignAdvisor,
    handleConvertToClient, handleToggleClientStatus, handleResolveDuplicate,
    handleAddNote, handleDeclineLead, handleArchiveLead, handleUnarchiveLead, dispatch,
  } = usePipelineLeads();

  const activeLeadsCount = activeTab === 'pipeline' ? filteredLeads.length : (counts?.active ?? 0);
  const closedLeadsCount = activeTab === 'archived' ? filteredLeads.length : (counts?.archived ?? 0);

  const handleAdvanceStage = (lead) => {
    if (!canChangeStage) {
      notifyWarning('Pipeline stage updates are restricted to Mortgage Advisors. As Brokerage Admin, you can assign advisors.');
      return;
    }

    const assignedAdvisorId = lead.assignedAdvisorId?._id || lead.assignedAdvisorId;
    if (assignedAdvisorId && String(assignedAdvisorId) !== String(currentUserId)) {
      notifyError('Access Denied: This mortgage case is assigned to another advisor.');
      return;
    }

    const col = PIPELINE_COLUMNS.find((c) => c.key === lead.stage);
    if (col && col.nextStage) {
      handleRequestStageChange(lead._id || lead.id, col.nextStage, lead.stage, lead);
    }
  };

  const handleRegressToDocs = (lead) => {
    if (!canChangeStage) {
      notifyWarning('Pipeline stage updates are restricted to Mortgage Advisors. As Brokerage Admin, you can assign advisors.');
      return;
    }

    const assignedAdvisorId = lead.assignedAdvisorId?._id || lead.assignedAdvisorId;
    if (assignedAdvisorId && String(assignedAdvisorId) !== String(currentUserId)) {
      notifyError('Access Denied: This mortgage case is assigned to another advisor.');
      return;
    }

    handleRequestStageChange(lead._id || lead.id, 'Document Collection', lead.stage, lead);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1.5, md: 2 } }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.1rem' } }}>
              {isMobile ? 'Lead Kanban Board' : 'Lead Kanban Board'}
            </Typography>
            <Chip
              label={`${activeTab === 'pipeline' ? `${filteredLeads.length} Active` : `${filteredLeads.length} Closed`}`}
              color={activeTab === 'pipeline' ? 'primary' : 'default'}
              size="small"
              sx={{ fontWeight: 700 }}
            />
            {/* Refresh & Action buttons inline on mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Tooltip title="Refresh pipeline data">
                <IconButton
                  size="small"
                  onClick={() => dispatch(fetchLeads({ isArchived: activeTab === 'archived' ? 'true' : 'false' }))}
                  disabled={loading}
                  sx={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 2,
                    p: 0.75,
                    color: '#475569',
                    display: { xs: 'inline-flex', md: 'none' },
                  }}
                >
                  <RefreshCw size={16} />
                </IconButton>
              </Tooltip>
              {isAdmin && isMobile && (
                <Tooltip title="Add Expat Lead">
                  <IconButton
                    size="small"
                    onClick={() => setCreateModalOpen(true)}
                    sx={{
                      borderRadius: 2,
                      p: 0.75,
                      backgroundColor: '#18181b',
                      color: '#ffffff',
                      '&:hover': { backgroundColor: '#27272a' },
                    }}
                  >
                    <Plus size={16} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', display: { xs: 'block', sm: 'block' } }}>
            Live German expat mortgage deal tracking, advisor allocation, and lifecycle progression.
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={15} />}
            onClick={() => dispatch(fetchLeads({ isArchived: activeTab === 'archived' ? 'true' : 'false' }))}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1' }}
          >
            Refresh
          </Button>
          {isAdmin && (
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)} sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: '#18181b', color: '#ffffff', px: 2.5 }}>
              + Add Expat Lead
            </Button>
          )}
        </Box>
      </Box>

      {/* View Switcher Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.92rem' },
              minHeight: 44,
              px: { xs: 1, sm: 2.5 },
            },
          }}
        >
          <Tab
            value="pipeline"
            icon={<LayoutGrid size={16} />}
            iconPosition="start"
            label={isMobile ? `Active (${activeLeadsCount})` : `Active Pipeline (${activeLeadsCount})`}
          />
          <Tab
            value="archived"
            icon={<FolderArchive size={16} />}
            iconPosition="start"
            label={isMobile ? `Closed (${closedLeadsCount})` : `Closed Portfolio & Archive (${closedLeadsCount})`}
          />
        </Tabs>
      </Box>

      {activeTab === 'pipeline' && <PipelineMetricsBar leads={leads} />}

      <PipelineFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAdvisor={selectedAdvisor}
        onAdvisorChange={setSelectedAdvisor}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
        advisors={advisors}
      />

      {/* Hovering Top-Right Floating Notification Alert */}
      <Snackbar
        open={Boolean(notification?.open || error)}
        autoHideDuration={5000}
        onClose={() => {
          if (notification?.open) clearNotification();
          if (error) dispatch(clearLeadError());
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={notification?.open ? notification.severity : 'error'}
          onClose={() => {
            if (notification?.open) clearNotification();
            if (error) dispatch(clearLeadError());
          }}
          icon={
            (notification?.open ? notification.severity : 'error') === 'error' ? (
              <AlertCircle size={20} color="#dc2626" />
            ) : (notification?.open ? notification.severity : 'error') === 'warning' ? (
              <AlertTriangle size={20} color="#d97706" />
            ) : (notification?.open ? notification.severity : 'error') === 'info' ? (
              <Info size={20} color="#2563eb" />
            ) : (
              <CheckCircle2 size={20} color="#059669" />
            )
          }
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            alignItems: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid',
            borderColor:
              (notification?.open ? notification.severity : 'error') === 'error'
                ? '#fecaca'
                : (notification?.open ? notification.severity : 'error') === 'warning'
                ? '#fde68a'
                : (notification?.open ? notification.severity : 'error') === 'info'
                ? '#bfdbfe'
                : '#bbf7d0',
            backgroundColor:
              (notification?.open ? notification.severity : 'error') === 'error'
                ? '#fef2f2'
                : (notification?.open ? notification.severity : 'error') === 'warning'
                ? '#fffbeb'
                : (notification?.open ? notification.severity : 'error') === 'info'
                ? '#eff6ff'
                : '#f0fdf4',
            color:
              (notification?.open ? notification.severity : 'error') === 'error'
                ? '#991b1b'
                : (notification?.open ? notification.severity : 'error') === 'warning'
                ? '#92400e'
                : (notification?.open ? notification.severity : 'error') === 'info'
                ? '#1e40af'
                : '#166534',
            maxWidth: { xs: '90vw', sm: 480 },
          }}
        >
          {notification?.open ? notification.message : error}
        </Alert>
      </Snackbar>

      {loading && leads.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 340 }}>
          <CircularProgress size={36} sx={{ color: '#2563eb' }} />
        </Box>
      ) : activeTab === 'pipeline' ? (
        <PipelineKanbanBoard
          columns={PIPELINE_COLUMNS}
          filteredLeads={filteredLeads}
          onLeadClick={(lead) => dispatch(setSelectedLead(lead))}
          onDropLead={handleDropLead}
          onAdvanceStage={handleAdvanceStage}
          onRegressToDocs={handleRegressToDocs}
          canChangeStage={canChangeStage}
          currentUserId={currentUserId}
          userRole={userRole}
          updatingStageLeadId={updatingStageLeadId}
        />
      ) : (
        <ClosedPortfolioTable
          leads={filteredLeads}
          onLeadClick={(lead) => dispatch(setSelectedLead(lead))}
          onUnarchiveLead={handleUnarchiveLead}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
        />
      )}

      <LeadDossierDrawer
        open={Boolean(selectedLead)}
        onClose={() => dispatch(setSelectedLead(null))}
        lead={selectedLead}
        advisors={advisors}
        userRole={userRole}
        currentUserId={currentUserId}
        isAssigningAdvisor={assigningAdvisor}
        convertingClient={convertingClient}
        onStageChange={handleRequestStageChange}
        onAssignAdvisor={handleAssignAdvisor}
        onConvertToClient={handleConvertToClient}
        onToggleClientStatus={handleToggleClientStatus}
        onResolveDuplicate={handleResolveDuplicate}
        onAddNote={handleAddNote}
        onDeclineLead={handleDeclineLead}
        onArchiveLead={handleArchiveLead}
        onUnarchiveLead={handleUnarchiveLead}
      />

      <StageTransitionConfirmModal
        open={stageConfirmModal.open}
        data={stageConfirmModal}
        loading={loading}
        onConfirm={handleConfirmStageTransition}
        onCancel={handleCancelStageTransition}
        onOpenDossier={(l) => dispatch(setSelectedLead(l))}
      />

      {isAdmin && (
        <CreateLeadModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateLead}
          advisors={advisors}
          saving={savingLead}
        />
      )}
    </DashboardLayout>
  );
};

export default PipelineKanbanPage;
