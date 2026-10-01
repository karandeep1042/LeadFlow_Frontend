import React from 'react';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CheckSquare } from 'lucide-react';

export const TaskConfigSection = ({ taskTitle, taskPriority, taskDueHours, onChange }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <CheckSquare size={18} color="#059669" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '0.925rem', sm: '1rem' } }}>
          2. Advisor Follow-Up Task
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
        <TextField
          label="Task Title for Mortgage Advisor"
          value={taskTitle}
          onChange={(e) => onChange('taskTitle', e.target.value)}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f8fafc' },
          }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Task Priority</InputLabel>
            <Select
              value={taskPriority}
              label="Task Priority"
              onChange={(e) => onChange('taskPriority', e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
            >
              <MenuItem value="low">Low Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Due Timeframe</InputLabel>
            <Select
              value={taskDueHours}
              label="Due Timeframe"
              onChange={(e) => onChange('taskDueHours', e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
            >
              <MenuItem value={2}>Due within 2 Hours</MenuItem>
              <MenuItem value={12}>Due within 12 Hours</MenuItem>
              <MenuItem value={24}>Due within 24 Hours</MenuItem>
              <MenuItem value={48}>Due within 48 Hours</MenuItem>
              <MenuItem value={72}>Due within 72 Hours</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskConfigSection;
