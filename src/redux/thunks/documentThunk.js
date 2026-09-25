import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

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
  async ({ docType, file, caseId }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', docType);
      if (caseId) formData.append('caseId', caseId);

      const response = await axiosInstance.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      return { docId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to approve document.'
      );
    }
  }
);

export const rejectDocument = createAsyncThunk(
  'document/rejectDocument',
  async ({ docId, reason }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/documents/${docId}/reject`, { reason });
      return { docId, reason, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to reject document.'
      );
    }
  }
);
