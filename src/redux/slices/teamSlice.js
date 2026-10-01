import { createSlice } from '@reduxjs/toolkit';
import { fetchAdvisors, inviteAdvisor, toggleAdvisorStatus, deleteAdvisor } from '../thunks/teamThunk';

const initialState = {
  advisors: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearTeamError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Advisors
      .addCase(fetchAdvisors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvisors.fulfilled, (state, action) => {
        state.loading = false;
        state.advisors = action.payload.data?.advisors || action.payload.data || action.payload || [];
      })
      .addCase(fetchAdvisors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Invite Advisor
      .addCase(inviteAdvisor.fulfilled, (state, action) => {
        const newAdvisor = action.payload.data || action.payload;
        if (newAdvisor) {
          state.advisors.unshift(newAdvisor);
        }
      })

      // Toggle Advisor Status
      .addCase(toggleAdvisorStatus.fulfilled, (state, action) => {
        const { advisorId, status } = action.payload;
        const advisor = state.advisors.find((a) => String(a._id || a.id) === String(advisorId));
        if (advisor) {
          advisor.status = status;
        }
      })

      // Delete Advisor
      .addCase(deleteAdvisor.fulfilled, (state, action) => {
        const { advisorId } = action.payload;
        state.advisors = state.advisors.filter(
          (a) => String(a._id || a.id) !== String(advisorId)
        );
      });
  },
});

export const { clearTeamError } = teamSlice.actions;
export default teamSlice.reducer;

