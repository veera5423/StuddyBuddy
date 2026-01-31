import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    toast.error('Admin access required');
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;