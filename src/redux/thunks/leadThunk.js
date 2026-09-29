import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchLeads = createAsyncThunk(
  'lead/fetchLeads',
  async (filters, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/leads', { params: filters });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leads.'
      );
    }
  }
);

export const createLead = createAsyncThunk(
  'lead/createLead',
  async (leadData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/leads', leadData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create lead.'
      );
    }
  }
);

export const updateLeadStage = createAsyncThunk(
  'lead/updateLeadStage',
  async ({ leadId, stage, previousStage, resolvePendingTask = true, isRevision, selectedDocIds, reason }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/leads/${leadId}/stage`, {
        stage,
        resolvePendingTask,
        isRevision,
        selectedDocIds,
        reason,
      });
      return { leadId, stage, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        leadId,
        previousStage,
        error: error.response?.data?.message || 'Failed to update lead stage.',
      });
    }
  }
);

export const assignLeadAdvisor = createAsyncThunk(
  'lead/assignLeadAdvisor',
  async ({ leadId, assignedAdvisorId }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/leads/${leadId}/assign`, { assignedAdvisorId });
      return { leadId, assignedAdvisorId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to assign advisor.'
      );
    }
  }
);

export const convertToClient = createAsyncThunk(
  'lead/convertToClient',
  async ({ leadId, caseData }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/leads/${leadId}/convert`, caseData || {});
      return { leadId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to convert lead to client.'
      );
    }
  }
);

export const resolveDuplicate = createAsyncThunk(
  'lead/resolveDuplicate',
  async ({ leadId, action, targetLeadId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/leads/${leadId}/resolve-duplicate`, {
        action, // 'merge' | 'mark_unique'
        targetLeadId,
      });
      return { leadId, action, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to resolve duplicate lead.'
      );
    }
  }
);

export const addLeadNote = createAsyncThunk(
  'lead/addLeadNote',
  async ({ leadId, note }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/leads/${leadId}/notes`, { note });
      return { leadId, note: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add note.'
      );
    }
  }
);

export const declineLead = createAsyncThunk(
  'lead/declineLead',
  async ({ leadId, reason }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/leads/${leadId}/decline`, { reason });
      return { leadId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to decline case.'
      );
    }
  }
);

export const archiveLead = createAsyncThunk(
  'lead/archiveLead',
  async ({ leadId, finalDisbursedAmount, closingNotes }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/leads/${leadId}/archive`, {
        finalDisbursedAmount,
        closingNotes,
      });
      return { leadId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to archive case.'
      );
    }
  }
);

export const unarchiveLead = createAsyncThunk(
  'lead/unarchiveLead',
  async ({ leadId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/leads/${leadId}/unarchive`);
      return { leadId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to restore case.'
      );
    }
  }
);

