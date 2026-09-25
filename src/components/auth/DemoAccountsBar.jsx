import React from 'react';
import { Box, Typography, Stack, Chip, Tooltip } from '@mui/material';
import { Shield, Building2, UserCheck, User, KeyRound } from 'lucide-react';

export const DEMO_ACCOUNTS = [
  {
    role: 'platform_admin',
    label: 'Platform Admin',
    email: 'admin@leadflow.de',
    password: 'Password@123',
    icon: Shield,
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    description: 'Manage SaaS tenants & system settings',
  },
  {
    role: 'brokerage_admin',
    label: 'Brokerage Admin',
    email: 'hans@hypobroker.de',
    password: 'Password@123',
    icon: Building2,
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    description: 'Manage team, webhooks & email automations',
  },
  {
    role: 'advisor',
    label: 'Mortgage Advisor',
    email: 'sarah@hypobroker.de',
    password: 'Password@123',
    icon: UserCheck,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    description: 'Manage live pipeline & document verification',
  },
  {
    role: 'client',
    label: 'Expat Borrower',
    email: 'rahul.patel@expatmail.de',
    password: 'Password@123',
    icon: User,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'Client document upload & status tracking',
  },
];

export const DemoAccountsBar = ({ onSelectDemoAccount, activeEmail = '' }) => {
  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 3,
        backgroundColor: '#f8fafc',
        border: '1px dashed #cbd5e1',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyRound size={16} style={{ color: '#2563eb' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Login (1-Click Fill)
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
          Password@123
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
        {DEMO_ACCOUNTS.map((acc) => {
          const IconComponent = acc.icon;
          const isSelected = activeEmail === acc.email;

          return (
            <Tooltip key={acc.role} title={`${acc.description} (${acc.email})`} arrow>
              <Chip
                icon={<IconComponent size={14} style={{ color: acc.color, marginLeft: 6 }} />}
                label={acc.label}
                onClick={() => onSelectDemoAccount(acc)}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  borderColor: isSelected ? acc.color : acc.border,
                  backgroundColor: isSelected ? acc.bg : '#ffffff',
                  color: isSelected ? acc.color : '#334155',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  py: 0.5,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: acc.bg,
                    borderColor: acc.color,
                  },
                }}
              />
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DemoAccountsBar;
