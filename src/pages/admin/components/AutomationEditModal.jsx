import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Stack, Switch, FormControlLabel, Divider, IconButton,
} from '@mui/material';
import { RefreshCw, X } from 'lucide-react';
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
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2.5, sm: 3 },
          m: { xs: 1.5, sm: 3 },
          width: { xs: 'calc(100% - 24px)', sm: 'auto' },
          maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
          overflowX: 'hidden',
        },
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DialogTitle
          sx={{
            pb: 1.5,
            pt: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.25,
            borderBottom: '1px solid #f1f5f9',
            position: 'relative',
          }}
        >
          <Box sx={{ pr: { xs: 4, sm: 0 }, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.25rem' }, color: '#0f172a' }}>
              Edit Stage Automation Rule
            </Typography>
            <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 700, mt: 0.25 }}>
              Stage: {trigger?.stage}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshCw size={13} />}
            onClick={handleResetToDefault}
            sx={{
              textTransform: 'none',
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.25,
              whiteSpace: 'nowrap',
              alignSelf: { xs: 'flex-start', sm: 'center' },
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
            }}
          >
            Reset Defaults
          </Button>

          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={saving}
            size="small"
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: '#94a3b8',
              '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' },
            }}
          >
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Stack spacing={2.5}>
            <Box
              sx={{
                p: { xs: 1.75, sm: 2 },
                backgroundColor: formData.isActive ? '#eff6ff' : '#f8fafc',
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: formData.isActive ? '#bfdbfe' : '#e2e8f0',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: formData.isActive ? '#1e40af' : '#475569' }}>
                  Automation Active Status
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.25 }}>
                  When active, leads reaching this stage trigger the email and task.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700, color: formData.isActive ? '#1e40af' : '#64748b' }}>
                    {formData.isActive ? 'Active' : 'Paused'}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </Box>

            <EmailTemplateSection
              subject={formData.subject}
              body={formData.body}
              onChange={handleChange}
              onInsertTag={handleInsertTag}
            />

            <Divider />

            <TaskConfigSection
              taskTitle={formData.taskTitle}
              taskPriority={formData.taskPriority}
              taskDueHours={formData.taskDueHours}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            gap: { xs: 1, sm: 1.5 },
            justifyContent: 'space-between',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <Button
            onClick={onClose}
            color="inherit"
            disabled={saving}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              borderRadius: 2,
              fontWeight: 600,
              color: '#64748b',
              py: { xs: 1, sm: 0.75 },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              backgroundColor: '#18181b',
              color: '#ffffff',
              borderRadius: 2,
              px: 3,
              py: { xs: 1, sm: 0.75 },
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#09090b', boxShadow: 'none' },
            }}
          >
            {saving ? 'Saving...' : 'Save Automation Rule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AutomationEditModal;
