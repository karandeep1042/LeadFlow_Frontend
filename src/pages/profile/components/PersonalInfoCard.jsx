import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Grid, TextField, Button, Stack, InputAdornment, CircularProgress,
} from '@mui/material';
import {
  User, Mail, CheckCircle2, AlertCircle, Sparkles, Send, Check,
} from 'lucide-react';
import PhoneInputField from '../../../components/common/PhoneInputField';
import {
  updateUserProfile, sendSignupVerificationCode, verifySignupCode, fetchCurrentUser,
} from '../../../redux/thunks/authThunk';

export default function PersonalInfoCard({ user, roleMeta, organizationName, onShowToast }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCodeSent(false);
      setIsEmailVerified(false);
      setVerificationCode('');
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const originalEmail = (user?.email || '').trim().toLowerCase();
  const currentEnteredEmail = email.trim().toLowerCase();
  const isEmailChanged = originalEmail !== '' && currentEnteredEmail !== originalEmail;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.trim().toLowerCase() !== originalEmail) {
      setCodeSent(false);
      setIsEmailVerified(false);
      setVerificationCode('');
    }
  };

  const handleSendVerificationCode = async () => {
    if (!currentEnteredEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEnteredEmail)) {
      onShowToast('Please enter a valid email address.', 'error');
      return;
    }
    setSendingCode(true);
    const result = await dispatch(sendSignupVerificationCode({ email: currentEnteredEmail, name: name.trim() || 'User' }));
    setSendingCode(false);
    if (sendSignupVerificationCode.fulfilled.match(result)) {
      setCodeSent(true);
      setCountdown(60);
      onShowToast(`Verification code sent to ${currentEnteredEmail}`, 'success');
    } else {
      onShowToast(result.payload || 'Failed to send verification code.', 'error');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      onShowToast('Please enter the 6-digit verification code.', 'error');
      return;
    }
    setVerifyingCode(true);
    const result = await dispatch(verifySignupCode({ email: currentEnteredEmail, code: verificationCode.trim() }));
    setVerifyingCode(false);
    if (verifySignupCode.fulfilled.match(result)) {
      setIsEmailVerified(true);
      onShowToast('Email verified successfully! You can now save your profile.', 'success');
    } else {
      onShowToast(result.payload || 'Invalid or expired verification code.', 'error');
    }
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Full Name cannot be empty.', 'error');
      return;
    }
    if (isEmailChanged && !isEmailVerified) {
      onShowToast('Please verify your new email address with the verification code first.', 'error');
      return;
    }
    setProfileSaving(true);
    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      ...(isEmailChanged ? { email: currentEnteredEmail } : {}),
    };
    const result = await dispatch(updateUserProfile(payload));
    setProfileSaving(false);
    if (updateUserProfile.fulfilled.match(result)) {
      onShowToast('Personal details updated successfully!', 'success');
      dispatch(fetchCurrentUser());
    } else {
      onShowToast(result.payload || 'Failed to update personal details.', 'error');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2, borderBottom: '1px solid #e2e8f0', mb: 3 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>Personal Information</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Manage your identity, verified email, and phone number</Typography>
        </Box>
      </Box>

      <form onSubmit={handleSavePersonalInfo} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, display: 'block' }}>Full Name *</Typography>
            <TextField fullWidth size="small" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required InputProps={{ startAdornment: <InputAdornment position="start"><User size={16} style={{ color: '#94a3b8' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f8fafc' } }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>Email Address *</Typography>
              {!isEmailChanged ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#16a34a' }}>
                  <CheckCircle2 size={13} />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>Verified</Typography>
                </Box>
              ) : isEmailVerified ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#16a34a' }}>
                  <CheckCircle2 size={13} />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>New Email Verified</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#d97706' }}>
                  <AlertCircle size={13} />
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>Verification Required</Typography>
                </Box>
              )}
            </Box>
            <TextField fullWidth type="email" size="small" placeholder="your.email@leadflow.com" value={email} onChange={handleEmailChange} required InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={16} style={{ color: '#94a3b8' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#f8fafc' } }} />

            {isEmailChanged && (
              <Paper elevation={0} sx={{ mt: 1.5, p: 2, borderRadius: '12px', border: isEmailVerified ? '1px solid #bbf7d0' : '1px solid #fed7aa', backgroundColor: isEmailVerified ? '#f0fdf4' : '#fffbeb' }}>
                {isEmailVerified ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600 }}>New email <strong>{currentEnteredEmail}</strong> verified! Click Save Details below.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 600 }}>Enter 6-digit code sent to <strong>{currentEnteredEmail}</strong> to verify this new email.</Typography>
                    {!codeSent ? (
                      <Button type="button" variant="outlined" size="small" onClick={handleSendVerificationCode} disabled={sendingCode || !currentEnteredEmail} startIcon={sendingCode ? <CircularProgress size={14} color="inherit" /> : <Send size={14} />} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, borderColor: '#d97706', color: '#b45309', alignSelf: 'flex-start' }}>
                        {sendingCode ? 'Sending Code...' : 'Send Verification Code'}
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField placeholder="6-digit code" size="small" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#ffffff', fontWeight: 700, letterSpacing: '0.12em' } }} />
                        <Button type="button" variant="contained" size="small" onClick={handleVerifyCode} disabled={verifyingCode || verificationCode.trim().length !== 6} startIcon={verifyingCode ? <CircularProgress size={14} color="inherit" /> : <Check size={14} />} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}>
                          {verifyingCode ? 'Verifying...' : 'Verify'}
                        </Button>
                        <Button type="button" variant="text" size="small" onClick={handleSendVerificationCode} disabled={sendingCode || countdown > 0} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>
                          {countdown > 0 ? `Resend (${countdown}s)` : 'Resend Code'}
                        </Button>
                      </Box>
                    )}
                  </Stack>
                )}
              </Paper>
            )}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.75, display: 'block' }}>Phone Number</Typography>
            <PhoneInputField id="profile-phone-input" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="170 1234567" defaultCountry="+49" size="small" fullWidth />
          </Box>

          <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', mb: 1 }}>Workspace Details</Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Assigned Role</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{roleMeta.label}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Organization</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', noWrap: true }}>{organizationName}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, borderTop: '1px solid #e2e8f0', mt: 3 }}>
          <Button type="submit" variant="contained" disabled={profileSaving || (isEmailChanged && !isEmailVerified)} startIcon={profileSaving ? <CircularProgress size={16} color="inherit" /> : <Sparkles size={16} />} sx={{ fontWeight: 800, borderRadius: '10px', px: 3.5, py: 1, textTransform: 'none', backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' } }}>
            {profileSaving ? 'Saving Changes...' : 'Save Personal Details'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
