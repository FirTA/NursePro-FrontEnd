// RequireRole.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireRole = ({ children, roles }) => {
  const { auth } = useAuth();
  
  const userRole = auth?.user?.role?.toLowerCase() || auth?.role?.toLowerCase() || '';
  
  if (!roles.includes(userRole)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default RequireRole;