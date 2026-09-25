import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  registerBrokerage,
  fetchCurrentUser,
  updateAdminProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../thunks/authThunk';
import { clearAccessToken } from '../../services/api/tokenStorage';

const initialState = {
  user: null,
  role: null, // 'platform_admin' | 'brokerage_admin' | 'advisor' | 'client'
  brokerageId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  resetCodeSent: false,
  resetCodePreview: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    resetForgotPasswordState(state) {
      state.resetCodeSent = false;
      state.resetCodePreview = null;
      state.error = null;
    },
    setDemoUser(state, action) {
      // Allows instant demo switching in prototype/v0/lovable mode
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.brokerageId = action.payload.brokerageId || 'demo_brokerage_01';
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      clearAccessToken();
      state.user = null;
      state.role = null;
      state.brokerageId = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.resetCodeSent = false;
      state.resetCodePreview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.role = action.payload.data?.role || action.payload.role;
        state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Brokerage
      .addCase(registerBrokerage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBrokerage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.role = 'brokerage_admin';
        state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
        state.isAuthenticated = true;
      })
      .addCase(registerBrokerage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetCodeSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetCodeSent = true;
        state.resetCodePreview = action.payload.resetCode || null;
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
        state.resetCodePreview = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || action.payload.user;
        state.role = action.payload.data?.role || action.payload.role;
        state.brokerageId = action.payload.data?.brokerageId || action.payload.brokerageId || null;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
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

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.brokerageId = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.brokerageId = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError, resetForgotPasswordState, setDemoUser, logout } = authSlice.actions;
export default authSlice.reducer;

