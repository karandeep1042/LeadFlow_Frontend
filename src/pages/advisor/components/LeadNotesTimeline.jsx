import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Paper, Avatar, Chip } from '@mui/material';
import {
  FileClock, Sparkles, Award, XCircle, Clock, ChevronDown, ChevronUp,
  FileCheck, FileX, TrendingUp, UserCheck, UserX,
} from 'lucide-react';

const getLogEventMeta = (text = '', author = '') => {
  const lower = text.toLowerCase();
  const isSystem = !author || author.toLowerCase().includes('system') || author.toLowerCase().includes('automation');

  if (lower.includes('[document verified]') || lower.includes('approved "') || lower.includes('verified for bank')) {
    return { category: 'DOC VERIFIED', color: '#059669', bgColor: '#ecfdf5', borderColor: '#a7f3d0', dotColor: '#10b981', icon: FileCheck };
  }
  if (lower.includes('[document revision requested]') || lower.includes('rejected "') || lower.includes('revision requested')) {
    return { category: 'REVISION NEEDED', color: '#dc2626', bgColor: '#fef2f2', borderColor: '#fecaca', dotColor: '#ef4444', icon: FileX };
  }
  if (lower.includes('claimed by') || lower.includes('pipeline stage updated') || lower.includes('advanced from') || lower.includes('moving case')) {
    return { category: 'STAGE TRANSITION', color: '#2563eb', bgColor: '#eff6ff', borderColor: '#bfdbfe', dotColor: '#3b82f6', icon: TrendingUp };
  }
  if (lower.includes('client portal') || lower.includes('portal account') || lower.includes('login credentials')) {
    if (lower.includes('deactivated') || lower.includes('suspended')) {
      return { category: 'PORTAL DEACTIVATED', color: '#d97706', bgColor: '#fffbeb', borderColor: '#fde68a', dotColor: '#f59e0b', icon: UserX };
    }
    return { category: 'PORTAL ACTIVATED', color: '#7c3aed', bgColor: '#f5f3ff', borderColor: '#ddd6fe', dotColor: '#8b5cf6', icon: UserCheck };
  }
  if (lower.includes('declined') || lower.includes('permanently declined')) {
    return { category: 'CASE DECLINED', color: '#991b1b', bgColor: '#fff1f2', borderColor: '#fecdd3', dotColor: '#e11d48', icon: XCircle };
  }
  if (lower.includes('archived') || lower.includes('finalized') || lower.includes('payout')) {
    return { category: 'DEAL ARCHIVED', color: '#047857', bgColor: '#ecfdf5', borderColor: '#a7f3d0', dotColor: '#059669', icon: Award };
  }
  if (lower.includes('assigned to advisor') || lower.includes('reassigned')) {
    return { category: 'ADVISOR ASSIGNED', color: '#0284c7', bgColor: '#f0f9ff', borderColor: '#bae6fd', dotColor: '#0ea5e9', icon: UserCheck };
  }
  return { category: isSystem ? 'SYSTEM EVENT' : 'ACTIVITY LOG', color: '#475569', bgColor: '#f8fafc', borderColor: '#e2e8f0', dotColor: '#64748b', icon: Sparkles };
};

export const LeadNotesTimeline = ({ notesList = [] }) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const reversedNotes = useMemo(() => [...notesList].reverse(), [notesList]);
  const totalNotes = reversedNotes.length;
  const displayedNotes = reversedNotes.slice(0, visibleCount);

  const hasMore = visibleCount < totalNotes;
  const canShowLess = visibleCount > 10;
  const remainingCount = Math.min(10, totalNotes - visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleCount(10);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileClock size={18} color="#2563eb" />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
            Activity & Audit Trail
          </Typography>
          <Chip
            label={`${totalNotes} Events`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.68rem',
              fontWeight: 800,
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
            }}
          />
        </Box>
        {totalNotes > 10 && (
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.72rem' }}>
            Showing {displayedNotes.length} of {totalNotes}
          </Typography>
        )}
      </Box>

      {/* Audit Trail Timeline */}
      {totalNotes === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2.5,
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            textAlign: 'center',
          }}
        >
          <FileClock size={28} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            No activity logs recorded yet
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Pipeline transitions, document reviews, and portal updates will appear here in chronological order.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ position: 'relative', pl: 2.5 }}>
          {/* Continuous vertical timeline connector line */}
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              bottom: 14,
              left: 11,
              width: '2px',
              backgroundColor: '#e2e8f0',
              zIndex: 1,
            }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            {displayedNotes.map((n, idx) => {
              const meta = getLogEventMeta(n.text, n.author);
              const IconComponent = meta.icon;
              const formattedDate = n.createdAt
                ? new Date(n.createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now';

              return (
                <Box key={n._id || idx} sx={{ position: 'relative', zIndex: 2 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -20,
                      top: 10,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: meta.bgColor,
                      border: `2px solid ${meta.dotColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 3px #ffffff',
                    }}
                  >
                    <IconComponent size={10} color={meta.color} />
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#cbd5e1',
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 0.75,
                        mb: 0.75,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                        <Chip
                          label={meta.category}
                          size="small"
                          sx={{
                            height: 19,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                            backgroundColor: meta.bgColor,
                            color: meta.color,
                            border: `1px solid ${meta.borderColor}`,
                          }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar
                            sx={{
                              width: 16,
                              height: 16,
                              fontSize: '0.55rem',
                              bgcolor: meta.dotColor,
                              fontWeight: 800,
                            }}
                          >
                            {n.author ? n.author.charAt(0).toUpperCase() : 'S'}
                          </Avatar>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.72rem' }}>
                            {n.author || 'System Automation'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8', fontSize: '0.7rem' }}>
                        <Clock size={11} />
                        <span>{formattedDate}</span>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1e293b',
                        fontSize: '0.8125rem',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {n.text}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Pagination Controls (Show More & Show Less) */}
      {totalNotes > 10 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 2, pt: 1 }}>
          {hasMore && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleShowMore}
              startIcon={<ChevronDown size={14} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: 2,
                color: '#2563eb',
                borderColor: '#bfdbfe',
                backgroundColor: '#eff6ff',
                '&:hover': {
                  backgroundColor: '#dbeafe',
                  borderColor: '#93c5fd',
                },
              }}
            >
              Show More (+{remainingCount})
            </Button>
          )}

          {canShowLess && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleShowLess}
              startIcon={<ChevronUp size={14} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: 2,
                color: '#64748b',
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  borderColor: '#94a3b8',
                },
              }}
            >
              Show Less (Top 10)
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LeadNotesTimeline;
