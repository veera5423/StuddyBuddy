import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const date = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>StudyBuddy</h3>
          <p>Your ultimate companion for academic success. Access study materials, track progress, and excel in your studies.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="mailto:support@studybuddy.com">karthikstuddybuddy@gmail.com</a></li>
            <li><a href="tel:+91 6309792090">+91 6309792090</a></li>
          </ul>
        </div>
        
      </div>
      <div className="footer-bottom">
        <p>&copy; {date} StudyBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;