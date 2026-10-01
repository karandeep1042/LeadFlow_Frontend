import React, { useRef } from 'react';
import { Box, Paper, Typography, Stack, Button, Chip, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { CheckCircle2, AlertCircle, Clock, Upload, RefreshCw, Eye, Lock } from 'lucide-react';

const DocumentItemRow = ({
  definition,
  uploadedDoc,
  onUploadFile,
  onPreviewDoc,
  uploading = false,
  isVaultLocked = false,
  hasRevisionRequested = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadFile) onUploadFile(definition, file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const status = uploadedDoc?.status || 'unuploaded';

  const renderBadge = () => {
    if (uploading) {
      return (
        <Chip
          icon={<CircularProgress size={12} color="inherit" />}
          label="Uploading..."
          size="small"
          sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.75rem', height: 24 }}
        />
      );
    }
    if (status === 'verified') {
      return (
        <Chip
          icon={<CheckCircle2 size={13} color="#059669" />}
          label="Verified"
          size="small"
          sx={{ bgcolor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', fontWeight: 700, fontSize: '0.75rem', height: 24 }}
        />
      );
    }
    if (status === 'processing') {
      return (
        <Chip
          icon={<Clock size={13} color="#2563eb" />}
          label="Checking (~4s)..."
          size="small"
          sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700, fontSize: '0.75rem', height: 24 }}
        />
      );
    }
    if (status === 'rejected') {
      return (
        <Chip
          icon={<AlertCircle size={13} color="#dc2626" />}
          label="Revision Needed"
          size="small"
          sx={{ bgcolor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: 700, fontSize: '0.75rem', height: 24 }}
        />
      );
    }
    return (
      <Chip
        label={definition.required ? 'Required' : 'Optional'}
        size="small"
        sx={{
          bgcolor: definition.required ? '#fffbeb' : '#f8fafc',
          color: definition.required ? '#b45309' : '#64748b',
          border: '1px solid #e2e8f0',
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
        }}
      />
    );
  };

  const borderColor = uploading
    ? '#93c5fd'
    : status === 'rejected'
    ? '#fca5a5'
    : status === 'verified'
    ? '#a7f3d0'
    : status === 'processing'
    ? '#bfdbfe'
    : '#e2e8f0';

  const borderLeftAccent = uploading
    ? '4px solid #3b82f6'
    : status === 'rejected'
    ? '4px solid #ef4444'
    : status === 'verified'
    ? '4px solid #10b981'
    : status === 'processing'
    ? '4px solid #3b82f6'
    : '4px solid #cbd5e1';

  // If revision is requested, ONLY the rejected item is allowed to upload replacement; all other items are locked
  const isLockedForRevision = hasRevisionRequested && status !== 'rejected';
  const isFullyLocked = isVaultLocked || isLockedForRevision;

  const renderActionButton = (isMobile = false) => {
    const btnHeight = isMobile ? 44 : 38;
    const btnFlex = isMobile ? 1 : 'none';
    const btnWidth = isMobile ? '100%' : 'auto';

    if (uploading) {
      return (
        <Button
          variant="contained"
          size="small"
          disabled
          startIcon={<CircularProgress size={13} color="inherit" />}
          sx={{
            bgcolor: '#93c5fd !important',
            color: '#ffffff !important',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 2.25,
            whiteSpace: 'nowrap',
            height: btnHeight,
            flex: btnFlex,
            width: btnWidth,
            fontSize: '0.84rem',
            boxShadow: 'none',
            '&.Mui-disabled': {
              bgcolor: '#93c5fd !important',
              color: '#ffffff !important',
            },
          }}
        >
          {status === 'verified' ? 'Replacing...' : 'Uploading...'}
        </Button>
      );
    }

    if (status === 'rejected') {
      return (
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<RefreshCw size={15} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isVaultLocked}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            whiteSpace: 'nowrap',
            height: btnHeight,
            flex: btnFlex,
            width: btnWidth,
            px: 2,
            fontSize: '0.84rem',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
          }}
        >
          Upload Replacement
        </Button>
      );
    }

    if (isFullyLocked) {
      return (
        <Tooltip
          title={
            isLockedForRevision
              ? 'Locked: Only flagged revision documents can be replaced during this review stage.'
              : 'Document vault is locked during lender underwriting.'
          }
          arrow
        >
          <Box sx={{ flex: btnFlex, width: btnWidth }}>
            <Button
              variant="outlined"
              size="small"
              disabled
              startIcon={<Lock size={14} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                color: '#94a3b8 !important',
                borderColor: '#e2e8f0 !important',
                bgcolor: '#f8fafc',
                whiteSpace: 'nowrap',
                height: btnHeight,
                width: '100%',
                fontSize: '0.84rem',
              }}
            >
              Locked
            </Button>
          </Box>
        </Tooltip>
      );
    }

    if (status === 'verified') {
      return (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Upload size={14} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            color: '#334155',
            borderColor: '#cbd5e1',
            whiteSpace: 'nowrap',
            height: btnHeight,
            flex: btnFlex,
            width: btnWidth,
            fontSize: '0.84rem',
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
          }}
        >
          Replace
        </Button>
      );
    }

    if (status === 'processing') {
      return (
        <Button
          variant="outlined"
          size="small"
          disabled
          startIcon={<CircularProgress size={13} color="inherit" />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            whiteSpace: 'nowrap',
            height: btnHeight,
            flex: btnFlex,
            width: btnWidth,
            fontSize: '0.84rem',
          }}
        >
          Checking...
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        size="small"
        startIcon={<Upload size={14} />}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        sx={{
          bgcolor: '#2563eb',
          '&:hover': { bgcolor: '#1d4ed8' },
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 2,
          px: 2.25,
          whiteSpace: 'nowrap',
          height: btnHeight,
          flex: btnFlex,
          width: btnWidth,
          fontSize: '0.84rem',
          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
        }}
      >
        Upload
      </Button>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.25, md: 2.5 },
        borderRadius: { xs: 2.5, sm: 3 },
        border: '1px solid',
        borderColor,
        borderLeft: borderLeftAccent,
        bgcolor: status === 'rejected' ? '#fffaf5' : '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        },
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* Main Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 1.75, md: 2.5 },
        }}
      >
        {/* Document Info Column */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header Row: Title and Status Badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: { xs: '0.92rem', sm: '0.98rem' },
                lineHeight: 1.3,
              }}
            >
              {definition.title}
            </Typography>
            {renderBadge()}
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              mb: 0.25,
            }}
          >
            {definition.germanTitle}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.78rem', sm: '0.8rem' },
              display: 'block',
              lineHeight: 1.45,
            }}
          >
            {definition.description}
          </Typography>

          {/* Rejection Alert Box */}
          {status === 'rejected' && uploadedDoc?.rejectionReason && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                bgcolor: '#fef2f2',
                borderRadius: 2,
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
              }}
            >
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Revision Requested:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#b91c1c', fontSize: '0.82rem', mt: 0.25, fontWeight: 500, lineHeight: 1.4 }}
                >
                  {uploadedDoc.rejectionReason}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Action Controls - Desktop View (md+) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.25,
            flexShrink: 0,
          }}
        >
          {uploadedDoc && (
            <Tooltip title="Preview Document" arrow>
              <IconButton
                size="small"
                onClick={() => onPreviewDoc && onPreviewDoc(uploadedDoc)}
                sx={{
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  width: 38,
                  height: 38,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#e2e8f0', borderColor: '#cbd5e1' },
                }}
              >
                <Eye size={17} style={{ color: '#475569' }} />
              </IconButton>
            </Tooltip>
          )}
          {renderActionButton(false)}
        </Box>

        {/* Action Controls - Mobile / Tablet View (<md) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1.25,
            width: '100%',
            pt: 1.25,
            mt: 0.5,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {uploadedDoc && (
            <Tooltip title="Preview Document" arrow>
              <IconButton
                onClick={() => onPreviewDoc && onPreviewDoc(uploadedDoc)}
                aria-label="Preview Document"
                sx={{
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#e2e8f0', borderColor: '#cbd5e1' },
                }}
              >
                <Eye size={19} style={{ color: '#475569' }} />
              </IconButton>
            </Tooltip>
          )}
          {renderActionButton(true)}
        </Box>
      </Box>
    </Paper>
  );
};

export default DocumentItemRow;
