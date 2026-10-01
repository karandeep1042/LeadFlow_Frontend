import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, TextField, Button, Stack, IconButton, InputAdornment, LinearProgress, CircularProgress,
} from '@mui/material';
import {
  Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, Circle, AlertCircle, KeyRound,
} from 'lucide-react';
import { updateUserProfile } from '../../../redux/thunks/authThunk';

const RequirementItem = ({ fulfilled, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {fulfilled ? (
      <CheckCircle2 size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
    ) : (
      <Circle size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
    )}
    <Typography
      variant="caption"
      sx={{
        color: fulfilled ? '#15803d' : '#64748b',
        fontWeight: fulfilled ? 600 : 500,
        fontSize: '0.78rem',
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default function PasswordSecurityCard({ onShowToast }) {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const passwordCriteria = {
    minLength: newPassword.length >= 6,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
  };

  const fulfilledCount = Object.values(passwordCriteria).filter(Boolean).length;
  const isPasswordValid = fulfilledCount === 5;
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  const getStrengthInfo = () => {
    if (fulfilledCount === 0) return { label: '', color: '#cbd5e1', percent: 0 };
    if (fulfilledCount <= 2) return { label: 'Weak', color: '#ef4444', percent: 35 };
    if (fulfilledCount <= 4) return { label: 'Medium', color: '#f59e0b', percent: 75 };
    return { label: 'Strong', color: '#16a34a', percent: 100 };
  };
  const strengthInfo = getStrengthInfo();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      onShowToast('Please enter your current password.', 'error');
      return;
    }
    if (!isPasswordValid) {
      onShowToast('New password must satisfy all 5 security criteria.', 'error');
      return;
    }
    if (!passwordsMatch) {
      onShowToast('New password and confirmation do not match.', 'error');
      return;
    }

    setPasswordSaving(true);
    const result = await dispatch(updateUserProfile({ currentPassword: currentPassword.trim(), newPassword }));
    setPasswordSaving(false);

    if (updateUserProfile.fulfilled.match(result)) {
      onShowToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      onShowToast(result.payload || 'Failed to update password.', 'error');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2, borderBottom: '1px solid #e2e8f0', mb: 3 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={20} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>Security & Password</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Update your password following required security rules</Typography>
        </Box>
      </Box>

      <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, display: 'block' }}>Current Password *</Typography>
            <TextField
              fullWidth
              size="small"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRound size={16} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                        aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f8fafc' } }}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, display: 'block' }}>New Password *</Typography>
            <TextField
              fullWidth
              size="small"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={16} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                        aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f8fafc' } }}
            />

            {newPassword.length > 0 && (
              <Box sx={{ mt: 1.5, p: 2, borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>Password Strength</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: strengthInfo.color, fontSize: '0.75rem' }}>{strengthInfo.label}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={strengthInfo.percent} sx={{ height: 6, borderRadius: 3, backgroundColor: '#e2e8f0', '& .MuiLinearProgress-bar': { backgroundColor: strengthInfo.color, borderRadius: 3, transition: 'transform 0.3s ease' }, mb: 1.5 }} />
                <Stack spacing={0.75}>
                  <RequirementItem fulfilled={passwordCriteria.minLength} label="At least 6 characters" />
                  <RequirementItem fulfilled={passwordCriteria.hasUpper} label="At least one uppercase letter (A-Z)" />
                  <RequirementItem fulfilled={passwordCriteria.hasLower} label="At least one lowercase letter (a-z)" />
                  <RequirementItem fulfilled={passwordCriteria.hasNumber} label="At least one number (0-9)" />
                  <RequirementItem fulfilled={passwordCriteria.hasSpecial} label="At least one special character (!@#$%&*...)" />
                </Stack>
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, display: 'block' }}>Confirm New Password *</Typography>
            <TextField
              fullWidth
              size="small"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={16} style={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="small"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        sx={{ color: '#94a3b8', '&:hover': { color: '#0f172a' } }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f8fafc' } }}
            />
            {confirmPassword.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600, fontSize: '0.75rem' }}>Passwords match</Typography>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} style={{ color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600, fontSize: '0.75rem' }}>Passwords do not match</Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, borderTop: '1px solid #e2e8f0', mt: 3 }}>
          <Button type="submit" variant="contained" disabled={passwordSaving || !currentPassword || !isPasswordValid || !passwordsMatch} startIcon={passwordSaving ? <CircularProgress size={16} color="inherit" /> : <ShieldCheck size={16} />} sx={{ fontWeight: 800, borderRadius: '10px', px: 3.5, py: 1, textTransform: 'none', backgroundColor: '#0f172a', '&:hover': { backgroundColor: '#1e293b' } }}>
            {passwordSaving ? 'Updating Password...' : 'Update Password'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
