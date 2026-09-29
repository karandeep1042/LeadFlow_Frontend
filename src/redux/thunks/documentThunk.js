import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchDocuments = createAsyncThunk(
  'document/fetchDocuments',
  async (params = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/documents', { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch documents.'
      );
    }
  }
);

export const fetchClientDocuments = createAsyncThunk(
  'document/fetchClientDocuments',
  async (caseId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/documents/case/${caseId || 'current'}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch documents.'
      );
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'document/uploadDocument',
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/documents/upload', payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to upload document.'
      );
    }
  }
);

export const approveDocument = createAsyncThunk(
  'document/approveDocument',
  async ({ docId, notes }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/documents/${docId}/approve`, { notes });
      return { docId, data: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to approve document.'
      );
    }
  }
);

export const rejectDocument = createAsyncThunk(
  'document/rejectDocument',
  async ({ docId, reason, notes }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/documents/${docId}/reject`, { reason, notes });
      return { docId, reason, data: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to reject document.'
      );
    }
  }
);

export const reverifyDocument = createAsyncThunk(
  'document/reverifyDocument',
  async (docId, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/documents/${docId}/reverify`);
      return { docId, data: response.data?.data || response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to reverify document.'
      );
    }
  }
);

