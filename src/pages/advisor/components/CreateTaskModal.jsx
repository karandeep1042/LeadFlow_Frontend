import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip,
} from '@mui/material';
import { PlusCircle, Zap, Clock } from 'lucide-react';

const MORTGAGE_PRESETS = [
  { title: 'Initial 2-Hour Consultation Outreach Call', priority: 'high', dueHours: 2, desc: 'Discuss borrowing capacity and visa parameters.' },
  { title: 'Review 3-Month Gehaltsabrechnungen (Payslips)', priority: 'medium', dueHours: 12, desc: 'Verify net monthly income and probationary period.' },
  { title: 'Request Missing Schufa Credit Record', priority: 'medium', dueHours: 24, desc: 'Ensure positive Schufa record is received.' },
  { title: 'Calculate Household Surplus & Max Loan Capacity', priority: 'high', dueHours: 12, desc: 'Compute debt-to-income and household net surplus.' },
  { title: 'Submit Bank Dossier to Interhyp / Europace / ING', priority: 'high', dueHours: 24, desc: 'Package verified borrower KYC for lender.' },
  { title: 'Order Property Valuation / Gutachten', priority: 'low', dueHours: 72, desc: 'Coordinate certified appraiser or bank surveyor valuation.' },
];

export const CreateTaskModal = ({
  open,
  onClose,
  onSave,
  leads = [],
  advisors = [],
  saving = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [assignedAdvisorId, setAssignedAdvisorId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueAt, setDueAt] = useState(() => {
    const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });

  const handleApplyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setPriority(preset.priority);
    const d = new Date(Date.now() + preset.dueHours * 60 * 60 * 1000);
    setDueAt(d.toISOString().slice(0, 16));
  };

  const handleApplyTimeframe = (hours) => {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    setDueAt(d.toISOString().slice(0, 16));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueAt) return;
    onSave({
      title,
      description,
      leadId: leadId || null,
      assignedAdvisorId: assignedAdvisorId || null,
      priority,
      dueAt: new Date(dueAt).toISOString(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlusCircle size={20} color="#2563eb" />
          Create Due Diligence / Mortgage Task
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1.5 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
              <Zap size={14} color="#2563eb" />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                Quick Mortgage Presets
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {MORTGAGE_PRESETS.map((p, idx) => (
                <Chip
                  key={idx}
                  label={p.title}
                  size="small"
                  onClick={() => handleApplyPreset(p)}
                  sx={{ fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}
                />
              ))}
            </Box>
          </Box>
          <TextField
            label="Task Title"
            required
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Outreach call or review payslips"
          />

          <TextField
            label="Task Description"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Action item details, lender requirements, or notes..."
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Linked Expat Lead</InputLabel>
              <Select value={leadId} label="Linked Expat Lead" onChange={(e) => setLeadId(e.target.value)}>
                <MenuItem value=""><em>-- No Lead (General Task) --</em></MenuItem>
                {leads.map((l) => (
                  <MenuItem key={l._id || l.id} value={l._id || l.id}>
                    {l.firstName} {l.lastName} ({l.city || l.stage})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Assigned Advisor</InputLabel>
              <Select value={assignedAdvisorId} label="Assigned Advisor" onChange={(e) => setAssignedAdvisorId(e.target.value)}>
                <MenuItem value=""><em>-- Unassigned --</em></MenuItem>
                {advisors.map((adv) => (
                  <MenuItem key={adv._id || adv.id} value={adv._id || adv.id}>
                    {adv.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Due Date & Time"
              type="datetime-local"
              required
              fullWidth
              size="small"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={12} /> Set SLA:
            </Typography>
            {[
              { label: '+2h (SLA Target)', hours: 2 },
              { label: '+12h', hours: 12 },
              { label: '+24h (Tomorrow)', hours: 24 },
              { label: '+3 Days', hours: 72 },
            ].map((t) => (
              <Chip
                key={t.hours}
                label={t.label}
                size="small"
                variant="outlined"
                onClick={() => handleApplyTimeframe(t.hours)}
                sx={{ fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving || !title} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2 }}>
            {saving ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTaskModal;