import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress, Snackbar, Alert, Paper, Chip, IconButton, Tooltip } from '@mui/material';
import { RefreshCw, CheckSquare, Clock, Archive } from 'lucide-react';
import {
  fetchTasks, fetchTaskAnalytics, completeTask, updateTask, deleteTask,
} from '../../redux/thunks/taskThunk';
import {
  setActiveTab, setSearchQuery, setPriorityFilter, setAdvisorFilter, setSortBy,
} from '../../redux/slices/taskSlice';
import {
  fetchLeads, updateLeadStage, assignLeadAdvisor, convertToClient, resolveDuplicate, addLeadNote,
} from '../../redux/thunks/leadThunk';
import { toggleClientStatus } from '../../redux/thunks/clientThunk';
import { rejectDocument } from '../../redux/thunks/documentThunk';
import teamApi from '../../services/api/teamApi';
import { subscribeToSocketEvent } from '../../services/socket/socketService';

import TaskMetricsStrip from './components/TaskMetricsStrip';
import TaskFilterBar from './components/TaskFilterBar';
import TaskCard from './components/TaskCard';
import EditTaskModal from './components/EditTaskModal';
import LeadDossierDrawer from './components/LeadDossierDrawer';
import StageTransitionConfirmModal from './components/StageTransitionConfirmModal';
import { getStageDisplayName } from '../../utils/automationConstants';

const ALLOWED_STAGE_TRANSITIONS = {
  'New': ['Contacted'],
  'Contacted': ['Document Collection'],
  'Document Collection': ['Bank Submission'],
  'Bank Submission': ['Won', 'Document Collection'],
  'Won': ['Lost'],
  'Lost': [],
};

