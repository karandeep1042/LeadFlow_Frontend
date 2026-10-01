import React from 'react';
import { Box, Typography } from '@mui/material';
import { Settings } from 'lucide-react';
import AdminProfileCard from './components/AdminProfileCard';
import AdminPasswordCard from './components/AdminPasswordCard';
import SmtpDiagnosticsCard from './components/SmtpDiagnosticsCard';

export default function GlobalSettingsPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 6}}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4f46e5', mb: 0.5 }}>
          <Settings size={16} />
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Global Platform
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Administrator & Security
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Manage superadmin profile, master security, and live infrastructure diagnostics (Redis and SMTP).
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <AdminProfileCard />
        <AdminPasswordCard />
      </Box>

      <SmtpDiagnosticsCard />
    </Box>
  );
}

