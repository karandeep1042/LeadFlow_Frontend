import React, { useState } from 'react';
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
  InputBase,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Bell,
  Search,
  LogOut,
  Building2,
  Shield,
  UserCheck,
  User,
  Radio,
} from 'lucide-react';
import { logoutUser } from '../../redux/thunks/authThunk';
import { ROUTES } from '../../utils/constants/routes';

export const Header = ({ onMobileNavToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleProfileOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleLogout = async () => {
    handleProfileClose();
    await dispatch(logoutUser());
    navigate(ROUTES.SIGNIN);
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

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#0f172a', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: { xs: 64, md: 70 }, gap: 2 }}>
        <IconButton edge="start" onClick={onMobileNavToggle} sx={{ display: { md: 'none' }, color: '#64748b' }}>
          <MenuIcon size={22} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            icon={<Building2 size={15} style={{ color: '#2563eb' }} />}
            label={user?.brokerage?.name || (role === 'platform_admin' ? 'Global SaaS Platform' : 'HypoExpat Berlin GmbH')}
            sx={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: 700, fontSize: '0.8125rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: { xs: 'none', sm: 'inline-flex' } }}
          />
          <Chip icon={<Radio size={12} style={{ color: '#10b981' }} />} label="Live" size="small" sx={{ backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.75rem', border: '1px solid #a7f3d0', display: { xs: 'none', md: 'inline-flex' } }} />
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 380, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', px: 1.5, py: 0.35 }}>
            <Search size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
            <InputBase placeholder="Search leads, advisors, documents..." sx={{ fontSize: '0.875rem', color: '#0f172a', width: '100%' }} />
          </Paper>
        </Box>

        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#64748b', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', p: 1 }}>
              <Badge badgeContent={2} color="error" variant="dot"><Bell size={18} /></Badge>
            </IconButton>
          </Tooltip>

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
