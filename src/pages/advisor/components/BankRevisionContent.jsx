import React from 'react';
import {
  Stack, Box, Typography, Chip, Paper, Checkbox, Button,
  TextField, Alert, CircularProgress,
} from '@mui/material';
import { RotateCcw } from 'lucide-react';

export const BANK_REVISION_PRESETS = [
  'SCHUFA Bonitätsauskunft is older than 60 days. Bank requested an updated copy.',
  'Bank underwriters flagged unreadable / blurry scan. Please upload a clear PDF.',
  'Missing consecutive 3 months of payslips (Nettolohnabrechnungen).',
  'Bank account statement does not show official account holder name.',
  'Additional Eigenkapital (equity) proof required by lender underwriters.',
  'Property exposé is missing official Grundbuch extract / Flurkarte.',
];

export const BankRevisionContent = ({
  leadName,
  leadDocs = [],
  docsLoading = false,
  selectedDocIds = [],
  setSelectedDocIds,
  revisionReason = '',
  setRevisionReason,
  validationError = '',
  setValidationError,
}) => {
  return (
    <Stack spacing={2}>
      <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
          <RotateCcw size={20} color="#ea580c" style={{ flexShrink: 0, marginTop: 2 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9a3412', mb: 0.5 }}>
              Lender Revision / Auflage for {leadName || 'Borrower'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#c2410c', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Select the document(s) flagged by the bank and add revision instructions. Submitting will mark the files as <strong>Revision Needed</strong>, unlock the borrower's dropzone, and move the deal back to <strong>Document Collection</strong>.
            </Typography>
          </Box>
        </Box>
      </Box>

      {docsLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, gap: 1.5 }}>
          <CircularProgress size={22} color="warning" />
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Loading borrower documents...</Typography>
        </Box>
      ) : leadDocs.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No uploaded documents found for this borrower yet. You can still add revision notes and move the stage.
        </Alert>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              SELECT FLAGGED DOCUMENT(S) TO REJECT ({selectedDocIds.length} SELECTED):
            </Typography>
            <Button
              size="small"
              onClick={() => {
                if (selectedDocIds.length === leadDocs.length) {
                  setSelectedDocIds([]);
                } else {
                  setSelectedDocIds(leadDocs.map((d) => d._id));
                }
              }}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700, p: 0 }}
            >
              {selectedDocIds.length === leadDocs.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>

          <Box sx={{ maxHeight: 180, overflowY: 'auto', pr: 0.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {leadDocs.map((doc) => {
              const isSelected = selectedDocIds.includes(doc._id);
              return (
                <Paper
                  key={doc._id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDocIds(selectedDocIds.filter((id) => id !== doc._id));
                    } else {
                      setSelectedDocIds([...selectedDocIds, doc._id]);
                    }
                    if (validationError && setValidationError) setValidationError('');
                  }}
                  elevation={0}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    border: '1.5px solid',
                    borderColor: isSelected ? '#ea580c' : '#e2e8f0',
                    bgcolor: isSelected ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': { borderColor: isSelected ? '#ea580c' : '#cbd5e1' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, overflow: 'hidden' }}>
                    <Checkbox
                      checked={isSelected}
                      size="small"
                      sx={{ p: 0.25, color: '#94a3b8', '&.Mui-checked': { color: '#ea580c' } }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.title || doc.fileName || 'Untitled Document'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {doc.category || doc.docType || 'Document'} • {doc.fileName}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={doc.status === 'verified' ? 'Verified' : (doc.status === 'rejected' ? 'Rejected' : doc.status)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      bgcolor: doc.status === 'verified' ? '#ecfdf5' : (doc.status === 'rejected' ? '#fef2f2' : '#eff6ff'),
                      color: doc.status === 'verified' ? '#059669' : (doc.status === 'rejected' ? '#dc2626' : '#2563eb'),
                      border: `1px solid ${doc.status === 'verified' ? '#a7f3d0' : (doc.status === 'rejected' ? '#fecaca' : '#bfdbfe')}`,
                    }}
                  />
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
          STANDARD BANK REJECTION REASONS (CLICK TO APPLY):
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {BANK_REVISION_PRESETS.map((preset, idx) => (
            <Chip
              key={idx}
              label={preset}
              size="small"
              onClick={() => {
                setRevisionReason(preset);
                if (validationError && setValidationError) setValidationError('');
              }}
              sx={{
                fontSize: '0.73rem',
                backgroundColor: revisionReason === preset ? '#ffedd5' : '#f1f5f9',
                color: revisionReason === preset ? '#9a3412' : '#475569',
                border: `1px solid ${revisionReason === preset ? '#fdba74' : '#e2e8f0'}`,
                fontWeight: revisionReason === preset ? 700 : 500,
                cursor: 'pointer',
                maxWidth: '100%',
                height: 'auto',
                py: 0.5,
                '& .MuiChip-label': { whiteSpace: 'normal', display: 'block' },
                '&:hover': { backgroundColor: '#fed7aa' },
              }}
            />
          ))}
        </Box>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Rejection Reason / Client Instructions"
        placeholder="e.g. Underwriters at DSL Bank requested the latest 3 payslips showing net income and wage tax breakdown."
        value={revisionReason}
        onChange={(e) => {
          setRevisionReason(e.target.value);
          if (validationError && setValidationError) setValidationError('');
        }}
        error={!!validationError}
        helperText={validationError}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            fontSize: '0.875rem',
          },
        }}
      />
    </Stack>
  );
};

export default BankRevisionContent;