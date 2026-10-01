import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Chip,
  Tooltip,
} from '@mui/material';
import { Check, Clock, Send, Award, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(95deg, #10b981 0%, #3b82f6 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#10b981',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#f1f5f9',
  zIndex: 1,
  color: '#64748b',
  width: 44,
  height: 44,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid #e2e8f0',
  transition: 'all 0.3s ease',
  ...(ownerState.active && {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 5px rgba(37, 99, 235, 0.18)',
    transform: 'scale(1.08)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderColor: '#059669',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
  }),
}));

const stepIcons = {
  1: <CheckCircle2 size={20} />,
  2: <FileText size={20} />,
  3: <Send size={20} />,
  4: <Award size={20} />,
  5: <Check size={20} />,
};

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <Check size={20} strokeWidth={2.5} /> : (stepIcons[String(icon)] || <Clock size={20} />)}
    </StepIconRoot>
  );
}

const MortgageRoadmapStepper = ({ stages = [], currentStage = 'Document Collection' }) => {
  const defaultStages = [
    {
      id: 1,
      title: 'Initial Consultation',
      subtitle: 'Discovery & Eligibility',
      description: 'Budget audit and bank qualification completed.',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Document Collection',
      subtitle: 'Audit & Compliance',
      description: 'Upload German payslips, SCHUFA, and ID documents.',
      status: 'current',
    },
    {
      id: 3,
      title: 'Bank Submission',
      subtitle: 'Bankanfrage Dispatch',
      description: 'Application submitted to ING, DSL, or Commerzbank.',
      status: 'upcoming',
    },
    {
      id: 4,
      title: 'Loan Approval',
      subtitle: 'Credit Sanction',
      description: 'Bank credit approved with guaranteed interest rate.',
      status: 'upcoming',
    },
    {
      id: 5,
      title: 'Notary & Payout',
      subtitle: 'Kaufvertrag Signed',
      description: 'Notary contract executed and loan disbursed.',
      status: 'upcoming',
    },
  ];

  const activeStages = stages.length > 0 ? stages : defaultStages;
  const activeStepIndex = activeStages.findIndex((s) => s.status === 'current');
  const activeStep = activeStepIndex !== -1 ? activeStepIndex : (activeStages.every((s) => s.status === 'completed') ? activeStages.length - 1 : 1);
  const currentStageObj = activeStages[activeStep] || activeStages[1] || activeStages[0];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 3, md: 3.5 },
        borderRadius: { xs: 3, md: 3.5 },
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Header Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 1.2, fontSize: '0.75rem' }}>
            GERMAN MORTGAGE LIFECYCLE
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              mt: -0.5,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            Application Progress Tracker
          </Typography>
        </Box>
        <Chip
          icon={<Clock size={14} color="#2563eb" />}
          label={`Active: Stage ${activeStep + 1} of ${activeStages.length} (${currentStageObj?.title || 'Document Collection'})`}
          sx={{
            bgcolor: '#eff6ff',
            color: '#1d4ed8',
            fontWeight: 700,
            fontSize: '0.78rem',
            border: '1px solid #bfdbfe',
            height: 28,
            alignSelf: { xs: 'stretch', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        />
      </Stack>

      {/* DESKTOP VIEW: Horizontal Stepper (visible on md and up) */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', py: 1 }}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<CustomConnector />}>
          {activeStages.map((stage, idx) => (
            <Step key={stage.id || idx} completed={stage.status === 'completed'}>
              <StepLabel
                StepIconComponent={CustomStepIcon}
                optional={
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5, fontSize: '0.75rem', fontWeight: 500 }}>
                    {stage.subtitle || stage.description}
                  </Typography>
                }
              >
                <Tooltip title={stage.description || ''} arrow placement="top">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: stage.status === 'current' ? 800 : 700,
                      color: stage.status === 'current' ? '#2563eb' : (stage.status === 'completed' ? '#0f172a' : '#94a3b8'),
                      fontSize: '0.88rem',
                    }}
                  >
                    {stage.title}
                  </Typography>
                </Tooltip>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {/* MOBILE / TABLET VIEW: Native Android-Style Vertical Timeline (visible on xs and sm) */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, pt: 0.5 }}>
        {/* Active Stage Spotlight Banner */}
        <Box
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 2.5,
            bgcolor: '#f8fafc',
            border: '1.5px solid #dbeafe',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.05)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.92rem' }}>
                  Current Milestone: {currentStageObj.title}
                </Typography>
                <Chip
                  label="In Progress"
                  size="small"
                  sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 700, fontSize: '0.68rem', height: 20 }}
                />
        {/* Vertical Timeline Step List */}
        <Stack spacing={0}>
          {activeStages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            const isLast = idx === activeStages.length - 1;

            return (
              <Box key={stage.id || idx} sx={{ display: 'flex', position: 'relative' }}>
                {/* Left Step Node and Connector Line */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isCompleted ? '#10b981' : (isCurrent ? '#2563eb' : '#f1f5f9'),
                      color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                      border: isCurrent ? '3px solid #bfdbfe' : (isCompleted ? '2px solid #059669' : '1.5px solid #cbd5e1'),
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      zIndex: 2,
                      boxShadow: isCurrent ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                  </Box>
                  {!isLast && (
                    <Box
                      sx={{
                        width: 2.5,
                        flexGrow: 1,
                        my: 0.5,
                        minHeight: 28,
                        bgcolor: isCompleted ? '#10b981' : '#e2e8f0',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Box>

                {/* Right Step Content Card */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    pb: isLast ? 0.5 : 2.5,
                    pt: 0.25,
                  }}
                >
                  <Box
                    sx={{
                      p: isCurrent ? 1.5 : 0,
                      borderRadius: isCurrent ? 2 : 0,
                      bgcolor: isCurrent ? '#eff6ff' : 'transparent',
                      border: isCurrent ? '1px solid #dbeafe' : 'none',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: isCurrent ? 800 : (isCompleted ? 700 : 600),
                          color: isCurrent ? '#1d4ed8' : (isCompleted ? '#0f172a' : '#64748b'),
                          fontSize: '0.88rem',
                        }}
                      >
                        {stage.title}
                      </Typography>
                      {isCompleted ? (
                        <Chip
                          icon={<Check size={11} color="#059669" />}
                          label="Done"
                          size="small"
                          sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                        />
                      ) : isCurrent ? (
                        <Chip
                          icon={<Clock size={11} color="#2563eb" />}
                          label="Current"
                          size="small"
                          sx={{ bgcolor: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.72rem' }}>
                          Upcoming
                        </Typography>
                      )}
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{
                        color: isCurrent ? '#3b82f6' : '#64748b',
                        fontWeight: 600,
                        display: 'block',
                        mt: 0.25,
                        fontSize: '0.75rem',
                      }}
                    >
                      {stage.subtitle}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isCurrent ? '#1e293b' : '#64748b',
                        fontSize: '0.78rem',
                        mt: 0.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {stage.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>
              </Box>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.45 }}>
                {currentStageObj.description || currentStageObj.subtitle}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default MortgageRoadmapStepper;
