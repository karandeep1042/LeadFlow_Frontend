import React from 'react';
import {
  Box, Paper, TextField, InputAdornment, FormControl, InputLabel,
  Select, MenuItem, Chip, Tabs, Tab, IconButton, Tooltip, Button,
} from '@mui/material';
import { Search, X, RotateCcw, AlertCircle, Clock, Calendar, CheckCircle2, Archive, Users } from 'lucide-react';

export const TaskFilterBar = ({
  activeTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  advisorFilter,
  onAdvisorChange,
  advisors = [],
  sortBy,
  onSortChange,
  userRole = 'advisor',
}) => {
  const isFiltered = Boolean(
    searchQuery ||
    priorityFilter !== 'all' ||
    advisorFilter !== 'all' ||
    sortBy !== 'due_soonest' ||
    activeTab !== 'all'
  );

  const handleResetFilters = () => {
    onSearchChange('');
    onPriorityChange('all');
    onAdvisorChange('all');
    onSortChange('due_soonest');
    onTabChange('all');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* 1. Status Filter Tabs */}
      <Box sx={{ borderBottom: '1px solid #f1f5f9', pb: 0.5 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => onTabChange(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 42,
            '& .MuiTabs-indicator': { backgroundColor: '#18181b', height: 2.5, borderRadius: 2 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minHeight: 42,
              px: { xs: 1.25, sm: 2 },
              minWidth: 'auto',
            },
          }}
        >
          <Tab
            value="all"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>All Active</span>
                <Chip
                  label={counts.total}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'all' ? '#18181b' : '#f1f5f9',
                    color: activeTab === 'all' ? '#ffffff' : '#475569',
                  }}
                />
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', minHeight: 42 }}
          />

          <Tab
            value="overdue"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertCircle size={15} color={counts.overdue > 0 ? '#ef4444' : '#94a3b8'} />
                <span>Overdue</span>
                {counts.overdue > 0 && (
                  <Chip
                    label={counts.overdue}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      border: '1px solid #fecaca',
                    }}
                  />
                )}
              </Box>
            }
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              minHeight: 42,
              color: counts.overdue > 0 ? '#dc2626' : undefined,
            }}
          />

          <Tab
            value="due_today"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={15} color="#f59e0b" />
                <span>Due Today</span>
                <Chip
                  label={counts.dueToday}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'due_today' ? '#f59e0b' : '#fef3c7',
                    color: activeTab === 'due_today' ? '#ffffff' : '#b45309',
                  }}
                />
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', minHeight: 42 }}
          />

          <Tab
            value="upcoming"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={15} color="#3b82f6" />
                <span>Upcoming</span>
                <Chip
                  label={counts.upcoming}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'upcoming' ? '#3b82f6' : '#eff6ff',
                    color: activeTab === 'upcoming' ? '#ffffff' : '#1d4ed8',
                  }}
                />
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', minHeight: 42 }}
          />

          <Tab
            value="completed"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Completed (7d)</span>
                <Chip
                  label={counts.completed}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'completed' ? '#10b981' : '#ecfdf5',
                    color: activeTab === 'completed' ? '#ffffff' : '#047857',
                  }}
                />
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', minHeight: 42 }}
          />

          <Tab
            value="archive"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Archive size={15} color="#6366f1" />
                <span>Archive & History</span>
                <Chip
                  label={counts.archive ?? 0}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'archive' ? '#6366f1' : '#eef2ff',
                    color: activeTab === 'archive' ? '#ffffff' : '#4338ca',
                  }}
                />
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', minHeight: 42 }}
          />
        </Tabs>
      </Box>
      {/* 2. Filter & Search Controls Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        {/* Search Field: Full width on < 900px, fixed width on >= 900px */}
        <TextField
          size="small"
          placeholder="Search by task, details, or borrower name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#94a3b8" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')} sx={{ p: 0.5 }}>
                    <X size={14} color="#94a3b8" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{
            width: { xs: '100%', md: 280, lg: 340 },
            flexShrink: 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8fafc',
            },
          }}
        />

        {/* Filter Selects & Sort Row Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1.5,
            width: { xs: '100%', md: 'auto' },
            flex: { md: 1 },
            justifyContent: { xs: 'stretch', md: 'flex-start' },
          }}
        >

          {/* Priority Select: flex: 1 (half width) on < 900px, fixed minWidth on >= 900px */}
          <FormControl
            size="small"
            sx={{
              flex: { xs: 1, md: 'none' },
              minWidth: { xs: 0, md: 140 },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={priorityFilter}
              label="Priority"
              onChange={(e) => onPriorityChange(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="low">Low Priority</MenuItem>
            </Select>
          </FormControl>

          {/* Assignee Select for Admin */}
          {(userRole === 'brokerage_admin' || userRole === 'platform_admin' || userRole === 'admin') && (
            <FormControl
              size="small"
              sx={{
                flex: { xs: 1, md: 'none' },
                minWidth: { xs: 0, md: 170 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <InputLabel id="advisor-task-filter-label">Assignee</InputLabel>
              <Select
                labelId="advisor-task-filter-label"
                value={advisorFilter}
                label="Assignee"
                onChange={(e) => onAdvisorChange(e.target.value)}
                sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
              >
                <MenuItem value="all">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={15} color="#64748b" />
                    <span>All Advisors</span>
                  </Box>
                </MenuItem>
                <MenuItem value="unassigned">-- Unassigned --</MenuItem>
                {advisors.map((adv) => (
                  <MenuItem key={adv._id || adv.id} value={adv._id || adv.id}>
                    {adv.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Sort By Select: flex: 1 (half width) on < 900px, pushed right on >= 900px */}
          <FormControl
            size="small"
            sx={{
              flex: { xs: 1, md: 'none' },
              minWidth: { xs: 0, md: 160 },
              width: { xs: '100%', md: 'auto' },
              ml: { md: 'auto' },
            }}
          >
            <InputLabel id="sort-task-label">Sort By</InputLabel>
            <Select
              labelId="sort-task-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
            >
              <MenuItem value="due_soonest">Due (Soonest)</MenuItem>
              <MenuItem value="most_overdue">Most Overdue</MenuItem>
              <MenuItem value="priority">Priority (High to Low)</MenuItem>
              <MenuItem value="newest">Recently Created</MenuItem>
            </Select>
          </FormControl>

          {/* Reset Filters Button */}
          {isFiltered && (
            <Tooltip title="Reset all filters">
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetFilters}
                startIcon={<RotateCcw size={14} />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: '#ef4444',
                  borderColor: '#fca5a5',
                  height: 40,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  flexShrink: 0,
                  px: { xs: 1.25, sm: 2 },
                  '&:hover': {
                    borderColor: '#ef4444',
                    backgroundColor: '#fef2f2',
                  },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Reset</Box>
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskFilterBar;