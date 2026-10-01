import { io } from 'socket.io-client';
import {
  onLeadUpdatedWs,
  onLeadCreatedWs,
  onLeadNoteAddedWs,
} from '../../redux/slices/leadSlice';
import {
  onDocumentStatusUpdatedWs,
  onDocumentCreatedWs,
} from '../../redux/slices/documentSlice';
import {
  updatePortalDocument,
  updatePortalLead,
} from '../../redux/slices/clientSlice';
import { onNotificationReceivedWs } from '../../redux/slices/notificationSlice';

let socket = null;
let currentToken = null;
let currentUser = null;
const eventListeners = new Map();

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Initialize and connect Socket.IO client
 *
 * @param {string} token - JWT Access Token
 * @param {Function} dispatch - Redux dispatch function
 * @param {object} user - Authenticated user details
 */
export const connectSocket = (token, dispatch, user = null) => {
  if (!token) return null;
  currentUser = user;

  // If socket is already connected with the same token, reuse
  if (socket && socket.connected && currentToken === token) {
    return socket;
  }

  // Disconnect existing socket if token changed
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = token;

  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log(`[Socket.IO Client] Connected successfully (id: ${socket.id})`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket.IO Client] Disconnected: ${reason}`);
  });

  socket.on('connect_error', (error) => {
    console.warn(`[Socket.IO Client] Connection error:`, error.message);
  });

  // Real-time Lead Stage Updated Event
  socket.on('lead:stage_updated', (leadData) => {
    console.log('[Socket.IO Client] lead:stage_updated received:', leadData);
    if (dispatch && leadData) {
      dispatch(onLeadUpdatedWs(leadData));
      dispatch(updatePortalLead(leadData));
    }
    notifySubscribers('lead:stage_updated', leadData);
  });

  // Real-time Lead General Update Event
  socket.on('lead:updated', (leadData) => {
    console.log('[Socket.IO Client] lead:updated received:', leadData);
    if (dispatch && leadData) {
      dispatch(onLeadUpdatedWs(leadData));
      dispatch(updatePortalLead(leadData));
    }
    notifySubscribers('lead:updated', leadData);
  });

  // Real-time Lead Created Event
  socket.on('lead:created', (leadData) => {
    console.log('[Socket.IO Client] lead:created received:', leadData);
    if (dispatch && leadData) {
      dispatch(onLeadCreatedWs(leadData));
    }
    notifySubscribers('lead:created', leadData);
  });

  // Real-time Lead Note Added Event
  socket.on('lead:note_added', (payload) => {
    console.log('[Socket.IO Client] lead:note_added received:', payload);
    if (dispatch && payload) {
      dispatch(onLeadNoteAddedWs(payload));
    }
    notifySubscribers('lead:note_added', payload);
  });

  // Real-time Document Updated Event
  socket.on('document:updated', (docData) => {
    console.log('[Socket.IO Client] document:updated received:', docData);
    if (dispatch && docData) {
      dispatch(onDocumentStatusUpdatedWs(docData));
      dispatch(updatePortalDocument(docData));
    }
    notifySubscribers('document:updated', docData);
  });

  // Real-time Document Status Updated Event (Background Worker Completion)
  socket.on('document:status_updated', (docData) => {
    console.log('[Socket.IO Client] document:status_updated received:', docData);
    if (dispatch && docData) {
      dispatch(onDocumentStatusUpdatedWs(docData));
      dispatch(updatePortalDocument(docData));
    }
    notifySubscribers('document:status_updated', docData);
  });

  // Real-time Document Created / Uploaded Event
  socket.on('document:created', (docData) => {
    console.log('[Socket.IO Client] document:created received:', docData);
    if (dispatch && docData) {
      dispatch(onDocumentCreatedWs(docData));
      dispatch(updatePortalDocument(docData));
    }
    notifySubscribers('document:created', docData);
  });

  // Real-time Stage Task Synced Event
  socket.on('task:synced', (payload) => {
    console.log('[Socket.IO Client] task:synced received:', payload);
    notifySubscribers('task:synced', payload);
  });

  // Real-time Task Created Event
  socket.on('task:created', (taskData) => {
    console.log('[Socket.IO Client] task:created received:', taskData);
    notifySubscribers('task:created', taskData);
  });

  // Real-time Task Updated Event
  socket.on('task:updated', (taskData) => {
    console.log('[Socket.IO Client] task:updated received:', taskData);
    notifySubscribers('task:updated', taskData);
  });

  // Real-time Task Deleted Event
  socket.on('task:deleted', (payload) => {
    console.log('[Socket.IO Client] task:deleted received:', payload);
    notifySubscribers('task:deleted', payload);
  });

  // Real-time Multi-Role Notification Event
  socket.on('notification:new', (notificationData) => {
    console.log('[Socket.IO Client] notification:new received:', notificationData);
    if (!notificationData) return;

    // Defense-in-depth: client-side recipient verification
    if (currentUser) {
      const myId = currentUser._id || currentUser.id || currentUser.userId;
      const myRole = currentUser.role;

      // If targeted to a specific user and it doesn't match current user, ignore
      if (notificationData.recipientId && myId && String(notificationData.recipientId) !== String(myId)) {
        return;
      }

      // If client user, reject any staff/admin role notifications
      if (myRole === 'client' && notificationData.recipientRole && notificationData.recipientRole !== 'client') {
        return;
      }
    }

    if (dispatch && notificationData) {
      dispatch(onNotificationReceivedWs(notificationData));
    }
    notifySubscribers('notification:new', notificationData);
  });

  return socket;
};

/**
 * Disconnect socket and clean up
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
    currentUser = null;
    eventListeners.clear();
    console.log('[Socket.IO Client] Socket explicitly disconnected and cleared.');
  }
};

/**
 * Get active socket instance
 */
export const getSocket = () => socket;

/**
 * Subscribe a component callback to a specific socket event
 */
export const subscribeToSocketEvent = (event, callback) => {
  if (!eventListeners.has(event)) {
    eventListeners.set(event, new Set());
  }
  eventListeners.get(event).add(callback);

  return () => {
    const listeners = eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        eventListeners.delete(event);
      }
    }
  };
};

/**
 * Notify all subscriber callbacks for an event
 */
const notifySubscribers = (event, data) => {
  const listeners = eventListeners.get(event);
  if (listeners) {
    listeners.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[Socket Subscriber Error on ${event}]:`, err);
      }
    });
  }
};

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  subscribeToSocketEvent,
};
