import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/notifications');
      return response.data?.data || { notifications: [], unreadCount: 0 };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to load notifications.'
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (notificationId, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
      return response.data?.data || { _id: notificationId, isRead: true };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read.'
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllNotificationsAsRead',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to mark all as read.'
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}`);
      return notificationId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification.'
      );
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notification/clearAllNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.delete('/api/notifications/clear-all');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to clear all notifications.'
      );
    }
  }
);

