import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Stack, MenuItem,
  FormControl, InputLabel, Select,
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import PhoneInputField from '../../../components/common/PhoneInputField';

const CITIES = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart', 'Düsseldorf'];
const VISA_TYPES = [
  'EU Blue Card',
  'Permanent Residence (Niederlassungserlaubnis)',
  'EU Citizen',
  'Freelance / Self-Employed (Freiberufler)',
];

export const CreateLeadModal = ({ open, onClose, onSave, advisors = [], saving }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    loanAmount: '',
    purchasePrice: '',
    city: 'Berlin',
    visaType: 'EU Blue Card',
    employmentType: 'Employed (Permanent)',
    monthlyNetIncome: '',
    assignedAdvisorId: '',
    notes: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      loanAmount: Number(formData.loanAmount) || 0,
      purchasePrice: Number(formData.purchasePrice) || 0,
      monthlyNetIncome: Number(formData.monthlyNetIncome) || 0,
      assignedAdvisorId: formData.assignedAdvisorId || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <UserPlus size={20} color="#2563eb" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Create New Expat Mortgage Lead</Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="First Name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required fullWidth size="small" />
              <TextField label="Last Name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} fullWidth size="small" />
              <TextField label="Email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required fullWidth size="small" />
              <PhoneInputField
                id="create-lead-phone"
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField label="Loan (€)" type="number" value={formData.loanAmount} onChange={(e) => handleChange('loanAmount', e.target.value)} required fullWidth size="small" />
              <TextField label="Purchase Price (€)" type="number" value={formData.purchasePrice} onChange={(e) => handleChange('purchasePrice', e.target.value)} fullWidth size="small" />
              <TextField label="Net Income (€)" type="number" value={formData.monthlyNetIncome} onChange={(e) => handleChange('monthlyNetIncome', e.target.value)} fullWidth size="small" />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Property City</InputLabel>
                <Select value={formData.city} label="Property City" onChange={(e) => handleChange('city', e.target.value)}>
                  {CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Visa Category</InputLabel>
                <Select value={formData.visaType} label="Visa Category" onChange={(e) => handleChange('visaType', e.target.value)}>
                  {VISA_TYPES.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Employment</InputLabel>
                <Select value={formData.employmentType} label="Employment" onChange={(e) => handleChange('employmentType', e.target.value)}>
                  <MenuItem value="Employed (Permanent)">Employed (Permanent)</MenuItem>
                  <MenuItem value="Self-Employed / Freelancer">Self-Employed</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Assign Advisor</InputLabel>
                <Select value={formData.assignedAdvisorId} label="Assign Advisor" onChange={(e) => handleChange('assignedAdvisorId', e.target.value)}>
                  <MenuItem value=""><em>-- Unassigned --</em></MenuItem>
                  {advisors.map((adv) => (
                    <MenuItem key={adv._id || adv.id} value={adv._id || adv.id}>
                      {adv.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField label="Lead Notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} multiline rows={2} fullWidth />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2 }}>
            {saving ? 'Creating...' : 'Create Lead'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateLeadModal;
