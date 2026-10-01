import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, TextField, InputAdornment, Stack, Chip,
} from '@mui/material';
import { Building2, Search, Plus, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  fetchTenants,
  createTenant,
  toggleTenantStatus,
  updateTenantDetails,
  fetchTenantMetrics,
} from '../../redux/thunks/tenantThunk';
import TenantsKpiStrip from './components/TenantsKpiStrip';
import TenantsTable from './components/TenantsTable';
import TenantMetricsDrawer from './components/TenantMetricsDrawer';
import ProvisionTenantModal from './components/ProvisionTenantModal';
import { SuspendTenantModal, ReactivateTenantModal } from './components/SuspendReactivateModals';
import EditTenantModal from './components/EditTenantModal';

export default function TenantsManagementPage() {
  const dispatch = useDispatch();
  const { tenants, selectedTenantMetrics, loading, actionLoading } = useSelector((s) => s.tenant);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);
  const [isReactivateOpen, setIsReactivateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => { dispatch(fetchTenants()); }, [dispatch]);

  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const matchStatus = status === 'all' || t.status === status;
      const q = search.toLowerCase();
      return matchStatus && (!search || t.name?.toLowerCase().includes(q) || t.city?.toLowerCase().includes(q));
    });
  }, [tenants, status, search]);

  const totalCount = tenants.length;
  const activeCount = tenants.filter((t) => t.status === 'active').length;
  const suspendedCount = tenants.filter((t) => t.status === 'suspended').length;
  const totalVolume = tenants.reduce((acc, t) => acc + (t.stats?.wonVolumeEur || 0), 0);
  const curId = selectedTenant?._id || selectedTenant?.id;

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5', mb: 0.5 }}>
              <Building2 size={16} />
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Multi-Tenant SaaS
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Brokerage Organizations
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Provision, monitor, and manage mortgage workspaces.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
            <Button
              variant="outlined"
              onClick={() => dispatch(fetchTenants())}
              disabled={loading}
              startIcon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
              sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', color: '#475569', borderColor: '#cbd5e1', backgroundColor: '#ffffff', '&:hover': { backgroundColor: '#f8fafc' } }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAddOpen(true)}
              startIcon={<Plus size={16} />}
              sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', backgroundColor: '#4f46e5', boxShadow: 'none', '&:hover': { backgroundColor: '#4338ca', boxShadow: 'none' } }}
            >
              Add Brokerage
            </Button>
          </Stack>
        </Box>

        <TenantsKpiStrip totalCount={totalCount} activeCount={activeCount} suspendedCount={suspendedCount} totalVolume={totalVolume} />

        {/* Filter and Search Bar */}
        <Box sx={{ p: 2, backgroundColor: '#ffffff', borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Search brokerages by name or city..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' } }}
          />

          <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-start' }}>
            <Button
              size="small"
              variant={status === 'all' ? 'contained' : 'text'}
              onClick={() => setStatus('all')}
              sx={{
                borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.75rem',
                backgroundColor: status === 'all' ? '#0f172a' : 'transparent',
                color: status === 'all' ? '#ffffff' : '#64748b',
                boxShadow: 'none',
              }}
            >
              All ({totalCount})
            </Button>
            <Button
              size="small"
              variant={status === 'active' ? 'contained' : 'text'}
              onClick={() => setStatus('active')}
              sx={{
                borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.75rem',
                backgroundColor: status === 'active' ? '#059669' : 'transparent',
                color: status === 'active' ? '#ffffff' : '#64748b',
                boxShadow: 'none',
              }}
            >
              Active ({activeCount})
            </Button>
            <Button
              size="small"
              variant={status === 'suspended' ? 'contained' : 'text'}
              onClick={() => setStatus('suspended')}
              sx={{
                borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.75rem',
                backgroundColor: status === 'suspended' ? '#dc2626' : 'transparent',
                color: status === 'suspended' ? '#ffffff' : '#64748b',
                boxShadow: 'none',
              }}
            >
              Suspended ({suspendedCount})
            </Button>
          </Stack>
        </Box>

        <TenantsTable
          tenants={filteredTenants}
          onOpenDrawer={(t) => { setSelectedTenant(t); setIsDrawerOpen(true); dispatch(fetchTenantMetrics(t._id || t.id)); }}
          onOpenEdit={(t) => { setSelectedTenant(t); setIsEditOpen(true); }}
          onOpenBan={(t) => { setSelectedTenant(t); setIsBanOpen(true); }}
          onOpenReactivate={(t) => { setSelectedTenant(t); setIsReactivateOpen(true); }}
        />

        <ProvisionTenantModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={async (d) => { const r = await dispatch(createTenant(d)); return { success: createTenant.fulfilled.match(r), error: r.payload }; }} loading={actionLoading} />
        <SuspendTenantModal isOpen={isBanOpen} onClose={() => setIsBanOpen(false)} tenant={selectedTenant} onConfirm={(r) => { dispatch(toggleTenantStatus({ tenantId: curId, status: 'suspended', reason: r })); setIsBanOpen(false); }} />
        <ReactivateTenantModal isOpen={isReactivateOpen} onClose={() => setIsReactivateOpen(false)} tenant={selectedTenant} onConfirm={() => { dispatch(toggleTenantStatus({ tenantId: curId, status: 'active' })); setIsReactivateOpen(false); }} />
        <EditTenantModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} tenant={selectedTenant} onSave={(d) => { dispatch(updateTenantDetails({ tenantId: curId, ...d })); setIsEditOpen(false); }} />
        <TenantMetricsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} tenant={selectedTenant} metrics={selectedTenantMetrics} />
      </Box>
    </DashboardLayout>
  );
}
