import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/api/axiosInstance';

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (filters, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/tasks', { params: filters });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks.'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create task.'
      );
    }
  }
);

export const completeTask = createAsyncThunk(
  'task/completeTask',
  async ({ taskId, isCompleted }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/tasks/${taskId}/complete`, { isCompleted });
      return { taskId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to complete task.'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ taskId, taskData }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/tasks/${taskId}`, taskData);
      return { taskId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update task.'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async ({ taskId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
      return { taskId, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete task.'
      );
    }
  }
);
