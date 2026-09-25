import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLeads,
  createLead,
  updateLeadStage,
  assignLeadAdvisor,
  convertToClient,
  resolveDuplicate,
  addLeadNote,
} from '../../../redux/thunks/leadThunk';
import teamApi from '../../../services/api/teamApi';

export const usePipelineLeads = () => {
  const dispatch = useDispatch();
  const { leads, selectedLead, loading, error, assigningAdvisor } = useSelector((state) => state.lead);

  const [advisors, setAdvisors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchLeads());
    loadAdvisors();
  }, [dispatch]);

  const loadAdvisors = async () => {
    try {
      const res = await teamApi.getAdvisors();
      const advs = res?.data?.advisors || res?.advisors || [];
      setAdvisors(advs);
    } catch (err) {
      console.error('Could not fetch advisors:', err);
    }
  };

  const notify = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDropLead = async (leadId, targetStage, previousStage) => {
    try {
      await dispatch(updateLeadStage({ leadId, stage: targetStage, previousStage })).unwrap();
      notify(`Lead stage updated to ${targetStage}`);
    } catch (err) {
      // error is handled in slice
    }
  };

  const handleCreateLead = async (formData) => {
    setSavingLead(true);
    try {
      await dispatch(createLead(formData)).unwrap();
      setCreateModalOpen(false);
      notify('Expat lead registered successfully.');
    } finally {
      setSavingLead(false);
    }
  };

  const handleAssignAdvisor = async (leadId, advisorId) => {
    try {
      await dispatch(assignLeadAdvisor({ leadId, assignedAdvisorId: advisorId || null })).unwrap();
      notify('Advisor assignment updated and borrower notified via email.');
    } catch (err) {
      // error handled in slice
    }
  };

  const handleConvertToClient = async (leadId) => {
    await dispatch(convertToClient({ leadId })).unwrap();
    notify('Lead converted to Client Portal user account.');
  };

  const handleResolveDuplicate = async (leadId) => {
    await dispatch(resolveDuplicate({ leadId, action: 'mark_unique' })).unwrap();
    notify('Duplicate inquiry marked as distinct lead.');
  };

  const handleAddNote = async (leadId, noteText) => {
    await dispatch(addLeadNote({ leadId, note: noteText })).unwrap();
  };

  const filteredLeads = leads.filter((lead) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.city}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    if (selectedAdvisor !== 'all') {
      if (selectedAdvisor === 'unassigned') {
        if (lead.assignedAdvisorId) return false;
      } else {
        const advId = lead.assignedAdvisorId?._id || lead.assignedAdvisorId;
        if (String(advId) !== String(selectedAdvisor)) return false;
      }
    }
    if (tagFilter === 'high_value' && (Number(lead.loanAmount) || 0) < 500000) return false;
    if (tagFilter === 'duplicates' && (!lead.isDuplicate || lead.duplicateResolved)) return false;
    if (tagFilter === 'blue_card' && lead.visaType !== 'EU Blue Card') return false;
    return true;
  });

  return {
    leads,
    filteredLeads,
    selectedLead,
    loading,
    error,
    assigningAdvisor,
    advisors,
    searchQuery,
    setSearchQuery,
    selectedAdvisor,
    setSelectedAdvisor,
    tagFilter,
    setTagFilter,
    createModalOpen,
    setCreateModalOpen,
    savingLead,
    successMsg,
    setSuccessMsg,
    handleDropLead,
    handleCreateLead,
    handleAssignAdvisor,
    handleConvertToClient,
    handleResolveDuplicate,
    handleAddNote,
    dispatch,
  };
};
