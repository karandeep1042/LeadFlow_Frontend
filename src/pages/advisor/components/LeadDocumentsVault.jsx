import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Chip, Button, IconButton, Tooltip,
  TextField, InputAdornment, LinearProgress, Stack, FormControl, InputLabel, Select, MenuItem, Alert,
  Snackbar, CircularProgress,
} from '@mui/material';
import {
  CheckCircle2, AlertTriangle, Clock, FileText, Eye,
  RotateCw, RotateCcw, RefreshCw, Search, ShieldCheck, ShieldAlert,
  Sparkles, Lock, X,
} from 'lucide-react';
import axiosInstance from '../../../services/api/axiosInstance';
import {
  approveDocument, rejectDocument, reverifyDocument,
} from '../../../redux/thunks/documentThunk';
import {
  GERMAN_MORTGAGE_CATEGORIES, CHECKLIST_DEFINITIONS,
} from '../../../utils/constants/checklistConfig';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentRejectModal from './DocumentRejectModal';
import { subscribeToSocketEvent } from '../../../services/socket/socketService';

const VAULT_CATEGORIES = [
  { key: 'all', label: 'All Documents' },
  { key: 'personal', label: 'Personal & ID' },
  { key: 'income', label: 'Income & Salary' },
  { key: 'financial', label: 'Financial & SCHUFA' },
  { key: 'property', label: 'Property Exposé' },
];

// Simulated OCR metadata extraction details for German mortgage checklist
const getOcrExtractionSnippet = (docType, status) => {
  if (status !== 'verified' && status !== 'processing') return null;
  switch (docType) {
    case 'passport':
      return { label: 'OCR: ID Validated', detail: 'DE Bürgeramt Check: Passed • Exp: 2032' };
    case 'residence_permit':
      return { label: 'OCR: Residence Validated', detail: 'Aufenthaltstitel: §18b EU Blue Card (Unrestricted)' };
    case 'registration_cert':
      return { label: 'OCR: Meldebestätigung', detail: 'Registered: Berlin-Mitte • Valid <12 mo' };
    case 'marriage_cert':
      return { label: 'OCR: Standesamt', detail: 'Joint Liability Certified' };
    case 'payslip_1':
      return { label: 'OCR: Payslip M1', detail: 'Gross: €7,400 • Net: €4,450 • Tax Class: I' };
    case 'payslip_2':
      return { label: 'OCR: Payslip M2', detail: 'Gross: €7,400 • Net: €4,450 • Unbroken' };
    case 'payslip_3':
      return { label: 'OCR: Payslip M3', detail: 'Gross: €7,400 • Net: €4,450 • Permanent' };
    case 'tax_summary':
      return { label: 'OCR: Lohnsteuerbescheinigung', detail: 'Annual Gross: €88,800 • Deductions Match' };
    case 'employment_contract':
      return { label: 'OCR: Arbeitsvertrag', detail: 'Permanent (Unbefristet) • Passed Probation' };
    case 'employer_confirmation':
      return { label: 'OCR: HR Confirmation', detail: 'Active Employment Verified' };
    case 'schufa':
      return { label: 'OCR: SCHUFA Score', detail: 'Score: 98.8% • Positive Rating • <60 days' };
    case 'bank_statement_1':
      return { label: 'OCR: Account M1', detail: 'Salary Deposit Confirmed • Cash Flow Positive' };
    case 'bank_statement_2':
      return { label: 'OCR: Account M2', detail: 'Consistent Inflow • No Overdraft Defaults' };
    case 'bank_statement_3':
      return { label: 'OCR: Account M3', detail: 'Balance Steady • Living Expense Buffer Met' };
    case 'equity_proof':
      return { label: 'OCR: Eigenkapital', detail: 'Available Equity: Liquid Deposit Verified' };
    case 'property_expose':
      return { label: 'OCR: Exposé Data', detail: 'Object Verified • Valuation Benchmark Met' };
    case 'grundbuch':
      return { label: 'OCR: Grundbuchauszug', detail: 'Department II & III Clear • <3 mo' };
    case 'floor_plan':
      return { label: 'OCR: Wohnflächenberechnung', detail: 'DIN 277 Verified Living Area' };
    default:
      return { label: 'OCR: Compliance Check', detail: 'Document integrity verified' };
  }
};

