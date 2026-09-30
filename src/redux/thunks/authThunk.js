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
export const switchWorkspace = createAsyncThunk(
  'auth/switchWorkspace',
  async ({ brokerageId, role }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/switch-workspace', {
        brokerageId,
        role,
      });
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to switch workspace.'
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

export const verifyResetCode = createAsyncThunk(
  'auth/verifyResetCode',
  async ({ email, resetCode }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify-reset-code', {
        email,
        resetCode,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Invalid or expired verification code.'
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

export const sendSignupVerificationCode = createAsyncThunk(
  'auth/sendSignupVerificationCode',
  async ({ email, name }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/send-signup-verification-code', {
        email,
        name,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send verification code.'
      );
    }
  }
);

export const verifySignupCode = createAsyncThunk(
  'auth/verifySignupCode',
  async ({ email, code }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify-signup-code', {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Invalid or expired verification code.'
      );
    }
  }
);

export const setInitialPassword = createAsyncThunk(
  'auth/setInitialPassword',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/set-initial-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update initial password.'
      );
    }
  }
);


