import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTenants,
  createTenant,
  toggleTenantStatus,
  updateTenantDetails,
  fetchTenantMetrics,
  fetchPlatformOverviewMetrics,
  fetchPlatformTemplates,
  updatePlatformTemplate,
  resetPlatformTemplate,
  sendTestPlatformEmail,
  testSmtpConnection,
  fetchPlatformHealth,
  updateSuperAdminProfile,
  updateSuperAdminPassword,
  fetchEmailQueueItems,
  flushEmailQueueThunk,
  retryEmailQueueJob,
  retryAllEmailQueueJobs,
  deleteEmailQueueJob,
} from '../thunks/tenantThunk';

const initialState = {
  tenants: [],
  selectedTenant: null,
  selectedTenantMetrics: null,
  platformMetrics: {
    totalBrokerages: 0,
    activeBrokerages: 0,
    suspendedBrokerages: 0,
    totalLeads: 0,
    totalMortgagesAcquired: 0,
    totalVolumeEur: 0,
    totalDocs: 0,
    verifiedDocs: 0,
    rejectedDocs: 0,
    pendingDocs: 0,
    documentAcceptedRate: 94.2,
    documentRejectedRate: 5.8,
    funnel: [],
    leaderboard: [],
  },
  platformTemplates: [],
  selectedTemplate: null,
  smtpStatus: null,
  platformHealth: null,
  emailQueue: {
    counts: { pending: 0, processing: 0, sent: 0, failed: 0, total: 0 },
    items: [],
  },
  loading: false,
  templateLoading: false,
  actionLoading: false,
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
    setSelectedTemplate(state, action) {
      state.selectedTemplate = action.payload;
    },
    tenantStatusUpdated(state, action) {
      const { tenantId, status, banReason } = action.payload;
      const tenant = state.tenants.find((t) => String(t._id || t.id) === String(tenantId));
      if (tenant) {
        tenant.status = status;
        tenant.banReason = banReason;
      }
    },
    tenantCreated(state, action) {
      const newTenant = action.payload;
      const exists = state.tenants.some((t) => String(t._id || t.id) === String(newTenant._id || newTenant.id));
      if (!exists) {
        state.tenants.unshift(newTenant);
      }
    },
    tenantDetailsUpdated(state, action) {
      const updated = action.payload;
      const idx = state.tenants.findIndex((t) => String(t._id || t.id) === String(updated._id || updated.id));
      if (idx !== -1) {
        state.tenants[idx] = { ...state.tenants[idx], ...updated };
      }
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
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newTenant = action.payload.data || action.payload;
        if (newTenant) {
          const exists = state.tenants.some((t) => String(t._id || t.id) === String(newTenant._id || newTenant.id));
          if (!exists) state.tenants.unshift(newTenant);
        }
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Toggle Tenant Status (Suspend / Reactivate)
      .addCase(toggleTenantStatus.fulfilled, (state, action) => {
        const { tenantId, status, reason } = action.payload;
        const tenant = state.tenants.find((t) => String(t._id || t.id) === String(tenantId));
        if (tenant) {
          tenant.status = status;
          if (reason) tenant.banReason = reason;
        }
      })

      // Update Tenant Details
      .addCase(updateTenantDetails.fulfilled, (state, action) => {
        const { tenantId, data } = action.payload;
        const idx = state.tenants.findIndex((t) => String(t._id || t.id) === String(tenantId));
        if (idx !== -1 && data) {
          state.tenants[idx] = { ...state.tenants[idx], ...data };
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
      })

      // Fetch Platform Templates
      .addCase(fetchPlatformTemplates.pending, (state) => {
        state.templateLoading = true;
      })
      .addCase(fetchPlatformTemplates.fulfilled, (state, action) => {
        state.templateLoading = false;
        state.platformTemplates = action.payload.data?.templates || action.payload.data || [];
        if (!state.selectedTemplate && state.platformTemplates.length > 0) {
          state.selectedTemplate = state.platformTemplates[0];
        }
      })
      .addCase(fetchPlatformTemplates.rejected, (state, action) => {
        state.templateLoading = false;
        state.error = action.payload;
      })

      // Update Platform Template
      .addCase(updatePlatformTemplate.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        const idx = state.platformTemplates.findIndex((t) => t.key === key);
        if (idx !== -1 && data) {
          state.platformTemplates[idx] = data;
          if (state.selectedTemplate?.key === key) {
            state.selectedTemplate = data;
          }
        }
      })

      // Reset Platform Template
      .addCase(resetPlatformTemplate.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        const idx = state.platformTemplates.findIndex((t) => t.key === key);
        if (idx !== -1 && data) {
          state.platformTemplates[idx] = data;
          if (state.selectedTemplate?.key === key) {
            state.selectedTemplate = data;
          }
        }
      })

      // Test SMTP Connection
      .addCase(testSmtpConnection.fulfilled, (state, action) => {
        state.smtpStatus = action.payload;
      })

      // Fetch Platform Health
      .addCase(fetchPlatformHealth.fulfilled, (state, action) => {
        state.platformHealth = action.payload.data;
        if (action.payload.data?.emailQueue) {
          state.emailQueue = {
            ...state.emailQueue,
            counts: action.payload.data.emailQueue.counts || state.emailQueue.counts,
            items: action.payload.data.emailQueue.recentItems || state.emailQueue.items,
          };
        }
      })

      // Fetch Email Queue Items
      .addCase(fetchEmailQueueItems.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.emailQueue = action.payload.data;
        }
      })

      // Flush Email Queue
      .addCase(flushEmailQueueThunk.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.emailQueue = action.payload.data;
        }
      })

      // Delete Email Queue Job
      .addCase(deleteEmailQueueJob.fulfilled, (state, action) => {
        const jobId = action.payload?.jobId;
        if (jobId) {
          state.emailQueue.items = state.emailQueue.items.filter((item) => item._id !== jobId);
        }
      });
  },
});

export const {
  clearTenantError,
  setSelectedTenant,
  clearSelectedTenantMetrics,
  setSelectedTemplate,
  tenantStatusUpdated,
  tenantCreated,
  tenantDetailsUpdated,
} = tenantSlice.actions;

export default tenantSlice.reducer;
