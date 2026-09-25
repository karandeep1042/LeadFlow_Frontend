import { createSlice } from '@reduxjs/toolkit';
import {
  fetchIngestionSources,
  createIngestionSource,
  updateIngestionSource,
  deleteIngestionSource,
  testWebhookPayload,
  toggleSourceStatus,
} from '../thunks/integrationThunk';

const initialState = {
  sources: [],
  selectedSource: null,
  latestGeneratedKey: null,
  testRunnerResult: null,
  testRunnerLoading: false,
  loading: false,
  error: null,
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    clearIntegrationError(state) {
      state.error = null;
    },
    clearLatestGeneratedKey(state) {
      state.latestGeneratedKey = null;
    },
    clearTestRunnerResult(state) {
      state.testRunnerResult = null;
    },
    setSelectedSource(state, action) {
      state.selectedSource = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sources
      .addCase(fetchIngestionSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngestionSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload.data?.sources || action.payload.data || action.payload || [];
      })
      .addCase(fetchIngestionSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Source
      .addCase(createIngestionSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIngestionSource.fulfilled, (state, action) => {
        state.loading = false;
        const newSource = action.payload.data || action.payload;
        if (newSource) {
          state.sources.unshift(newSource);
          state.latestGeneratedKey = {
            rawApiKey: action.payload.rawApiKey || newSource.rawApiKey,
            webhookUrl: action.payload.webhookUrl || newSource.webhookUrl,
            sourceName: newSource.name,
          };
        }
      })
      .addCase(createIngestionSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Source
      .addCase(updateIngestionSource.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        if (updated) {
          const idx = state.sources.findIndex((s) => String(s._id || s.id) === String(updated._id || updated.id));
          if (idx !== -1) {
            state.sources[idx] = { ...state.sources[idx], ...updated };
          }
        }
      })

      // Delete Source
      .addCase(deleteIngestionSource.fulfilled, (state, action) => {
        const sourceId = action.payload.sourceId;
        state.sources = state.sources.filter((s) => String(s._id || s.id) !== String(sourceId));
      })

      // Test Webhook
      .addCase(testWebhookPayload.pending, (state) => {
        state.testRunnerLoading = true;
        state.testRunnerResult = null;
      })
      .addCase(testWebhookPayload.fulfilled, (state, action) => {
        state.testRunnerLoading = false;
        state.testRunnerResult = action.payload.result;
      })
      .addCase(testWebhookPayload.rejected, (state, action) => {
        state.testRunnerLoading = false;
        state.testRunnerResult = {
          success: false,
          error: action.payload || 'Webhook test failed',
        };
      })

      // Toggle Source Status
      .addCase(toggleSourceStatus.fulfilled, (state, action) => {
        const { sourceId, status } = action.payload;
        const src = state.sources.find((s) => String(s._id || s.id) === String(sourceId));
        if (src) {
          src.status = status;
        }
      });
  },
});

export const {
  clearIntegrationError,
  clearLatestGeneratedKey,
  clearTestRunnerResult,
  setSelectedSource,
} = integrationSlice.actions;

export default integrationSlice.reducer;

