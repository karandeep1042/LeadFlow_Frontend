import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, Paper, Avatar } from '@mui/material';
import { MessageSquare, Send, Clock } from 'lucide-react';

export const LeadNotesTimeline = ({ notesList = [], onAddNote, addingNote }) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <MessageSquare size={16} color="#2563eb" />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Internal Advisor Notes ({notesList.length})
        </Typography>
      </Box>

      {/* Note Input */}
      <form onSubmit={handleAdd}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Add internal consultation note or lender update..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newNoteText.trim() || addingNote}
            sx={{ backgroundColor: '#18181b', color: '#ffffff', minWidth: 40, px: 2 }}
          >
            <Send size={15} />
          </Button>
        </Box>
      </form>

      {/* Notes List */}
      <Stack spacing={1.5}>
        {notesList.length === 0 ? (
          <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No notes added yet. Record borrower interactions above.
          </Typography>
        ) : (
          [...notesList].reverse().map((n, idx) => (
            <Paper key={idx} elevation={0} sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 20, height: 20, fontSize: '0.65rem', bgcolor: '#2563eb', fontWeight: 700 }}>
                    {n.author ? n.author.charAt(0) : 'A'}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>{n.author || 'Advisor'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8', fontSize: '0.7rem' }}>
                  <Clock size={11} />
                  <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem' }}>
                {n.text}
              </Typography>
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default LeadNotesTimeline;
