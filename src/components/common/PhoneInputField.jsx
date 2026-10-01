import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
  ListSubheader,
} from '@mui/material';
import { Phone, Search } from 'lucide-react';
import { COUNTRY_CODES, splitPhoneNumber, formatFullPhoneNumber } from '../../utils/countryCodes';

export default function PhoneInputField({
  id,
  name = 'phone',
  value = '',
  onChange,
  label,
  placeholder = '170 1234567',
  disabled = false,
  required = false,
  error = false,
  helperText,
  size = 'small',
  fullWidth = true,
  defaultCountry = '+49',
  countrySelectWidth = { xs: 110, sm: 130 },
  showPhoneIcon = false,
  sx = {},
}) {
  const parsed = useMemo(() => splitPhoneNumber(value, defaultCountry), [value, defaultCountry]);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [nationalNumber, setNationalNumber] = useState(parsed.nationalNumber);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCountryCode(parsed.countryCode);
    setNationalNumber(parsed.nationalNumber);
  }, [parsed.countryCode, parsed.nationalNumber]);

  const triggerChange = (newCode, newNum) => {
    const fullPhone = formatFullPhoneNumber(newCode, newNum);
    if (onChange) {
      onChange({
        target: {
          id: id || name,
          name: name,
          value: fullPhone,
        },
      });
    }
  };

  const handleCountryChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    triggerChange(newCode, nationalNumber);
  };

  const handleNumberChange = (e) => {
    const inputVal = e.target.value;
    if (inputVal.trim().startsWith('+')) {
      const detected = splitPhoneNumber(inputVal.trim(), countryCode);
      setCountryCode(detected.countryCode);
      setNationalNumber(detected.nationalNumber);
      triggerChange(detected.countryCode, detected.nationalNumber);
      return;
    }
    setNationalNumber(inputVal);
    triggerChange(countryCode, inputVal);
  };

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRY_CODES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRY_CODES.filter(
      (c) => c.country.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const countryLabelId = id ? `${id}-country-label` : `${name}-country-label`;

  return (
    <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', width: fullWidth ? '100%' : 'auto', ...sx }}>
      <FormControl size={size} disabled={disabled} error={error} sx={{ width: countrySelectWidth, flexShrink: 0 }}>
        {label && <InputLabel id={countryLabelId} sx={{ fontWeight: 600 }}>Code</InputLabel>}
        <Select
          labelId={countryLabelId}
          id={`${id || name}-country-select`}
          label={label ? 'Code' : undefined}
          value={countryCode}
          onChange={handleCountryChange}
          onClose={() => setSearchQuery('')}
          renderValue={(selected) => {
            const item = COUNTRY_CODES.find((c) => c.code === selected) || { flag: '🌐', code: selected };
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 700, fontSize: '0.85rem' }}>
                <span>{item.flag}</span>
                <span style={{ color: '#1e293b' }}>{item.code}</span>
              </Box>
            );
          }}
          MenuProps={{
            autoFocus: false,
            PaperProps: { sx: { maxHeight: 320, borderRadius: 2, p: 0.5 } },
          }}
          sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}
        >
          <ListSubheader sx={{ pt: 1, pb: 1, backgroundColor: '#ffffff' }}>
            <TextField
              size="small"
              placeholder="Search..."
              fullWidth
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={14} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.82rem' } }}
            />
          </ListSubheader>

          {filteredCountries.map((item, idx) => (
            <MenuItem
              key={`${item.iso}-${item.code}-${idx}`}
              value={item.code}
              sx={{ py: 0.8, px: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }}
            >
              <span>{item.flag}</span>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit', flex: 1 }}>
                {item.country}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, ml: 'auto' }}>
                {item.code}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id={id || name}
        name={name}
        type="tel"
        size={size}
        fullWidth
        label={label}
        placeholder={placeholder}
        value={nationalNumber}
        onChange={handleNumberChange}
        disabled={disabled}
        required={required}
        error={error}
        helperText={helperText}
        slotProps={{
          input: {
            startAdornment: showPhoneIcon ? (
              <InputAdornment position="start">
                <Phone size={16} style={{ color: '#94a3b8' }} />
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#ffffff' } }}
      />
    </Box>
  );
}
