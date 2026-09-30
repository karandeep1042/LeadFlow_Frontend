import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Award, Euro, FolderArchive, RotateCcw, Eye, XCircle, CheckCircle2, User, Calendar, AlertCircle } from 'lucide-react';

export const ClosedPortfolioTable = ({
  leads = [],
  onLeadClick,
  onUnarchiveLead,
  isAdmin = false,
  currentUserId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [statusFilter, setStatusFilter] = useState('all');

  const totalVolume = leads
    .filter((l) => !l.isDeclined)
    .reduce((sum, l) => sum + (Number(l.finalDisbursedAmount || l.loanAmount) || 0), 0);

  const completedCount = leads.filter((l) => !l.isDeclined).length;
  const declinedCount = leads.filter((l) => l.isDeclined).length;

  const displayedLeads = leads.filter((lead) => {
    if (statusFilter === 'disbursed') return !lead.isDeclined;
    if (statusFilter === 'declined') return lead.isDeclined;
    return true;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Portfolio Top Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5, width: '100%' }}>
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Euro size={22} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Closed Volume</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '1.1rem', lg: '1.5rem' } }}>€{totalVolume.toLocaleString('de-DE')}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={22} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Executed & Disbursed</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '1.1rem', lg: '1.5rem' } }}>{completedCount} Mortgage{completedCount === 1 ? '' : 's'}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <XCircle size={22} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Declined / Failed Cases</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', fontSize: { xs: '1.1rem', lg: '1.5rem' } }}>{declinedCount} Case{declinedCount === 1 ? '' : 's'}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Portfolio Table */}
      <Paper elevation={0} sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#ffffff' }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FolderArchive size={20} color="#2563eb" />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Closed Portfolio Ledger ({displayedLeads.length})
            </Typography>
          </Stack>

          <Tabs
            value={statusFilter}
            onChange={(e, v) => setStatusFilter(v)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              minHeight: 36,
              width: { xs: '100%', sm: 'auto' },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.72rem', sm: '0.8rem' },
                minHeight: 36,
                py: 0.5,
                px: { xs: 0.75, sm: 1.5 },
              },
            }}
          >
            <Tab value="all" label={isMobile ? `All (${leads.length})` : `All Closed (${leads.length})`} />
            <Tab value="disbursed" label={`Disbursed (${completedCount})`} />
            <Tab value="declined" label={`Declined (${declinedCount})`} />
          </Tabs>
        </Box>

        {displayedLeads.length === 0 ? (
          <Box sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
            <FolderArchive size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155' }}>
              No deals match the selected filter
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, maxWidth: 460, mx: 'auto' }}>
              Deals that have been finalized at notary closing or declined by underwriting will appear here.
            </Typography>
          </Box>
        ) : isMobile ? (
          /* Mobile Card Layout */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2 }}>
            {displayedLeads.map((lead) => {
              const leadId = lead._id || lead.id;
              const advisor = lead.assignedAdvisorId;
              const isMineCard = advisor && String(advisor._id || advisor) === String(currentUserId);
              const disbursed = Number(lead.finalDisbursedAmount || lead.loanAmount) || 0;
              const closingDate = lead.payoutCompletedAt || lead.archivedAt || lead.declinedAt || lead.updatedAt;

              return (
                <Paper
                  key={leadId}
                  elevation={0}
                  onClick={() => onLeadClick && onLeadClick(lead)}
                  sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e2e8f0', cursor: 'pointer', '&:active': { bgcolor: '#f8fafc' } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>{lead.firstName} {lead.lastName}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{lead.email}</Typography>
                    </Box>
                    {lead.isDeclined ? (
                      <Chip icon={<XCircle size={13} color="#dc2626" />} label="Declined" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }} />
                    ) : (
                      <Chip icon={<CheckCircle2 size={13} color="#059669" />} label="Disbursed" size="small" sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem' }}>LOAN AMOUNT</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>€{disbursed.toLocaleString('de-DE')}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem' }}>ADVISOR</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{advisor?.name || (isMineCard ? 'You' : 'Unassigned')}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem' }}>CITY</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{lead.city || '—'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem' }}>CLOSING DATE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{closingDate ? new Date(closingDate).toLocaleDateString('de-DE') : '—'}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 1.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
                    <Button size="small" variant="outlined" startIcon={<Eye size={13} />} onClick={(e) => { e.stopPropagation(); onLeadClick && onLeadClick(lead); }} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, color: '#334155', borderColor: '#cbd5e1', fontSize: '0.75rem' }}>
                      Dossier
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>Client / Borrower</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>City / Visa</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>Disbursed Loan</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>Assigned Advisor</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>Closing Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>Outcome Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedLeads.map((lead) => {
                  const leadId = lead._id || lead.id;
                  const advisor = lead.assignedAdvisorId;
                  const isMine = advisor && String(advisor._id || advisor) === String(currentUserId);
                  const disbursed = Number(lead.finalDisbursedAmount || lead.loanAmount) || 0;
                  const closingDate = lead.payoutCompletedAt || lead.archivedAt || lead.declinedAt || lead.updatedAt;

                  return (
                    <TableRow key={leadId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          {lead.firstName} {lead.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {lead.email}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                          {lead.city || 'Berlin'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {lead.visaType || 'EU Blue Card'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: lead.isDeclined ? '#94a3b8' : '#059669' }}>
                          €{disbursed.toLocaleString('de-DE')}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <User size={14} color="#64748b" />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                            {advisor?.name || (isMine ? 'You' : 'Unassigned')}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={14} color="#64748b" />
                          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                            {closingDate ? new Date(closingDate).toLocaleDateString('de-DE') : '—'}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        {lead.isDeclined ? (
                          <Chip
                            icon={<XCircle size={13} color="#dc2626" />}
                            label="Declined"
                            size="small"
                            sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.75rem' }}
                          />
                        ) : (
                          <Chip
                            icon={<CheckCircle2 size={13} color="#059669" />}
                            label="Disbursed & Archived"
                            size="small"
                            sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.75rem' }}
                          />
                        )}
                      </TableCell>

                      <TableCell align="right">
                          <Tooltip title="View Case Dossier" arrow>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Eye size={13} />}
                              onClick={() => onLeadClick && onLeadClick(lead)}
                              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, color: '#334155', borderColor: '#cbd5e1' }}
                            >
                              Dossier
                            </Button>
                          </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ClosedPortfolioTable;