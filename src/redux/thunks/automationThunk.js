import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchEmailTemplates = createAsyncThunk(
  'automation/fetchEmailTemplates',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/automations/templates');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch email templates.'
      );
    }
  }
);

export const saveEmailTemplate = createAsyncThunk(
  'automation/saveEmailTemplate',
  async (templateData, thunkAPI) => {
    try {
      const isEdit = Boolean(templateData._id || templateData.id);
      const response = isEdit
        ? await axiosInstance.put(`/api/automations/templates/${templateData._id || templateData.id}`, templateData)
        : await axiosInstance.post('/api/automations/templates', templateData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to save email template.'
      );
    }
  }
);

export const fetchStageTriggers = createAsyncThunk(
  'automation/fetchStageTriggers',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/automations/triggers');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stage triggers.'
      );
    }
  }
);

export const updateStageTrigger = createAsyncThunk(
  'automation/updateStageTrigger',
  async (triggerData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/automations/triggers', triggerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update stage trigger.'
      );
    }
  }
);

export const toggleTriggerStatus = createAsyncThunk(
  'automation/toggleTriggerStatus',
  async ({ triggerId, isActive }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/automations/triggers/${triggerId}/status`, {
        isActive,
      });
      return { triggerId, isActive, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to toggle trigger status.'
      );
    }
  }
);

