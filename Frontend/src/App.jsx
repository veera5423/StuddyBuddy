import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import SubjectMaterials from './components/SubjectMaterials';
import PDFViewer from './components/PDFViewer';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const showFooter = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/subject/:subjectId" element={
          <ProtectedRoute>
            <SubjectMaterials />
          </ProtectedRoute>
        } />
        <Route path="/pdf/:materialId" element={
          <ProtectedRoute>
            <PDFViewer />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      {showFooter && <Footer />}
      <ToastContainer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;