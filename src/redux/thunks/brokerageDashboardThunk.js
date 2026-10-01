import { createAsyncThunk } from '@reduxjs/toolkit';
import { brokerageDashboardApi } from '../../services/api/brokerageDashboardApi';

export const fetchBrokerageDashboard = createAsyncThunk(
  'brokerageDashboard/fetchDashboard',
  async (_, thunkAPI) => {
    try {
      const data = await brokerageDashboardApi.getDashboardData();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch dashboard data';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
