import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Badge,
  Divider,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Bell,
  LogOut,
  Building2,
  Shield,
  UserCheck,
  User,
  Radio,
} from 'lucide-react';
import { logoutUser } from '../../redux/thunks/authThunk';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../../redux/thunks/notificationThunk';
import { useSocket } from '../../hooks/useSocket';
import { ROUTES } from '../../utils/constants/routes';
import NotificationCenter from './NotificationCenter';

export const Header = ({ onMobileNavToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { items: notifications, unreadCount, loading: notifLoading } = useSelector(
    (state) => state.notification || { items: [], unreadCount: 0, loading: false }
  );
  const { isConnected } = useSocket();

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isAuthenticated || user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleProfileOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleNotifOpen = (e) => setNotifAnchorEl(e.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = async () => {
    handleProfileClose();
    await dispatch(logoutUser());
    navigate(ROUTES.SIGNIN);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationAsRead(notif._id));
    }
    if (notif.data?.url) {
      handleNotifClose();
      navigate(notif.data.url);
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const handleDeleteNotification = (e, notifId) => {
    e.stopPropagation();
    dispatch(deleteNotification(notifId));
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'platform_admin':
        return { label: 'Platform Admin', color: '#7c3aed', bg: '#f5f3ff', icon: Shield };
      case 'brokerage_admin':
        return { label: 'Brokerage Admin', color: '#2563eb', bg: '#eff6ff', icon: Building2 };
      case 'advisor':
        return { label: 'Mortgage Advisor', color: '#059669', bg: '#ecfdf5', icon: UserCheck };
      default:
        return { label: 'Client', color: '#d97706', bg: '#fffbeb', icon: User };
    }
  };

  const roleMeta = getRoleBadge();
  const RoleIcon = roleMeta.icon;

  const organizationName =
    user?.brokerage?.name ||
    user?.brokerageName ||
    (role === 'platform_admin' ? 'Global SaaS Platform' : 'HypoExpat Berlin GmbH');

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
        zIndex: 1100,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      }}
    >
      <Toolbar sx={{ px: { xs: 1.5, sm: 3 }, minHeight: { xs: 58, sm: 64, md: 70 }, gap: { xs: 1, sm: 1.5, md: 2 } }}>
        <IconButton edge="start" onClick={onMobileNavToggle} sx={{ display: { md: 'none' }, color: '#64748b', p: 1 }}>
          <MenuIcon size={22} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0, flexShrink: 1 }}>
          <Tooltip title={organizationName} arrow>
            <Chip
              icon={<Building2 size={14} style={{ color: '#2563eb', flexShrink: 0 }} />}
              label={organizationName}
              size="small"
              sx={{
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                height: { xs: 29, sm: 32 },
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: role === 'client' ? { xs: 'none', sm: 'inline-flex' } : 'inline-flex',
                maxWidth: { xs: 165, sm: 260, md: 360 },
                cursor: 'default',
                '& .MuiChip-label': {
                  px: { xs: 0.75, sm: 1 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
                '& .MuiChip-icon': {
                  ml: { xs: '6px', sm: '8px' },
                  mr: { xs: '-2px', sm: '2px' },
                },
              }}
            />
          </Tooltip>
          <Chip
            icon={<Radio size={12} style={{ color: isConnected ? '#10b981' : '#f59e0b' }} />}
            label={isConnected ? 'Live' : 'Connecting...'}
            size="small"
            sx={{
              backgroundColor: isConnected ? '#ecfdf5' : '#fffbeb',
              color: isConnected ? '#059669' : '#b45309',
              fontWeight: 700,
              fontSize: '0.75rem',
              border: `1px solid ${isConnected ? '#a7f3d0' : '#fde68a'}`,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/* Notification Bell Button */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotifOpen}
              sx={{
                color: unreadCount > 0 ? '#2563eb' : '#64748b',
                backgroundColor: unreadCount > 0 ? '#eff6ff' : '#f8fafc',
                border: '1px solid',
                borderColor: unreadCount > 0 ? '#bfdbfe' : '#e2e8f0',
                borderRadius: '10px',
                p: 1,
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6875rem',
                    height: 18,
                    minWidth: 18,
                    fontWeight: 800,
                  },
                }}
              >
                <Bell size={18} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Responsive Notification Center: Native Mobile Bottom Sheet / Desktop Popover */}
          <NotificationCenter
            open={Boolean(notifAnchorEl)}
            anchorEl={notifAnchorEl}
            onClose={handleNotifClose}
            notifications={notifications}
            unreadCount={unreadCount}
            loading={notifLoading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNotificationClick={handleNotificationClick}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
            onDeleteNotification={handleDeleteNotification}
          />

          <Chip icon={<RoleIcon size={14} style={{ color: roleMeta.color }} />} label={roleMeta.label} sx={{ backgroundColor: roleMeta.bg, color: roleMeta.color, fontWeight: 700, fontSize: '0.8125rem', border: `1px solid ${roleMeta.color}30`, display: { xs: 'none', sm: 'inline-flex' } }} />

          <IconButton onClick={handleProfileOpen} sx={{ p: 0.5, border: '2px solid #e2e8f0', borderRadius: '50%' }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#18181b', color: '#ffffff', fontWeight: 700, fontSize: '0.875rem' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>

          <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ sx: { width: 240, p: 1, borderRadius: 3, border: '1px solid #e2e8f0', mt: 1.5 } }}>
            <Box sx={{ px: 1.5, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{user?.name || 'Administrator'}</Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', wordBreak: 'break-all' }}>{user?.email || 'admin@leadflow.de'}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75, pt: 0.75, borderTop: '1px dashed #e2e8f0' }}>
                <Building2 size={13} style={{ color: '#2563eb', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {organizationName}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 0.75 }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', borderRadius: 2 }}>
              <ListItemIcon sx={{ color: '#ef4444', minWidth: 32 }}><LogOut size={16} /></ListItemIcon>
              <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
