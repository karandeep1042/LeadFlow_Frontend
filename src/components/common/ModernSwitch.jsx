import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

/**
 * Modern iOS / SaaS style pill toggle switch matching LeadFlow brand UI.
 * Features an elongated capsule track and crisp elevated circular thumb.
 */
export const ModernSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 20,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(18px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 3,
    transitionDuration: '250ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#ffffff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#2563eb', // Rich purple/violet matching reference design
        opacity: 1,
        border: 0,
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 5px rgba(58, 130, 237, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      backgroundColor: '#f1f5f9',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)',
    transition: theme.transitions.create(['width', 'transform', 'background-color', 'box-shadow'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    opacity: 1,
    backgroundColor: '#cbd5e1',
    boxSizing: 'border-box',
    transition: theme.transitions.create(['background-color'], {
      duration: 200,
    }),
  },
}));

export default ModernSwitch;
