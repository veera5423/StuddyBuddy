import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUsers, FaBook, FaFileAlt, FaDownload, FaPlus, FaTrash } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [uploadData, setUploadData] = useState({ subjectId: '', title: '', description: '', file: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [analyticsRes, usersRes, subjectsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/subjects`, { headers })
      ]);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User verified successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    
    if (!newSubject.name.trim()) {
      toast.error('Subject name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/subjects`, newSubject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Subject added successfully');
      setNewSubject({ name: '', description: '' });
      setShowAddSubject(false);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to add subject';
      toast.error(message);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject and all its materials?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Subject deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    
    if (!uploadData.subjectId) {
      toast.error('Please select a subject');
      return;
    }
    
    if (!uploadData.file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/subjects/${uploadData.subjectId}/materials`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Material uploaded successfully');
      setUploadData({ subjectId: '', title: '', description: '', file: null });
      setShowUploadMaterial(false);
      setIsUploading(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload material';
      toast.error(message);
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="admin-content">
        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <FaUsers className="card-icon" />
            <div className="card-content">
              <h3>{analytics.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="analytics-card">
            <FaUsers className="card-icon" />
            <div className="card-content">
              <h3>{analytics.verifiedUsers}</h3>
              <p>Verified Users</p>
            </div>
          </div>
          <div className="analytics-card">
            <FaBook className="card-icon" />
            <div className="card-content">
              <h3>{analytics.totalSubjects}</h3>
              <p>Total Subjects</p>
            </div>
          </div>
          <div className="analytics-card">
            <FaFileAlt className="card-icon" />
            <div className="card-content">
              <h3>{analytics.totalMaterials}</h3>
              <p>Total Materials</p>
            </div>
          </div>
          <div className="analytics-card">
            <FaDownload className="card-icon" />
            <div className="card-content">
              <h3>{analytics.totalDownloads}</h3>
              <p>Total Downloads</p>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="admin-section">
          <h2>User Management</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.isVerified ? 'Yes' : 'No'}</td>
                    <td>
                      {!user.isVerified && user.role !== 'admin' && (
                        <button 
                          onClick={() => handleVerifyUser(user._id)}
                          className="verify-btn"
                        >
                          Verify
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Management */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Subject Management</h2>
            <button 
              onClick={() => setShowAddSubject(!showAddSubject)}
              className="add-btn"
            >
              <FaPlus /> Add Subject
            </button>
          </div>

          {showAddSubject && (
            <form onSubmit={handleAddSubject} className="add-subject-form">
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={newSubject.description}
                onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
              />
              <div className="form-actions">
                <button type="submit">Add Subject</button>
                <button type="button" onClick={() => setShowAddSubject(false)}>Cancel</button>
              </div>
            </form>
          )}

          <div className="subjects-list">
            {subjects.map((subject) => (
              <div key={subject._id} className="subject-item">
                <div className="subject-info">
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                </div>
                <button 
                  onClick={() => handleDeleteSubject(subject._id)}
                  className="delete-btn"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Material Upload */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Material Upload</h2>
            <button 
              onClick={() => setShowUploadMaterial(!showUploadMaterial)}
              className="add-btn"
            >
              <FaPlus /> Upload Material
            </button>
          </div>

          {showUploadMaterial && (
            <form onSubmit={handleUploadMaterial} className="upload-material-form">
              {subjects.length === 0 ? (
                <p style={{ color: 'red' }}>No subjects available. Please add a subject first.</p>
              ) : (
                <select
                  value={uploadData.subjectId}
                  onChange={(e) => setUploadData({...uploadData, subjectId: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
              )}
              <input
                type="text"
                placeholder="Material Title"
                value={uploadData.title}
                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={uploadData.description}
                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                required
              />
              <div className="form-actions">
                <button type="submit" disabled={subjects.length === 0 || isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                <button type="button" onClick={() => setShowUploadMaterial(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;