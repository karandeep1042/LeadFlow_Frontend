import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Avatar, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, Snackbar, CircularProgress, Tooltip, Switch, InputAdornment,
  IconButton, Skeleton, Stack,
} from '@mui/material';
import {
  UserPlus, Mail, Phone, CheckCircle2, AlertTriangle, Search,
  RefreshCw, Users, ShieldCheck, ShieldAlert, TrendingUp, Briefcase, Trash2,
} from 'lucide-react';
import PhoneInputField from '../../components/common/PhoneInputField';
import ModernSwitch from '../../components/common/ModernSwitch';
import DeleteAdvisorModal from './components/DeleteAdvisorModal';
import {
  fetchAdvisors,
  inviteAdvisor,
  toggleAdvisorStatus,
} from '../../redux/thunks/teamThunk';
import teamApi from '../../services/api/teamApi';

export const TeamManagementPage = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { advisors, loading } = useSelector((state) => state.team);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [openInvite, setOpenInvite] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({ name: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  // Delete advisor modal states
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAdvisorForDelete, setSelectedAdvisorForDelete] = useState(null);

  const fetchAdvisorsList = () => {
    dispatch(fetchAdvisors());
  };

  useEffect(() => {
    fetchAdvisorsList();
  }, [dispatch]);

  const handleOpenInvite = () => {
    setNewAdvisor({ name: '', email: '', phone: '' });
    setFormError('');
    setOpenInvite(true);
  };

  const validateForm = () => {
    const name = newAdvisor.name.trim();
    const email = newAdvisor.email.trim().toLowerCase();

    if (!name || name.length < 2) return 'Please enter a valid full name.';
    if (!email) return 'Please enter a work email address.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please provide a valid email format.';

    if (currentUser?.email && currentUser.email.toLowerCase().trim() === email) {
      return 'You cannot invite yourself to the organization.';
    }

    if (advisors.some((a) => a.email && a.email.toLowerCase().trim() === email)) {
      return 'An advisor with this email already belongs to your team roster.';
    }

    return null;
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const valError = validateForm();
    if (valError) {
      setFormError(valError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');

      const resAction = await dispatch(
        inviteAdvisor({
          name: newAdvisor.name.trim(),
          email: newAdvisor.email.trim().toLowerCase(),
          phone: newAdvisor.phone ? newAdvisor.phone.trim() : undefined,
        })
      );

      if (inviteAdvisor.fulfilled.match(resAction)) {
        setSuccessBanner(
          `Invitation dispatched! An onboarding email with login credentials was sent to ${newAdvisor.email.trim()}.`
        );
        setOpenInvite(false);
        setNewAdvisor({ name: '', email: '', phone: '' });
        setTimeout(() => setSuccessBanner(''), 7000);
      } else {
        setFormError(resAction.payload || 'Failed to send invitation. Please try again.');
      }
    } catch (err) {
      setFormError(err?.message || 'Failed to send invitation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (advisor) => {
    const nextStatus = advisor.status === 'active' ? 'suspended' : 'active';
    try {
      const resAction = await dispatch(
        toggleAdvisorStatus({
          advisorId: advisor.id || advisor._id,
          status: nextStatus,
        })
      );
      if (toggleAdvisorStatus.fulfilled.match(resAction)) {
        setSuccessBanner(
          nextStatus === 'suspended'
            ? `Advisor account "${advisor.name}" has been suspended.`
            : `Advisor account "${advisor.name}" has been reactivated.`
        );
        setTimeout(() => setSuccessBanner(''), 4000);
      } else {
        setErrorBanner(resAction.payload || 'Failed to update advisor status.');
        setTimeout(() => setErrorBanner(''), 4000);
      }
    } catch (err) {
      setErrorBanner(err.message || 'Failed to update advisor status.');
      setTimeout(() => setErrorBanner(''), 4000);
    }
  };

  const filteredAdvisors = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return advisors;
    return advisors.filter((adv) => {
      return adv.name?.toLowerCase().includes(q) || adv.email?.toLowerCase().includes(q);
    });
  }, [advisors, searchTerm]);

  const activeCount = useMemo(() => {
    return advisors.filter((a) => a.status === 'active' || !a.status).length;
  }, [advisors]);

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
              <Users size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                Team Roster
              </Typography>
              <Chip
                label={`${advisors.length} Total`}
                size="small"
                sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb' }}
              />
              <Chip
                label={`${activeCount} Active`}
                size="small"
                sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#059669' }}
              />
            </Box>

            {/* Mobile Inline Refresh Button (< md) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Tooltip title="Refresh team roster">
                <IconButton
                  size="small"
                  onClick={fetchAdvisorsList}
                  disabled={loading}
                  sx={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 2,
                    p: 0.75,
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.1rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Team & Mortgage Advisors
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              mt: 0.5,
              maxWidth: 620,
            }}
          >
            Manage staff seats, monitor advisor caseloads, pipeline volume, and account access.
          </Typography>
        </Box>

        {/* Desktop Actions View (>= md) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
          <Tooltip title="Refresh team roster">
            <IconButton
              onClick={fetchAdvisorsList}
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
            variant="contained"
            startIcon={<UserPlus size={16} />}
            onClick={handleOpenInvite}
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
            Invite Advisor
          </Button>
        </Box>

        {/* Mobile Actions View (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<UserPlus size={16} />}
            onClick={handleOpenInvite}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#18181b',
              color: '#ffffff',
              py: 1,
              '&:hover': { backgroundColor: '#09090b' },
            }}
          >
            Invite Advisor
          </Button>
        </Box>
      </Box>

      {/* Top-Right Floating Notification Alert */}
      <Snackbar
        open={Boolean(successBanner || errorBanner)}
        autoHideDuration={5000}
        onClose={() => {
          setSuccessBanner('');
          setErrorBanner('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={errorBanner ? 'error' : 'success'}
          icon={errorBanner ? <AlertTriangle size={20} color="#dc2626" /> : <CheckCircle2 size={20} color="#059669" />}
          onClose={() => {
            setSuccessBanner('');
            setErrorBanner('');
          }}
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
          {errorBanner || successBanner}
        </Alert>
      </Snackbar>

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <TextField
          size="small"
          placeholder="Filter advisors by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#94a3b8" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, backgroundColor: '#f8fafc' },
            },
          }}
        />
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        {/* Desktop Table View (>= sm) */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc', '& th': { fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                  <TableCell>Advisor</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Active Pipeline</TableCell>
                  <TableCell>Pipeline Volume</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {loading && advisors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: '#2563eb' }} />
                    <Typography variant="body2" sx={{ mt: 1.5, color: '#64748b' }}>Loading advisor team...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredAdvisors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>No mortgage advisors found</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>{searchTerm ? 'No results matching your query.' : 'Click "Invite Advisor" above to add your first mortgage advisor.'}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdvisors.map((adv) => {
                  const isActive = adv.status === 'active';
                  return (
                    <TableRow key={adv.id || adv._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, bgcolor: isActive ? '#eff6ff' : '#f1f5f9', color: isActive ? '#2563eb' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem' }}>
                            {adv.name ? adv.name.charAt(0).toUpperCase() : 'A'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>{adv.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Joined {adv.createdAt ? new Date(adv.createdAt).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' }) : 'Recently'}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 500 }}>{adv.email}</Typography>
                        {adv.phone && <Typography variant="caption" sx={{ color: '#64748b' }}>{adv.phone}</Typography>}
                      </TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{adv.activeCases ?? 0} active cases</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 800, color: '#2563eb' }}>{adv.volume || (adv.totalVolumeEur ? `€${(adv.totalVolumeEur / 1000000).toFixed(1)}M` : '€0')}</Typography></TableCell>
                      <TableCell>
                        <Chip
                          icon={isActive ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                          label={isActive ? 'ACTIVE' : 'SUSPENDED'}
                          size="small"
                          sx={{
                            backgroundColor: isActive ? '#ecfdf5' : '#fef2f2',
                            color: isActive ? '#059669' : '#dc2626',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                          <Tooltip title={isActive ? 'Deactivate / Suspend Access' : 'Activate Access'}>
                            <Box sx={{ display: 'inline-flex' }}>
                              <ModernSwitch
                                checked={isActive}
                                onChange={() => handleToggleStatus(adv)}
                              />
                            </Box>
                          </Tooltip>

                          <Tooltip title="Delete Advisor Account">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedAdvisorForDelete(adv);
                                setOpenDeleteModal(true);
                              }}
                              sx={{
                                color: '#94a3b8',
                                borderRadius: 2,
                                p: 0.75,
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#ffffff',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                  color: '#dc2626',
                                  borderColor: '#fca5a5',
                                  backgroundColor: '#fef2f2',
                                },
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>

        {/* Mobile Card View (< sm) */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', p: 1.5, gap: 1.5 }}>
          {loading && advisors.length === 0 ? (
            <Stack spacing={1.5}>
              <Skeleton variant="rounded" height={90} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" height={90} sx={{ borderRadius: 2 }} />
            </Stack>
          ) : filteredAdvisors.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>No mortgage advisors found</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontSize: '0.8rem' }}>
                {searchTerm ? 'No results matching your query.' : 'Click "Invite Advisor" above to add your first mortgage advisor.'}
              </Typography>
            </Box>
          ) : (
            filteredAdvisors.map((adv) => {
              const isActive = adv.status === 'active' || !adv.status;
              return (
                <Box
                  key={adv.id || adv._id}
                  sx={{
                    p: 1.75,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.25,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: isActive ? '#eff6ff' : '#f1f5f9', color: isActive ? '#2563eb' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem' }}>
                        {adv.name ? adv.name.charAt(0).toUpperCase() : 'A'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }} noWrap>
                          {adv.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                          Joined {adv.createdAt ? new Date(adv.createdAt).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' }) : 'Recently'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      <Chip
                        label={isActive ? 'ACTIVE' : 'SUSPENDED'}
                        size="small"
                        sx={{
                          height: 20,
                          backgroundColor: isActive ? '#ecfdf5' : '#fef2f2',
                          color: isActive ? '#059669' : '#dc2626',
                          fontWeight: 800,
                          fontSize: '0.65rem',
                        }}
                      />
                      <ModernSwitch checked={isActive} onChange={() => handleToggleStatus(adv)} />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedAdvisorForDelete(adv);
                          setOpenDeleteModal(true);
                        }}
                        sx={{
                          color: '#94a3b8',
                          borderRadius: 1.5,
                          p: 0.5,
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          '&:hover': {
                            color: '#dc2626',
                            borderColor: '#fca5a5',
                            backgroundColor: '#fef2f2',
                          },
                        }}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Mail size={12} color="#94a3b8" />
                      <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500 }} noWrap>
                        {adv.email}
                      </Typography>
                    </Box>
                    {adv.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Phone size={12} color="#94a3b8" />
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{adv.phone}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, pt: 0.5, borderTop: '1px dashed #f1f5f9' }}>
                    <Box sx={{ p: 0.75, backgroundColor: '#f8fafc', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Briefcase size={13} color="#64748b" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.65rem', lineHeight: 1 }}>
                          Active Cases
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.78rem' }}>
                          {adv.activeCases ?? 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 0.75, backgroundColor: '#eff6ff', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp size={13} color="#2563eb" />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#3b82f6', display: 'block', fontSize: '0.65rem', lineHeight: 1 }}>
                          Volume
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.78rem' }}>
                          {adv.volume || (adv.totalVolumeEur ? `€${(adv.totalVolumeEur / 1000000).toFixed(1)}M` : '€0')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Paper>

      <Dialog open={openInvite} onClose={() => !submitting && setOpenInvite(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, m: { xs: 2, sm: 3 } } }}>
        <form onSubmit={handleInvite}>
          <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} />
            </Box>
            Invite Mortgage Advisor
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
            {formError && <Alert severity="error" sx={{ borderRadius: 2 }} icon={<AlertTriangle size={18} />}>{formError}</Alert>}
            <TextField label="Full Name *" placeholder="Lukas Schmidt" value={newAdvisor.name} onChange={(e) => { setNewAdvisor({ ...newAdvisor, name: e.target.value }); setFormError(''); }} disabled={submitting} fullWidth size="small" />
            <TextField label="Work Email Address *" placeholder="lukas@hypoberlin.de" type="email" value={newAdvisor.email} onChange={(e) => { setNewAdvisor({ ...newAdvisor, email: e.target.value }); setFormError(''); }} disabled={submitting} fullWidth size="small" helperText="An invitation email with temporary credentials will be sent automatically." />
            <PhoneInputField
              id="advisor-phone"
              name="phone"
              label="Phone Number (Optional)"
              placeholder="30 12345678"
              value={newAdvisor.phone}
              onChange={(e) => setNewAdvisor({ ...newAdvisor, phone: e.target.value })}
              disabled={submitting}
              fullWidth
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenInvite(false)} color="inherit" disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Mail size={16} />} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2, fontWeight: 700 }}>
              {submitting ? 'Sending...' : 'Send Invitation Email'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Advisor Modal with Lead Reassignment Workflow */}
      <DeleteAdvisorModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedAdvisorForDelete(null);
        }}
        advisor={selectedAdvisorForDelete}
        allAdvisors={advisors}
        onSuccess={({ deletedAdvisor, reassignedCount, targetAdvisor, message }) => {
          setSuccessBanner(
            message ||
              `Advisor "${deletedAdvisor?.name}" was permanently deleted${
                reassignedCount > 0
                  ? ` and ${reassignedCount} active lead(s) were reassigned to ${targetAdvisor?.name || 'another advisor'}`
                  : ''
              }.`
          );
          setTimeout(() => setSuccessBanner(''), 7000);
          fetchAdvisorsList();
        }}
      />
    </Box>
  );
};

export default TeamManagementPage;
