import React from 'react';
import { Box, Typography, IconButton, Avatar, Chip, Tooltip } from '@mui/material';
import {
  Bell,
  Sparkles,
  CheckSquare,
  CheckCircle2,
  Radio,
  FolderCheck,
  AlertTriangle,
  Trash2,
  ArrowRight,
  Building2,
  XCircle,
  Shield,
} from 'lucide-react';

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const diffSec = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
};

const getNotificationMeta = (type) => {
  switch (type) {
    case 'lead_ingested':
      return { icon: Sparkles, color: '#2563eb', bg: '#eff6ff' };
    case 'task_assigned':
      return { icon: CheckSquare, color: '#7c3aed', bg: '#f5f3ff' };
    case 'task_completed':
      return { icon: CheckCircle2, color: '#059669', bg: '#ecfdf5' };
    case 'stage_updated':
      return { icon: Radio, color: '#0284c7', bg: '#f0f9ff' };
    case 'docs_complete':
      return { icon: FolderCheck, color: '#059669', bg: '#ecfdf5' };
    case 'doc_revision':
      return { icon: AlertTriangle, color: '#dc2626', bg: '#fee2e2' };
    case 'brokerage_registered':
      return { icon: Building2, color: '#7c3aed', bg: '#f5f3ff' };
    case 'lead_completed':
      return { icon: CheckCircle2, color: '#059669', bg: '#ecfdf5' };
    case 'lead_failed':
      return { icon: XCircle, color: '#e11d48', bg: '#fff1f2' };
    case 'platform_alert':
      return { icon: Shield, color: '#4f46e5', bg: '#eef2ff' };
    default:
      return { icon: Bell, color: '#64748b', bg: '#f1f5f9' };
  }
};

export const NotificationItem = ({ notif, onClick, onDelete }) => {
  const isUrgent =
    notif.type === 'doc_revision' ||
    notif.data?.urgent ||
    notif.data?.isRevision ||
    notif.title?.includes('Failed') ||
    notif.title?.includes('Revision');

  const meta = isUrgent
    ? { icon: AlertTriangle, color: '#dc2626', bg: '#fee2e2' }
    : getNotificationMeta(notif.type);
  const IconComp = meta.icon;

  return (
    <Box
      onClick={() => onClick(notif)}
      sx={{
        px: { xs: 2, sm: 2.25 },
        py: 1.75,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        borderBottom: '1px solid #f8fafc',
        backgroundColor: isUrgent
          ? notif.isRead ? '#fffcfc' : '#fef2f2'
          : notif.isRead ? '#ffffff' : '#f8fbff',
        borderLeft: isUrgent
          ? notif.isRead ? '4px solid #fca5a5' : '4px solid #ef4444'
          : notif.isRead ? '4px solid transparent' : '4px solid #3b82f6',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        '&:active': { backgroundColor: isUrgent ? '#fee2e2' : '#f1f5f9' },
        '&:hover': {
          backgroundColor: isUrgent
            ? notif.isRead ? '#fee2e2' : '#fecaca'
            : notif.isRead ? '#f8fafc' : '#eff6ff',
        },
      }}
    >
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: meta.bg,
          color: meta.color,
          borderRadius: '12px',
          flexShrink: 0,
          border: isUrgent ? '1px solid #fecaca' : '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <IconComp size={19} />
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', pr: 0.5, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.35 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, flexWrap: 'wrap' }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '0.84rem',
                fontWeight: notif.isRead ? 600 : 800,
                color: isUrgent ? '#991b1b' : '#0f172a',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              {notif.title}
            </Typography>
            {isUrgent && (
              <Chip
                label="Action Required"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6875rem', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {formatTimeAgo(notif.createdAt)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            color: notif.isRead ? '#64748b' : '#334155',
            lineHeight: 1.45,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            fontWeight: notif.isRead ? 400 : 500,
          }}
        >
          {notif.message}
        </Typography>

        {notif.data?.url && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: '#2563eb', fontSize: '0.72rem', fontWeight: 700 }}>
            <span>View details</span>
            <ArrowRight size={11} />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 0.75, flexShrink: 0, alignSelf: 'stretch' }}>
        {!notif.isRead ? (
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isUrgent ? '#ef4444' : '#2563eb', mt: 0.5 }} />
        ) : (
          <Box sx={{ width: 8, height: 8 }} />
        )}
        <Tooltip title="Delete notification" arrow placement="left">
          <IconButton
            size="small"
            onClick={(e) => onDelete(e, notif._id)}
            sx={{ p: 0.6, color: '#cbd5e1', borderRadius: '8px', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }}
          >
            <Trash2 size={14} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default NotificationItem;
