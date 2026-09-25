import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { leadflowTheme } from './theme/theme';
import { fetchCurrentUser } from './redux/thunks/authThunk';
import { getAccessToken } from './services/api/tokenStorage';
import { ROUTES } from './utils/constants/routes';

// Auth Pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Brokerage Admin Pages
import BrokerageAdminDashboard from './pages/admin/BrokerageAdminDashboard';
import TeamManagementPage from './pages/admin/TeamManagementPage';
import IntegrationsPage from './pages/admin/IntegrationsPage';
import AutomationsPage from './pages/admin/AutomationsPage';
// Advisor Pages
import PipelineKanbanPage from './pages/advisor/PipelineKanbanPage';
import TasksManagementPage from './pages/advisor/TasksManagementPage';


// Common / Layouts
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleDashboardPlaceholder from './pages/dashboard/RoleDashboardPlaceholder';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt session re-authentication on cold start only if token is present
    const token = getAccessToken();
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={leadflowTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SIGNIN} replace />} />
          <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

          {/* Protected Platform Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['platform_admin']} />}>
            <Route
              path={ROUTES.PLATFORM_ADMIN_TENANTS}
              element={
                <RoleDashboardPlaceholder
                  roleTitle="Platform Admin"
                  roleKey="platform_admin"
                  description="Global SaaS multi-tenant oversight and broker management dashboard."
                />
              }
            />
          </Route>

          {/* Protected Brokerage Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['brokerage_admin']} />}>
            <Route path={ROUTES.BROKERAGE_ADMIN_DASHBOARD} element={<BrokerageAdminDashboard />} />
            <Route path={ROUTES.BROKERAGE_ADMIN_TEAM} element={<TeamManagementPage />} />
            <Route path={ROUTES.BROKERAGE_ADMIN_INTEGRATIONS} element={<IntegrationsPage />} />
            <Route path={ROUTES.BROKERAGE_ADMIN_AUTOMATIONS} element={<AutomationsPage />} />
          </Route>

          {/* Protected Advisor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['advisor', 'brokerage_admin']} />}>
            <Route
              path={ROUTES.ADVISOR_PIPELINE}
              element={<PipelineKanbanPage />}
            />
            <Route
              path={ROUTES.ADVISOR_TASKS}
              element={<TasksManagementPage />}
            />
          </Route>

          {/* Protected Client Routes */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route
              path={ROUTES.CLIENT_PORTAL}
              element={
                <RoleDashboardPlaceholder
                  roleTitle="Client Portal"
                  roleKey="client"
                  description="Asynchronous document checklist and mortgage application status hub."
                />
              }
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={ROUTES.SIGNIN} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;




