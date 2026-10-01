import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi } from '../../services/api/clientApi';

export const fetchClients = createAsyncThunk(
  'client/fetchClients',
  async (_, thunkAPI) => {
    try {
      const data = await clientApi.getClients();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch clients';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchClientPortalOverview = createAsyncThunk(
  'client/fetchPortalOverview',
  async (leadId = null, thunkAPI) => {
    try {
      const data = await clientApi.getPortalOverview(leadId);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch portal overview';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleClientStatus = createAsyncThunk(
  'client/toggleClientStatus',
  async ({ clientId, status, reason }, thunkAPI) => {
    try {
      const data = await clientApi.updateClientStatus(clientId, status, reason);
      return { clientId, status, reason, data };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update client status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
