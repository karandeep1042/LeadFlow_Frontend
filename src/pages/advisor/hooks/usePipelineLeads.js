import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLeads,
  createLead,
  updateLeadStage,
  assignLeadAdvisor,
  convertToClient,
  resolveDuplicate,
  addLeadNote,
  declineLead,
  archiveLead,
  unarchiveLead,
} from '../../../redux/thunks/leadThunk';
import { toggleClientStatus } from '../../../redux/thunks/clientThunk';
import { completeTask, fetchTasks } from '../../../redux/thunks/taskThunk';
import { rejectDocument } from '../../../redux/thunks/documentThunk';
import teamApi from '../../../services/api/teamApi';
import { getStageDisplayName } from '../../../utils/automationConstants';

const ALLOWED_STAGE_TRANSITIONS = {
  'New': ['Contacted'],
  'Contacted': ['Document Collection'],
  'Document Collection': ['Bank Submission'],
  'Bank Submission': ['Won', 'Document Collection'],
  'Won': ['Lost'],
  'Lost': [],
};

export const usePipelineLeads = () => {
  const dispatch = useDispatch();
  const { leads, counts = { active: 0, archived: 0 }, selectedLead, loading, error, assigningAdvisor, updatingStageLeadId } = useSelector((state) => state.lead);
  const { tasks } = useSelector((state) => state.task);

  const [advisors, setAdvisors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'archived'
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [convertingClient, setConvertingClient] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [stageConfirmModal, setStageConfirmModal] = useState({
    open: false,
    leadId: null,
    targetStage: null,
    previousStage: null,
    leadName: '',
    type: null,
    docsSummary: null,
    pendingTask: null,
    leadObj: null,
  });

  const loadLeads = useCallback(() => {
    dispatch(fetchLeads({ isArchived: activeTab === 'archived' ? 'true' : 'false' }));
  }, [dispatch, activeTab]);

  useEffect(() => {
    loadLeads();
    loadAdvisors();
    dispatch(fetchTasks());
  }, [loadLeads, dispatch]);

  const loadAdvisors = async () => {
    try {
      const res = await teamApi.getAdvisors();
      const advs = res?.data?.advisors || res?.advisors || [];
      setAdvisors(advs);
    } catch (err) {
      console.error('Could not fetch advisors:', err);
    }
  };

  const notify = (msg, severity = 'success') => {
    setNotification({ open: true, message: msg, severity });
    if (severity === 'error') {
      setErrorMsg(msg);
      setSuccessMsg('');
    } else {
      setSuccessMsg(msg);
      setErrorMsg('');
    }
    setTimeout(() => {
      setNotification((prev) => (prev.message === msg ? { ...prev, open: false } : prev));
      setSuccessMsg((prev) => (prev === msg ? '' : prev));
      setErrorMsg((prev) => (prev === msg ? '' : prev));
    }, 5000);
  };

  const notifySuccess = (msg) => notify(msg, 'success');
  const notifyError = (msg) => notify(msg, 'error');
  const notifyWarning = (msg) => notify(msg, 'warning');
  const notifyInfo = (msg) => notify(msg, 'info');
  const clearNotification = () => {
    setNotification({ open: false, message: '', severity: 'info' });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const executeStageChange = async (leadId, targetStage, previousStage, resolvePendingTask = true, extraData = {}) => {
    const targetLead = leads.find((l) => String(l._id || l.id) === String(leadId));
    const borrowerName = targetLead ? `${targetLead.firstName} ${targetLead.lastName || ''}`.trim() : 'Lead';
    const isClaimedFromIngestion = previousStage === 'New' && targetStage === 'Contacted';
    const isBankRevisionRegression = previousStage === 'Bank Submission' && targetStage === 'Document Collection';

    try {
      const res = await dispatch(updateLeadStage({
        leadId,
        stage: targetStage,
        previousStage,
        resolvePendingTask,
        isRevision: extraData.isRevision,
        selectedDocIds: extraData.selectedDocIds,
        reason: extraData.reason,
      })).unwrap();

      dispatch(fetchTasks());

      const updatedLead = res?.data?.data || res?.data || targetLead;
      const finalName = updatedLead ? `${updatedLead.firstName} ${updatedLead.lastName || ''}`.trim() : borrowerName;

      if (isClaimedFromIngestion) {
        notifySuccess(`Successfully claimed ${finalName}! Case assigned to you and moved to Initial Consultation.`);
      } else if (isBankRevisionRegression) {
        const count = extraData.selectedDocIds?.length || 0;
        if (count > 0) {
          notifyInfo(`Case moved to Document Collection. ${count} revision request(s) sent to ${finalName}.`);
        } else {
          notifyInfo(`Case moved to Document Collection. Revision notification sent to ${finalName}.`);
        }
      } else if (targetStage === 'Contacted' && (previousStage === 'Document Collection' || previousStage === 'Bank Submission')) {
        notifyWarning(`Deal moved back to Initial Consultation. Client Portal access deactivated.`);
      } else if (targetStage === 'Document Collection' && previousStage === 'Contacted') {
        notifySuccess(`Deal moved to Document Collection. Client Portal document access enabled.`);
      } else if (targetStage === 'Bank Submission') {
        notifySuccess(`Case approved for Bank Submission. Dossier sent to partner bank underwriting.`);
      } else if (targetStage === 'Won') {
        notifySuccess(`Loan approval secured for ${finalName}! Ready for Notary & Closing.`);
      } else if (targetStage === 'Lost') {
        notifySuccess(`${finalName} advanced to Notary & Closing! Closing workflow initiated.`);
      } else {
        notifySuccess(`Successfully moved ${finalName} to ${getStageDisplayName(targetStage)}.`);
      }
    } catch (err) {
      const errMsg = err?.error || err?.message || (typeof err === 'string' ? err : 'Failed to update stage. Please try again.');
      notifyError(errMsg);
    }
  };

  const handleRequestStageChange = (leadId, targetStage, previousStage, leadObj = null) => {
    const targetLead =
      leadObj ||
      leads.find((l) => String(l._id || l.id) === String(leadId)) ||
      (selectedLead && String(selectedLead._id || selectedLead.id) === String(leadId) ? selectedLead : null);

    const actualPrevStage = previousStage || targetLead?.stage || 'New';
    const borrowerName = targetLead
      ? `${targetLead.firstName} ${targetLead.lastName || ''}`.trim()
      : 'Borrower';

    // 1. Disallow moving back to Lead Ingestion (New) once progressed
    if (actualPrevStage !== 'New' && targetStage === 'New') {
      notifyError('Stage Lock: Deals cannot be moved back to Lead Ingestion once claimed and progressed in the pipeline.');
      return;
    }

    // 2. Disallow moving backward from Won / Lost stages
    const terminalStages = ['Won', 'Lost', 'Approved', 'Closed Won', 'Closed Lost'];
    if (terminalStages.includes(actualPrevStage) && targetStage !== actualPrevStage) {
      const isAllowedAdvancement = (actualPrevStage === 'Won' || actualPrevStage === 'Approved') && (targetStage === 'Lost' || targetStage === 'Closed Won');
      if (!isAllowedAdvancement) {
        notifyError('Stage Lock: Deals with approved loan offers or finalized closings have binding commitments and cannot be moved backward.');
        return;
      }
    }

    // 3. Strict Sequential Progression Rule
    if (actualPrevStage !== targetStage) {
      const allowedNextStages = ALLOWED_STAGE_TRANSITIONS[actualPrevStage] || [];
      if (!allowedNextStages.includes(targetStage)) {
        if (actualPrevStage === 'Contacted' && targetStage === 'Bank Submission') {
          notifyError('Sequential Pipeline Rule: Deals must progress step-by-step through Document Collection before Bank Submission.');
        } else {
          notifyError(`Sequential Pipeline: Cannot jump directly from "${getStageDisplayName(actualPrevStage)}" to "${getStageDisplayName(targetStage)}". Cases must progress step-by-step through each milestone.`);
        }
        return;
      }
    }

    // 4. Document Compliance Verification Gate for Bank Submission
    if (targetStage === 'Bank Submission') {
      const docsSummary = targetLead?.docsSummary;
      if (!docsSummary?.isComplianceComplete) {
        setStageConfirmModal({
          open: true,
          type: 'compliance_blocked',
          leadId,
          targetStage,
          previousStage: actualPrevStage,
          leadName: borrowerName,
          docsSummary: docsSummary || {
            totalRequired: 18,
            uploadedCount: 0,
            verifiedCount: 0,
            unverifiedCount: 18,
            rejectedCount: 0,
            pendingCount: 0,
          },
          leadObj: targetLead,
        });
        return;
      }
    }

    // 5. Smart Stage Task Gate: Check if current stage task is pending completion
    const isAdvancingForward = actualPrevStage !== targetStage && !(actualPrevStage === 'Bank Submission' && targetStage === 'Document Collection');
    if (isAdvancingForward) {
      const pendingTask = tasks.find((t) => {
        const tLeadId = t.leadId?._id || t.leadId;
        const matchesLead = String(tLeadId) === String(leadId);
        const matchesStage = t.stage === actualPrevStage || (!t.stage && t.status === 'pending');
        return matchesLead && matchesStage && !t.isCompleted && t.status !== 'superseded';
      });

      if (pendingTask) {
        setStageConfirmModal({
          open: true,
          type: 'task_pending_advance',
          leadId,
          targetStage,
          previousStage: actualPrevStage,
          leadName: `${targetLead?.firstName || ''} ${targetLead?.lastName || ''}`.trim() || 'Client',
          pendingTask,
          docsSummary: null,
          leadObj: targetLead,
        });
        return;
      }
    }

    // 6. Prompt when moving from Initial Consultation (Contacted) to Document Collection
    const isAdvancingToDocs =
      actualPrevStage === 'Contacted' &&
      targetStage === 'Document Collection';

    if (isAdvancingToDocs) {
      setStageConfirmModal({
        open: true,
        type: 'activate_portal',
        leadId,
        targetStage,
        previousStage: actualPrevStage,
        leadName: borrowerName,
        docsSummary: targetLead?.docsSummary,
        leadObj: targetLead,
      });
      return;
    }

    // 7. Prompt when moving from Document Collection to Bank Submission
    const isAdvancingToBank =
      actualPrevStage === 'Document Collection' &&
      targetStage === 'Bank Submission';

    if (isAdvancingToBank) {
      setStageConfirmModal({
        open: true,
        type: 'bank_submission',
        leadId,
        targetStage,
        previousStage: actualPrevStage,
        leadName: borrowerName,
        docsSummary: targetLead?.docsSummary,
        pendingTask: null,
        leadObj: targetLead,
      });
      return;
    }

    // 8. Bank Underwriting Feedback: Prompt when moving from Bank Submission back to Document Collection
    const isRegressingToDocCollection =
      actualPrevStage === 'Bank Submission' &&
      targetStage === 'Document Collection';

    if (isRegressingToDocCollection) {
      setStageConfirmModal({
        open: true,
        type: 'bank_revision_regression',
        leadId,
        targetStage,
        previousStage: actualPrevStage,
        leadName: borrowerName,
        docsSummary: targetLead?.docsSummary,
        pendingTask: null,
        leadObj: targetLead,
      });
      return;
    }

    // All other valid transitions execute directly
    executeStageChange(leadId, targetStage, actualPrevStage);
  };

  const handleConfirmStageTransition = async (confirmData = {}) => {
    const { leadId, targetStage, previousStage, pendingTask } = stageConfirmModal;
    const resolvePendingTask = confirmData?.resolvePendingTask ?? true;
    const pendingTaskId = confirmData?.pendingTaskId || pendingTask?._id;

    setStageConfirmModal({
      open: false,
      leadId: null,
      targetStage: null,
      previousStage: null,
      leadName: '',
      type: null,
      docsSummary: null,
      pendingTask: null,
      leadObj: null,
    });

    if (pendingTaskId) {
      dispatch(completeTask({ taskId: pendingTaskId, isCompleted: true }));
    }

    if (leadId && targetStage) {
      await executeStageChange(leadId, targetStage, previousStage, resolvePendingTask, confirmData);
    }
  };

  const handleCancelStageTransition = () => {
    setStageConfirmModal({
      open: false,
      leadId: null,
      targetStage: null,
      previousStage: null,
      leadName: '',
      type: null,
      docsSummary: null,
      pendingTask: null,
      leadObj: null,
    });
  };

  const handleDropLead = (leadId, targetStage, previousStage) => {
    handleRequestStageChange(leadId, targetStage, previousStage);
  };

  const handleCreateLead = async (formData) => {
    setSavingLead(true);
    try {
      await dispatch(createLead(formData)).unwrap();
      setCreateModalOpen(false);
      notifySuccess('Expat lead registered successfully.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to create lead.');
    } finally {
      setSavingLead(false);
    }
  };

  const handleAssignAdvisor = async (leadId, advisorId) => {
    try {
      await dispatch(assignLeadAdvisor({ leadId, assignedAdvisorId: advisorId || null })).unwrap();
      notifySuccess('Advisor assignment updated and borrower notified via email.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to update advisor assignment.');
    }
  };

  const handleConvertToClient = async (leadId) => {
    setConvertingClient(true);
    try {
      const res = await dispatch(convertToClient({ leadId })).unwrap();
      notifySuccess(res?.message || 'Lead converted to Client Portal account (Portal Active). Onboarding invitation email sent.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to convert lead to client portal.');
    } finally {
      setConvertingClient(false);
    }
  };

  const handleToggleClientStatus = async (clientId, status, reason) => {
    try {
      const res = await dispatch(toggleClientStatus({ clientId, status, reason })).unwrap();
      if (status === 'suspended') {
        notifyWarning(res?.data?.message || 'Client portal account deactivated and suspended. Notification email sent.');
      } else {
        notifySuccess(res?.data?.message || `Client portal status updated to ${status}. Notification email sent.`);
      }
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to update client status.');
    }
  };

  const handleResolveDuplicate = async (leadId) => {
    try {
      await dispatch(resolveDuplicate({ leadId, action: 'mark_unique' })).unwrap();
      notifySuccess('Duplicate inquiry marked as distinct lead.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to resolve duplicate lead.');
    }
  };

  const handleAddNote = async (leadId, noteText) => {
    try {
      await dispatch(addLeadNote({ leadId, note: noteText })).unwrap();
      notifySuccess('Lead note added successfully.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to add note.');
    }
  };

  const handleDeclineLead = async (leadId, reason) => {
    try {
      await dispatch(declineLead({ leadId, reason })).unwrap();
      notifyWarning('Case has been permanently declined and concluded.');
      loadLeads();
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to decline lead.');
    }
  };

  const handleArchiveLead = async (leadId, { finalDisbursedAmount, closingNotes }) => {
    try {
      await dispatch(archiveLead({ leadId, finalDisbursedAmount, closingNotes })).unwrap();
      notifySuccess('Deal successfully finalized, disbursed, and archived in Closed Portfolio.');
      loadLeads();
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to archive lead.');
    }
  };

  const handleUnarchiveLead = async (leadId) => {
    try {
      await dispatch(unarchiveLead({ leadId })).unwrap();
      notifySuccess('Deal restored back to active pipeline.');
      loadLeads();
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to unarchive lead.');
    }
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
    counts,
    filteredLeads,
    selectedLead,
    loading,
    error,
    assigningAdvisor,
    updatingStageLeadId,
    convertingClient,
    advisors,
    searchQuery,
    setSearchQuery,
    selectedAdvisor,
    setSelectedAdvisor,
    tagFilter,
    setTagFilter,
    activeTab,
    setActiveTab,
    createModalOpen,
    setCreateModalOpen,
    savingLead,
    notification,
    setNotification,
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    clearNotification,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    stageConfirmModal,
    handleRequestStageChange,
    handleConfirmStageTransition,
    handleCancelStageTransition,
    handleDropLead,
    handleCreateLead,
    handleAssignAdvisor,
    handleConvertToClient,
    handleToggleClientStatus,
    handleResolveDuplicate,
    handleAddNote,
    handleDeclineLead,
    handleArchiveLead,
    handleUnarchiveLead,
    dispatch,
  };
};
