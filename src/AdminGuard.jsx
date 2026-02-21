import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AdminGuard() {
  const { user, loading } = useAuth();

  
  if (loading) return null;

  
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}