import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tenantReducer from './slices/tenantSlice';
import leadReducer from './slices/leadSlice';
import taskReducer from './slices/taskSlice';
import documentReducer from './slices/documentSlice';
import integrationReducer from './slices/integrationSlice';
import automationReducer from './slices/automationSlice';
import teamReducer from './slices/teamSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    lead: leadReducer,
    task: taskReducer,
    document: documentReducer,
    integration: integrationReducer,
    automation: automationReducer,
    team: teamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
