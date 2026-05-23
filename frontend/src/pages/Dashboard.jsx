import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { maskAccountNumber } from '../utils/account';

const MyBankDashboard = ({ onLogout, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return user || (stored ? JSON.parse(stored) : null);
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data.user);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUserData(user);
      }
    };

    fetchUserData();
  }, [user]);

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

  const accountNumber = userData?.accountNumber || userData?.username || '0000000000';

  const transactions = (userData?.transactions || [])
    .slice(-6)
    .reverse()
    .map((tx) => ({
      name: tx.description || tx.type || 'Transaction',
      date: tx.date ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
      amount: tx.amount,
      type: tx.amount < 0 ? 'neg' : 'pos',
      account: maskAccountNumber(tx.account || accountNumber),
      avatar: tx.description ? tx.description.charAt(0).toUpperCase() : tx.type?.charAt(0).toUpperCase() || 'T',
      alt: false
    }));

  const balance = userData?.balance ?? 0;
  const formattedBalance = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const visibleBalance = showBalance ? `$${formattedBalance}` : '****';

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
                <Link to="/dashboard" className="active">
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
                <Link to="/support">
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
                <h1>
                  Hello, {userData?.firstName || 'User'}
                  <span className="wave">👋</span>
                </h1>
                <p className="subheading">Account No: {accountNumber}</p>
                <p>Welcome back. Here’s a quick look at your money today.</p>
              </div>
            </div>
            <div className="header-right">
              <div className="pill-balance">
                Balance:
                <strong style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{visibleBalance}</strong>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowBalance((prev) => !prev)}>
                {showBalance ? 'Hide' : 'Show'} Balance
              </button>
              <button className="btn btn-secondary">
                <span>⚙️</span> Settings
              </button>
              <Link to="/payment" className="btn btn-primary">
                <span>➕</span> New Transfer
              </Link>
            </div>
          </header>

          <section className="top-grid">
            <div className="card" style={{ animationDelay: '0.05s' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Card Balance</div>
                  <div className="card-value" style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{showBalance ? `$${formattedBalance}` : '****'}</div>
                </div>
                <div className="chip">
                  <span className="dot"></span>
                  Active • Visa **** 2345
                </div>
              </div>
              <div className="stat-row">
                <span>Spending this month</span>
                <span className="stat-pill">
                  <span className="arrow">▲</span>
                  +17% vs last month
                </span>
              </div>
            </div>

            <div className="card" style={{ animationDelay: '0.12s' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Quick Stats</div>
                </div>
              </div>
              <div className="stat-row">
                <span>Total Income</span>
                <span>$85,992</span>
              </div>
              <div className="stat-row">
                <span>Total Expense</span>
                <span>$38,160</span>
              </div>
              <div className="stat-row">
                <span>Savings</span>
                <span>$47,832</span>
              </div>
            </div>
          </section>

          <section className="top-grid" style={{ marginTop: '4px' }}>
            <div className="card" style={{ animationDelay: '0.18s' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Total Income</div>
                  <div className="card-value">$85,992</div>
                </div>
                <span className="stat-pill">
                  <span className="arrow">▲</span>
                  +17%
                </span>
              </div>
              <div className="stat-row">
                <span>From salary, clients & more</span>
                <span className="muted">Last 30 days</span>
              </div>
            </div>

            <div className="card" style={{ animationDelay: '0.24s' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Total Expense</div>
                  <div className="card-value">$38,160</div>
                </div>
                <span className="stat-pill negative">
                  <span className="arrow">▼</span>
                  -44%
                </span>
              </div>
              <div className="stat-row">
                <span>Bills, shopping, subscriptions</span>
                <span className="muted">Last 30 days</span>
              </div>
            </div>
          </section>

          <section className="transactions">
            <h2>
              Recent Transactions
              <span className="badge">Today & yesterday</span>
            </h2>
            <div className="transaction-list" style={{ animationDelay: '0.3s' }}>
              {transactions.length === 0 ? (
                <div className="transaction empty">
                  <div className="details">
                    <span className="name">No recent transactions yet.</span>
                    <span className="date">Your latest transfers will appear here.</span>
                  </div>
                </div>
              ) : (
                transactions.map((tx, i) => (
                  <div key={i} className="transaction">
                    <div className="transaction-left">
                      <div className={`avatar ${tx.alt ? 'alt' : ''}`}>{tx.avatar}</div>
                      <div className="details">
                        <span className="name">{tx.name}</span>
                        <span className="date">{tx.date}</span>
                        <span className="date">Account: {tx.account}</span>
                      </div>
                    </div>
                    <div className={`amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyBankDashboard;
