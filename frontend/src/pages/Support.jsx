import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Support = ({ onLogout, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 820);
  const [isMobile, setIsMobile] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 820;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
      if (!mobile) {
        setOverlayActive(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setOverlayActive((prev) => !prev);
    }
  };

  const closeOverlay = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    setOverlayActive(false);
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm({ name: '', email: '', topic: '', message: '' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    resetForm();
    window.alert('Message sent! This is demo behavior and will not be delivered.');
  };

  const accountNumber = user?.accountNumber || user?.username || '0000000000';
  const balance = user?.balance ?? 0;
  const visibleBalance = showBalance ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****';

  return (
    <div className="dashboard">
      <div className={`overlay ${((sidebarOpen && isMobile) || overlayActive) ? 'active' : ''}`} onClick={closeOverlay} />

      <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div>
          <div className="logo">
            <div className="logo-icon">MB</div>
            <div className="logo-text">MyBank</div>
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/dashboard">
                  <span className="icon">🏠</span>
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link to="/payment">
                  <span className="icon">💸</span>
                  <span>Payment / Transfer</span>
                </Link>
              </li>
              <li>
                <Link to="/history">
                  <span className="icon">📜</span>
                  <span>Transaction History</span>
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <span className="icon">👤</span>
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className="active">
                  <span className="icon">💬</span>
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="theme-switch">
            <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
              ☀️ Light
            </button>
            <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
              🌙 Dark
            </button>
          </div>

          <button className="signout" onClick={onLogout}>
            <span className="icon">⎋</span>
            <span>Sign Out</span>
          </button>
          <div className="sidebar-meta">Secure • Encrypted • v1.0</div>
        </div>
      </aside>

      <main className="main">
        <div className="main-inner">
          <header className="header">
            <div className="header-left">
              <button className="hamburger" onClick={toggleSidebar}>
                ☰
              </button>
              <div>
                <h1>Support Center</h1>
                <p>How can we help you today? Browse FAQs, contact support, or start a chat.</p>
              </div>
            </div>
            <div className="header-right header-pill-row">
              <span className="pill pill-muted" style={{ color: balance < 0 ? '#fca5a5' : undefined }}>Balance: {visibleBalance}</span>
              <span className="pill pill-muted">Account No: {accountNumber}</span>
              <button type="button" className="pill pill-secondary" onClick={() => setShowBalance((prev) => !prev)}>
                {showBalance ? 'Hide' : 'Show'} Balance
              </button>
              <button type="button" className="pill pill-secondary">Help Topics</button>
              <button type="button" className="pill pill-primary">Contact Us</button>
            </div>
          </header>

          <section className="support-layout">
            <div className="support-main">
              <div className="card faq-card">
                <div className="card-title">Frequently Asked Questions</div>
                <div className="faq-list">
                  <button type="button" className="faq-item">
                    <span>How do I reset my password?</span>
                    <span>+</span>
                  </button>
                  <button type="button" className="faq-item">
                    <span>How long do transfers take?</span>
                    <span>+</span>
                  </button>
                  <button type="button" className="faq-item">
                    <span>How do I dispute a transaction?</span>
                    <span>+</span>
                  </button>
                  <button type="button" className="faq-item">
                    <span>Is my data secure?</span>
                    <span>+</span>
                  </button>
                </div>
              </div>

              <div className="card contact-card">
                <div className="card-title">Contact Support</div>
                <div className="card-subtitle">Send us a message and our support team will reply within 24 hours (demo behavior).</div>
                <form className="support-form" onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>Your name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="E.g. Darrell Steward"
                    />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="input-group">
                    <label>Topic</label>
                    <select value={form.topic} onChange={handleChange('topic')}>
                      <option value="">Select topic</option>
                      <option value="login">Account access</option>
                      <option value="transfer">Transfer issue</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Message</label>
                    <textarea
                      value={form.message}
                      onChange={handleChange('message')}
                      placeholder="Describe your issue..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>Reset</button>
                    <button type="submit" className="btn btn-primary">Send Message</button>
                  </div>
                  <p className="privacy-note">We respect your privacy. Do not share sensitive info like full card numbers.</p>
                </form>
              </div>
            </div>

            <aside className="support-side">
              <div className="card contact-methods-card">
                <div className="card-title">Contact Methods</div>
                <div className="contact-method">
                  <div className="contact-icon">💬</div>
                  <div>
                    <p><strong>Live Chat</strong></p>
                    <p className="side-text">Available 24/7 — click the chat bubble.</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div>
                    <p><strong>Email Support</strong></p>
                    <p className="side-text">support@mybank.example (demo)</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <div>
                    <p><strong>Phone</strong></p>
                    <p className="side-text">+234 800 000 0000 (Mon–Fri)</p>
                  </div>
                </div>
              </div>

              <div className="card security-card">
                <div className="card-title">Security Tips</div>
                <ul>
                  <li>Never share your password or OTP.</li>
                  <li>Enable two-factor authentication in Profile → Security.</li>
                  <li>Review transactions regularly and report suspicious activity.</li>
                </ul>
              </div>

              <div className="card hours-card">
                <div className="card-title">Support Hours</div>
                <p className="card-subtitle">Our response times (demo):</p>
                <div className="support-hour-row">
                  <span>Live chat</span>
                  <strong>24/7</strong>
                </div>
                <div className="support-hour-row">
                  <span>Email</span>
                  <strong>Within 24 hours</strong>
                </div>
                <div className="support-hour-row">
                  <span>Phone</span>
                  <strong>Mon–Fri 9am–6pm</strong>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Support;
