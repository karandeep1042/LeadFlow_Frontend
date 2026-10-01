import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Popover,
  Tooltip,
} from '@mui/material';
import { CheckCheck, X, Inbox, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';

export const NotificationCenter = ({
  open,
  anchorEl,
  onClose,
  notifications = [],
  unreadCount = 0,
  loading = false,
  markingAllRead = false,
  clearingAll = false,
  deletingNotifId = null,
  activeTab = 0,
  setActiveTab,
  onNotificationClick,
  onMarkAllRead,
  onClearAll,
  onDeleteNotification,
}) => {
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 1) return !item.isRead;
    return true;
  });

  const paperStyles = {
    width: { xs: 'calc(100vw - 24px)', sm: 380 },
    minWidth: { xs: 'calc(100vw - 24px)', sm: 380 },
    maxWidth: { xs: 'calc(100vw - 24px)', sm: 380 },
    height: 520,
    maxHeight: 'calc(100vh - 90px)',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.16), 0 8px 16px -4px rgba(15, 23, 42, 0.08)',
    mt: 1.5,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: paperStyles } }}
      PaperProps={{ sx: paperStyles }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >

      {/* Header Bar */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          gap: 1.5,
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: { xs: '0.95rem', sm: '1.025rem' },
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Notifications
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={onMarkAllRead}
              disabled={markingAllRead}
              startIcon={markingAllRead ? <CircularProgress size={12} color="inherit" /> : <CheckCheck size={13} />}
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'none',
                px: 1,
                py: 0.35,
                borderRadius: '8px',
                backgroundColor: '#f0f7ff',
                minWidth: 0,
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: '#dbeafe' },
              }}
            >
              {markingAllRead ? 'Marking...' : 'Mark all read'}
            </Button>
          )}

          {notifications.length > 0 && (
            <Tooltip title="Clear all notifications" arrow placement="left">
              <Button
                size="small"
                onClick={onClearAll}
                disabled={clearingAll}
                startIcon={clearingAll ? <CircularProgress size={12} color="inherit" /> : <Trash2 size={12} />}
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'none',
                  minWidth: 0,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                  },
                }}
              >
                {clearingAll ? 'Clearing...' : 'Clear all'}
              </Button>
            </Tooltip>
          )}

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: '#94a3b8',
              p: 0.5,
              borderRadius: '8px',
              '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' },
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Segmented Filter Control */}
      <Box sx={{ px: 2, pt: 1.25, pb: 0.75 }}>
        <Box sx={{ display: 'flex', backgroundColor: '#f1f5f9', p: '3px', borderRadius: '10px', gap: '4px' }}>
          <Button
            fullWidth
            onClick={() => setActiveTab(0)}
            sx={{
              py: 0.55,
              fontSize: '0.78rem',
              fontWeight: activeTab === 0 ? 800 : 600,
              textTransform: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === 0 ? '#ffffff' : 'transparent',
              color: activeTab === 0 ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 0 ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease',
              '&:hover': { backgroundColor: activeTab === 0 ? '#ffffff' : 'rgba(255,255,255,0.4)' },
            }}
          >
            All ({notifications.length})
          </Button>

          <Button
            fullWidth
            onClick={() => setActiveTab(1)}
            sx={{
              py: 0.55,
              fontSize: '0.78rem',
              fontWeight: activeTab === 1 ? 800 : 600,
              textTransform: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === 1 ? '#ffffff' : 'transparent',
              color: activeTab === 1 ? (unreadCount > 0 ? '#2563eb' : '#0f172a') : '#64748b',
              boxShadow: activeTab === 1 ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
              transition: 'all 0.15s ease',
              '&:hover': { backgroundColor: activeTab === 1 ? '#ffffff' : 'rgba(255,255,255,0.4)' },
            }}
          >
            Unread ({unreadCount})
          </Button>
        </Box>
      </Box>

      {/* Notifications Scroll List */}
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          pb: 1,
        }}
      >
        {loading ? (
          <Box sx={{ p: 5, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={26} sx={{ color: '#2563eb' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box
            sx={{
              py: { xs: 6, sm: 7 },
              px: 3,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                mb: 1.5,
              }}
            >
              <Inbox size={26} style={{ strokeWidth: 1.6 }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5, fontSize: '0.9375rem' }}>
              {activeTab === 1 ? 'All caught up!' : 'No notifications yet'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8125rem', maxWidth: 260, lineHeight: 1.4 }}>
              {activeTab === 1
                ? 'You have read all of your recent alerts and updates.'
                : 'Updates on leads, tasks, stages, and document reviews will appear here.'}
            </Typography>
          </Box>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif._id}
              notif={notif}
              isDeleting={deletingNotifId === notif._id}
              onClick={onNotificationClick}
              onDelete={onDeleteNotification}
            />
          ))
        )}
      </Box>
    </Box>
  </Popover>
);
};

export default NotificationCenter;

