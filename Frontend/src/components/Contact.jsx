import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <nav className="nav">
          <div className="nav-brand">
            <Link to="/dashboard">StudyBuddy</Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact" className="active">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="contact-content">
        <section className="contact-hero">
          <div className="container">
            <h1>Contact Us</h1>
            <p>Have questions or feedback? We'd love to hear from you!</p>
          </div>
        </section>

        <section className="contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <h2>Get In Touch</h2>
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div>
                    <h3>Email</h3>
                    <p>karthikstuddybuddy@gmail.com</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div>
                    <h3>Phone</h3>
                    <p>+91 </p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div>
                    <h3>Address</h3>
                    <p>123 Learning Street<br />Education City, EC 12345</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">🕒</div>
                  <div>
                    <h3>Support Hours</h3>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="contact-form">
                <h2>Send us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;