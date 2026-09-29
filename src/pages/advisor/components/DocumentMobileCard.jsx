import React from 'react';
import { Paper, Box, Typography, Chip, IconButton, Tooltip, Button } from '@mui/material';
import { Eye, CheckCircle2, AlertTriangle, Clock, ExternalLink, FileText, Lock } from 'lucide-react';
import { STAGE_META, getStageDisplayName } from '../../../utils/automationConstants';

export const DocumentMobileCard = ({
  doc, onPreview, onQuickApprove, onOpenRejectModal, onOpenLeadDossier, actionLoading = false,
}) => {
  const lead = doc.leadId;
  const client = doc.clientId;
  const isVerified = doc.status === 'verified';
  const isRejected = doc.status === 'rejected';
  const isProcessing = doc.status === 'processing' || doc.status === 'pending';
  const leadStage = lead?.stage;
  const isLocked = leadStage ? leadStage !== 'Document Collection' : false;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: 1.5,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {lead ? `${lead.firstName} ${lead.lastName}` : client?.name || 'Client'}
          </Typography>
          {lead?.stage && (
            <Chip
              size="small"
              label={getStageDisplayName(lead.stage)}
              sx={{
                mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 700,
                backgroundColor: `${STAGE_META[lead.stage]?.color || '#64748b'}15`,
                color: STAGE_META[lead.stage]?.color || '#64748b',
                border: `1px solid ${STAGE_META[lead.stage]?.color || '#64748b'}30`,
              }}
            />
          )}
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          {isProcessing && <Chip size="small" icon={<Clock size={12} />} label="Processing" sx={{ backgroundColor: '#fffbeb', color: '#b45309', fontWeight: 700, fontSize: '0.7rem' }} />}
          {isVerified && <Chip size="small" icon={<CheckCircle2 size={12} color="#059669" />} label="Verified" sx={{ backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.7rem' }} />}
          {isRejected && <Chip size="small" icon={<AlertTriangle size={12} color="#dc2626" />} label="Revision Needed" sx={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: '0.7rem' }} />}
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, backgroundColor: '#f8fafc', p: 1.25, borderRadius: 2 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 1.5, backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={18} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }} noWrap>{doc.title}</Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }} noWrap>{doc.fileName} • {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</Typography>
        </Box>
      </Box>

      {/* Uploaded date */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</Typography>
        {isLocked && <Chip size="small" icon={<Lock size={11} color="#64748b" />} label="Audit Locked" sx={{ height: 18, fontSize: '0.62rem', backgroundColor: '#f1f5f9', color: '#64748b' }} />}
      </Box>

      {isRejected && doc.rejectionReason && (
        <Box sx={{ p: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 600, display: 'block' }}>Reason: {doc.rejectionReason}</Typography>
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 0.5, borderTop: '1px solid #f1f5f9' }}>
        <Button
          fullWidth variant="outlined" size="small" startIcon={<Eye size={14} />} onClick={() => onPreview(doc)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', borderColor: '#bfdbfe', color: '#2563eb' }}
        >
          Audit
        </Button>
        {!isVerified && (
          <Tooltip title={isLocked ? `Verification locked (Case in ${leadStage})` : "Approve"}>
            <span>
              <IconButton size="small" onClick={() => onQuickApprove(doc._id)} disabled={actionLoading || isLocked} sx={{ border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: 2, p: 0.8 }}>
                <CheckCircle2 size={16} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {!isRejected && (
          <Tooltip title={isLocked ? `Revision locked (Case in ${leadStage})` : "Request Revision"}>
            <span>
              <IconButton size="small" onClick={() => onOpenRejectModal(doc)} disabled={actionLoading || isLocked} sx={{ border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: 2, p: 0.8 }}>
                <AlertTriangle size={16} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {lead && (
          <Tooltip title="Open Dossier">
            <IconButton size="small" onClick={() => onOpenLeadDossier(lead)} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, p: 0.8, color: '#64748b' }}>
              <ExternalLink size={16} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default DocumentMobileCard;