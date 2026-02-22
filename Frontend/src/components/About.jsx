import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <nav className="nav">
          <div className="nav-brand">
            <Link to="/dashboard">StudyBuddy</Link>
          </div>
          <ul className="nav-links">

            <li><Link to="/about" className="active">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="about-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>About StudyBuddy</h1>
            <p>Empowering students with comprehensive study materials and tools for academic excellence.</p>
          </div>
        </section>

        <section className="mission-section">
          <div className="container">
            <h2>Our Mission</h2>
            <p>
              At StudyBuddy, we believe that every student deserves access to high-quality educational resources.
              Our platform provides a centralized hub for study materials, enabling students to focus on learning
              rather than searching for resources.
            </p>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2>Why Choose StudyBuddy?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Comprehensive Materials</h3>
                <p>Access a wide range of study materials across various subjects and topics.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Community Driven</h3>
                <p>Contribute and benefit from a community of learners and educators.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Private</h3>
                <p>Your data and materials are protected with enterprise-grade security.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Accessible Anywhere</h3>
                <p>Study on any device, anywhere, with our responsive web platform.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="container">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👨‍💻</div>
                {/* <div className="member-avatar"><img src="vite.svg" alt="karthik" /></div> */}
                <h3>Pasam.Karthik Reddy</h3>
                <p>Founder & CEO</p>
                <p>Passionate about education technology and student success.</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍🏫</div>
                <h3>Karthik and Team</h3>
                <p>Head of Content</p>
                <p>Ensuring quality and relevance in all our study materials.</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👨‍🔧</div>
                <h3>Pasam.Karthik Reddy</h3>
                <p>Lead Developer</p>
                <p>Building the technology that powers your learning experience.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;