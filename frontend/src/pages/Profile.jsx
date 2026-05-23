import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import './Profile.css';
import { maskAccountNumber } from '../utils/account';

const Profile = ({ onLogout, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 820);
  const [isMobile, setIsMobile] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 820;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeOverlay = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const accountNumber = user?.accountNumber || user?.username || '0000000000';
  const balance = user?.balance ?? 0;
  const visibleBalance = showBalance ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '****';

  return (
    <div className="dashboard">
      <div className={`overlay ${sidebarOpen && isMobile ? 'active' : ''}`} onClick={closeOverlay} />
      <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div>
          <div className="logo">
            <div className="logo-icon">MB</div>
            <span className="logo-text">MyBank</span>
          </div>
          <nav>
            <ul>
              <li><Link to="/dashboard">🏠 Overview</Link></li>
              <li><Link to="/payment">💸 Payment / Transfer</Link></li>
              <li><Link to="/history">📜 Transaction History</Link></li>
              <li><Link to="/profile" className="active">👤 Profile</Link></li>
              <li><Link to="/support">💬 Support</Link></li>
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
              <div>
                <h1>Your Profile</h1>
                <p>Manage your personal information and account settings.</p>
              </div>
            </div>
            <div className="header-right">
              <div className="pill-balance">Balance: <strong style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{visibleBalance}</strong></div>
              <button className="btn btn-secondary" onClick={() => setShowBalance((prev) => !prev)}>
                {showBalance ? 'Hide' : 'Show'} Balance
              </button>
              <button className="btn btn-secondary">Security</button>
              <button className="btn btn-primary">Edit</button>
            </div>
          </header>

          <div className="profile-grid">
          <section className="profile-main-card">
            <div className="card-top-row">
              <div className="hero-section">
                <div className="avatar-large">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  <span className="avatar-glow"></span>
                </div>
                <div className="hero-text">
                  <h2>{user?.firstName} {user?.lastName}</h2>
                  <p>{user?.role || 'User'}</p>
                  <small>Account No: {accountNumber} • Member since 2019 • Verified</small>
                </div>
              </div>
              <div className="hero-actions">
                <button className="btn btn-secondary">Change Avatar</button>
                <button className="btn btn-secondary">Export</button>
              </div>
            </div>

            <div className="fields-grid">
              <div className="input-field">
                <label>Full Name</label>
                <input type="text" defaultValue={`${user?.firstName} ${user?.lastName}`} />
              </div>
              <div className="input-field">
                <label>Role</label>
                <input type="text" defaultValue={user?.role || 'User'} />
              </div>
              <div className="input-field">
                <label>Email Address</label>
                <input type="text" defaultValue={user?.email} />
              </div>
              <div className="input-field">
                <label>Phone Number</label>
                <input type="text" defaultValue={user?.phone || "+234 801 234 5678"} />
              </div>
              <div className="input-field">
                <label>Country</label>
                <input type="text" defaultValue="Nigeria" />
              </div>
              <div className="input-field">
                <label>City</label>
                <input type="text" defaultValue="Abeokuta" />
              </div>
            </div>

            <div className="input-field bio-field">
              <label>Bio</label>
              <textarea defaultValue="Designer focused on clean interfaces and delightful micro-interactions."></textarea>
            </div>

            <div className="footer-note">
              Changes are saved locally in this demo. Connect to your backend to persist.
            </div>

            <div className="action-row">
              <button className="btn btn-secondary">Reset</button>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </section>

          <aside className="profile-side-card">
            <div className="side-card-header">
              <div>
                <h3>Account</h3>
                <p>Overview & settings</p>
              </div>
              <button className="icon-button">⚙️</button>
            </div>

            <div className="account-summary">
              <span className="summary-value" style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{visibleBalance}</span>
              <p>Current balance</p>
            </div>
            <div className="account-summary" style={{ marginTop: '14px' }}>
              <span className="summary-value">{accountNumber}</span>
              <p>Account number</p>
            </div>

            <div className="mini-list">
              <div className="mini-item">
                <span>2</span>
                <div>
                  <p>Linked cards</p>
                  <button className="link-button">Manage</button>
                </div>
              </div>
              <div className="mini-item">
                <span>5</span>
                <div>
                  <p>Saved beneficiaries</p>
                  <button className="link-button">View</button>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }}>Change Password</button>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Close Account</button>
          </aside>
        </div>
      </div>
      </main>
    </div>
  );
};

export default Profile;
