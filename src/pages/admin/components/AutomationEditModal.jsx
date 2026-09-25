import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Stack, Switch, FormControlLabel, Divider,
} from '@mui/material';
import { RefreshCw } from 'lucide-react';
import EmailTemplateSection from './EmailTemplateSection';
import TaskConfigSection from './TaskConfigSection';
import { DEFAULT_STAGE_TEMPLATES } from '../../../utils/automationConstants';

export const AutomationEditModal = ({ open, onClose, trigger, onSave, saving }) => {
  const [formData, setFormData] = useState({
    stage: '',
    subject: '',
    body: '',
    taskTitle: '',
    taskPriority: 'medium',
    taskDueHours: 24,
    isActive: true,
  });

  useEffect(() => {
    if (trigger) {
      const template = trigger.emailTemplateId || {};
      setFormData({
        stage: trigger.stage || '',
        subject: template.subject || trigger.subject || '',
        body: template.body || trigger.body || '',
        taskTitle: trigger.taskTitle || '',
        taskPriority: trigger.taskPriority || 'medium',
        taskDueHours: trigger.taskDueHours || 24,
        isActive: trigger.isActive !== undefined ? trigger.isActive : true,
      });
    }
  }, [trigger]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInsertTag = (tag) => {
    setFormData((prev) => ({ ...prev, body: prev.body + ` ${tag} ` }));
  };

  const handleResetToDefault = () => {
    const defaultCfg = DEFAULT_STAGE_TEMPLATES.find((c) => c.stage === formData.stage);
    if (defaultCfg) {
      setFormData((prev) => ({
        ...prev,
        subject: defaultCfg.subject,
        body: defaultCfg.body,
        taskTitle: defaultCfg.taskTitle,
        taskPriority: defaultCfg.taskPriority,
        taskDueHours: defaultCfg.taskDueHours,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      stage: trigger.stage,
      emailTemplateId: trigger.emailTemplateId?._id || trigger.emailTemplateId,
      subject: formData.subject,
      body: formData.body,
      taskTitle: formData.taskTitle,
      taskPriority: formData.taskPriority,
      taskDueHours: Number(formData.taskDueHours),
      isActive: formData.isActive,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Edit Stage Automation Rule</Typography>
            <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 600 }}>Stage: {trigger?.stage}</Typography>
          </Box>
          <Button size="small" variant="text" startIcon={<RefreshCw size={14} />} onClick={handleResetToDefault} sx={{ textTransform: 'none', color: '#64748b' }}>
            Reset Defaults
          </Button>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box sx={{ p: 2, backgroundColor: formData.isActive ? '#eff6ff' : '#f8fafc', borderRadius: 2, border: '1px solid', borderColor: formData.isActive ? '#bfdbfe' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: formData.isActive ? '#1e40af' : '#475569' }}>Automation Active Status</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>When active, leads reaching this stage trigger the email and task.</Typography>
              </Box>
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} color="primary" />} label={formData.isActive ? 'Active' : 'Paused'} />
            </Box>

            <EmailTemplateSection subject={formData.subject} body={formData.body} onChange={handleChange} onInsertTag={handleInsertTag} />

            <Divider />

            <TaskConfigSection taskTitle={formData.taskTitle} taskPriority={formData.taskPriority} taskDueHours={formData.taskDueHours} onChange={handleChange} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={onClose} color="inherit" disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2, px: 3 }}>
            {saving ? 'Saving...' : 'Save Automation Rule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AutomationEditModal;
