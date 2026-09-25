import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

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

export const toggleTenantStatus = createAsyncThunk(
  'tenant/toggleTenantStatus',
  async ({ tenantId, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/platform-admin/tenants/${tenantId}/status`, {
        status,
      });
      return { tenantId, status, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update tenant status.'
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
