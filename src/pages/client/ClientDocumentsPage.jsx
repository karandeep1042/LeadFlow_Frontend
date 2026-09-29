import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, Stack, Button, Tabs, Tab, LinearProgress, IconButton, Alert, Snackbar } from '@mui/material';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchClientPortalOverview } from '../../redux/thunks/clientThunk';
import { uploadDocument } from '../../redux/thunks/documentThunk';
import { useSocket } from '../../hooks/useSocket';
import { GERMAN_MORTGAGE_CATEGORIES, CHECKLIST_DEFINITIONS } from '../../utils/constants/checklistConfig';
import DocumentDropzone from './components/DocumentDropzone';
import DocumentItemRow from './components/DocumentItemRow';
import ClientDocumentPreviewModal from './components/ClientDocumentPreviewModal';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ClientDocumentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { portalData, portalLoading } = useSelector((s) => s.client);
  const [tab, setTab] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadingType, setUploadingType] = useState(null);
  const [toast, setToast] = useState(null);

  useSocket();
  useEffect(() => { dispatch(fetchClientPortalOverview()); }, [dispatch]);

  const docs = portalData?.documents || [];
  const verified = docs.filter((d) => d.status === 'verified').length;
  const rejected = docs.filter((d) => d.status === 'rejected').length;
  const totalRequired = 18;
  const pct = Math.min(100, Math.round((verified / totalRequired) * 100));

  const lead = portalData?.lead;
  const leadStage = lead?.stage;
  const isDeclined = Boolean(lead?.isDeclined);
  const isArchived = Boolean(lead?.isArchived);

  // Vault is locked for post-collection stages (underwriting, won, approved, lost, archived, declined)
  const isPostCollectionStage = ['Bank Submission', 'Won', 'Lost', 'Approved', 'Closed Won', 'Notary & Payout'].includes(leadStage) || isDeclined || isArchived;

  // Active revision requested state: advisor flagged specific document(s) for revision
  const hasRevisionRequested = rejected > 0;
  const isVaultLocked = isPostCollectionStage || isDeclined || isArchived;

  const handleUpload = async (def, file) => {
    try {
      setUploadingType(def.docType);
      const leadId = portalData?.lead?._id;
      await dispatch(uploadDocument({
        leadId: leadId && leadId !== 'case-default' ? leadId : null,
        clientId: user?._id || user?.id,
        docType: def.docType,
        category: def.category,
        title: def.title,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
      })).unwrap();
      setToast({ open: true, message: `Uploaded "${file.name}". OCR verification queued (~4s)...`, severity: 'info' });
      dispatch(fetchClientPortalOverview());
    } catch (err) {
      setToast({ open: true, message: `Upload error: ${err.message || 'Failed to upload file'}`, severity: 'error' });
    } finally {
      setUploadingType(null);
    }
  };

  const handleBatch = async (files) => {
    setToast({ open: true, message: `Uploading ${files.length} document(s)...`, severity: 'info' });
    for (const f of files) {
      const name = f.name.toLowerCase();
      let d = CHECKLIST_DEFINITIONS.find((x) => {
        if (name.includes('schufa') && x.docType === 'schufa') return true;
        if ((name.includes('pass') || name.includes('id')) && x.docType === 'passport') return true;
        if ((name.includes('blue') || name.includes('aufenthalt')) && x.docType === 'residence_permit') return true;
        return false;
      }) || CHECKLIST_DEFINITIONS[0];
      await handleUpload(d, f);
    }
  };

  const list = tab === 'all' ? CHECKLIST_DEFINITIONS : CHECKLIST_DEFINITIONS.filter((d) => d.category === tab);

  return (
    <DashboardLayout>
      {/* Sleek, Compact Header Toolbar */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: { xs: 2.5, sm: 3 },
          py: { xs: 1.25, sm: 1.5, md: 1.75 },
          px: { xs: 1.5, sm: 2, md: 2.5 },
          mb: { xs: 2, sm: 2.5 },
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 2 } }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate('/client/portal')}
              size="small"
              sx={{
                textTransform: 'none',
                color: '#475569',
                fontWeight: 700,
                fontSize: { xs: '0.82rem', sm: '0.875rem' },
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                px: { xs: 1.25, sm: 1.75 },
                py: { xs: 0.4, sm: 0.5 },
                minWidth: 0,
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a', borderColor: '#cbd5e1' },
              }}
            >
              Back
            </Button>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}
            >
              Document Vault
            </Typography>
          </Box>
          <IconButton
            onClick={() => dispatch(fetchClientPortalOverview())}
            size="small"
            disabled={portalLoading}
            aria-label="Refresh Documents"
            sx={{
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              width: { xs: 34, sm: 36 },
              height: { xs: 34, sm: 36 },
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#e2e8f0', borderColor: '#cbd5e1' },
              flexShrink: 0,
            }}
          >
            <RefreshCw size={15} className={portalLoading ? 'animate-spin' : ''} style={{ color: '#475569' }} />
          </IconButton>
        </Box>
      </Box>

      <Stack spacing={{ xs: 2, sm: 2.5 }}>
        {isDeclined ? (
          <Alert severity="error" sx={{ borderRadius: 2.5, fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
            Financing Case Concluded: This case is closed. Your document vault is available in read-only mode for your records.
          </Alert>
        ) : isArchived ? (
          <Alert severity="success" sx={{ borderRadius: 2.5, fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
            Mortgage Disbursed & Completed: Your mortgage has been successfully executed and disbursed. Documents are archived for your records.
          </Alert>
        ) : hasRevisionRequested ? (
          <Alert severity="warning" sx={{ borderRadius: 2.5, fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
            Action Required: {rejected} document{rejected > 1 ? 's' : ''} flagged for revision by your advisor. Only the flagged document{rejected > 1 ? 's are' : ' is'} unlocked for re-upload. All other verified documents are locked to preserve your mortgage dossier.
          </Alert>
        ) : isPostCollectionStage ? (
          <Alert severity="info" sx={{ borderRadius: 2.5, fontWeight: 600, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
            Vault Locked for Lender Underwriting: Your mortgage application is currently under review with partner lenders. Document replacements are locked to maintain bank dossier compliance.
          </Alert>
        ) : null}

        {/* Readiness Progress Card */}
        <Box sx={{ p: { xs: 2, sm: 2.25 }, bgcolor: '#ffffff', borderRadius: { xs: 2.5, sm: 3 }, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: { xs: '0.84rem', sm: '0.9rem' }, color: '#0f172a' }}>
              Readiness: {verified} / {totalRequired} Verified ({pct}%)
            </Typography>
            {rejected > 0 && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: '#fef2f2', px: 1, py: 0.25, borderRadius: 1.5, border: '1px solid #fecaca' }}>
                <AlertTriangle size={13} color="#dc2626" />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#dc2626', fontSize: '0.74rem' }}>
                  {rejected} Action Required
                </Typography>
              </Box>
            )}
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                bgcolor: pct === 100 ? '#10b981' : '#2563eb',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <DocumentDropzone
          onBatchUpload={handleBatch}
          uploading={!!uploadingType}
          disabled={isPostCollectionStage || hasRevisionRequested}
          disabledTitle={
            hasRevisionRequested
              ? 'Document Vault Locked for Targeted Revisions'
              : 'Document Vault Locked During Bank Underwriting'
          }
          disabledSubtitle={
            hasRevisionRequested
              ? "Batch uploads are locked. Please use the direct 'Upload Replacement' button on the specific revision document flagged below."
              : 'Batch uploads are paused to ensure lender dossier compliance.'
          }
        />

        {/* Scrollable Category Tabs */}
        <Box sx={{ bgcolor: '#ffffff', borderRadius: { xs: 2.5, sm: 3 }, p: 0.5, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 40, sm: 44 },
              '& .MuiTab-root': {
                minHeight: { xs: 40, sm: 44 },
                py: { xs: 0.75, sm: 1 },
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                fontWeight: 700,
                textTransform: 'none',
                color: '#64748b',
                borderRadius: 2,
                '&.Mui-selected': {
                  color: '#2563eb',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#2563eb',
                height: 3,
                borderRadius: 1.5,
              },
            }}
          >
            <Tab label="All Documents (18)" value="all" />
            {GERMAN_MORTGAGE_CATEGORIES.map((c) => (
              <Tab key={c.id} label={c.name} value={c.id} />
            ))}
          </Tabs>
        </Box>

        {/* Document Cards List */}
        <Stack spacing={{ xs: 1.25, sm: 1.5 }}>
          {list.map((def) => (
            <DocumentItemRow
              key={def.docType}
              definition={def}
              uploadedDoc={docs.find((d) => d.docType === def.docType)}
              uploading={uploadingType === def.docType}
              isVaultLocked={isPostCollectionStage}
              hasRevisionRequested={hasRevisionRequested}
              onUploadFile={handleUpload}
              onPreviewDoc={(d) => setPreviewDoc(d)}
            />
          ))}
        </Stack>
      </Stack>

      <ClientDocumentPreviewModal open={!!previewDoc} document={previewDoc} onClose={() => setPreviewDoc(null)} />
      <Snackbar
        open={Boolean(toast?.open)}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={toast?.severity || 'info'}
          onClose={() => setToast(null)}
          sx={{
            width: '100%',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderRadius: 2.5,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: { xs: '90vw', sm: 480 },
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default ClientDocumentsPage;
