import React from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Stack, Chip, Button } from '@mui/material';
import { X } from 'lucide-react';

export default function TenantMetricsDrawer({ isOpen, onClose, tenant, metrics }) {
  if (!tenant) return null;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 460, md: 500 }, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' },
      }}
    >
      <Box sx={{ p: 3, backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>
            Brokerage Intelligence
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', mt: 0.5 }}>{tenant.name}</Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
            {tenant.city || 'Berlin'} • Admin: {tenant.adminContact?.name || 'Admin'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          <Box sx={{ p: 1.75, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', display: 'block' }}>CONVERSION</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#4f46e5', mt: 0.5 }}>{metrics?.conversionRate || '0.0'}%</Typography>
          </Box>
          <Box sx={{ p: 1.75, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', display: 'block' }}>WON CASES</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', mt: 0.5 }}>{metrics?.wonLeads || 0}</Typography>
          </Box>
          <Box sx={{ p: 1.75, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', fontSize: '0.65rem', display: 'block' }}>DOC ACCURACY</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#d97706', mt: 0.5 }}>{metrics?.documentHealth?.acceptanceRate || 100}%</Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1, textTransform: 'uppercase', fontSize: '0.725rem' }}>
            German Mortgage Funnel
          </Typography>
          <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>01. Ingestion / New</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{metrics?.stageBreakdown?.new || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>02. Initial Consultation</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{metrics?.stageBreakdown?.contacted || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>03. Document Underwriting</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{metrics?.stageBreakdown?.documentCollection || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>04. Bank Submission</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{metrics?.stageBreakdown?.bankSubmission || 0}</Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>05. Won & Funded</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>{metrics?.stageBreakdown?.won || 0}</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1, textTransform: 'uppercase', fontSize: '0.725rem' }}>
            Registered Advisors ({metrics?.advisors?.length || 0})
          </Typography>
          <Stack spacing={1}>
            {!metrics?.advisors || metrics.advisors.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>No advisors registered in this workspace yet.</Typography>
              </Box>
            ) : (
              metrics.advisors.map((adv) => (
                <Box key={adv.id || adv._id} sx={{ p: 1.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{adv.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{adv.email}</Typography>
                  </Box>
                  <Chip label={`${adv.activeLeadsCount || 0} active leads`} size="small" sx={{ height: 22, fontSize: '0.675rem', fontWeight: 700, backgroundColor: '#eef2ff', color: '#4f46e5' }} />
                </Box>
              ))
            )}
          </Stack>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, color: '#475569', borderColor: '#cbd5e1' }}>
          Close Panel
        </Button>
      </Box>
    </Drawer>
  );
}
