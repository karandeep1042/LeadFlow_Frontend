import { createSlice } from '@reduxjs/toolkit';
import { fetchBrokerageDashboard } from '../thunks/brokerageDashboardThunk';

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const brokerageDashboardSlice = createSlice({
  name: 'brokerageDashboard',
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrokerageDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrokerageDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchBrokerageDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = brokerageDashboardSlice.actions;
export default brokerageDashboardSlice.reducer;
