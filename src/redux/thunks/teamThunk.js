import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchAdvisors = createAsyncThunk(
  'team/fetchAdvisors',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/team/advisors');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch advisors.'
      );
    }
  }
);

export const inviteAdvisor = createAsyncThunk(
  'team/inviteAdvisor',
  async (advisorData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/team/advisors/invite', advisorData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to invite advisor.'
      );
    }
  }
);

export const toggleAdvisorStatus = createAsyncThunk(
  'team/toggleAdvisorStatus',
  async ({ advisorId, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/team/advisors/${advisorId}/status`, {
        status,
      });
      return { advisorId, status, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update advisor status.'
      );
    }
  }
);

export const deleteAdvisor = createAsyncThunk(
  'team/deleteAdvisor',
  async ({ advisorId, reassignToAdvisorId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/team/advisors/${advisorId}`, {
        data: { reassignToAdvisorId },
      });
      return { advisorId, reassignToAdvisorId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete advisor.'
      );
    }
  }
);

