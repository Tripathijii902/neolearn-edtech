import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  // If not logged in, redirect to home (where they can open auth modal)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If route is restricted by role, check if user has the role
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role.toLowerCase())) {
    // If student tries to access instructor route, kick to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