export const TasksManagementPage = () => {
  const dispatch = useDispatch();
  const { user, role: userRole } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.id;
  const isAdmin = userRole === 'brokerage_admin' || userRole === 'admin';
  const {
    tasks, analytics, activeTab, searchQuery, priorityFilter, advisorFilter,
    sortBy, loading, actionLoading,
  } = useSelector((state) => state.task);
  const { leads, assigningAdvisor } = useSelector((state) => state.lead);

  const [advisors, setAdvisors] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
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

  const notify = (msg, severity = 'info') => {
    setToast({ open: true, message: msg, severity });
  };
  const notifySuccess = (msg) => notify(msg, 'success');
  const notifyError = (msg) => notify(msg, 'error');
  const notifyWarning = (msg) => notify(msg, 'warning');
  const notifyInfo = (msg) => notify(msg, 'info');

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
        notifyWarning('Deal moved back to Initial Consultation. Client Portal access deactivated.');
      } else if (targetStage === 'Document Collection' && previousStage === 'Contacted') {
        notifySuccess('Deal moved to Document Collection. Client Portal document access enabled.');
      } else if (targetStage === 'Won') {
        notifySuccess(`Loan approval secured for ${finalName}! Ready for Notary & Closing.`);
      } else if (targetStage === 'Lost') {
        notifySuccess(`${finalName} advanced to Notary & Closing! Closing workflow initiated.`);
      } else {
        notifySuccess(`Successfully moved ${finalName} to ${getStageDisplayName(targetStage)}.`);
      }
    } catch (err) {
      notifyError(err?.error || err?.message || 'Failed to update stage.');
    }
  };

  const handleRequestStageChange = (leadId, targetStage, previousStage, leadObj = null) => {
    const targetLead = leadObj || leads.find((l) => String(l._id || l.id) === String(leadId)) || selectedLead;
    const actualPrevStage = previousStage || targetLead?.stage || 'New';
    const borrowerName = targetLead ? `${targetLead.firstName} ${targetLead.lastName || ''}`.trim() : 'Borrower';

    if (actualPrevStage !== 'New' && targetStage === 'New') {
      notifyError('Stage Lock: Deals cannot be moved back to Lead Ingestion once claimed and progressed.');
      return;
    }

    const terminalStages = ['Won', 'Lost', 'Approved', 'Closed Won', 'Closed Lost'];
    if (terminalStages.includes(actualPrevStage) && targetStage !== actualPrevStage) {
      const isAllowedAdvancement = (actualPrevStage === 'Won' || actualPrevStage === 'Approved') && (targetStage === 'Lost' || targetStage === 'Closed Won');
      if (!isAllowedAdvancement) {
        notifyError('Stage Lock: Deals with approved loan offers or finalized closings cannot be moved backward.');
        return;
      }
    }

    if (actualPrevStage !== targetStage) {
      const allowed = ALLOWED_STAGE_TRANSITIONS[actualPrevStage] || [];
      if (!allowed.includes(targetStage)) {
        if (actualPrevStage === 'Contacted' && targetStage === 'Bank Submission') {
          notifyError('Sequential Pipeline Rule: Deals must progress step-by-step through Document Collection before Bank Submission.');
        } else {
          notifyError(`Sequential Pipeline: Cannot jump directly from "${getStageDisplayName(actualPrevStage)}" to "${getStageDisplayName(targetStage)}". Cases must progress step-by-step through each milestone.`);
        }
        return;
      }
    }

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
          pendingTask: null,
          leadObj: targetLead,
        });
        return;
      }
    }

    // Smart Stage Task Gate: Check if current stage task is pending completion
    // Claiming a lead (moving from Lead Ingestion to Initial Consultation) does NOT require completing any prior task
    const isClaimingFromNew = actualPrevStage === 'New' && targetStage === 'Contacted';
    const isAdvancingForward =
      actualPrevStage !== targetStage &&
      !isClaimingFromNew &&
      !(actualPrevStage === 'Bank Submission' && targetStage === 'Document Collection');
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
          leadName: borrowerName,
          pendingTask,
          docsSummary: null,
          leadObj: targetLead,
        });
        return;
      }
    }

    if (actualPrevStage === 'Contacted' && targetStage === 'Document Collection') {
      setStageConfirmModal({
        open: true,
        type: 'activate_portal',
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

    if (actualPrevStage === 'Document Collection' && targetStage === 'Bank Submission') {
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

    if (actualPrevStage === 'Bank Submission' && targetStage === 'Document Collection') {
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

    executeStageChange(leadId, targetStage, actualPrevStage);
  };

  const handleConfirmStageTransition = async (confirmData = {}) => {
    const { leadId, targetStage, previousStage, pendingTask } = stageConfirmModal;
    const resolvePendingTask = confirmData?.resolvePendingTask ?? true;
    const pendingTaskId = confirmData?.pendingTaskId || pendingTask?._id;

    setStageConfirmModal({ open: false, leadId: null, targetStage: null, previousStage: null, leadName: '', type: null, docsSummary: null, pendingTask: null, leadObj: null });

    if (pendingTaskId) {
      dispatch(completeTask({ taskId: pendingTaskId, isCompleted: true }));
    }

    if (leadId && targetStage) {
      await executeStageChange(leadId, targetStage, previousStage, resolvePendingTask, confirmData);
    }
  };

  const handleCancelStageTransition = () => {
    setStageConfirmModal({ open: false, leadId: null, targetStage: null, previousStage: null, leadName: '', type: null, docsSummary: null, pendingTask: null, leadObj: null });
  };

  useEffect(() => {
    loadData();

    // Live WebSocket real-time synchronization for stage transitions and task changes
    const unsubTask = subscribeToSocketEvent('task:synced', () => {
      dispatch(fetchTasks());
    });
    const unsubStage = subscribeToSocketEvent('lead:stage_updated', () => {
      dispatch(fetchTasks());
      dispatch(fetchLeads());
    });
    const unsubLeadUpdated = subscribeToSocketEvent('lead:updated', () => {
      dispatch(fetchTasks());
      dispatch(fetchLeads());
    });

    return () => {
      unsubTask();
      unsubStage();
      unsubLeadUpdated();
    };
  }, [dispatch]);

  const loadData = async () => {
    dispatch(fetchTasks());
    dispatch(fetchTaskAnalytics());
    dispatch(fetchLeads());
    try {
      const res = await teamApi.getAdvisors();
      setAdvisors(res?.data?.advisors || res?.advisors || []);
    } catch (err) {
      console.error('Failed to fetch advisors:', err);
    }
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      await dispatch(completeTask({ taskId, isCompleted })).unwrap();
      notifySuccess(isCompleted ? 'Task marked as completed.' : 'Task reopened.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to update task completion.');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await dispatch(updateTask({ taskId, taskData })).unwrap();
      setEditTask(null);
      notifySuccess('Task updated successfully.');
    } catch (err) {
      notifyError(err?.message || err?.error || 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask({ taskId })).unwrap();
        notifyInfo('Task removed.');
      } catch (err) {
        notifyError(err?.message || err?.error || 'Failed to delete task.');
      }
    }
  };
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Mortgage Advisors see tasks assigned to them and unassigned tasks; Admins see brokerage-wide tasks
  const advisorScopedTasks = isAdmin
    ? tasks
    : tasks.filter((t) => {
        const advId = t.assignedAdvisorId?._id || t.assignedAdvisorId;
        return !advId || String(advId) === String(currentUserId);
      });

  const counts = {
    total: advisorScopedTasks.filter((t) => !t.isCompleted || (t.completedAt && new Date(t.completedAt) >= sevenDaysAgo) || (!t.completedAt && t.isCompleted)).length,
    overdue: advisorScopedTasks.filter((t) => !t.isCompleted && new Date(t.dueAt) < now).length,
    dueToday: advisorScopedTasks.filter((t) => !t.isCompleted && new Date(t.dueAt) >= startOfDay && new Date(t.dueAt) <= endOfDay).length,
    upcoming: advisorScopedTasks.filter((t) => !t.isCompleted && new Date(t.dueAt) > endOfDay).length,
    completed: advisorScopedTasks.filter((t) => t.isCompleted && (t.completedAt ? new Date(t.completedAt) >= sevenDaysAgo : true)).length,
    archive: advisorScopedTasks.filter((t) => t.isCompleted && t.completedAt && new Date(t.completedAt) < sevenDaysAgo).length,
    totalAll: advisorScopedTasks.length,
  };

  const filteredTasks = advisorScopedTasks.filter((task) => {
    const due = new Date(task.dueAt);
    const completedDate = task.completedAt ? new Date(task.completedAt) : null;
    const isArchived = Boolean(task.isCompleted && completedDate && completedDate < sevenDaysAgo);

    if (activeTab === 'archive') {
      if (!task.isCompleted || !isArchived) return false;
    } else {
      // For all standard operational tabs, hide old archived completed tasks (> 7d)
      if (isArchived) return false;

      if (activeTab === 'overdue' && (task.isCompleted || due >= now)) return false;
      if (activeTab === 'due_today' && (task.isCompleted || due < startOfDay || due > endOfDay)) return false;
      if (activeTab === 'upcoming' && (task.isCompleted || due <= endOfDay)) return false;
      if (activeTab === 'completed' && !task.isCompleted) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const leadName = task.leadId ? `${task.leadId.firstName} ${task.leadId.lastName} ${task.leadId.email}`.toLowerCase() : '';
      if (!`${task.title} ${task.description} ${leadName}`.toLowerCase().includes(q)) return false;
    }

    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    if (isAdmin && advisorFilter !== 'all') {
      if (advisorFilter === 'unassigned') {
        if (task.assignedAdvisorId) return false;
      } else {
        const advId = task.assignedAdvisorId?._id || task.assignedAdvisorId;
        if (String(advId) !== String(advisorFilter)) return false;
      }
    }
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (activeTab === 'archive') {
      const bComp = b.completedAt ? new Date(b.completedAt) : new Date(b.updatedAt || b.createdAt);
      const aComp = a.completedAt ? new Date(a.completedAt) : new Date(a.updatedAt || a.createdAt);
      return bComp - aComp;
    }
    if (sortBy === 'due_soonest') return new Date(a.dueAt) - new Date(b.dueAt);
    if (sortBy === 'most_overdue') return new Date(a.dueAt) - new Date(b.dueAt);
    if (sortBy === 'priority') {
      const pMap = { high: 3, medium: 2, low: 1 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    }
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <Box>
      {/* Top Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.1rem' },
                }}
              >
                Pending Tasks & SLAs
              </Typography>
              <Chip
                label={`${counts.total} Tasks`}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
              />
            </Box>

            {/* Mobile inline refresh button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <Tooltip title="Refresh tasks">
                <IconButton
                  size="small"
                  onClick={loadData}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    p: 0.75,
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    backgroundColor: '#ffffff',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <RefreshCw size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Track due diligence action items, expat outreach deadlines, and bank submission SLAs.
          </Typography>
        </Box>

        {/* Desktop actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            onClick={loadData}
            disabled={loading}
            startIcon={<RefreshCw size={15} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: '#cbd5e1',
              color: '#475569',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Metrics Strip */}
      <TaskMetricsStrip counts={counts} analytics={analytics} activeTab={activeTab} onTabChange={(tab) => dispatch(setActiveTab(tab))} />

      {/* Filter Toolbar */}
      <TaskFilterBar
        activeTab={activeTab}
        onTabChange={(tab) => dispatch(setActiveTab(tab))}
        counts={counts}
        searchQuery={searchQuery}
        onSearchChange={(q) => dispatch(setSearchQuery(q))}
        priorityFilter={priorityFilter}
        onPriorityChange={(p) => dispatch(setPriorityFilter(p))}
        advisorFilter={advisorFilter}
        onAdvisorChange={(a) => dispatch(setAdvisorFilter(a))}
        advisors={advisors}
        sortBy={sortBy}
        onSortChange={(s) => dispatch(setSortBy(s))}
        userRole={userRole}
      />

      {/* Archive Header Banner */}
      {activeTab === 'archive' && (
        <Paper
          elevation={0}
          sx={{
            p: 2.25,
            mb: 2.5,
            borderRadius: 2.5,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #c7d2fe',
              }}
            >
              <Archive size={20} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Task Completion Archive & Historical Audit Trail
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Tasks completed over 7 days ago are automatically archived here to keep operational inboxes focused while maintaining SLA analytics and BaFin compliance audit trails.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${counts.archive} Archived`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: '#ffffff',
                color: '#4338ca',
                border: '1px solid #c7d2fe',
              }}
            />
            {analytics?.avgResolutionHours > 0 && (
              <Chip
                label={`Avg SLA: ${analytics.avgResolutionHours}h`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0',
                }}
              />
            )}
          </Box>
        </Paper>
      )}

      {/* Task List */}
      {loading && tasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress size={36} sx={{ color: '#2563eb' }} />
        </Box>
      ) : filteredTasks.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id || task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onOpenLead={(lead) => setSelectedLead(lead)}
              onEditTask={(t) => setEditTask(t)}
              onDeleteTask={handleDeleteTask}
              userRole={userRole}
            />
          ))}
        </Box>
      ) : (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <Clock size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
            No tasks found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 460, mx: 'auto' }}>
            {activeTab === 'all'
              ? 'No tasks currently scheduled. Operational tasks are automatically generated as leads advance across pipeline stages and SLA rules.'
              : `There are no tasks matching the "${activeTab.replace('_', ' ')}" filter.`}
          </Typography>
        </Paper>
      )}

      {/* Modals & Lead Drawer */}
      {isAdmin && (
        <EditTaskModal
          open={Boolean(editTask)}
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleUpdateTask}
          leads={leads}
          advisors={advisors}
          saving={actionLoading}
        />
      )}

      <LeadDossierDrawer
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        advisors={advisors}
        userRole={userRole}
        currentUserId={currentUserId}
        isAssigningAdvisor={assigningAdvisor}
        onStageChange={handleRequestStageChange}
        onAssignAdvisor={async (leadId, advId) => {
          try {
            await dispatch(assignLeadAdvisor({ leadId, assignedAdvisorId: advId || null })).unwrap();
            notifySuccess('Advisor assignment updated.');
            dispatch(fetchTasks());
          } catch (err) {
            notifyError(err?.message || err?.error || 'Failed to assign advisor.');
          }
        }}
        onConvertToClient={async (leadId) => {
          try {
            const res = await dispatch(convertToClient({ leadId })).unwrap();
            notifySuccess(res?.message || 'Lead converted to Client Portal account (Portal Active). Onboarding invitation email sent.');
          } catch (err) {
            notifyError(err?.message || err?.error || 'Failed to convert lead to client.');
          }
        }}
        onToggleClientStatus={async (clientId, status, reason) => {
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
        }}
        onResolveDuplicate={async (leadId) => {
          try {
            await dispatch(resolveDuplicate({ leadId, action: 'mark_unique' })).unwrap();
            notifySuccess('Duplicate marked as unique.');
          } catch (err) {
            notifyError(err?.message || err?.error || 'Failed to resolve duplicate.');
          }
        }}
        onAddNote={async (leadId, note) => {
          try {
            await dispatch(addLeadNote({ leadId, note })).unwrap();
            notifySuccess('Note added successfully.');
          } catch (err) {
            notifyError(err?.message || err?.error || 'Failed to add note.');
          }
        }}
      />

      <StageTransitionConfirmModal
        open={stageConfirmModal.open}
        data={stageConfirmModal}
        loading={loading}
        onConfirm={handleConfirmStageTransition}
        onCancel={handleCancelStageTransition}
        onOpenDossier={(l) => setSelectedLead(l)}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            minWidth: 300,
            maxWidth: { xs: '90vw', sm: 480 },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksManagementPage;