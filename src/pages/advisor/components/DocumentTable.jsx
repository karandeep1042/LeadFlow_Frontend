import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Typography, Chip, IconButton, Tooltip, CircularProgress,
} from '@mui/material';
import { Eye, CheckCircle2, AlertTriangle, Clock, ExternalLink, FileText } from 'lucide-react';
import { STAGE_META, getStageDisplayName } from '../../../utils/automationConstants';
import DocumentMobileCard from './DocumentMobileCard';
import { openDocumentInNewTab } from '../../../utils/documentUrl';

export const DocumentTable = ({
  documents = [],
  loading = false,
  onPreview,
  onQuickApprove,
  onOpenRejectModal,
  onOpenLeadDossier,
  actionLoading = false,
}) => {
  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <CircularProgress size={32} sx={{ color: '#2563eb', mb: 2 }} />
        <Typography variant="body2" sx={{ color: '#64748b' }}>Loading document compliance inbox...</Typography>
      </Paper>
    );
  }

  if (documents.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>No documents found</Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>Try adjusting your search, category, or status filter.</Typography>
      </Paper>
    );
  }

  return (
    <>
      {/* 1. Mobile Cards View (visible on < md) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
        {documents.map((doc) => (
          <DocumentMobileCard
            key={doc._id}
            doc={doc}
            onPreview={onPreview}
            onQuickApprove={onQuickApprove}
            onOpenRejectModal={onOpenRejectModal}
            onOpenLeadDossier={onOpenLeadDossier}
            actionLoading={actionLoading}
          />
        ))}
      </Box>

      {/* 2. Desktop Table View (visible on >= md) */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          display: { xs: 'none', md: 'block' },
          borderRadius: 3,
          border: '1px solid #e2e8f0',
        }}
      >
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>BORROWER / CASE</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>DOCUMENT</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>STATUS</TableCell>
            <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>UPLOADED</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => {
            const lead = doc.leadId;
            const client = doc.clientId;
            const isVerified = doc.status === 'verified';
            const isRejected = doc.status === 'rejected';
            const isProcessing = doc.status === 'processing' || doc.status === 'pending';

            const leadStage = lead?.stage;
            const isLocked = leadStage ? leadStage !== 'Document Collection' : false;

            return (
              <TableRow key={doc._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ py: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {lead ? `${lead.firstName} ${lead.lastName}` : client?.name || 'Client'}
                    </Typography>
                    {lead?.stage && (
                      <Chip
                        size="small"
                        label={getStageDisplayName(lead.stage)}
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          backgroundColor: STAGE_META[lead.stage]?.bgColor || '#f1f5f9',
                          color: STAGE_META[lead.stage]?.color || '#475569',
                          border: `1px solid ${STAGE_META[lead.stage]?.color ? `${STAGE_META[lead.stage].color}40` : '#e2e8f0'}`,
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{lead ? `${lead.city || 'Germany'} • €${Number(lead.loanAmount || 0).toLocaleString()}` : client?.email || ''}</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.8 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      cursor: doc.fileUrl ? 'pointer' : 'default',
                      color: doc.fileUrl ? '#1e40af' : '#0f172a',
                      '&:hover': doc.fileUrl ? { textDecoration: 'underline' } : {},
                    }}
                    onClick={() => {
                      if (doc.fileUrl) {
                        openDocumentInNewTab(doc.fileUrl);
                      } else {
                        onPreview(doc);
                      }
                    }}
                  >
                    {doc.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{doc.fileName} • {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.8 }}>
                  {isProcessing && <Chip size="small" icon={<Clock size={13} />} label="Processing Check..." sx={{ backgroundColor: '#fffbeb', color: '#b45309', fontWeight: 700 }} />}
                  {isVerified && <Chip size="small" icon={<CheckCircle2 size={13} color="#059669" />} label="Verified" sx={{ backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700 }} />}
                  {isRejected && <Tooltip title={doc.rejectionReason || 'Revision needed'}><Chip size="small" icon={<AlertTriangle size={13} color="#dc2626" />} label="Revision Needed" sx={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 700 }} /></Tooltip>}
                </TableCell>
                <TableCell sx={{ py: 1.8 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{new Date(doc.createdAt).toLocaleDateString()}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ py: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Tooltip title="Preview & Audit">
                      <IconButton size="small" onClick={() => onPreview(doc)} sx={{ color: '#2563eb' }}>
                        <Eye size={15} />
                      </IconButton>
                    </Tooltip>
                    {doc.fileUrl && (
                      <Tooltip title="Open in New Tab">
                        <IconButton
                          size="small"
                          onClick={() => openDocumentInNewTab(doc.fileUrl)}
                          sx={{ color: '#64748b', '&:hover': { color: '#2563eb' } }}
                        >
                          <ExternalLink size={15} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!isVerified && (
                      <Tooltip title={isLocked ? `Verification locked (Case in ${leadStage} stage)` : "Approve & Verify"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onQuickApprove(doc._id)}
                            disabled={actionLoading || isLocked}
                            sx={{ color: isLocked ? '#94a3b8' : '#059669' }}
                          >
                            <CheckCircle2 size={15} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                    {!isRejected && (
                      <Tooltip title={isLocked ? `Revision requests locked (Case in ${leadStage} stage)` : "Request Revision / Reject"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => onOpenRejectModal(doc)}
                            disabled={actionLoading || isLocked}
                            sx={{ color: isLocked ? '#94a3b8' : '#dc2626' }}
                          >
                            <AlertTriangle size={15} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                    {lead && (
                      <Tooltip title="Open Dossier">
                        <IconButton size="small" onClick={() => onOpenLeadDossier(lead)} sx={{ color: '#64748b' }}>
                          <ExternalLink size={15} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default DocumentTable;
