import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  X,
  Layers,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  UserX,
  Users,
} from 'lucide-react';

export const PipelineFilterToolbar = ({
  searchQuery,
  onSearchChange,
  selectedAdvisor,
  onAdvisorChange,
  tagFilter,
  onTagFilterChange,
  advisors = [],
}) => {
  const isFiltered = Boolean(searchQuery || selectedAdvisor !== 'all' || tagFilter !== 'all');

  const handleResetFilters = () => {
    onSearchChange('');
    onAdvisorChange('all');
    onTagFilterChange('all');
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2.5,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {/* Search & Advisor Dropdown */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 1.5,
          flex: { xs: '1 1 auto', lg: '0 1 auto' },
        }}
      >
        <TextField
          size="small"
          placeholder="Search by client name, email, city..."
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
            width: { xs: '100%', md: "80%" },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8fafc',
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
          <InputLabel id="advisor-filter-label">Filter by Advisor</InputLabel>
          <Select
            labelId="advisor-filter-label"
            value={selectedAdvisor}
            label="Filter by Advisor"
            onChange={(e) => onAdvisorChange(e.target.value)}
            sx={{ borderRadius: 2, backgroundColor: '#f8fafc' }}
          >
            <MenuItem value="all">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={15} color="#64748b" />
                <span>All Advisors (Brokerage)</span>
              </Box>
            </MenuItem>
            <MenuItem value="unassigned">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#b45309' }}>
                <UserX size={15} color="#b45309" />
                <span>Unassigned Leads</span>
              </Box>
            </MenuItem>
            {advisors.map((adv) => (
              <MenuItem key={adv._id || adv.id} value={adv._id || adv.id}>
                {adv.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Filter Chips */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: { xs: 'nowrap', lg: 'wrap' },
          justifyContent: 'flex-start',
          overflowX: { xs: 'auto', lg: 'visible' },
          pb: { xs: 0.5, lg: 0 },
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Chip
          icon={<Layers size={14} />}
          label="All Leads"
          clickable
          variant={tagFilter === 'all' ? 'filled' : 'outlined'}
          color={tagFilter === 'all' ? 'primary' : 'default'}
          onClick={() => onTagFilterChange('all')}
          sx={{ fontWeight: 700, borderRadius: 2, height: 32, flexShrink: 0 }}
        />

        <Chip
          icon={<TrendingUp size={14} />}
          label="High Value (>€500k)"
          clickable
          variant={tagFilter === 'high_value' ? 'filled' : 'outlined'}
          color={tagFilter === 'high_value' ? 'success' : 'default'}
          onClick={() => onTagFilterChange('high_value')}
          sx={{ fontWeight: 700, borderRadius: 2, height: 32, flexShrink: 0 }}
        />

        <Chip
          icon={<ShieldAlert size={14} />}
          label="Duplicates Only"
          clickable
          variant={tagFilter === 'duplicates' ? 'filled' : 'outlined'}
          color={tagFilter === 'duplicates' ? 'error' : 'default'}
          onClick={() => onTagFilterChange('duplicates')}
          sx={{ fontWeight: 700, borderRadius: 2, height: 32, flexShrink: 0 }}
        />

        <Chip
          icon={<CreditCard size={14} />}
          label="EU Blue Card"
          clickable
          variant={tagFilter === 'blue_card' ? 'filled' : 'outlined'}
          color={tagFilter === 'blue_card' ? 'primary' : 'default'}
          onClick={() => onTagFilterChange('blue_card')}
          sx={{ fontWeight: 700, borderRadius: 2, height: 32, flexShrink: 0 }}
        />

        {isFiltered && (
          <Tooltip title="Reset filters">
            <IconButton
              size="small"
              onClick={handleResetFilters}
              sx={{ p: 0.75, borderRadius: 2, backgroundColor: '#f1f5f9', color: '#64748b' }}
            >
              <X size={15} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default PipelineFilterToolbar;

