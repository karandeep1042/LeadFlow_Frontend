import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress, Snackbar, Paper, Chip } from '@mui/material';
import { Plus, RefreshCw, CheckSquare, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  fetchTasks, createTask, completeTask, updateTask, deleteTask,
} from '../../redux/thunks/taskThunk';
import {
  setActiveTab, setSearchQuery, setPriorityFilter, setAdvisorFilter, setSortBy,
} from '../../redux/slices/taskSlice';
import {
  fetchLeads, updateLeadStage, assignLeadAdvisor, convertToClient, resolveDuplicate, addLeadNote,
} from '../../redux/thunks/leadThunk';
import teamApi from '../../services/api/teamApi';

import TaskMetricsStrip from './components/TaskMetricsStrip';
import TaskFilterBar from './components/TaskFilterBar';
import TaskCard from './components/TaskCard';
import CreateTaskModal from './components/CreateTaskModal';
import EditTaskModal from './components/EditTaskModal';
import LeadDossierDrawer from './components/LeadDossierDrawer';

export const TasksManagementPage = () => {
  const dispatch = useDispatch();
  const { role: userRole } = useSelector((state) => state.auth);
  const {
    tasks, activeTab, searchQuery, priorityFilter, advisorFilter,
    sortBy, loading, actionLoading,
  } = useSelector((state) => state.task);
  const { leads, assigningAdvisor } = useSelector((state) => state.lead);

  const [advisors, setAdvisors] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const notify = (msg) => setToastMsg(msg);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    dispatch(fetchTasks());
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
      notify(isCompleted ? 'Task marked as completed! 🎯' : 'Task reopened.');
    } catch (err) {
      notify('Failed to update task completion.');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      setCreateModalOpen(false);
      notify('New mortgage task registered successfully.');
    } catch (err) {
      notify('Failed to create task.');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await dispatch(updateTask({ taskId, taskData })).unwrap();
      setEditTask(null);
      notify('Task updated successfully.');
    } catch (err) {
      notify('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask({ taskId })).unwrap();
        notify('Task removed.');
      } catch (err) {
        notify('Failed to delete task.');
      }
    }
  };
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const counts = {
    total: tasks.length,
    overdue: tasks.filter((t) => !t.isCompleted && new Date(t.dueAt) < now).length,
    dueToday: tasks.filter((t) => !t.isCompleted && new Date(t.dueAt) >= startOfDay && new Date(t.dueAt) <= endOfDay).length,
    upcoming: tasks.filter((t) => !t.isCompleted && new Date(t.dueAt) > endOfDay).length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  const filteredTasks = tasks.filter((task) => {
    const due = new Date(task.dueAt);
    if (activeTab === 'overdue' && (task.isCompleted || due >= now)) return false;
    if (activeTab === 'due_today' && (task.isCompleted || due < startOfDay || due > endOfDay)) return false;
    if (activeTab === 'upcoming' && (task.isCompleted || due <= endOfDay)) return false;
    if (activeTab === 'completed' && !task.isCompleted) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const leadName = task.leadId ? `${task.leadId.firstName} ${task.leadId.lastName} ${task.leadId.email}`.toLowerCase() : '';
      if (!`${task.title} ${task.description} ${leadName}`.toLowerCase().includes(q)) return false;
    }

    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    if (advisorFilter !== 'all') {
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
    <DashboardLayout>
      {/* Top Header */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' } }}>
              Pending Tasks & SLAs
            </Typography>
            <Chip label={`${counts.total} Tasks`} color="primary" size="small" sx={{ fontWeight: 700 }} />
          </Box>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Track due diligence action items, expat outreach deadlines, and bank submission SLAs.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" onClick={loadData} startIcon={<RefreshCw size={15} />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#475569' }}>
            Refresh
          </Button>
          <Button variant="contained" onClick={() => setCreateModalOpen(true)} startIcon={<Plus size={16} />} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 2.5 }}>
            + Create Task
          </Button>
        </Box>
      </Box>

      {/* Metrics Strip */}
      <TaskMetricsStrip counts={counts} activeTab={activeTab} onTabChange={(tab) => dispatch(setActiveTab(tab))} />

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
            />
          ))}
        </Box>
      ) : (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <Clock size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
            No tasks found
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 400, mx: 'auto', mb: 2.5 }}>
            {activeTab === 'all'
              ? 'There are no active or completed tasks in this view. Click below to add a new task.'
              : `There are no tasks matching the "${activeTab.replace('_', ' ')}" filter.`}
          </Typography>
          <Button variant="contained" onClick={() => setCreateModalOpen(true)} startIcon={<Plus size={16} />} sx={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Create Task
          </Button>
        </Paper>
      )}

      {/* Modals & Lead Drawer */}
      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateTask}
        leads={leads}
        advisors={advisors}
        saving={actionLoading}
      />

      <EditTaskModal
        open={Boolean(editTask)}
        task={editTask}
        onClose={() => setEditTask(null)}
        onSave={handleUpdateTask}
        leads={leads}
        advisors={advisors}
        saving={actionLoading}
      />

      <LeadDossierDrawer
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        advisors={advisors}
        userRole={userRole}
        isAssigningAdvisor={assigningAdvisor}
        onStageChange={async (leadId, stage, prevStage) => {
          await dispatch(updateLeadStage({ leadId, stage, previousStage: prevStage })).unwrap();
          notify(`Lead stage updated to ${stage}`);
          dispatch(fetchTasks());
        }}
        onAssignAdvisor={async (leadId, advId) => {
          await dispatch(assignLeadAdvisor({ leadId, assignedAdvisorId: advId || null })).unwrap();
          notify('Advisor assignment updated.');
          dispatch(fetchTasks());
        }}
        onConvertToClient={async (leadId) => {
          await dispatch(convertToClient({ leadId })).unwrap();
          notify('Lead converted to Client Portal account.');
        }}
        onResolveDuplicate={async (leadId) => {
          await dispatch(resolveDuplicate({ leadId, action: 'mark_unique' })).unwrap();
          notify('Duplicate marked as unique.');
        }}
        onAddNote={async (leadId, note) => {
          await dispatch(addLeadNote({ leadId, note })).unwrap();
        }}
      />

      <Snackbar open={Boolean(toastMsg)} autoHideDuration={3500} onClose={() => setToastMsg('')} message={toastMsg} />
    </DashboardLayout>
  );
};

export default TasksManagementPage;