import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLeads,
  createLead,
  updateLeadStage,
  assignLeadAdvisor,
  convertToClient,
  resolveDuplicate,
  addLeadNote,
} from '../thunks/leadThunk';

const initialState = {
  leads: [],
  selectedLead: null,
  activeFilter: 'all', // 'all' | 'my' | 'duplicates' | 'high_value' | 'unassigned'
  selectedAdvisorFilter: 'all', // 'all' | advisorId | 'unassigned'
  searchQuery: '',
  loading: false,
  error: null,
  stageUpdateLoading: false,
  assigningAdvisor: false,
};

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    clearLeadError(state) {
      state.error = null;
    },
    setSelectedLead(state, action) {
      state.selectedLead = action.payload;
    },
    setActiveFilter(state, action) {
      state.activeFilter = action.payload;
    },
    setSelectedAdvisorFilter(state, action) {
      state.selectedAdvisorFilter = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    onLeadCreatedWs(state, action) {
      const incomingLead = action.payload;
      const exists = state.leads.some((l) => String(l._id || l.id) === String(incomingLead._id || incomingLead.id));
      if (!exists) {
        state.leads.unshift(incomingLead);
      }
    },
    onLeadUpdatedWs(state, action) {
      const updatedLead = action.payload;
      const index = state.leads.findIndex((l) => String(l._id || l.id) === String(updatedLead._id || updatedLead.id));
      if (index !== -1) {
        state.leads[index] = { ...state.leads[index], ...updatedLead };
      }
      if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(updatedLead._id || updatedLead.id)) {
        state.selectedLead = { ...state.selectedLead, ...updatedLead };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data?.leads || action.payload.data || action.payload || [];
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        const newLead = action.payload.data || action.payload;
        if (newLead) {
          state.leads.unshift(newLead);
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Optimistic Drag-and-Drop Stage Update
      .addCase(updateLeadStage.pending, (state, action) => {
        const { leadId, stage } = action.meta.arg;
        const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
        if (lead) {
          lead.stage = stage;
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
          state.selectedLead.stage = stage;
        }
      })
      .addCase(updateLeadStage.fulfilled, (state, action) => {
        const { leadId, data } = action.payload;
        const index = state.leads.findIndex((l) => String(l._id || l.id) === String(leadId));
        if (index !== -1 && data?.data) {
          state.leads[index] = { ...state.leads[index], ...data.data };
        }
      })
      .addCase(updateLeadStage.rejected, (state, action) => {
        // Rollback on failure
        const { leadId, previousStage } = action.payload || {};
        if (leadId && previousStage) {
          const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
          if (lead) {
            lead.stage = previousStage;
          }
        }
        state.error = action.payload?.error || 'Failed to update stage';
      })

      // Assign Advisor
      .addCase(assignLeadAdvisor.pending, (state) => {
        state.assigningAdvisor = true;
        state.error = null;
      })
      .addCase(assignLeadAdvisor.fulfilled, (state, action) => {
        state.assigningAdvisor = false;
        const updated = action.payload.data?.data || action.payload.data;
        if (updated) {
          const index = state.leads.findIndex((l) => String(l._id || l.id) === String(updated._id || updated.id));
          if (index !== -1) {
            state.leads[index] = updated;
          }
          if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(updated._id || updated.id)) {
            state.selectedLead = updated;
          }
        }
      })
      .addCase(assignLeadAdvisor.rejected, (state, action) => {
        state.assigningAdvisor = false;
        state.error = action.payload;
      })

      // Convert to Client
      .addCase(convertToClient.fulfilled, (state, action) => {
        const { leadId, data } = action.payload;
        const updated = data?.data?.lead || data?.lead;
        const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
        if (lead) {
          lead.isConverted = true;
          lead.stage = 'Document Collection';
          if (updated) Object.assign(lead, updated);
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
          state.selectedLead.isConverted = true;
          state.selectedLead.stage = 'Document Collection';
          if (updated) Object.assign(state.selectedLead, updated);
        }
      })

      // Resolve Duplicate
      .addCase(resolveDuplicate.fulfilled, (state, action) => {
        const updated = action.payload.data?.data || action.payload.data;
        const { leadId } = action.payload;
        const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
        if (lead) {
          lead.isDuplicate = false;
          lead.duplicateResolved = true;
          if (updated) Object.assign(lead, updated);
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
          state.selectedLead.isDuplicate = false;
          state.selectedLead.duplicateResolved = true;
          if (updated) Object.assign(state.selectedLead, updated);
        }
      })

      // Add Note
      .addCase(addLeadNote.fulfilled, (state, action) => {
        const { leadId, note } = action.payload;
        const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
        if (lead) {
          if (!lead.notesList) lead.notesList = [];
          lead.notesList.push(note);
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
          if (!state.selectedLead.notesList) state.selectedLead.notesList = [];
          state.selectedLead.notesList.push(note);
        }
      });
  },
});

export const {
  clearLeadError,
  setSelectedLead,
  setActiveFilter,
  setSelectedAdvisorFilter,
  setSearchQuery,
  onLeadCreatedWs,
  onLeadUpdatedWs,
} = leadSlice.actions;

export default leadSlice.reducer;

