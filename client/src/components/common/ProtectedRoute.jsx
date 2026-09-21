import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label={requireAdmin ? 'Verifying administrator privileges...' : 'Checking authentication...'} />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: requireAdmin
            ? 'Administrator privileges required. Please sign in with an admin account.'
            : 'Please sign in to access this page.',
        }}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Access denied. You must be signed in with an administrator account to view the admin panel.',
        }}
        replace
      />
    );
  }

  return children;
};
