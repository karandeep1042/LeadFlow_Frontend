import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTenants,
  createTenant,
  toggleTenantStatus,
  fetchTenantMetrics,
  fetchPlatformOverviewMetrics,
} from '../thunks/tenantThunk';

const initialState = {
  tenants: [],
  selectedTenant: null,
  selectedTenantMetrics: null,
  platformMetrics: {
    totalBrokerages: 0,
    activeBrokerages: 0,
    suspendedBrokerages: 0,
    totalMortgagesAcquired: 0,
    totalVolumeEur: 0,
    documentAcceptedRate: 0,
    documentRejectedRate: 0,
  },
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearTenantError(state) {
      state.error = null;
    },
    setSelectedTenant(state, action) {
      state.selectedTenant = action.payload;
    },
    clearSelectedTenantMetrics(state) {
      state.selectedTenantMetrics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload.data?.tenants || action.payload.data || [];
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Tenant
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false;
        const newTenant = action.payload.data || action.payload;
        if (newTenant) {
          state.tenants.unshift(newTenant);
        }
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Tenant Status (Suspend / Reactivate)
      .addCase(toggleTenantStatus.fulfilled, (state, action) => {
        const { tenantId, status } = action.payload;
        const tenant = state.tenants.find((t) => String(t._id || t.id) === String(tenantId));
        if (tenant) {
          tenant.status = status;
        }
      })

      // Fetch Tenant Metrics
      .addCase(fetchTenantMetrics.fulfilled, (state, action) => {
        state.selectedTenantMetrics = action.payload.metrics;
      })

      // Fetch Platform Overview
      .addCase(fetchPlatformOverviewMetrics.fulfilled, (state, action) => {
        state.platformMetrics = {
          ...state.platformMetrics,
          ...(action.payload.data || action.payload),
        };
      });
  },
});

export const { clearTenantError, setSelectedTenant, clearSelectedTenantMetrics } = tenantSlice.actions;
export default tenantSlice.reducer;
