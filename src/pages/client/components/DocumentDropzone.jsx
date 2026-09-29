import React, { useState, useRef } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { UploadCloud, Lock } from 'lucide-react';

const DocumentDropzone = ({
  onBatchUpload,
  uploading = false,
  disabled = false,
  disabledTitle,
  disabledSubtitle,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onBatchUpload) {
      onBatchUpload(files);
    }
  };

  const handleFileSelect = (e) => {
    if (disabled) return;
    const files = Array.from(e.target.files);
    if (files.length > 0 && onBatchUpload) {
      onBatchUpload(files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (disabled) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.75, sm: 3.5 },
          borderRadius: { xs: 2.5, sm: 3.5 },
          border: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            maxWidth: 580,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              width: { xs: 44, sm: 48 },
              height: { xs: 44, sm: 48 },
              borderRadius: '50%',
              bgcolor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              mx: 'auto',
              flexShrink: 0,
            }}
          >
            <Lock size={22} />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: '#1e293b',
              textAlign: 'center',
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.35,
              width: '100%',
              mx: 'auto',
            }}
          >
            {disabledTitle || 'Document Vault Locked During Bank Underwriting'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              mt: 0.75,
              fontSize: { xs: '0.8rem', sm: '0.84rem' },
              textAlign: 'center',
              lineHeight: 1.5,
              width: '100%',
              maxWidth: 520,
              mx: 'auto',
            }}
          >
            {disabledSubtitle ||
              'Batch uploads are paused to ensure lender dossier compliance. If a specific document is flagged for revision by your advisor, you can replace that specific item in the checklist below.'}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        p: { xs: 2.75, sm: 3.5, md: 4 },
        borderRadius: { xs: 2.5, sm: 3.5 },
        border: '2px dashed',
        borderColor: isDragOver ? '#2563eb' : '#cbd5e1',
        bgcolor: isDragOver ? 'rgba(37, 99, 235, 0.04)' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#2563eb',
          bgcolor: 'rgba(37, 99, 235, 0.02)',
        },
        width: '100%',
        boxSizing: 'border-box',
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 580,
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            width: { xs: 48, sm: 54 },
            height: { xs: 48, sm: 54 },
            borderRadius: '50%',
            bgcolor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1.5,
            mx: 'auto',
            flexShrink: 0,
          }}
        >
          {uploading ? <CircularProgress size={26} thickness={4} /> : <UploadCloud size={26} />}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#0f172a',
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            textAlign: 'center',
            lineHeight: 1.35,
            width: '100%',
          }}
        >
          Drag & Drop German Mortgage Files Here
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            mt: 0.75,
            mb: 2,
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            textAlign: 'center',
            lineHeight: 1.5,
            width: '100%',
            maxWidth: 500,
          }}
        >
          Drop multiple PDF or image files at once (Payslips, SCHUFA, Passport, Bank Statements).
        </Typography>

        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: '#cbd5e1',
            color: '#334155',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: { xs: '0.82rem', sm: '0.85rem' },
            borderRadius: 2,
            px: 2.5,
            py: 0.75,
            minHeight: { xs: 42, sm: 36 },
          }}
        >
          Browse Files from Device
        </Button>
      </Box>
    </Paper>
  );
};

export default DocumentDropzone;
