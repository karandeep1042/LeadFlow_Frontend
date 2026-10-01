import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

// 1. Fetch Tenants
export const fetchTenants = createAsyncThunk(
  'tenant/fetchTenants',
  async (params, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/platform-admin/tenants', { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch brokerage tenants.'
      );
    }
  }
);

// 2. Create Tenant (Auto-verified)
export const createTenant = createAsyncThunk(
  'tenant/createTenant',
  async (tenantData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/platform-admin/tenants', tenantData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create new brokerage.'
      );
    }
  }
);

// 3. Toggle Tenant Status (Suspend / Reactivate)
export const toggleTenantStatus = createAsyncThunk(
  'tenant/toggleTenantStatus',
  async ({ tenantId, status, reason }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/platform-admin/tenants/${tenantId}/status`, {
        status,
        reason,
      });
      return { tenantId, status, reason, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update tenant status.'
      );
    }
  }
);

// 4. Update Tenant Basic Details
export const updateTenantDetails = createAsyncThunk(
  'tenant/updateTenantDetails',
  async ({ tenantId, name, city, phone, subdomain }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/platform-admin/tenants/${tenantId}/details`, {
        name,
        city,
        phone,
        subdomain,
      });
      return { tenantId, data: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update tenant details.'
      );
    }
  }
);

export const fetchTenantMetrics = createAsyncThunk(
  'tenant/fetchTenantMetrics',
  async (tenantId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/platform-admin/tenants/${tenantId}/metrics`);
      return { tenantId, metrics: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tenant metrics.'
      );
    }
  }
);

export const fetchPlatformOverviewMetrics = createAsyncThunk(
  'tenant/fetchPlatformOverviewMetrics',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/platform-admin/metrics/overview');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch platform metrics.'
      );
    }
  }
);

// 7. Fetch Platform Email Templates
export const fetchPlatformTemplates = createAsyncThunk(
  'tenant/fetchPlatformTemplates',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/platform-admin/email-templates');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch platform email templates.'
      );
    }
  }
);

// 8. Update Platform Email Template
export const updatePlatformTemplate = createAsyncThunk(
  'tenant/updatePlatformTemplate',
  async ({ key, subject, body }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/platform-admin/email-templates/${key}`, {
        subject,
        body,
      });
      return { key, data: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update email template.'
      );
    }
  }
);

// 9. Reset Platform Email Template
export const resetPlatformTemplate = createAsyncThunk(
  'tenant/resetPlatformTemplate',
  async (key, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/platform-admin/email-templates/${key}/reset`);
      return { key, data: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to reset email template.'
      );
    }
  }
);

// 10. Send Test Platform Email
export const sendTestPlatformEmail = createAsyncThunk(
  'tenant/sendTestPlatformEmail',
  async ({ key, targetEmail, subject, body }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/platform-admin/email-templates/${key}/test`, {
        targetEmail,
        subject,
        body,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send test email.'
      );
    }
  }
);

// 11. Test SMTP Connection
export const testSmtpConnection = createAsyncThunk(
  'tenant/testSmtpConnection',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/platform-admin/diagnostics/smtp');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'SMTP Connection Test Failed.'
      );
    }
  }
);

// 12. Fetch Full Platform Infrastructure Health
export const fetchPlatformHealth = createAsyncThunk(
  'tenant/fetchPlatformHealth',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/platform-admin/diagnostics/health');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch platform health.'
      );
    }
  }
);

// 13. Test Service Connection (database, redis, or smtp)
export const testPlatformService = createAsyncThunk(
  'tenant/testPlatformService',
  async ({ type, payload }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/platform-admin/diagnostics/test/${type}`, payload || {});
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || `Failed to test ${type} connection.`
      );
    }
  }
);

// 14. Update Service Credentials (database, redis, or smtp)
export const updatePlatformCredentials = createAsyncThunk(
  'tenant/updatePlatformCredentials',
  async ({ type, payload }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/platform-admin/diagnostics/credentials/${type}`, payload || {});
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || `Failed to update ${type} credentials.`
      );
    }
  }
);

// 15. Update Super Admin Profile
export const updateSuperAdminProfile = createAsyncThunk(
  'tenant/updateSuperAdminProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await axiosInstance.put('/api/platform-admin/profile', profileData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update administrator profile.'
      );
    }
  }
);

// 16. Update Super Admin Password
export const updateSuperAdminPassword = createAsyncThunk(
  'tenant/updateSuperAdminPassword',
  async (passwordData, thunkAPI) => {
    try {
      const response = await axiosInstance.put('/api/platform-admin/password', passwordData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update administrator password.'
      );
    }
  }
);

