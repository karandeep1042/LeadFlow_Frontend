import React from 'react';
import { Box, Paper, Typography, Avatar, Button, Stack, Chip } from '@mui/material';
import { Mail, Phone, Calendar, ShieldCheck, MessageSquare } from 'lucide-react';

const AssignedAdvisorCard = ({ advisor, brokerage }) => {
  const advisorName = advisor?.name || 'Sarah Jenkins';
  const advisorEmail = advisor?.email || 'sarah.jenkins@leadflow.de';
  const advisorPhone = advisor?.phone || '+49 30 8920 1102';
  const advisorTitle = advisor?.title || 'Senior Expat Mortgage Specialist';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 3 },
        borderRadius: { xs: 3, md: 3.5 },
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 1.2, fontSize: '0.75rem' }}>
            YOUR ASSIGNED ADVISOR
          </Typography>
          <Chip
            icon={<ShieldCheck size={13} color="#059669" />}
            label="Licensed §34i"
            size="small"
            sx={{
              bgcolor: '#ecfdf5',
              color: '#065f46',
              fontWeight: 700,
              fontSize: '0.7rem',
              border: '1px solid #a7f3d0',
              height: 24,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1.75} alignItems="center" sx={{ mb: 2.5 }}>
          <Avatar
            sx={{
              width: { xs: 48, sm: 52 },
              height: { xs: 48, sm: 52 },
              bgcolor: '#2563eb',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            }}
          >
            {advisorName.split(' ').map((n) => n[0]).join('')}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.25 }}>
              {advisorName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>
              {advisorTitle}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.5} sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', mb: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Mail size={16} color="#64748b" style={{ flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.84rem', wordBreak: 'break-all' }}>
              <a href={`mailto:${advisorEmail}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                {advisorEmail}
              </a>
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Phone size={16} color="#64748b" style={{ flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.84rem' }}>
              <a href={`tel:${advisorPhone}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                {advisorPhone}
              </a>
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={1.25}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Calendar size={17} />}
          onClick={() => window.open(`mailto:${advisorEmail}?subject=Book Consultation Call - LeadFlow Case`, '_blank')}
          sx={{
            bgcolor: '#0f172a',
            '&:hover': { bgcolor: '#1e293b' },
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            borderRadius: 2.5,
            height: { xs: 46, sm: 42 },
          }}
        >
          Book Consultation Call
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<MessageSquare size={17} />}
          onClick={() => window.open(`mailto:${advisorEmail}?subject=Mortgage Inquiry - LeadFlow Case`, '_blank')}
          sx={{
            borderColor: '#cbd5e1',
            color: '#334155',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: 2.5,
            height: { xs: 46, sm: 42 },
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
          }}
        >
          Send Direct Email
        </Button>
      </Stack>
    </Paper>
  );
};

export default AssignedAdvisorCard;
