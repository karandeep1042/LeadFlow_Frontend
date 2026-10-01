import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Drawer, Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Chip, Avatar, IconButton, Divider, Tooltip,
  CircularProgress,
} from '@mui/material';
import { Building2, LogOut } from 'lucide-react';
import leadflowLogoWithoutLabel from '../../assets/leadflow-logo-without-label.png';
import { getRoleNavigation } from '../../utils/navigation/navigationConfig';
import { logoutUser } from '../../redux/thunks/authThunk';
import { startNavigationProgress } from '../common/TopProgressBar';
import { ROUTES } from '../../utils/constants/routes';

const SIDEBAR_WIDTH = 260;

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const sections = useMemo(() => getRoleNavigation(role), [role]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser());
    } finally {
      navigate(ROUTES.SIGNIN);
    }
  };

  const handleItemClick = () => {
    startNavigationProgress();
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  };

  const organizationName =
    user?.brokerage?.name ||
    user?.brokerageName ||
    (role === 'platform_admin' ? 'Global SaaS Platform' : 'HypoExpat Berlin GmbH');

  const renderContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          component="img"
          src={leadflowLogoWithoutLabel}
          alt="LeadFlow"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            objectFit: 'contain',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.12)',
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>LeadFlow</Typography>
          <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.72rem' }}>
            {organizationName}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, py: 1.5 }}>
        {sections.map((section, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ px: 1.5, mb: 0.5, display: 'block', fontWeight: 700, color: '#94a3b8', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
              {section.subheader}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={RouterLink}
                      to={item.path}
                      disableRipple
                      disableTouchRipple
                      onPointerDown={() => startNavigationProgress()}
                      onClick={handleItemClick}
                      sx={{
                        borderRadius: 2,
                        py: 0.85,
                        px: 1.5,
                        backgroundColor: isActive ? '#eff6ff' : 'transparent',
                        color: isActive ? '#2563eb' : '#475569',
                        transition: 'background-color 0.1s ease, color 0.1s ease',
                        '&:hover': {
                          backgroundColor: isActive ? '#eff6ff' : '#f8fafc',
                          color: isActive ? '#2563eb' : '#0f172a',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30, color: isActive ? '#2563eb' : '#64748b' }}>
                        <IconComponent size={18} />
                      </ListItemIcon>
                      <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }} />
                      {item.badge && (
                        <Chip label={item.badge} size="small" sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700, backgroundColor: isActive ? '#2563eb' : '#f1f5f9', color: isActive ? '#ffffff' : '#64748b' }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#18181b', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Administrator'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {organizationName}
            </Typography>
          </Box>
        </Box>
        <Tooltip title={isLoggingOut ? 'Signing out...' : 'Sign Out'}>
          <IconButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            size="small"
            sx={{ color: '#64748b', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }}
          >
            {isLoggingOut ? <CircularProgress size={16} color="inherit" /> : <LogOut size={16} />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH } }}
      >
        {renderContent()}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, width: SIDEBAR_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH } }}
        open
      >
        {renderContent()}
      </Drawer>
    </>
  );
};

export default Sidebar;
