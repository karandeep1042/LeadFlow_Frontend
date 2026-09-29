import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Chip, Button, IconButton, Grid, Paper, Tooltip,
} from '@mui/material';
import { X, CheckCircle2, AlertTriangle, Clock, FileText, RotateCw, ExternalLink, Lock } from 'lucide-react';

export const DocumentPreviewModal = ({
  open, onClose, document, onApprove, onOpenRejectModal, onReverify, onOpenLeadDossier,
  actionLoading = false, isStageLocked, leadStage: leadStageProp,
}) => {
  if (!document) return null;
  const lead = document.leadId;
  const client = document.clientId;
  const isVerified = document.status === 'verified';
  const isRejected = document.status === 'rejected';

  const currentStage = leadStageProp || lead?.stage;
  const locked = isStageLocked !== undefined ? isStageLocked : (currentStage ? currentStage !== 'Document Collection' : false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: { xs: 2.5, sm: 3 }, m: { xs: 1, sm: 2 } } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', py: 1.5, px: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>{document.title}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>{document.fileName} • {(document.fileSize / (1024 * 1024)).toFixed(2)} MB</Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}><X size={18} /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        {locked && (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Lock size={16} color="#64748b" />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
              Document Audit Locked: Deal is in <strong>{currentStage || 'Read Only'}</strong>. Approvals and revisions are only active in <strong>Document Collection</strong>.
            </Typography>
          </Paper>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>Audit</Typography>
                <Chip size="small" label={isVerified ? 'Verified' : isRejected ? 'Revision Needed' : 'Checking...'} icon={isVerified ? <CheckCircle2 size={13} /> : isRejected ? <AlertTriangle size={13} /> : <Clock size={13} />} sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
              </Box>
              <Box sx={{ p: 2, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e3a8a' }}>{document.title}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Applicant: {lead ? `${lead.firstName} ${lead.lastName}` : client?.name || 'N/A'}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Uploaded: {new Date(document.createdAt).toLocaleString()}</Typography>
                {document.notes && <Typography variant="caption" sx={{ color: '#334155', display: 'block', mt: 1, p: 1, backgroundColor: '#f1f5f9', borderRadius: 1 }}>{document.notes}</Typography>}
                {document.rejectionReason && <Typography variant="caption" sx={{ color: '#b91c1c', display: 'block', mt: 1, p: 1, backgroundColor: '#fef2f2', borderRadius: 1 }}>{document.rejectionReason}</Typography>}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                <Tooltip title={locked ? `Re-verification locked in ${currentStage || 'current stage'}` : ""}>
                  <span>
                    <Button
                      size="small"
                      startIcon={<RotateCw size={14} />}
                      onClick={() => onReverify(document._id)}
                      disabled={actionLoading || locked}
                      sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Re-run Check
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>Borrower Details</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{lead ? `${lead.firstName} ${lead.lastName}` : client?.name || 'N/A'}</Typography>
                {lead?.loanAmount && <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>€{Number(lead.loanAmount).toLocaleString()} Target</Typography>}
                {lead?.city && <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>{lead.city}, Germany</Typography>}
                {currentStage && <Chip size="small" label={`Stage: ${currentStage}`} sx={{ mt: 1, fontWeight: 700, fontSize: '0.7rem' }} />}
              </Box>
              {lead && onOpenLeadDossier && (
                <Button fullWidth variant="outlined" size="small" endIcon={<ExternalLink size={14} />} onClick={() => { onClose(); onOpenLeadDossier(lead); }} sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                  Open Dossier
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: 'space-between',
          gap: 1.25,
        }}
      >
        <Button onClick={onClose} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#64748b', fontWeight: 600 }}>
          Close
        </Button>
        <Box sx={{ display: 'flex', gap: 1.25, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
          <Tooltip title={locked ? `Revision requests locked in ${currentStage || 'current stage'}` : ""}>
            <span style={{ flex: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<AlertTriangle size={16} />}
                onClick={() => { onClose(); onOpenRejectModal(document); }}
                disabled={actionLoading || locked}
                sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.8rem' }}
              >
                Request Revision
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={locked ? `Verification locked in ${currentStage || 'current stage'}` : ""}>
            <span style={{ flex: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CheckCircle2 size={16} />}
                onClick={() => onApprove(document._id)}
                disabled={actionLoading || isVerified || locked}
                sx={{ borderRadius: 2, fontWeight: 700, fontSize: '0.8rem' }}
              >
                {isVerified ? 'Verified' : 'Approve'}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentPreviewModal;
