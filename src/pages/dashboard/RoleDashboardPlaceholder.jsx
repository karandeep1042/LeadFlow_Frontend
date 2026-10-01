import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Shield,
  Building2,
  UserCheck,
  User,
  LogOut,
  Sparkles,
  Layers,
} from 'lucide-react';
import { logoutUser } from '../../redux/thunks/authThunk';
import { ROUTES } from '../../utils/constants/routes';

export const RoleDashboardPlaceholder = ({ roleTitle, roleKey, description }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, brokerageId } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate(ROUTES.SIGNIN);
  };

  const getRoleBadge = () => {
    switch (roleKey) {
      case 'platform_admin':
        return { label: 'Platform Administrator', color: '#7c3aed', bg: '#f5f3ff', icon: Shield };
      case 'brokerage_admin':
        return { label: 'Brokerage Owner / Admin', color: '#2563eb', bg: '#eff6ff', icon: Building2 };
      case 'advisor':
        return { label: 'Mortgage Advisor', color: '#059669', bg: '#ecfdf5', icon: UserCheck };
      default:
        return { label: 'Expat Borrower', color: '#d97706', bg: '#fffbeb', icon: User };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          border: '1px solid #e2e8f0',
          borderRadius: 4,
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Sparkles size={18} style={{ color: '#2563eb' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workspace Session
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
          Welcome, {user?.name || 'User'}!
        </Typography>

        <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 720, mb: 3 }}>
          {description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
          <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              Email Address
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {user?.email || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              Role
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {badge.label}
            </Typography>
          </Box>

          <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              Tenant Scope
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {brokerageId ? String(brokerageId).slice(0, 16) + '...' : 'Global / Platform'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RoleDashboardPlaceholder;
