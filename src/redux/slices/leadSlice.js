import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLeads,
  createLead,
  updateLeadStage,
  assignLeadAdvisor,
  convertToClient,
  resolveDuplicate,
  addLeadNote,
  declineLead,
  archiveLead,
  unarchiveLead,
} from '../thunks/leadThunk';
import { toggleClientStatus } from '../thunks/clientThunk';

const initialState = {
  leads: [],
  counts: { active: 0, archived: 0 },
  selectedLead: null,
  activeFilter: 'all', // 'all' | 'my' | 'duplicates' | 'high_value' | 'unassigned'
  selectedAdvisorFilter: 'all', // 'all' | advisorId | 'unassigned'
  searchQuery: '',
  loading: false,
  error: null,
  stageUpdateLoading: false,
  updatingStageLeadId: null,
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
      if (!incomingLead) return;
      const exists = state.leads.some((l) => String(l._id || l.id) === String(incomingLead._id || incomingLead.id));
      if (!exists) {
        state.leads.unshift(incomingLead);
      }
    },
    onLeadUpdatedWs(state, action) {
      const updatedLead = action.payload;
      if (!updatedLead) return;
      const leadId = String(updatedLead._id || updatedLead.id);
      const index = state.leads.findIndex((l) => String(l._id || l.id) === leadId);
      if (index !== -1) {
        state.leads[index] = { ...state.leads[index], ...updatedLead };
      } else {
        state.leads.unshift(updatedLead);
      }
      if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === leadId) {
        state.selectedLead = { ...state.selectedLead, ...updatedLead };
      }
    },
    onLeadNoteAddedWs(state, action) {
      const { leadId, note } = action.payload || {};
      if (!leadId || !note) return;
      const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
      if (lead) {
        if (!lead.notesList) lead.notesList = [];
        const exists = lead.notesList.some((n) => n._id && note._id && String(n._id) === String(note._id));
        if (!exists) lead.notesList.push(note);
      }
      if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
        if (!state.selectedLead.notesList) state.selectedLead.notesList = [];
        const exists = state.selectedLead.notesList.some((n) => n._id && note._id && String(n._id) === String(note._id));
        if (!exists) state.selectedLead.notesList.push(note);
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
        if (action.payload.data?.counts) {
          state.counts = action.payload.data.counts;
        }
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
        const { leadId, stage, previousStage } = action.meta.arg;
        state.updatingStageLeadId = String(leadId);
        state.error = null;
        const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
        if (lead) {
          lead.stage = stage;
          if (!lead.assignedAdvisorId && previousStage === 'New' && stage === 'Contacted') {
            lead.isClaiming = true;
          }
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
          state.selectedLead.stage = stage;
        }
      })
      .addCase(updateLeadStage.fulfilled, (state, action) => {
        state.updatingStageLeadId = null;
        const { leadId, data } = action.payload;
        const populatedLead = data?.data || data;
        const index = state.leads.findIndex((l) => String(l._id || l.id) === String(leadId));
        if (index !== -1 && populatedLead) {
          state.leads[index] = { ...state.leads[index], ...populatedLead, isClaiming: false };
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId) && populatedLead) {
          state.selectedLead = { ...state.selectedLead, ...populatedLead };
        }
      })
      .addCase(updateLeadStage.rejected, (state, action) => {
        state.updatingStageLeadId = null;
        // Rollback on failure
        const { leadId, previousStage } = action.payload || {};
        if (leadId) {
          const lead = state.leads.find((l) => String(l._id || l.id) === String(leadId));
          if (lead) {
            if (previousStage) {
              lead.stage = previousStage;
            }
            lead.isClaiming = false;
          }
          if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId)) {
            if (previousStage) {
              state.selectedLead.stage = previousStage;
            }
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

      // Toggle Client Status (Deactivate / Reactivate)
      .addCase(toggleClientStatus.fulfilled, (state, action) => {
        const { clientId, status, data } = action.payload;
        const returnedLead = data?.data?.lead || data?.lead;
        const userId = data?.data?.userId;

        const updateItem = (lead) => {
          if (returnedLead) {
            Object.assign(lead, returnedLead);
          } else {
            lead.isConverted = true;
            if (typeof lead.clientId === 'object' && lead.clientId !== null) {
              lead.clientId = { ...lead.clientId, status };
            } else {
              lead.clientStatus = status;
            }
          }
        };

        const lead = state.leads.find(
          (l) =>
            String(l._id || l.id) === String(clientId) ||
            (l.clientId && (String(l.clientId._id || l.clientId) === String(clientId) || (userId && String(l.clientId._id || l.clientId) === String(userId))))
        );
        if (lead) updateItem(lead);

        if (
          state.selectedLead &&
          (String(state.selectedLead._id || state.selectedLead.id) === String(clientId) ||
            (state.selectedLead.clientId &&
              (String(state.selectedLead.clientId._id || state.selectedLead.clientId) === String(clientId) ||
                (userId && String(state.selectedLead.clientId._id || state.selectedLead.clientId) === String(userId)))))
        ) {
          updateItem(state.selectedLead);
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
      })

      // Decline Lead
      .addCase(declineLead.fulfilled, (state, action) => {
        const updated = action.payload.data?.data || action.payload.data;
        const { leadId } = action.payload;
        const index = state.leads.findIndex((l) => String(l._id || l.id) === String(leadId));
        if (index !== -1 && updated) {
          state.leads[index] = { ...state.leads[index], ...updated };
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId) && updated) {
          state.selectedLead = { ...state.selectedLead, ...updated };
        }
      })

      // Archive Lead
      .addCase(archiveLead.fulfilled, (state, action) => {
        const updated = action.payload.data?.data || action.payload.data;
        const { leadId } = action.payload;
        const index = state.leads.findIndex((l) => String(l._id || l.id) === String(leadId));
        if (index !== -1 && updated) {
          state.leads[index] = { ...state.leads[index], ...updated };
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId) && updated) {
          state.selectedLead = { ...state.selectedLead, ...updated };
        }
      })

      // Unarchive Lead
      .addCase(unarchiveLead.fulfilled, (state, action) => {
        const updated = action.payload.data?.data || action.payload.data;
        const { leadId } = action.payload;
        const index = state.leads.findIndex((l) => String(l._id || l.id) === String(leadId));
        if (index !== -1 && updated) {
          state.leads[index] = { ...state.leads[index], ...updated };
        }
        if (state.selectedLead && String(state.selectedLead._id || state.selectedLead.id) === String(leadId) && updated) {
          state.selectedLead = { ...state.selectedLead, ...updated };
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
  onLeadNoteAddedWs,
} = leadSlice.actions;

export default leadSlice.reducer;

