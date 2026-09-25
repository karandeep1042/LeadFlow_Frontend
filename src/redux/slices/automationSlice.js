import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEmailTemplates,
  saveEmailTemplate,
  fetchStageTriggers,
  updateStageTrigger,
  toggleTriggerStatus,
} from '../thunks/automationThunk';

const initialState = {
  templates: [],
  triggers: [],
  selectedTemplate: null,
  activeTab: 'templates',
  loading: false,
  error: null,
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    clearAutomationError(state) {
      state.error = null;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSelectedTemplate(state, action) {
      state.selectedTemplate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data?.templates || action.payload.data || action.payload || [];
      })
      .addCase(fetchEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save Template
      .addCase(saveEmailTemplate.fulfilled, (state, action) => {
        const saved = action.payload.data || action.payload;
        if (saved) {
          const index = state.templates.findIndex((t) => String(t._id || t.id) === String(saved._id || saved.id));
          if (index !== -1) {
            state.templates[index] = saved;
          } else {
            state.templates.unshift(saved);
          }
        }
      })

      // Fetch Triggers
      .addCase(fetchStageTriggers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStageTriggers.fulfilled, (state, action) => {
        state.loading = false;
        state.triggers = action.payload.data?.triggers || action.payload.data || action.payload || [];
      })
      .addCase(fetchStageTriggers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Trigger
      .addCase(updateStageTrigger.fulfilled, (state, action) => {
        const savedTrigger = action.payload.data || action.payload;
        if (savedTrigger) {
          const index = state.triggers.findIndex((tr) => tr.stage === savedTrigger.stage);
          if (index !== -1) {
            state.triggers[index] = savedTrigger;
          } else {
            state.triggers.push(savedTrigger);
          }
        }
      })

      // Toggle Trigger Status
      .addCase(toggleTriggerStatus.fulfilled, (state, action) => {
        const { triggerId, isActive } = action.payload;
        const trigger = state.triggers.find((tr) => String(tr._id || tr.id) === String(triggerId));
        if (trigger) {
          trigger.isActive = isActive;
        }
      });
  },
});

export const { clearAutomationError, setActiveTab, setSelectedTemplate } = automationSlice.actions;
export default automationSlice.reducer;

