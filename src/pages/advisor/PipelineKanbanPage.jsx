import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Chip, Alert, CircularProgress } from '@mui/material';
import { Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PipelineMetricsBar from './components/PipelineMetricsBar';
import PipelineFilterToolbar from './components/PipelineFilterToolbar';
import PipelineKanbanBoard from './components/PipelineKanbanBoard';
import LeadDossierDrawer from './components/LeadDossierDrawer';
import CreateLeadModal from './components/CreateLeadModal';
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
  const { role: userRole } = useSelector((state) => state.auth);
  const canChangeStage = userRole === 'advisor';

  const {
    leads, filteredLeads, selectedLead, loading, error, assigningAdvisor,
    advisors, searchQuery, setSearchQuery, selectedAdvisor,
    setSelectedAdvisor, tagFilter, setTagFilter, createModalOpen,
    setCreateModalOpen, savingLead, successMsg, setSuccessMsg,
    handleDropLead, handleCreateLead, handleAssignAdvisor,
    handleConvertToClient, handleResolveDuplicate, handleAddNote, dispatch,
  } = usePipelineLeads();

  const handleAdvanceStage = (lead) => {
    if (!canChangeStage) {
      setSuccessMsg('Pipeline stage updates are restricted to Mortgage Advisors. As Brokerage Admin, you can assign advisors.');
      setTimeout(() => setSuccessMsg(''), 4000);
      return;
    }
    const col = PIPELINE_COLUMNS.find((c) => c.key === lead.stage);
    if (col && col.nextStage) {
      dispatch(updateLeadStage({ leadId: lead._id || lead.id, stage: col.nextStage, previousStage: lead.stage }));
      setSuccessMsg(`Advanced ${lead.firstName} to ${col.nextStage}`);
      setTimeout(() => setSuccessMsg(''), 3500);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' } }}>
              Mortgage Lead Kanban Board
            </Typography>
            <Chip label={`${filteredLeads.length} Deals`} color="primary" size="small" sx={{ fontWeight: 700 }} />
          </Box>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Live German expat mortgage deal tracking, advisor allocation, and lifecycle progression.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<RefreshCw size={15} />} onClick={() => dispatch(fetchLeads())} disabled={loading} sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1' }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setCreateModalOpen(true)} sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: '#18181b', color: '#ffffff', px: 2.5 }}>
            + Add Expat Lead
          </Button>
        </Box>
      </Box>

      <PipelineMetricsBar leads={leads} />

      <PipelineFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAdvisor={selectedAdvisor}
        onAdvisorChange={setSelectedAdvisor}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
        advisors={advisors}
      />

      {successMsg && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2.5 }} icon={<CheckCircle2 size={20} />} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }} icon={<AlertCircle size={20} />} onClose={() => dispatch(clearLeadError())}>{error}</Alert>}

      {loading && leads.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 340 }}>
          <CircularProgress size={36} sx={{ color: '#2563eb' }} />
        </Box>
      ) : (
        <PipelineKanbanBoard
          columns={PIPELINE_COLUMNS}
          filteredLeads={filteredLeads}
          onLeadClick={(lead) => dispatch(setSelectedLead(lead))}
          onDropLead={handleDropLead}
          onAdvanceStage={handleAdvanceStage}
          canChangeStage={canChangeStage}
        />
      )}

      <LeadDossierDrawer
        open={Boolean(selectedLead)}
        onClose={() => dispatch(setSelectedLead(null))}
        lead={selectedLead}
        advisors={advisors}
        userRole={userRole}
        isAssigningAdvisor={assigningAdvisor}
        onStageChange={handleDropLead}
        onAssignAdvisor={handleAssignAdvisor}
        onConvertToClient={handleConvertToClient}
        onResolveDuplicate={handleResolveDuplicate}
        onAddNote={handleAddNote}
      />

      <CreateLeadModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateLead}
        advisors={advisors}
        saving={savingLead}
      />
    </DashboardLayout>
  );
};

export default PipelineKanbanPage;
