import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Box, FormControlLabel, Checkbox,
} from '@mui/material';
import { Edit2 } from 'lucide-react';

export const EditTaskModal = ({
  open,
  onClose,
  task,
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
  const [dueAt, setDueAt] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setLeadId(task.leadId?._id || task.leadId || '');
      setAssignedAdvisorId(task.assignedAdvisorId?._id || task.assignedAdvisorId || '');
      setPriority(task.priority || 'medium');
      setIsCompleted(Boolean(task.isCompleted));
      if (task.dueAt) {
        const d = new Date(task.dueAt);
        setDueAt(d.toISOString().slice(0, 16));
      }
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueAt || !task) return;
    onSave(task._id || task.id, {
      title,
      description,
      leadId: leadId || null,
      assignedAdvisorId: assignedAdvisorId || null,
      priority,
      dueAt: new Date(dueAt).toISOString(),
      isCompleted,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit2 size={18} color="#2563eb" />
          Edit Task Details
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1.5 }}>
          <TextField
            label="Task Title"
            required
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Task Description"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Linked Expat Lead</InputLabel>
              <Select value={leadId} label="Linked Expat Lead" onChange={(e) => setLeadId(e.target.value)}>
                <MenuItem value=""><em>-- No Lead --</em></MenuItem>
                {leads.map((l) => (
                  <MenuItem key={l._id || l.id} value={l._id || l.id}>
                    {l.firstName} {l.lastName}
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
                <MenuItem value="high">🔴 High Priority</MenuItem>
                <MenuItem value="medium">🟡 Medium Priority</MenuItem>
                <MenuItem value="low">🟢 Low Priority</MenuItem>
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
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <FormControlLabel
            control={<Checkbox checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} color="success" />}
            label="Mark Task as Completed"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving || !title} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTaskModal;