import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import {
  User,
  Building2,
  Shield,
  UserCheck,
  BadgeCheck,
} from 'lucide-react';
import NotificationAlert from '../../components/common/NotificationAlert';
import PersonalInfoCard from './components/PersonalInfoCard';
import PasswordSecurityCard from './components/PasswordSecurityCard';
import { clearAuthError } from '../../redux/slices/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const getRoleMeta = () => {
    switch (role) {
      case 'platform_admin':
        return { label: 'Platform Admin', color: '#4f46e5', bg: '#eef2ff', icon: Shield };
      case 'brokerage_admin':
        return { label: 'Mortgage Brokerage Admin', color: '#2563eb', bg: '#eff6ff', icon: Building2 };
      case 'advisor':
        return { label: 'Mortgage Advisor', color: '#059669', bg: '#ecfdf5', icon: UserCheck };
      case 'client':
        return { label: 'Client / Borrower', color: '#7c3aed', bg: '#f5f3ff', icon: User };
      default:
        return { label: 'User', color: '#64748b', bg: '#f1f5f9', icon: User };
    }
  };

  const roleMeta = getRoleMeta();
  const RoleIcon = roleMeta.icon;

  const organizationName =
    user?.brokerage?.name ||
    user?.brokerageName ||
    (role === 'platform_admin' ? 'Global SaaS Platform' : 'HypoExpat Berlin GmbH');

  return (
    <Box>
      <NotificationAlert
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => {
          setToast((p) => ({ ...p, open: false }));
          dispatch(clearAuthError());
        }}
      />

      <Box sx={{ mx: 'auto' }}>
        {/* Top Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            mb: 3.5,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: { xs: 56, sm: 68 },
                height: { xs: 56, sm: 68 },
                bgcolor: '#0f172a',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: { xs: '1.25rem', sm: '1.6rem' },
                boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.15)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {user?.name || 'User Profile'}
                </Typography>
                <Chip
                  icon={<RoleIcon size={14} style={{ color: roleMeta.color }} />}
                  label={roleMeta.label}
                  size="small"
                  sx={{
                    backgroundColor: roleMeta.bg,
                    color: roleMeta.color,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: `1px solid ${roleMeta.color}30`,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {user?.email || 'No email registered'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<Building2 size={14} style={{ color: '#2563eb' }} />}
              label={organizationName}
              sx={{
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid #bfdbfe',
              }}
            />
            <Chip
              icon={<BadgeCheck size={14} style={{ color: '#16a34a' }} />}
              label="Account Active"
              sx={{
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid #bbf7d0',
              }}
            />
          </Box>
        </Paper>

        {/* 2-Column Main Settings Grid */}
        <Grid container spacing={3.5}>
          <Grid item size={{ xs: 12, lg: 6 }} >
            <PersonalInfoCard
              user={user}
              roleMeta={roleMeta}
              organizationName={organizationName}
              onShowToast={showToast}
            />
          </Grid>
          <Grid item size={{ xs: 12, lg: 6 }}>
            <PasswordSecurityCard onShowToast={showToast} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
