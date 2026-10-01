import React from 'react';
import {
  Box, Typography, Button, Chip, Table, TableHead, TableBody,
  TableRow, TableCell, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab,
} from '@mui/material';
import { Layers, RotateCcw, Trash2, CheckCircle, RefreshCw } from 'lucide-react';

export default function EmailQueueModal({
  open, onClose, queueCounts, queueItems, filterStatus,
  onFilterChange, onFlush, onRetryJob, onRetryAll, onDeleteJob, loading,
}) {
  const failedCount = queueCounts?.failed || 0;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Layers size={20} color="#0284c7" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Email Queue & DLQ</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {failedCount > 0 && (
            <Button variant="contained" color="error" size="small" disabled={loading} onClick={onRetryAll}>
              Retry All ({failedCount})
            </Button>
          )}
          <Button variant="outlined" size="small" disabled={loading} onClick={onFlush}>
            Flush Queue
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={filterStatus} onChange={onFilterChange} sx={{ mb: 2 }}>
          <Tab label={`All (${queueCounts?.total || 0})`} value="all" />
          <Tab label={`Failed DLQ (${queueCounts?.failed || 0})`} value="failed" sx={{ color: queueCounts?.failed > 0 ? '#b91c1c !important' : 'inherit' }} />
          <Tab label={`Pending (${queueCounts?.pending || 0})`} value="pending" />
          <Tab label={`Processing (${queueCounts?.processing || 0})`} value="processing" />
          <Tab label={`Sent (${queueCounts?.sent || 0})`} value="sent" />
        </Tabs>
        {(!queueItems || queueItems.length === 0) ? (
          <Box sx={{ py: 4, textAlign: 'center', color: '#94a3b8' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px', color: '#10b981' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>No queue items found.</Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Attempts</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Schedule / Sent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Error</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queueItems.map((item) => (
                  <TableRow key={item._id} hover>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.to}</TableCell>
                    <TableCell sx={{ maxWidth: 180 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subject}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.status?.toUpperCase()} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', backgroundColor: item.status === 'failed' ? '#fef2f2' : (item.status === 'pending' ? '#fffbeb' : '#ecfdf5'), color: item.status === 'failed' ? '#b91c1c' : (item.status === 'pending' ? '#b45309' : '#059669') }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{item.attempts || 1}/{item.maxAttempts || 5}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#64748b' }}>{item.status === 'sent' && item.sentAt ? new Date(item.sentAt).toLocaleTimeString() : (item.nextAttemptAt ? new Date(item.nextAttemptAt).toLocaleTimeString() : 'Immediate')}</TableCell>
                    <TableCell sx={{ maxWidth: 140 }}>
                      <Typography variant="caption" sx={{ color: item.lastError ? '#ef4444' : '#10b981', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.lastError || 'None'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        {(item.status === 'failed' || item.status === 'pending') && (
                          <IconButton size="small" onClick={() => onRetryJob(item._id)} sx={{ color: '#2563eb' }}><RotateCcw size={15} /></IconButton>
                        )}
                        <IconButton size="small" onClick={() => onDeleteJob(item._id)} sx={{ color: '#94a3b8' }}><Trash2 size={15} /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}