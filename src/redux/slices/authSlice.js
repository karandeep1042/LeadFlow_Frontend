import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  switchWorkspace,
  registerBrokerage,
  fetchCurrentUser,
  updateAdminProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
  setInitialPassword,
} from '../thunks/authThunk';
import { getAccessToken, clearAccessToken } from '../../services/api/tokenStorage';

const token = getAccessToken();

const initialState = {
  user: null,
  role: null, // 'platform_admin' | 'brokerage_admin' | 'advisor' | 'client'
  brokerageId: null,
  isAuthenticated: false,
  isCheckingAuth: Boolean(token),
  loading: false,
  error: null,
  resetCodeSent: false,
  pendingWorkspaces: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearPendingWorkspaces(state) {
      state.pendingWorkspaces = null;
    },
    resetForgotPasswordState(state) {
      state.resetCodeSent = false;
      state.error = null;
    },
    setDemoUser(state, action) {
      // Allows instant demo switching in prototype/v0/lovable mode
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.brokerageId = action.payload.brokerageId || 'demo_brokerage_01';
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      clearAccessToken();
      state.user = null;
      state.role = null;
      state.brokerageId = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
      state.loading = false;
      state.error = null;
      state.resetCodeSent = false;
      state.pendingWorkspaces = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.pendingWorkspaces = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        if (action.payload?.requiresWorkspaceSelection) {
          state.pendingWorkspaces = action.payload.workspaces || [];
          state.isAuthenticated = false;
        } else {
          state.user = action.payload.data?.user || action.payload.user;
          state.role = action.payload.data?.role || action.payload.role;
          state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
          state.isAuthenticated = true;
          state.pendingWorkspaces = null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
        state.pendingWorkspaces = null;
      })

      // Switch Workspace
      .addCase(switchWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.role = action.payload.data?.role || action.payload.role;
        state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
        state.isAuthenticated = true;
        state.pendingWorkspaces = null;
      })
      .addCase(switchWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
      })

      // Register Brokerage
      .addCase(registerBrokerage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBrokerage.fulfilled, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.role = 'brokerage_admin';
        state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
        state.isAuthenticated = true;
        state.pendingWorkspaces = null;
      })
      .addCase(registerBrokerage.rejected, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetCodeSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetCodeSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resetCodeSent = false;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetCodeSent = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isCheckingAuth = true;
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.role = action.payload.data?.role || action.payload.role;
        state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        clearAccessToken();
      })

      // Update Admin Profile
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          ...(action.payload.data || action.payload),
        };
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Set Initial Password (First-Time Mandatory Setup)
      .addCase(setInitialPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setInitialPassword.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.mustChangePassword = false;
        }
      })
      .addCase(setInitialPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.brokerageId = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.loading = false;
        state.error = null;
        clearAccessToken();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.brokerageId = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.loading = false;
        state.error = null;
        clearAccessToken();
      });
  },
});

export const { clearAuthError, clearPendingWorkspaces, resetForgotPasswordState, setDemoUser, logout } = authSlice.actions;
export default authSlice.reducer;

