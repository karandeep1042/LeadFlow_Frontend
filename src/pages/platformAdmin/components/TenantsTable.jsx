import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, IconButton, Tooltip, Stack,
} from '@mui/material';
import { Building2, MapPin, Ban, CheckCircle2, Eye, Edit2 } from 'lucide-react';

export default function TenantsTable({ tenants, onOpenDrawer, onOpenEdit, onOpenBan, onOpenReactivate }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>ORGANIZATION & CITY</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>PRIMARY ADMIN</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>TEAM / PIPELINE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>MORTGAGE VOLUME</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.75rem', py: 1.75 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center' }}>
                    <Building2 size={36} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>No brokerage workspaces found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((t) => {
                  const isSuspended = t.status === 'suspended';
                  return (
                    <TableRow key={t._id || t.id} hover sx={{ backgroundColor: isSuspended ? '#fef2f222' : 'inherit' }}>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{t.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <MapPin size={12} color="#64748b" />
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{t.city || 'Berlin'} • @{t.subdomain}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>{t.adminContact?.name || 'Admin'}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>{t.adminContact?.email || '—'}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={`${t.stats?.advisorsCount || 0} Adv`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#334155' }} />
                          <Chip label={`${t.stats?.totalLeads || 0} Leads`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#eef2ff', color: '#4f46e5' }} />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>€{((t.stats?.wonVolumeEur || 0) / 1000).toLocaleString()}k</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Closed mortgages</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Chip
                          icon={isSuspended ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                          label={isSuspended ? 'Suspended' : 'Active'}
                          size="small"
                          sx={{
                            height: 24, fontSize: '0.725rem', fontWeight: 800,
                            backgroundColor: isSuspended ? '#fef2f2' : '#ecfdf5',
                            color: isSuspended ? '#dc2626' : '#059669',
                            border: '1px solid', borderColor: isSuspended ? '#fecaca' : '#a7f3d0',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                          <Tooltip title="View Metrics"><IconButton size="small" onClick={() => onOpenDrawer(t)} sx={{ color: '#475569', '&:hover': { color: '#4f46e5', backgroundColor: '#eef2ff' } }}><Eye size={16} /></IconButton></Tooltip>
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => onOpenEdit(t)} sx={{ color: '#475569', '&:hover': { color: '#d97706', backgroundColor: '#fffbeb' } }}><Edit2 size={16} /></IconButton></Tooltip>
                          {isSuspended ? (
                            <Button size="small" variant="outlined" onClick={() => onOpenReactivate(t)} sx={{ height: 28, fontSize: '0.725rem', fontWeight: 800, textTransform: 'none', borderRadius: 1.5, color: '#059669', borderColor: '#a7f3d0', backgroundColor: '#ecfdf5', '&:hover': { backgroundColor: '#d1fae5' } }}>Reactivate</Button>
                          ) : (
                            <Button size="small" variant="outlined" onClick={() => onOpenBan(t)} sx={{ height: 28, fontSize: '0.725rem', fontWeight: 800, textTransform: 'none', borderRadius: 1.5, color: '#dc2626', borderColor: '#fecaca', backgroundColor: '#fef2f2', '&:hover': { backgroundColor: '#fee2e2' } }}>Suspend</Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column' }}>
        {tenants.map((t, idx) => {
          const isSuspended = t.status === 'suspended';
          return (
            <Box key={t._id || t.id || idx} sx={{ p: 2, borderBottom: idx < tenants.length - 1 ? '1px solid #f1f5f9' : 'none', backgroundColor: isSuspended ? '#fef2f222' : 'inherit' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{t.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{t.city} • @{t.subdomain}</Typography>
                </Box>
                <Chip label={isSuspended ? 'Suspended' : 'Active'} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 800, backgroundColor: isSuspended ? '#fef2f2' : '#ecfdf5', color: isSuspended ? '#dc2626' : '#059669' }} />
              </Box>
              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
                <Button size="small" variant="outlined" onClick={() => onOpenDrawer(t)} sx={{ fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, color: '#475569', borderColor: '#cbd5e1' }}>Metrics</Button>
                <Button size="small" variant="outlined" onClick={() => onOpenEdit(t)} sx={{ fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, color: '#475569', borderColor: '#cbd5e1' }}>Edit</Button>
                {isSuspended ? (
                  <Button size="small" variant="contained" onClick={() => onOpenReactivate(t)} sx={{ fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, backgroundColor: '#059669', boxShadow: 'none' }}>Reactivate</Button>
                ) : (
                  <Button size="small" variant="contained" onClick={() => onOpenBan(t)} sx={{ fontSize: '0.75rem', textTransform: 'none', borderRadius: 1.5, backgroundColor: '#dc2626', boxShadow: 'none' }}>Suspend</Button>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
