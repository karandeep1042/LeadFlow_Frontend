import React, { useState } from 'react';
import { Box, Tabs, Tab, useTheme, useMediaQuery, Typography, Chip } from '@mui/material';
import KanbanColumn from './KanbanColumn';

export const PipelineKanbanBoard = ({
  columns = [],
  filteredLeads = [],
  onLeadClick,
  onDropLead,
  onAdvanceStage,
  onRegressToDocs,
  canChangeStage = true,
  currentUserId = null,
  userRole = 'advisor',
  updatingStageLeadId = null,
}) => {
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [activeColumnIdx, setActiveColumnIdx] = useState(0);

  // Mobile view: Tab-based column switcher (one column at a time)
  if (isMobileOrTablet) {
    const activeCol = columns[activeColumnIdx] || columns[0];
    const activeColumnLeads = filteredLeads.filter((l) => l.stage === activeCol?.key);

    return (
      <Box sx={{ pb: 2 }}>
        {/* Column Tabs - horizontally scrollable */}
        <Box
          sx={{
            mb: 2,
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Tabs
            value={activeColumnIdx}
            onChange={(_, v) => setActiveColumnIdx(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                minHeight: 40,
                py: 0.75,
                px: 1.5,
                minWidth: 'auto',
              },
              '& .MuiTabs-scrollButtons': {
                width: 28,
                '&.Mui-disabled': { opacity: 0.3 },
              },
            }}
          >
            {columns.map((col, idx) => {
              const count = filteredLeads.filter((l) => l.stage === col.key).length;
              return (
                <Tab
                  key={col.key}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {col.label.replace(/^Stage \d+: /, '')}
                      </Typography>
                      <Chip
                        label={count}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          minWidth: 22,
                          backgroundColor: idx === activeColumnIdx ? '#2563eb' : '#f1f5f9',
                          color: idx === activeColumnIdx ? '#ffffff' : '#64748b',
                        }}
                      />
                    </Box>
                  }
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Active Column Content */}
        {activeCol && (
          <KanbanColumn
            stageKey={activeCol.key}
            stageLabel={activeCol.label}
            leads={activeColumnLeads}
            onLeadClick={onLeadClick}
            onDropLead={onDropLead}
            onAdvanceStage={onAdvanceStage}
            onRegressToDocs={onRegressToDocs}
            nextStageLabel={activeCol.nextLabel}
            canChangeStage={canChangeStage}
            currentUserId={currentUserId}
            userRole={userRole}
            updatingStageLeadId={updatingStageLeadId}
            isMobile
          />
        )}
      </Box>
    );
  }

  // Desktop view: horizontal scrollable Kanban board
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
        overflowX: 'auto',
        pb: 2,
        pt: 0.5,
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 4 },
      }}
    >
      {columns.map((col) => (
        <KanbanColumn
          key={col.key}
          stageKey={col.key}
          stageLabel={col.label}
          leads={filteredLeads.filter((l) => l.stage === col.key)}
          onLeadClick={onLeadClick}
          onDropLead={onDropLead}
          onAdvanceStage={onAdvanceStage}
          onRegressToDocs={onRegressToDocs}
          nextStageLabel={col.nextLabel}
          canChangeStage={canChangeStage}
          currentUserId={currentUserId}
          userRole={userRole}
          updatingStageLeadId={updatingStageLeadId}
        />
      ))}
    </Box>
  );
};

export default PipelineKanbanBoard;
