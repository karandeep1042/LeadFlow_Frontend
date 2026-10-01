import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Stack, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Tabs, Tab, IconButton, Tooltip, Alert, Snackbar, Skeleton,
} from '@mui/material';
import {
  Users, Search, RefreshCw, X, Zap, Kanban,
  ShieldAlert, ShieldCheck, FileCheck, Sparkles,
  CheckCircle2, AlertCircle, Mail, Phone, MapPin,
} from 'lucide-react';
import ClientStatusModal from './components/ClientStatusModal';
import { ROUTES } from '../../utils/constants/routes';
import { fetchClients, toggleClientStatus } from '../../redux/thunks/clientThunk';
import { clearClientMessages } from '../../redux/slices/clientSlice';

const STAGE_META = {
  New: { label: '01: Ingestion', color: '#2563eb', bg: '#eff6ff' },
  Contacted: { label: '02: Consultation', color: '#7c3aed', bg: '#f5f3ff' },
  'Document Collection': { label: '03: Documents', color: '#d97706', bg: '#fffbeb' },
  'Bank Submission': { label: '04: Bank Sub', color: '#0284c7', bg: '#f0f9ff' },
  Won: { label: '05: Approval', color: '#059669', bg: '#ecfdf5' },
  Lost: { label: '06: Notary & Closing', color: '#0d9488', bg: '#f0fdfa' },
};

