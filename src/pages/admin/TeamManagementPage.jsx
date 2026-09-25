import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, Chip, Avatar, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, CircularProgress, Tooltip, Switch, InputAdornment,
} from '@mui/material';
import { UserPlus, Mail, CheckCircle2, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import teamApi from '../../services/api/teamApi';

export const TeamManagementPage = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [openInvite, setOpenInvite] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({ name: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  const fetchAdvisorsList = async () => {
    try {
      setLoading(true);
      setErrorBanner('');
      const res = await teamApi.getAdvisors();
      if (res?.data?.advisors) {
        setAdvisors(res.data.advisors);
      }
    } catch (err) {
      setErrorBanner(err.response?.data?.message || 'Failed to load mortgage advisors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorsList();
  }, []);

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

      const res = await teamApi.inviteAdvisor({
        name: newAdvisor.name.trim(),
        email: newAdvisor.email.trim().toLowerCase(),
        phone: newAdvisor.phone ? newAdvisor.phone.trim() : undefined,
      });

      if (res?.success) {
        setSuccessBanner(
          `Invitation dispatched! An onboarding email with login credentials was sent to ${newAdvisor.email.trim()}.`
        );
        if (res.data) setAdvisors((prev) => [res.data, ...prev]);
        else fetchAdvisorsList();

        setOpenInvite(false);
        setNewAdvisor({ name: '', email: '', phone: '' });
        setTimeout(() => setSuccessBanner(''), 7000);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to send invitation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (advisor) => {
    const nextStatus = advisor.status === 'active' ? 'suspended' : 'active';
    try {
      await teamApi.updateAdvisorStatus(advisor.id || advisor._id, nextStatus);
      setAdvisors((prev) =>
        prev.map((a) =>
          (a.id || a._id) === (advisor.id || advisor._id) ? { ...a, status: nextStatus } : a
        )
      );
    } catch (err) {
      setErrorBanner(err.response?.data?.message || 'Failed to update advisor status.');
      setTimeout(() => setErrorBanner(''), 4000);
    }
  };

  const filteredAdvisors = advisors.filter((adv) => {
    const q = searchTerm.toLowerCase();
    return adv.name?.toLowerCase().includes(q) || adv.email?.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' } }}>Team & Mortgage Advisors</Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>Manage staff seats and monitor advisor case loads.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="outlined" onClick={fetchAdvisorsList} disabled={loading} startIcon={<RefreshCw size={16} />} sx={{ borderRadius: 2.5, borderColor: '#cbd5e1', color: '#475569' }}>Refresh</Button>
          <Button variant="contained" startIcon={<UserPlus size={16} />} onClick={handleOpenInvite} sx={{ borderRadius: 2.5, fontWeight: 700, backgroundColor: '#18181b', color: '#ffffff' }}>+ Invite Advisor</Button>
        </Box>
      </Box>

      {successBanner && <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }} icon={<CheckCircle2 size={20} />} onClose={() => setSuccessBanner('')}>{successBanner}</Alert>}
      {errorBanner && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }} icon={<AlertTriangle size={20} />} onClose={() => setErrorBanner('')}>{errorBanner}</Alert>}

      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <TextField size="small" placeholder="Filter advisors by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} color="#94a3b8" /></InputAdornment>, sx: { borderRadius: 2, backgroundColor: '#f8fafc' } }} />
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
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
              {loading ? (
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
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>{searchTerm ? 'No results matching your query.' : 'Click "+ Invite Advisor" above to add your first mortgage advisor.'}</Typography>
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
                        <Chip label={adv.status ? adv.status.toUpperCase() : 'ACTIVE'} size="small" sx={{ backgroundColor: isActive ? '#ecfdf5' : '#fef2f2', color: isActive ? '#059669' : '#dc2626', fontWeight: 700, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={isActive ? 'Suspend Access' : 'Activate Access'}>
                          <Switch size="small" checked={isActive} onChange={() => handleToggleStatus(adv)} color="primary" />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openInvite} onClose={() => !submitting && setOpenInvite(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
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
            <TextField label="Phone Number (Optional)" placeholder="+49 30 12345678" value={newAdvisor.phone} onChange={(e) => setNewAdvisor({ ...newAdvisor, phone: e.target.value })} disabled={submitting} fullWidth size="small" />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenInvite(false)} color="inherit" disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Mail size={16} />} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2, fontWeight: 700 }}>
              {submitting ? 'Sending...' : 'Send Invitation Email'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeamManagementPage;
