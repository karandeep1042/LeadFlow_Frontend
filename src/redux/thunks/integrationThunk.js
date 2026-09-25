import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchIngestionSources = createAsyncThunk(
  'integration/fetchIngestionSources',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/integrations/sources');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch ingestion sources.'
      );
    }
  }
);

export const createIngestionSource = createAsyncThunk(
  'integration/createIngestionSource',
  async (sourceData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/integrations/sources', sourceData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create ingestion source.'
      );
    }
  }
);

export const updateIngestionSource = createAsyncThunk(
  'integration/updateIngestionSource',
  async ({ sourceId, sourceData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/integrations/sources/${sourceId}`, sourceData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update ingestion source.'
      );
    }
  }
);

export const deleteIngestionSource = createAsyncThunk(
  'integration/deleteIngestionSource',
  async (sourceId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/integrations/sources/${sourceId}`);
      return { sourceId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete ingestion source.'
      );
    }
  }
);

export const testWebhookPayload = createAsyncThunk(
  'integration/testWebhookPayload',
  async ({ sourceId, payload, dryRun = true }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/api/integrations/sources/${sourceId}/test?dryRun=${dryRun}`,
        payload
      );
      return { sourceId, dryRun, result: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Webhook test failed.'
      );
    }
  }
);

export const toggleSourceStatus = createAsyncThunk(
  'integration/toggleSourceStatus',
  async ({ sourceId, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/integrations/sources/${sourceId}/status`, {
        status,
      });
      return { sourceId, status, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update source status.'
      );
    }
  }
);

