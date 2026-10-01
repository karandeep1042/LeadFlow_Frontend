import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, IconButton, Tooltip, Snackbar, Alert, Chip,
} from '@mui/material';
import { RefreshCw, Zap } from 'lucide-react';
import DocumentMetricsBar from './components/DocumentMetricsBar';
import DocumentFilterToolbar from './components/DocumentFilterToolbar';
import DocumentTable from './components/DocumentTable';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import DocumentRejectModal from './components/DocumentRejectModal';
import LeadDossierDrawer from './components/LeadDossierDrawer';
import StageTransitionConfirmModal from './components/StageTransitionConfirmModal';
import {
  fetchDocuments, approveDocument, rejectDocument, reverifyDocument,
} from '../../redux/thunks/documentThunk';
import { fetchAdvisors } from '../../redux/thunks/teamThunk';
import {
  setActiveCategory, setActiveStatus, setSearchQuery, setSelectedAdvisorId,
} from '../../redux/slices/documentSlice';
import { setSelectedLead } from '../../redux/slices/leadSlice';
import { usePipelineLeads } from './hooks/usePipelineLeads';

export const DocumentInboxPage = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const {
    documents, loading, actionLoading, activeCategory, activeStatus, searchQuery, selectedAdvisorId,
  } = useSelector((state) => state.document);
  const { advisors } = useSelector((state) => state.team);

  const {
    selectedLead, handleAssignAdvisor, handleConvertToClient,
    handleToggleClientStatus, handleAddNote, handleAdvanceStage,
    stageConfirmModal, handleRequestStageChange, handleConfirmStageTransition, handleCancelStageTransition,
  } = usePipelineLeads();

  const isStaffAdmin = role === 'brokerage_admin' || role === 'platform_admin';
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const loadDocs = () => {
    dispatch(fetchDocuments({ category: activeCategory, status: activeStatus, search: searchQuery, advisorId: selectedAdvisorId }));
  };

  useEffect(() => {
    loadDocs();
    if (isStaffAdmin && (!advisors || advisors.length === 0)) {
      dispatch(fetchAdvisors());
    }
  }, [dispatch, activeCategory, activeStatus, selectedAdvisorId]);

  const filteredDocuments = useMemo(() => {
    let result = [...documents];
    if (activeStatus && activeStatus !== 'all') {
      result = activeStatus === 'processing'
        ? result.filter((d) => d.status === 'processing' || d.status === 'pending')
        : result.filter((d) => d.status === activeStatus);
    }
    if (activeCategory && activeCategory !== 'all') result = result.filter((d) => d.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) =>
        d.title?.toLowerCase().includes(q) || d.fileName?.toLowerCase().includes(q) ||
        d.leadId?.firstName?.toLowerCase().includes(q) || d.leadId?.lastName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [documents, activeStatus, activeCategory, searchQuery]);

  const handleQuickApprove = async (docId) => {
    try {
      await dispatch(approveDocument({ docId })).unwrap();
      setToast({ open: true, message: 'Document verified & approved.', severity: 'success' });
      if (previewDoc?._id === docId) setPreviewDoc(null);
    } catch (err) { setToast({ open: true, message: err || 'Approval failed.', severity: 'error' }); }
  };

  const handleConfirmReject = async (docId, reason) => {
    try {
      await dispatch(rejectDocument({ docId, reason })).unwrap();
      setToast({ open: true, message: 'Revision requested from borrower.', severity: 'warning' });
      setRejectingDoc(null);
      if (previewDoc?._id === docId) setPreviewDoc(null);
    } catch (err) { setToast({ open: true, message: err || 'Rejection failed.', severity: 'error' }); }
  };

  const handleReverify = async (docId) => {
    try {
      await dispatch(reverifyDocument(docId)).unwrap();
      setToast({ open: true, message: 'Re-verification check queued.', severity: 'info' });
      if (previewDoc?._id === docId) setPreviewDoc(null);
    } catch (err) { setToast({ open: true, message: err || 'Failed.', severity: 'error' }); }
  };

  return (
    <Box>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: { xs: 2, md: 3 },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, width: { xs: '100%', md: 'auto' } }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.1rem' },
                }}
              >
                Document Verification Inbox
              </Typography>
              <Chip
                icon={<Zap size={12} color="#059669" />}
                label="Async Worker Live"
                size="small"
                sx={{
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                mt: 0.5,
                fontSize: { xs: '0.78rem', sm: '0.875rem' },
              }}
            >
              Audit borrower-uploaded payslips, SCHUFA reports, and IDs for German bank submissions.
            </Typography>
          </Box>

          {/* Compact Mobile Refresh Icon Button */}
          <Tooltip title="Refresh documents">
            <IconButton
              size="small"
              onClick={loadDocs}
              disabled={loading}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                p: 1,
                backgroundColor: '#ffffff',
                color: '#475569',
                flexShrink: 0,
                ml: 1,
                '&:hover': { backgroundColor: '#f8fafc' },
              }}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Desktop Actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
            onClick={loadDocs}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#e2e8f0',
              color: '#334155',
              height: 38,
              px: 2,
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <DocumentMetricsBar
        documents={documents}
        activeStatus={activeStatus}
        onStatusChange={(s) => dispatch(setActiveStatus(s))}
      />

      <DocumentFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => dispatch(setSearchQuery(q))}
        activeCategory={activeCategory}
        onCategoryChange={(c) => dispatch(setActiveCategory(c))}
        activeStatus={activeStatus}
        onStatusChange={(s) => dispatch(setActiveStatus(s))}
        selectedAdvisorId={selectedAdvisorId}
        onAdvisorChange={(a) => dispatch(setSelectedAdvisorId(a))}
        advisorsList={advisors}
        isStaffAdmin={isStaffAdmin}
        onResetFilters={() => {
          dispatch(setActiveCategory('all'));
          dispatch(setActiveStatus('all'));
          dispatch(setSearchQuery(''));
          if (isStaffAdmin) dispatch(setSelectedAdvisorId('all'));
        }}
      />

        <DocumentTable
          documents={filteredDocuments} loading={loading} actionLoading={actionLoading}
          onPreview={(doc) => setPreviewDoc(doc)} onQuickApprove={handleQuickApprove}
          onOpenRejectModal={(doc) => setRejectingDoc(doc)}
          onOpenLeadDossier={(lead) => dispatch(setSelectedLead(lead))}
        />

        <DocumentPreviewModal
          open={!!previewDoc} onClose={() => setPreviewDoc(null)} document={previewDoc}
          actionLoading={actionLoading} onApprove={handleQuickApprove}
          onOpenRejectModal={(doc) => { setPreviewDoc(null); setRejectingDoc(doc); }}
          onReverify={handleReverify}
          onOpenLeadDossier={(lead) => { setPreviewDoc(null); dispatch(setSelectedLead(lead)); }}
        />

        <DocumentRejectModal
          open={!!rejectingDoc} onClose={() => setRejectingDoc(null)} document={rejectingDoc}
          loading={actionLoading} onConfirmReject={handleConfirmReject}
        />

        <LeadDossierDrawer
          lead={selectedLead} open={!!selectedLead} onClose={() => dispatch(setSelectedLead(null))}
          onAssignAdvisor={handleAssignAdvisor} onConvertToClient={handleConvertToClient}
          onToggleClientStatus={handleToggleClientStatus} onAddNote={handleAddNote}
          onStageChange={handleRequestStageChange}
          onAdvanceStage={() => handleAdvanceStage(selectedLead)}
        />

        <StageTransitionConfirmModal
          open={stageConfirmModal.open}
          data={stageConfirmModal}
          loading={loading}
          onConfirm={handleConfirmStageTransition}
          onCancel={handleCancelStageTransition}
          onOpenDossier={(l) => dispatch(setSelectedLead(l))}
        />

        <Snackbar
          open={toast.open}
          autoHideDuration={5000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            zIndex: 9999,
            top: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
          }}
        >
          <Alert
            severity={toast.severity}
            onClose={() => setToast({ ...toast, open: false })}
            sx={{
              borderRadius: 2.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              minWidth: 300,
              maxWidth: { xs: '90vw', sm: 480 },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
    </Box>
  );
};

export default DocumentInboxPage;
