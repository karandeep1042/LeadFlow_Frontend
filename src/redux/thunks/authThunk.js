import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';
import { setAccessToken, clearAccessToken } from '../../services/api/tokenStorage';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  }
);

export const registerBrokerage = createAsyncThunk(
  'auth/registerBrokerage',
  async (signupData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/register-brokerage', signupData);
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Brokerage registration failed.'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile.'
      );
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  'auth/updateAdminProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update profile.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post('/api/auth/logout');
      clearAccessToken();
      return true;
    } catch (error) {
      clearAccessToken();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout encountered an issue'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to process forgot password request.'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, resetCode, newPassword }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/reset-password', {
        email,
        resetCode,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to reset password.'
      );
    }
  }
);