export const LeadDocumentsVault = ({ lead, userRole = 'advisor' }) => {
  const dispatch = useDispatch();

  const [leadDocs, setLeadDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const leadId = lead?._id || lead?.id;
  const clientId = lead?.clientId?._id || (typeof lead?.clientId === 'string' ? lead?.clientId : null);
  const isDocumentStage = lead?.stage === 'Document Collection';

  const loadLeadDocuments = async () => {
    if (!leadId && !clientId) {
      setLeadDocs([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/documents', {
        params: {
          leadId: leadId || undefined,
          clientId: clientId || undefined,
        },
      });
      const docs = res.data?.data?.documents || res.data?.data || [];
      setLeadDocs(docs);
    } catch (err) {
      console.error('[LeadDocumentsVault] Failed loading lead documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadDocuments();
  }, [leadId, clientId]);

  useEffect(() => {
    const unsubStatus = subscribeToSocketEvent('document:status_updated', (updatedDoc) => {
      if (!updatedDoc) return;
      const isRelevant = String(updatedDoc.leadId?._id || updatedDoc.leadId) === String(leadId) ||
        String(updatedDoc.clientId?._id || updatedDoc.clientId) === String(clientId);
      if (isRelevant) {
        setLeadDocs((prev) => {
          const idx = prev.findIndex((d) => String(d._id) === String(updatedDoc._id));
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = updatedDoc;
            return next;
          }
          return [updatedDoc, ...prev];
        });
      }
    });

    const unsubDoc = subscribeToSocketEvent('document:updated', (updatedDoc) => {
      if (!updatedDoc) return;
      const isRelevant = String(updatedDoc.leadId?._id || updatedDoc.leadId) === String(leadId) ||
        String(updatedDoc.clientId?._id || updatedDoc.clientId) === String(clientId);
      if (isRelevant) {
        setLeadDocs((prev) => {
          const idx = prev.findIndex((d) => String(d._id) === String(updatedDoc._id));
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = updatedDoc;
            return next;
          }
          return [updatedDoc, ...prev];
        });
      }
    });

    const unsubCreated = subscribeToSocketEvent('document:created', (newDoc) => {
      if (!newDoc) return;
      const isRelevant = String(newDoc.leadId?._id || newDoc.leadId) === String(leadId) ||
        String(newDoc.clientId?._id || newDoc.clientId) === String(clientId);
      if (isRelevant) {
        setLeadDocs((prev) => {
          const exists = prev.some((d) => String(d._id) === String(newDoc._id));
          if (!exists) return [newDoc, ...prev];
          return prev.map((d) => (String(d._id) === String(newDoc._id) ? newDoc : d));
        });
      }
    });

    return () => {
      unsubStatus();
      unsubDoc();
      unsubCreated();
    };
  }, [leadId, clientId]);

  const docsByType = useMemo(() => {
    const map = new Map();
    for (const doc of leadDocs) {
      const existing = map.get(doc.docType);
      if (!existing || doc.status === 'verified' || (existing.status !== 'verified' && new Date(doc.updatedAt) > new Date(existing.updatedAt))) {
        map.set(doc.docType, doc);
      }
    }
    return map;
  }, [leadDocs]);

  const totalRequired = 18;
  const uploadedCount = docsByType.size;
  let verifiedCount = 0;
  let rejectedCount = 0;
  let processingCount = 0;

  for (const def of CHECKLIST_DEFINITIONS) {
    const doc = docsByType.get(def.docType);
    if (doc) {
      if (doc.status === 'verified') verifiedCount++;
      else if (doc.status === 'rejected') rejectedCount++;
      else processingCount++;
    }
  }

  const missingCount = totalRequired - uploadedCount;
  const readinessPercent = Math.min(100, Math.round((verifiedCount / totalRequired) * 100));
  const isComplianceComplete = verifiedCount >= totalRequired;

  const categoryCounts = useMemo(() => {
    const counts = { all: CHECKLIST_DEFINITIONS.length, personal: 0, income: 0, financial: 0, property: 0 };
    CHECKLIST_DEFINITIONS.forEach((def) => {
      if (counts[def.category] !== undefined) {
        counts[def.category] += 1;
      }
    });
    return counts;
  }, []);

  const isFiltered = searchQuery.trim() !== '' || statusFilter !== 'all' || activeCategory !== 'all';

  const filteredDefinitions = useMemo(() => {
    return CHECKLIST_DEFINITIONS.filter((def) => {
      if (activeCategory !== 'all' && def.category !== activeCategory) return false;
      const uploadedDoc = docsByType.get(def.docType);
      const status = uploadedDoc ? uploadedDoc.status : 'missing';

      if (statusFilter !== 'all') {
        if (statusFilter === 'missing' && uploadedDoc) return false;
        if (statusFilter === 'processing' && status !== 'processing' && status !== 'pending') return false;
        if (statusFilter === 'verified' && status !== 'verified') return false;
        if (statusFilter === 'rejected' && status !== 'rejected') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = def.title.toLowerCase().includes(q);
        const matchesGerman = def.germanTitle.toLowerCase().includes(q);
        const matchesDesc = def.description.toLowerCase().includes(q);
        const matchesFileName = uploadedDoc?.fileName?.toLowerCase().includes(q);
        const matchesReason = uploadedDoc?.rejectionReason?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesGerman && !matchesDesc && !matchesFileName && !matchesReason) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, statusFilter, searchQuery, docsByType]);
  const handleQuickApprove = async (docId) => {
    try {
      setActionLoading(true);
      await dispatch(approveDocument({ docId })).unwrap();
      setToast({ open: true, message: 'Document verified & approved for bank submission.', severity: 'success' });
      if (previewDoc?._id === docId) setPreviewDoc(null);
      loadLeadDocuments();
    } catch (err) {
      setToast({ open: true, message: err || 'Failed to approve document', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async (docId, reason) => {
    try {
      setActionLoading(true);
      await dispatch(rejectDocument({ docId, reason })).unwrap();
      setToast({ open: true, message: 'Revision requested from client.', severity: 'warning' });
      setRejectingDoc(null);
      loadLeadDocuments();
    } catch (err) {
      setToast({ open: true, message: err || 'Failed to reject document', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReverify = async (docId) => {
    try {
      setActionLoading(true);
      await dispatch(reverifyDocument(docId)).unwrap();
      setToast({ open: true, message: 'Re-verification check triggered (~4s)...', severity: 'info' });
      if (previewDoc?._id === docId) setPreviewDoc(null);
      loadLeadDocuments();
    } catch (err) {
      setToast({ open: true, message: err || 'Failed to re-verify document', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 2.5 }}>

      {!isDocumentStage && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2.5,
            backgroundColor: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: '#f1f5f9',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Lock size={18} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Document Audit Locked • Stage: {lead?.stage || 'Read Only'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
              Document verification and revision requests are disabled while the deal is in "{lead?.stage}". To verify new documents or request bank revisions from the borrower, move the case back to Document Collection.
            </Typography>
          </Box>
        </Paper>
      )}

      {isComplianceComplete ? (
        <Alert
          severity="success"
          icon={<ShieldCheck size={20} />}
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            border: '1px solid #a7f3d0',
            backgroundColor: '#ecfdf5',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#065f46' }}>
                German Underwriting Gate: 18 / 18 Documents Verified
              </Typography>
              <Typography variant="caption" sx={{ color: '#047857' }}>
                All mandatory documents verified. Case is unlocked for Bank Submission.
              </Typography>
            </Box>
            <Chip
              size="small"
              icon={<CheckCircle2 size={13} color="#059669" />}
              label="Bank Ready"
              sx={{ backgroundColor: '#ffffff', color: '#059669', fontWeight: 800, border: '1px solid #a7f3d0' }}
            />
          </Box>
        </Alert>
      ) : (
        <Alert
          severity={rejectedCount > 0 ? "error" : "warning"}
          icon={rejectedCount > 0 ? <ShieldAlert size={20} /> : <Clock size={20} />}
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            border: `1px solid ${rejectedCount > 0 ? '#fecdd3' : '#fde68a'}`,
            backgroundColor: rejectedCount > 0 ? '#fff1f2' : '#fffbeb',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: rejectedCount > 0 ? '#9f1239' : '#92400e' }}>
            Compliance Gate: {verifiedCount} of 18 Documents Verified ({totalRequired - verifiedCount} remaining)
          </Typography>
          <Typography variant="caption" sx={{ color: rejectedCount > 0 ? '#881337' : '#78350f', display: 'block', mt: 0.25 }}>
            {rejectedCount > 0
              ? `${rejectedCount} document(s) require borrower revision before bank submission.`
              : 'German mortgage rules require all 18 documents to be uploaded and verified before submitting.'}
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
        <Paper
          elevation={0}
          onClick={() => setStatusFilter('all')}
          sx={{
            p: 1.75,
            borderRadius: 2.5,
            border: `1.5px solid ${statusFilter === 'all' ? '#2563eb' : '#e2e8f0'}`,
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: '#2563eb' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.7rem' }}>UPLOADED</Typography>
            <FileText size={16} color="#2563eb" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {uploadedCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>/ 18</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
            {missingCount > 0 ? `${missingCount} Missing` : 'All Uploaded'}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          onClick={() => setStatusFilter('verified')}
          sx={{
            p: 1.75,
            borderRadius: 2.5,
            border: `1.5px solid ${statusFilter === 'verified' ? '#059669' : '#e2e8f0'}`,
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: '#059669' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669', fontSize: '0.7rem' }}>VERIFIED</Typography>
            <CheckCircle2 size={16} color="#059669" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#047857', lineHeight: 1.1 }}>
            {verifiedCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>/ 18</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#059669', fontSize: '0.68rem', fontWeight: 600 }}>
            {readinessPercent}% Bank-Ready
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          onClick={() => setStatusFilter('rejected')}
          sx={{
            p: 1.75,
            borderRadius: 2.5,
            border: `1.5px solid ${statusFilter === 'rejected' ? '#dc2626' : (rejectedCount > 0 ? '#fecaca' : '#e2e8f0')}`,
            backgroundColor: rejectedCount > 0 ? '#fff5f5' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: '#dc2626' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#dc2626', fontSize: '0.7rem' }}>REJECTED</Typography>
            <AlertTriangle size={16} color="#dc2626" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#b91c1c', lineHeight: 1.1 }}>
            {rejectedCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>/ 18</span>
          </Typography>
          <Typography variant="caption" sx={{ color: rejectedCount > 0 ? '#dc2626' : '#64748b', fontSize: '0.68rem', fontWeight: 600 }}>
            {rejectedCount > 0 ? 'Revision Needed' : 'No Rejections'}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          onClick={() => setStatusFilter('processing')}
          sx={{
            p: 1.75,
            borderRadius: 2.5,
            border: `1.5px solid ${statusFilter === 'processing' ? '#d97706' : '#e2e8f0'}`,
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: '#d97706' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#d97706', fontSize: '0.7rem' }}>IN REVIEW</Typography>
            <Clock size={16} color="#d97706" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>
            {processingCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>/ 18</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
            {processingCount > 0 ? 'Worker Checking...' : 'Queue Clear'}
          </Typography>
        </Paper>
      </Box>

      {/* Linear Compliance Progress Bar */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Overall Underwriting Readiness
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isComplianceComplete ? '#059669' : '#2563eb' }}>
            {verifiedCount} / {totalRequired} Verified ({readinessPercent}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={readinessPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#f1f5f9',
            '& .MuiLinearProgress-bar': {
              backgroundColor: isComplianceComplete ? '#059669' : '#2563eb',
              borderRadius: 4,
            },
          }}
        />
      </Paper>

      {/* Category Filter Chips & Search Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2.5,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {/* Category Filter Chips */}
        <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          pb: 0.5,
          pt: 0.25,
          '::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {VAULT_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.key;
          const count = categoryCounts[cat.key] ?? 0;
          return (
            <Chip
              key={cat.key}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <span>{cat.label}</span>
                  <Box
                    component="span"
                    sx={{
                      px: 0.75,
                      py: 0.1,
                      borderRadius: 1,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                    }}
                  >
                    {count}
                  </Box>
                </Box>
              }
              onClick={() => setActiveCategory(cat.key)}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                height: 32,
                borderRadius: 2,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                ...(isSelected
                  ? {
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      borderColor: '#2563eb',
                      boxShadow: '0 1px 3px rgba(37, 99, 235, 0.25)',
                      '&:hover': { backgroundColor: '#1d4ed8' },
                    }
                  : {
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      borderColor: '#e2e8f0',
                      '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', color: '#1e293b' },
                    }),
              }}
            />
          );
        })}
      </Box>

        {/* Search, Status Dropdown & Refresh Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1.25,
          }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Search documents by title, German term..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <Search size={16} color="#64748b" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                    sx={{ p: 0.5, color: '#94a3b8', '&:hover': { color: '#475569' } }}
                  >
                    <X size={14} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              '& .MuiOutlinedInput-root': {
                height: 38,
                borderRadius: 2,
                fontSize: '0.8125rem',
                backgroundColor: '#ffffff',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb' },
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              flexShrink: 0,
            }}
          >
            <FormControl
              size="small"
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                minWidth: { xs: 0, sm: 155 },
              }}
            >
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{
                  height: 38,
                  borderRadius: 2,
                  fontSize: '0.8125rem',
                  backgroundColor: '#ffffff',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '& .MuiSelect-select': { py: '8.5px' },
                }}
              >
                <MenuItem value="all">All Statuses ({CHECKLIST_DEFINITIONS.length})</MenuItem>
                <MenuItem value="verified">Verified ({verifiedCount})</MenuItem>
                <MenuItem value="processing">In Review ({processingCount})</MenuItem>
                <MenuItem value="rejected">Revision Needed ({rejectedCount})</MenuItem>
                <MenuItem value="missing">Missing ({missingCount})</MenuItem>
              </Select>
            </FormControl>

            {isFiltered && (
              <Tooltip title="Reset all filters">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setActiveCategory('all');
                  }}
                  startIcon={<RotateCcw size={14} />}
                  sx={{
                    height: 38,
                    minWidth: 'auto',
                    px: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    borderColor: '#fecaca',
                    color: '#dc2626',
                    backgroundColor: '#fff5f5',
                    flexShrink: 0,
                    '&:hover': {
                      borderColor: '#dc2626',
                      backgroundColor: '#fee2e2',
                    },
                  }}
                >
                  Reset
                </Button>
              </Tooltip>
            )}

            <Tooltip title="Refresh Document Vault">
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
                onClick={loadLeadDocuments}
                disabled={loading}
                sx={{
                  height: 38,
                  px: { xs: 1.5, sm: 2 },
                  minWidth: { xs: 'auto', sm: 96 },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  fontSize: '0.78rem',
                  borderColor: '#e2e8f0',
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  flexShrink: 0,
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Refresh
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* 18-Point Document Checklist Rows */}
      <Stack spacing={1.5}>
        {loading ? (
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <CircularProgress size={28} sx={{ color: '#2563eb', mb: 1.5 }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Loading compliance document checklist...
            </Typography>
          </Paper>
        ) : filteredDefinitions.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2.5, border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc' }}>
            <FileText size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
              No matching documents
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Try adjusting your category, status filter, or search query.
            </Typography>
          </Paper>
        ) : (
          filteredDefinitions.map((def) => {
            const uploadedDoc = docsByType.get(def.docType);
            const status = uploadedDoc?.status || 'missing';
            const isVerified = status === 'verified';
            const isRejected = status === 'rejected';
            const isProcessing = status === 'processing' || status === 'pending';
            const isMissing = status === 'missing';
            const ocrSnippet = getOcrExtractionSnippet(def.docType, status);

            const borderColor = isRejected ? '#fca5a5' : isVerified ? '#a7f3d0' : isProcessing ? '#bfdbfe' : '#e2e8f0';
            const bgColor = isRejected ? '#fffaf0' : isVerified ? '#ffffff' : isProcessing ? '#fafcff' : '#fcfdfe';

            return (
              <Paper
                key={def.docType}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor,
                  backgroundColor: bgColor,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: isRejected ? '#dc2626' : (isVerified ? '#059669' : '#2563eb'),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>
                        {def.title}
                      </Typography>

                      {isVerified && (
                        <Chip
                          size="small"
                          icon={<CheckCircle2 size={13} color="#059669" />}
                          label="Verified"
                          sx={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontWeight: 800, height: 22, fontSize: '0.7rem' }}
                        />
                      )}
                      {isProcessing && (
                        <Chip
                          size="small"
                          icon={<Clock size={13} />}
                          label="Reviewing (~4s)..."
                          sx={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 800, height: 22, fontSize: '0.7rem' }}
                        />
                      )}
                      {isRejected && (
                        <Tooltip title={uploadedDoc?.rejectionReason || 'Revision requested'}>
                          <Chip
                            size="small"
                            icon={<AlertTriangle size={13} color="#dc2626" />}
                            label="Revision Needed"
                            sx={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: 800, height: 22, fontSize: '0.7rem' }}
                          />
                        </Tooltip>
                      )}
                      {isMissing && (
                        <Chip
                          size="small"
                          label={def.required ? 'Missing (Required)' : 'Optional'}
                          sx={{
                            backgroundColor: def.required ? '#fffbeb' : '#f8fafc',
                            color: def.required ? '#b45309' : '#64748b',
                            border: '1px dashed #cbd5e1',
                            fontWeight: 700,
                            height: 22,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                      <Chip
                        size="small"
                        label={def.category.toUpperCase()}
                        sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#475569' }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block' }}>
                      {def.germanTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.25, fontSize: '0.75rem' }}>
                      {def.description}
                    </Typography>

                    {uploadedDoc && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <FileText size={13} color="#1e40af" />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e40af' }}>
                            {uploadedDoc.fileName}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          • {(uploadedDoc.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          • Uploaded {new Date(uploadedDoc.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    {isRejected && uploadedDoc?.rejectionReason && (
                      <Box sx={{ mt: 1.25, p: 1.25, backgroundColor: '#fef2f2', borderRadius: 2, border: '1px solid #fecaca' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', display: 'block' }}>
                          Advisor Feedback / Rejection Note:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b91c1c', fontSize: '0.8rem', mt: 0.25 }}>
                          {uploadedDoc.rejectionReason}
                        </Typography>
                      </Box>
                    )}

                    {ocrSnippet && (
                      <Box sx={{ mt: 0.75, display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.4, borderRadius: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <Sparkles size={12} color="#4f46e5" />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#334155' }}>
                          {ocrSnippet.label}:
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {ocrSnippet.detail}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' }, pt: { xs: 1, sm: 0 }, borderTop: { xs: '1px solid #f1f5f9', sm: 'none' } }}>
                    {uploadedDoc ? (
                      <>
                        <Tooltip title="Preview & Audit Document">
                          <IconButton
                            size="small"
                            onClick={() => setPreviewDoc(uploadedDoc)}
                            sx={{ color: '#2563eb', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}
                          >
                            <Eye size={15} />
                          </IconButton>
                        </Tooltip>

                        {!isVerified && (
                          <Tooltip title={!isDocumentStage ? `Verification locked (Case in ${lead?.stage || 'Current'} stage)` : "Verify Document"}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleQuickApprove(uploadedDoc._id)}
                                disabled={actionLoading || !isDocumentStage}
                                sx={{
                                  color: !isDocumentStage ? '#94a3b8' : '#059669',
                                  backgroundColor: !isDocumentStage ? '#f1f5f9' : '#ecfdf5',
                                  border: `1px solid ${!isDocumentStage ? '#e2e8f0' : '#a7f3d0'}`,
                                }}
                              >
                                <CheckCircle2 size={15} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                        {!isRejected && (
                          <Tooltip title={!isDocumentStage ? `Revision requests locked (Case in ${lead?.stage || 'Current'} stage)` : "Request Revision / Reject"}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => setRejectingDoc(uploadedDoc)}
                                disabled={actionLoading || !isDocumentStage}
                                sx={{
                                  color: !isDocumentStage ? '#94a3b8' : '#dc2626',
                                  backgroundColor: !isDocumentStage ? '#f1f5f9' : '#fef2f2',
                                  border: `1px solid ${!isDocumentStage ? '#e2e8f0' : '#fecaca'}`,
                                }}
                              >
                                <AlertTriangle size={15} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                        <Tooltip title={!isDocumentStage ? `Re-verification locked (Case in ${lead?.stage || 'Current'} stage)` : "Re-run Compliance Check"}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleReverify(uploadedDoc._id)}
                              disabled={actionLoading || !isDocumentStage}
                              sx={{
                                color: !isDocumentStage ? '#94a3b8' : '#475569',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              <RotateCw size={15} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <Chip
                        size="small"
                        label="Not Uploaded"
                        sx={{
                          height: 24,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Paper>
            );
          })
        )}
      </Stack>

      {/* Reusable Document Preview Modal */}
      <DocumentPreviewModal
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        actionLoading={actionLoading}
        isStageLocked={!isDocumentStage}
        leadStage={lead?.stage}
        onApprove={handleQuickApprove}
        onOpenRejectModal={(doc) => {
          setPreviewDoc(null);
          setRejectingDoc(doc);
        }}
        onReverify={handleReverify}
      />

      {/* Reusable Document Reject Modal */}
      <DocumentRejectModal
        open={!!rejectingDoc}
        onClose={() => setRejectingDoc(null)}
        document={rejectingDoc}
        loading={actionLoading}
        onConfirmReject={handleConfirmReject}
      />

      {/* Notifications Toast */}
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

export default LeadDocumentsVault;

