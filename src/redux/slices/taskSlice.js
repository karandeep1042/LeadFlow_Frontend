import { createSlice } from '@reduxjs/toolkit';
import { fetchTasks, fetchTaskAnalytics, createTask, completeTask, updateTask, deleteTask } from '../thunks/taskThunk';

const initialState = {
  tasks: [],
  analytics: null,
  activeTab: 'all', // 'all' | 'overdue' | 'due_today' | 'upcoming' | 'completed' | 'archive'
  searchQuery: '',
  priorityFilter: 'all', // 'all' | 'high' | 'medium' | 'low'
  advisorFilter: 'all', // 'all' | advisorId | 'unassigned'
  sortBy: 'due_soonest', // 'due_soonest' | 'most_overdue' | 'priority' | 'newest'
  loading: false,
  analyticsLoading: false,
  actionLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setPriorityFilter(state, action) {
      state.priorityFilter = action.payload;
    },
    setAdvisorFilter(state, action) {
      state.advisorFilter = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    onTaskCreatedWs(state, action) {
      const incomingTask = action.payload;
      const exists = state.tasks.some((t) => String(t._id || t.id) === String(incomingTask._id || incomingTask.id));
      if (!exists) {
        state.tasks.unshift(incomingTask);
      }
    },
    onTaskUpdatedWs(state, action) {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex((t) => String(t._id || t.id) === String(updatedTask._id || updatedTask.id));
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updatedTask };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data?.tasks || action.payload.data || action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Analytics
      .addCase(fetchTaskAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(fetchTaskAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload.data || action.payload;
      })
      .addCase(fetchTaskAnalytics.rejected, (state) => {
        state.analyticsLoading = false;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newTask = action.payload.data || action.payload;
        if (newTask) {
          state.tasks.unshift(newTask);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Complete / Toggle Task
      .addCase(completeTask.fulfilled, (state, action) => {
        const updated = action.payload.data?.data || action.payload.data;
        const { taskId } = action.payload;
        const index = state.tasks.findIndex((t) => String(t._id || t.id) === String(taskId));
        if (index !== -1) {
          if (updated) {
            state.tasks[index] = updated;
          } else {
            state.tasks[index].isCompleted = !state.tasks[index].isCompleted;
            state.tasks[index].completedAt = state.tasks[index].isCompleted ? new Date().toISOString() : null;
          }
        }
      })

      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const updated = action.payload.data?.data || action.payload.data;
        const { taskId } = action.payload;
        const index = state.tasks.findIndex((t) => String(t._id || t.id) === String(taskId));
        if (index !== -1 && updated) {
          state.tasks[index] = updated;
        }
      })

      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId } = action.payload;
        state.tasks = state.tasks.filter((t) => String(t._id || t.id) !== String(taskId));
      });
  },
});


export const {
  clearTaskError,
  setActiveTab,
  setSearchQuery,
  setPriorityFilter,
  setAdvisorFilter,
  setSortBy,
  onTaskCreatedWs,
  onTaskUpdatedWs,
} = taskSlice.actions;

export default taskSlice.reducer;
