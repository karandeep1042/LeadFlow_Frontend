import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../utils/constants/routes';
import AuthLoadingScreen from './AuthLoadingScreen';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, role, loading, isCheckingAuth } = useSelector((state) => state.auth);
  const location = useLocation();

  // If initial auth verification or async session check is ongoing, display loader instead of premature redirect
  if (isCheckingAuth || (loading && !isAuthenticated)) {
    return <AuthLoadingScreen message="Verifying secure LeadFlow session..." />;
  }

  // If unauthenticated after check completes, redirect to sign-in while preserving original location
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }

  // Mandatory First-Time Password Reset Guard
  if (user?.mustChangePassword) {
    return <Navigate to={ROUTES.SET_INITIAL_PASSWORD} replace />;
  }

  // If user does not have permission for this route
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
