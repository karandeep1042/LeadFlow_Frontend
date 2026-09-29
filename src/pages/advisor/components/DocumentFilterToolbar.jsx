import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { Search, RotateCcw, User, X } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All Categories' },
  { key: 'personal', label: 'Personal & ID' },
  { key: 'income', label: 'Income & Payslips' },
  { key: 'financial', label: 'Financial & SCHUFA' },
  { key: 'property', label: 'Property & Collateral' },
];

export const DocumentFilterToolbar = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeStatus,
  onStatusChange,
  selectedAdvisorId,
  onAdvisorChange,
  advisorsList = [],
  isStaffAdmin = false,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    activeCategory !== 'all' ||
    activeStatus !== 'all' ||
    (isStaffAdmin && selectedAdvisorId !== 'all');

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 2, md: 3 },
        borderRadius: 2.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.25, sm: 1.75 },
      }}
    >
      {/* Top Row: Search & Advisor Dropdown & Reset */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        {/* Search Input */}
        <Box sx={{ flexGrow: 1, maxWidth: { md: 440 }, width: { xs: '100%', md: 'auto' } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search borrower name, document title, or file..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#64748b" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')} sx={{ p: 0.5, color: '#94a3b8' }}>
                    <X size={14} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: 2,
                fontSize: '0.875rem',
                backgroundColor: '#f8fafc',
                '& fieldset': { borderColor: '#e2e8f0' },
              },
            }}
          />
        </Box>

        {/* Advisor Dropdown & Reset button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'stretch', md: 'flex-end' },
          }}
        >
          {isStaffAdmin && (
            <FormControl
              size="small"
              sx={{
                flex: { xs: 1, md: 'none' },
                minWidth: { xs: 0, md: 220 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Select
                value={selectedAdvisorId}
                onChange={(e) => onAdvisorChange(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: 0.5 }}>
                    <User size={15} color="#64748b" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  fontSize: '0.85rem',
                  backgroundColor: '#f8fafc',
                  '& fieldset': { borderColor: '#e2e8f0' },
                }}
              >
                <MenuItem value="all">All Advisors' Deals</MenuItem>
                {advisorsList.map((adv) => (
                  <MenuItem key={adv._id} value={adv._id}>
                    {adv.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {isFiltered && (
            <Tooltip title="Reset all filters">
              <Button
                variant="outlined"
                size="small"
                onClick={onResetFilters}
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

      {/* Bottom Row: Category Chips with Horizontal Smooth Scroll */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          py: 0.5,
          px: 0.25,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: '#94a3b8',
            textTransform: 'uppercase',
            mr: 0.5,
            letterSpacing: 0.5,
            fontSize: '0.7rem',
            flexShrink: 0,
          }}
        >
          Category:
        </Typography>
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.key;
          return (
            <Chip
              key={cat.key}
              label={cat.label}
              size="small"
              onClick={() => onCategoryChange(cat.key)}
              sx={{
                flexShrink: 0,
                fontWeight: isSelected ? 700 : 500,
                fontSize: { xs: '0.72rem', sm: '0.75rem' },
                height: { xs: 28, sm: 30 },
                px: 0.5,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#1e3a8a' : '#f8fafc',
                color: isSelected ? '#ffffff' : '#475569',
                border: `1px solid ${isSelected ? '#1e3a8a' : '#e2e8f0'}`,
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: isSelected ? '#1e3a8a' : '#f1f5f9',
                  borderColor: isSelected ? '#1e3a8a' : '#cbd5e1',
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default DocumentFilterToolbar;
