import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" />;
  }

  if (!user.isVerified && user.role !== 'admin') {
    toast.error('Your account is not verified yet');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;