import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';
import Marquee from './Marquee';
import './Dashboard.css';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/subjects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubjects(response.data);
      } catch (error) {
        toast.error('Failed to load subjects');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>StudyBuddy Dashboard</h1>
          <nav className="header-nav">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
          </nav>
          {/* <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button> */}
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {/* <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={closeMobileMenu}>
          <FaTimes />
        </button>
        <nav className="mobile-menu-nav">
          <Link to="/about" onClick={closeMobileMenu}>About</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
          {user?.role === 'admin' && <Link to="/admin" onClick={closeMobileMenu}>Admin Panel</Link>}
        </nav>
      </div> */}

      <Marquee />

      <div className="dashboard-content">
        <h2>Available Subjects</h2>
        {subjects.length === 0 ? (
          <p className="no-subjects">No subjects available yet.</p>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div key={subject._id} className="subject-card">
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <Link to={`/subject/${subject._id}`} className="view-btn">
                  View Materials
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;