export const ClientsManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { clients, loading, updatingId, error, successMessage } = useSelector((state) => state.client);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [advisorFilter, setAdvisorFilter] = useState('all');

  const [selectedClient, setSelectedClient] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchClients());
  };

  const handleOpenStatusModal = (client) => {
    setSelectedClient(client);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedClient(null);
  };

  const handleConfirmStatusToggle = async (clientId, status, reason) => {
    await dispatch(toggleClientStatus({ clientId, status, reason }));
    handleCloseStatusModal();
  };

  const advisorOptions = useMemo(() => {
    const map = new Map();
    clients.forEach((c) => {
      if (c.advisor) map.set(c.advisor.id || c.advisor.name, c.advisor.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (statusTab !== 'all' && client.status !== statusTab) return false;
      if (stageFilter !== 'all' && client.stage !== stageFilter) return false;
      if (advisorFilter !== 'all') {
        if (advisorFilter === 'unassigned') {
          if (client.advisor) return false;
        } else if (!client.advisor || (client.advisor.id !== advisorFilter && client.advisor.name !== advisorFilter)) {
          return false;
        }
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = (client.name || '').toLowerCase().includes(query);
        const matchesEmail = (client.email || '').toLowerCase().includes(query);
        const matchesPhone = (client.phone || '').toLowerCase().includes(query);
        const matchesCity = (client.city || '').toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCity) return false;
      }
      return true;
    });
  }, [clients, statusTab, stageFilter, advisorFilter, searchTerm]);

  const activeCount = useMemo(() => clients.filter((c) => c.status === 'active').length, [clients]);
  const suspendedCount = useMemo(() => clients.filter((c) => c.status === 'suspended').length, [clients]);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 2.5, md: 3.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Sparkles size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                Borrower Relations Desk
              </Typography>
              <Chip label={`${clients.length} Total`} size="small" sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb' }} />
              <Chip label={`${activeCount} Active`} size="small" sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#059669' }} />
              {suspendedCount > 0 && (
                <Chip label={`${suspendedCount} Suspended`} size="small" sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#fef2f2', color: '#dc2626' }} />
              )}
            </Box>

            {/* Mobile Inline Refresh Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Tooltip title="Refresh directory">
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{ border: '1px solid #cbd5e1', borderRadius: 2, p: 0.75, backgroundColor: '#ffffff', color: '#475569', '&:hover': { backgroundColor: '#f8fafc' } }}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.1rem' }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Clients & Borrowers Directory
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.8rem', sm: '0.875rem' }, mt: 0.5, maxWidth: 620 }}>
            Comprehensive management of borrower accounts, advisor assignments, pipeline stages, and security access.
          </Typography>
        </Box>

        {/* Desktop View (>= md) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <Tooltip title="Refresh directory">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                p: 1.1,
                backgroundColor: '#ffffff',
                color: '#475569',
                '&:hover': { backgroundColor: '#f8fafc' },
              }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<Zap size={16} />}
            onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_AUTOMATIONS)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2,
              py: 1,
              borderColor: '#cbd5e1',
              color: '#334155',
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#94a3b8' },
            }}
          >
            Email Templates
          </Button>
          <Button
            variant="contained"
            startIcon={<Kanban size={16} />}
            onClick={() => navigate(ROUTES.ADVISOR_PIPELINE)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#18181b',
              color: '#ffffff',
              px: 2.5,
              py: 1,
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Open Live Pipeline
          </Button>
        </Box>

        {/* Mobile Actions View (< md) */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.25,
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Zap size={16} />}
            onClick={() => navigate(ROUTES.BROKERAGE_ADMIN_AUTOMATIONS)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              py: 1,
              borderColor: '#cbd5e1',
              color: '#334155',
              fontSize: '0.85rem',
              '&:hover': { backgroundColor: '#f8fafc', borderColor: '#94a3b8' },
            }}
          >
            Email Templates
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Kanban size={16} />}
            onClick={() => navigate(ROUTES.ADVISOR_PIPELINE)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#18181b',
              color: '#ffffff',
              py: 1,
              fontSize: '0.85rem',
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Open Live Pipeline
          </Button>
        </Box>
      </Box>

      {/* Top-Right Floating Notification Alert */}
      <Snackbar
        open={Boolean(successMessage || error)}
        autoHideDuration={5000}
        onClose={() => dispatch(clearClientMessages())}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          icon={error ? <AlertCircle size={20} color="#dc2626" /> : <CheckCircle2 size={20} color="#059669" />}
          onClose={() => dispatch(clearClientMessages())}
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            alignItems: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: { xs: '90vw', sm: 480 },
          }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
      {/* Filter Toolbar Paper */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', mb: 3 }}>
        <Tabs
          value={statusTab}
          onChange={(_, val) => setStatusTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 2,
            borderBottom: '1px solid #e2e8f0',
            minHeight: 44,
            '& .MuiTabs-indicator': { backgroundColor: '#18181b', height: 2.5, borderRadius: 2 },
            '& .MuiTab-root': {
              fontWeight: 700,
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minHeight: 44,
              px: { xs: 1.5, sm: 2 },
            },
          }}
        >
          <Tab value="all" label={`All Borrowers (${clients.length})`} />
          <Tab value="active" label={`Active (${activeCount})`} icon={<ShieldCheck size={16} />} iconPosition="start" />
          <Tab value="suspended" label={`Deactivated / Suspended (${suspendedCount})`} icon={<ShieldAlert size={16} />} iconPosition="start" />
        </Tabs>

        {/* Responsive Search & Filters Row Layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          {/* Row 1 on Tablet/Mobile: Full-Width Search Input */}
          <TextField
            size="small"
            placeholder="Search by client name, email, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: '100%', md: 320, lg: 380 },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8fafc',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} style={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Row 2 on Tablet/Mobile: Filter Selects & Reset Button */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1.5,
              width: { xs: '100%', md: 'auto' },
              flex: { md: 1 },
              justifyContent: { xs: 'stretch', md: 'flex-end' },
            }}
          >
            <FormControl
              size="small"
              sx={{
                flex: { xs: 1, md: 'none' },
                minWidth: { xs: 0, md: 160 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <InputLabel id="stage-filter-label">Pipeline Stage</InputLabel>
              <Select
                labelId="stage-filter-label"
                value={stageFilter}
                label="Pipeline Stage"
                onChange={(e) => setStageFilter(e.target.value)}
                sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
              >
                <MenuItem value="all">All Stages</MenuItem>
                <MenuItem value="New">Stage 01: Ingestion</MenuItem>
                <MenuItem value="Contacted">Stage 02: Consultation</MenuItem>
                <MenuItem value="Document Collection">Stage 03: Documents</MenuItem>
                <MenuItem value="Bank Submission">Stage 04: Bank Sub</MenuItem>
                <MenuItem value="Won">Stage 05: Loan Approval</MenuItem>
                <MenuItem value="Lost">Stage 06: Closing</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                flex: { xs: 1, md: 'none' },
                minWidth: { xs: 0, md: 170 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <InputLabel id="advisor-filter-label">Assigned Advisor</InputLabel>
              <Select
                labelId="advisor-filter-label"
                value={advisorFilter}
                label="Assigned Advisor"
                onChange={(e) => setAdvisorFilter(e.target.value)}
                sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
              >
                <MenuItem value="all">All Advisors</MenuItem>
                <MenuItem value="unassigned">Unassigned</MenuItem>
                {advisorOptions.map((adv) => (
                  <MenuItem key={adv.id} value={adv.id}>
                    {adv.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(searchTerm || statusTab !== 'all' || stageFilter !== 'all' || advisorFilter !== 'all') && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setStatusTab('all');
                  setStageFilter('all');
                  setAdvisorFilter('all');
                }}
                sx={{
                  fontWeight: 700,
                  color: '#ef4444',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  px: 1,
                }}
              >
                Reset
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      {/* Clients List & Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        {/* Mobile Cards View (< sm) */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.5, p: 1.5 }}>
          {loading && clients.length === 0 ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 1.5, mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </Paper>
            ))
          ) : filteredClients.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
              <Users size={32} style={{ color: '#94a3b8', margin: '0 auto 8px' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                No clients found
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Try adjusting your search terms or filter selections.
              </Typography>
            </Box>
          ) : (
            filteredClients.map((client) => {
              const stage = STAGE_META[client.stage] || { label: client.stage, color: '#2563eb', bg: '#eff6ff' };
              const isSuspended = client.status === 'suspended';

              return (
                <Paper
                  key={client.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: '1px solid #e2e8f0',
                    backgroundColor: isSuspended ? '#fafafa' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.25,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Avatar sx={{ width: 38, height: 38, bgcolor: isSuspended ? '#fef2f2' : '#eff6ff', color: isSuspended ? '#dc2626' : '#2563eb', fontWeight: 800, fontSize: '0.85rem' }}>
                        {(client.name || 'C').charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{client.name}</Typography>
                          {client.isRegistered && (
                            <Chip label="Portal" size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569' }} />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{client.city || 'Location unset'}</Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={isSuspended ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                      label={isSuspended ? 'Suspended' : 'Active'}
                      size="small"
                      sx={{ height: 22, fontSize: '0.675rem', fontWeight: 800, backgroundColor: isSuspended ? '#fef2f2' : '#ecfdf5', color: isSuspended ? '#dc2626' : '#059669' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, backgroundColor: '#f8fafc', p: 1.25, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600, wordBreak: 'break-all' }}>{client.email || 'No email'}</Typography>
                    </Box>
                    {client.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>{client.phone}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Chip label={stage.label} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 800, backgroundColor: stage.bg, color: stage.color }} />
                    {client.docsCount > 0 ? (
                      <Chip
                        icon={<FileCheck size={12} />}
                        label={`${client.verifiedDocsCount}/${client.docsCount} verified`}
                        size="small"
                        sx={{ height: 22, fontSize: '0.675rem', fontWeight: 700, backgroundColor: client.verifiedDocsCount === client.docsCount ? '#ecfdf5' : '#fffbeb', color: client.verifiedDocsCount === client.docsCount ? '#059669' : '#d97706' }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>No docs</Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5, borderTop: '1px dashed #e2e8f0' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.675rem' }}>
                        Financing: €{((client.loanAmount || 0) / 1000).toFixed(0)}k
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600, fontSize: '0.675rem' }}>
                        Advisor: {client.advisor?.name || 'Unassigned'}
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant={isSuspended ? 'contained' : 'outlined'}
                      onClick={() => handleOpenStatusModal(client)}
                      disabled={updatingId === (client.id || client._id)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        backgroundColor: isSuspended ? '#059669' : 'transparent',
                        color: isSuspended ? '#ffffff' : '#dc2626',
                        borderColor: isSuspended ? '#059669' : '#fca5a5',
                      }}
                    >
                      {isSuspended ? 'Reactivate' : 'Deactivate'}
                    </Button>
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
        {/* Desktop & Tablet Table View (>= sm) */}
        <TableContainer sx={{ display: { xs: 'none', sm: 'block' }, overflowX: 'auto' }}>
          <Table sx={{ minWidth: { sm: 780, md: '100%' } }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow sx={{ '& th': { fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                <TableCell>Client / Borrower</TableCell>
                <TableCell>Assigned Advisor</TableCell>
                <TableCell>Mortgage Financing</TableCell>
                <TableCell>Pipeline Stage</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Account Status</TableCell>
                <TableCell align="right">Access Control</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && clients.length === 0 ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}><TableCell colSpan={7}><Skeleton variant="text" height={40} /></TableCell></TableRow>
                ))
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Users size={36} style={{ color: '#94a3b8', marginBottom: 8 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>No clients found matching current criteria</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Try adjusting your search terms or filter selections.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => {
                  const stage = STAGE_META[client.stage] || { label: client.stage, color: '#2563eb', bg: '#eff6ff' };
                  const isSuspended = client.status === 'suspended';
                  return (
                    <TableRow key={client.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      {/* Client Info */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: isSuspended ? '#fef2f2' : '#eff6ff', color: isSuspended ? '#dc2626' : '#2563eb', fontWeight: 800, fontSize: '0.85rem' }}>
                            {(client.name || 'C').charAt(0)}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{client.name}</Typography>
                              {client.isRegistered && (
                                <Chip label="Portal" size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#475569' }} />
                              )}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{client.email}</Typography>
                            {client.phone && <Typography variant="caption" sx={{ color: '#94a3b8' }}>{client.phone}</Typography>}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Assigned Advisor */}
                      <TableCell>
                        {client.advisor ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.7rem' }}>
                              {client.advisor.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8125rem' }}>{client.advisor.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>{client.advisor.email}</Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Chip label="Unassigned" size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#64748b' }} />
                        )}
                      </TableCell>

                      {/* Financing & Stage */}
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                          {client.loanAmount ? `€${client.loanAmount.toLocaleString()}` : '€0'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{client.city}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>&bull;</Typography>
                          <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600 }}>{client.visaType}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={stage.label} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 800, backgroundColor: stage.bg, color: stage.color }} />
                      </TableCell>
                      {/* Documents */}
                      <TableCell>
                        {client.docsCount > 0 ? (
                          <Chip
                            icon={<FileCheck size={13} />}
                            label={`${client.verifiedDocsCount}/${client.docsCount} verified`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: client.verifiedDocsCount === client.docsCount ? '#ecfdf5' : '#fffbeb',
                              color: client.verifiedDocsCount === client.docsCount ? '#059669' : '#d97706',
                            }}
                          />
                        ) : (
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>No docs</Typography>
                        )}
                      </TableCell>

                      {/* Account Status */}
                      <TableCell>
                        <Chip
                          icon={isSuspended ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                          label={isSuspended ? 'Suspended' : 'Active'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            backgroundColor: isSuspended ? '#fef2f2' : '#ecfdf5',
                            color: isSuspended ? '#dc2626' : '#059669',
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant={isSuspended ? 'contained' : 'outlined'}
                          onClick={() => handleOpenStatusModal(client)}
                          disabled={updatingId === (client.id || client._id)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'none',
                            backgroundColor: isSuspended ? '#059669' : 'transparent',
                            color: isSuspended ? '#ffffff' : '#dc2626',
                            borderColor: isSuspended ? '#059669' : '#fca5a5',
                            '&:hover': {
                              backgroundColor: isSuspended ? '#047857' : '#fef2f2',
                              borderColor: isSuspended ? '#047857' : '#ef4444',
                            },
                          }}
                        >
                          {isSuspended ? 'Reactivate' : 'Deactivate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Client Status Modal */}
      <ClientStatusModal
        open={statusModalOpen}
        client={selectedClient}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusToggle}
        loading={Boolean(updatingId)}
      />
    </Box>
  );
};

export default ClientsManagementPage;
