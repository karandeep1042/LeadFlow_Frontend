import React, { useState } from 'react';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import LeadCard from './LeadCard';
import { STAGE_META } from '../../../utils/automationConstants';

export const KanbanColumn = ({
  stageKey,
  stageLabel,
  leads = [],
  onLeadClick,
  onDropLead,
  onAdvanceStage,
  onRegressToDocs,
  nextStageLabel,
  canChangeStage = true,
  currentUserId = null,
  userRole = 'advisor',
  updatingStageLeadId = null,
  isMobile = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = STAGE_META[stageKey] || {
    code: 'Stage',
    label: stageLabel,
    color: '#2563eb',
    bgColor: '#eff6ff',
  };

  const columnVolume = leads.reduce((sum, l) => sum + (Number(l.loanAmount) || 0), 0);

  const handleDragOver = (e) => {
    if (!canChangeStage) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!canChangeStage) return;
    const leadId = e.dataTransfer.getData('leadId');
    const currentStage = e.dataTransfer.getData('currentStage');
    if (leadId && currentStage !== stageKey) {
      onDropLead(leadId, stageKey, currentStage);
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        width: isMobile ? '100%' : 320,
        minWidth: isMobile ? 'unset' : 300,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        backgroundColor: isDragOver ? '#f0f7ff' : '#f8fafc',
        border: '1.5px solid',
        borderColor: isDragOver ? '#3b82f6' : '#e2e8f0',
        transition: 'all 0.15s ease',
        maxHeight: isMobile ? 'none' : 'calc(100vh - 240px)',
      }}
    >
      {/* Column Header */}
      <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', borderTopLeftRadius: 36, borderTopRightRadius: 36 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: meta.color }} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: meta.color }}>
              {meta.code}
            </Typography>
          </Box>
          <Chip
            label={leads.length}
            size="small"
            sx={{ height: 20, fontSize: '0.75rem', fontWeight: 800, backgroundColor: meta.bgColor, color: meta.color }}
          />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
          {meta.label}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
          Vol: €{(columnVolume / 1000).toFixed(0)}k EUR
        </Typography>
      </Box>

      {/* Cards Scrollable Area */}
      <Box
        sx={{
          p: 1.5,
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 3 },
        }}
      >
        {leads.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', border: '1.5px dashed #cbd5e1', borderRadius: 2, mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              {canChangeStage ? 'Drag leads here' : 'No deals in this stage'}
            </Typography>
          </Box>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead._id || lead.id}
              lead={lead}
              onClick={onLeadClick}
              onAdvanceStage={onAdvanceStage}
              onRegressToDocs={onRegressToDocs}
              nextStageLabel={nextStageLabel}
              canChangeStage={canChangeStage}
              currentUserId={currentUserId}
              userRole={userRole}
              updatingStageLeadId={updatingStageLeadId}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default KanbanColumn;
