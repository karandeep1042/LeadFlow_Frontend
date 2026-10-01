import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../thunks/notificationThunk';

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotificationError(state) {
      state.error = null;
    },
    onNotificationReceivedWs(state, action) {
      const newNotif = action.payload;
      if (!newNotif || !newNotif._id) return;

      const existingIndex = state.items.findIndex(
        (item) => String(item._id) === String(newNotif._id)
      );

      if (existingIndex >= 0) {
        state.items[existingIndex] = { ...state.items[existingIndex], ...newNotif };
      } else {
        state.items.unshift(newNotif);
        if (!newNotif.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markNotificationAsRead
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notifId = action.payload?._id || action.payload;
        const target = state.items.find((item) => String(item._id) === String(notifId));
        if (target && !target.isRead) {
          target.isRead = true;
          target.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.isRead = true;
          item.readAt = new Date().toISOString();
        });
        state.unreadCount = 0;
      })

      // deleteNotification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notifId = action.payload;
        const target = state.items.find((item) => String(item._id) === String(notifId));
        if (target && !target.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter((item) => String(item._id) !== String(notifId));
      })

      // clearAllNotifications
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      });
  },
});

export const { clearNotificationError, onNotificationReceivedWs } = notificationSlice.actions;

export default notificationSlice.reducer;
