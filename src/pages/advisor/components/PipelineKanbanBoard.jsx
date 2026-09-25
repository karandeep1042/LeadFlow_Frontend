import React from 'react';
import { Box } from '@mui/material';
import KanbanColumn from './KanbanColumn';

export const PipelineKanbanBoard = ({
  columns = [],
  filteredLeads = [],
  onLeadClick,
  onDropLead,
  onAdvanceStage,
  canChangeStage = true,
}) => {
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
          nextStageLabel={col.nextLabel}
          canChangeStage={canChangeStage}
        />
      ))}
    </Box>
  );
};

export default PipelineKanbanBoard;
