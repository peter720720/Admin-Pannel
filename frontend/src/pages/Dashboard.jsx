// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import API_URL from '../api';
// import './Dashboard.css';
// import { maskAccountNumber } from '../utils/account';

// const MyBankDashboard = ({ onLogout, user }) => {
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [overlayActive, setOverlayActive] = useState(false);
//   const [showBalance, setShowBalance] = useState(true);
//   const [userData, setUserData] = useState(() => {
//     const stored = localStorage.getItem('userData');
//     return user || (stored ? JSON.parse(stored) : null);
//   });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('userToken');
//         if (!token) return;

//         const response = await axios.get(`${API_URL}/api/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserData(response.data.user);
//         localStorage.setItem('userData', JSON.stringify(response.data.user));
//       } catch (err) {
//         console.error('Failed to fetch user data:', err);
//         setUserData(user);
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   useEffect(() => {
//     document.body.classList.toggle('light-mode', !isDarkMode);
//   }, [isDarkMode]);

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 820;
//       setIsMobile(mobile);
//       setSidebarOpen(!mobile);
//       if (!mobile) {
//         setOverlayActive(false);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     if (isMobile) {
//       setSidebarOpen((prev) => !prev);
//     } else {
//       setOverlayActive((prev) => !prev);
//     }
//   };

//   const closeOverlay = () => {
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//     setOverlayActive(false);
//   };

//   const accountNumber = userData?.accountNumber || userData?.username || '0000000000';

//   const transactions = (userData?.transactions || [])
//     .slice(-6)
//     .reverse()
//     .map((tx) => ({
//       name: tx.description || tx.type || 'Transaction',
//       date: tx.date ? new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
//       amount: tx.amount,
//       type: tx.amount < 0 ? 'neg' : 'pos',
//       account: maskAccountNumber(tx.account || accountNumber),
//       avatar: tx.description ? tx.description.charAt(0).toUpperCase() : tx.type?.charAt(0).toUpperCase() || 'T',
//       alt: false
//     }));

//   const balance = userData?.balance ?? 0;
//   const formattedBalance = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//   const visibleBalance = showBalance ? `$${formattedBalance}` : '****';

//   return (
//     <div className="dashboard">
//       <div className={`overlay ${((sidebarOpen && isMobile) || overlayActive) ? 'active' : ''}`} onClick={closeOverlay} />

//       <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
//         <div>
//           <div className="logo">
//             <div className="logo-icon">MB</div>
//             <div className="logo-text">MyBank</div>
//           </div>
//           <nav>
//             <ul>
//               <li>
//                 <Link to="/dashboard" className="active">
//                   <span className="icon">🏠</span>
//                   <span>Overview</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/payment">
//                   <span className="icon">💸</span>
//                   <span>Payment / Transfer</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/history">
//                   <span className="icon">📜</span>
//                   <span>Transaction History</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/profile">
//                   <span className="icon">👤</span>
//                   <span>Profile</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/support">
//                   <span className="icon">💬</span>
//                   <span>Support</span>
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>

//         <div className="sidebar-footer">
//           <div className="theme-switch">
//             <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
//               ☀️ Light
//             </button>
//             <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
//               🌙 Dark
//             </button>
//           </div>

//           <button className="signout" onClick={onLogout}>
//             <span className="icon">⎋</span>
//             <span>Sign Out</span>
//           </button>
//           <div className="sidebar-meta">Secure • Encrypted • v1.0</div>
//         </div>
//       </aside>

//       <main className="main">
//         <div className="main-inner">
//           <header className="header">
//             <div className="header-left">
//               <button className="hamburger" onClick={toggleSidebar}>
//                 ☰
//               </button>
//               <div>
//                 <h1>
//                   Hello, {userData?.firstName || 'User'}
//                   <span className="wave">👋</span>
//                 </h1>
//                 <p className="subheading">Account No: {accountNumber}</p>
//                 <p>Welcome back. Here’s a quick look at your money today.</p>
//               </div>
//             </div>
//             <div className="header-right">
//               <div className="pill-balance">
//                 Balance:
//                 <strong style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{visibleBalance}</strong>
//               </div>
//               <button className="btn btn-secondary" onClick={() => setShowBalance((prev) => !prev)}>
//                 {showBalance ? 'Hide' : 'Show'} Balance
//               </button>
//               <button className="btn btn-secondary">
//                 <span>⚙️</span> Settings
//               </button>
//               <Link to="/payment" className="btn btn-primary">
//                 <span>➕</span> New Transfer
//               </Link>
//             </div>
//           </header>

//           <section className="top-grid">
//             <div className="card" style={{ animationDelay: '0.05s' }}>
//               <div className="card-header">
//                 <div>
//                   <div className="card-title">Card Balance</div>
//                   <div className="card-value" style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{showBalance ? `$${formattedBalance}` : '****'}</div>
//                 </div>
//                 <div className="chip">
//                   <span className="dot"></span>
//                   Active • Visa **** 2345
//                 </div>
//               </div>
//               <div className="stat-row">
//                 <span>Spending this month</span>
//                 <span className="stat-pill">
//                   <span className="arrow">▲</span>
//                   +17% vs last month
//                 </span>
//               </div>
//             </div>

//             <div className="card" style={{ animationDelay: '0.12s' }}>
//               <div className="card-header">
//                 <div>
//                   <div className="card-title">Quick Stats</div>
//                 </div>
//               </div>
//               <div className="stat-row">
//                 <span>Total Income</span>
//                 <span>$85,992</span>
//               </div>
//               <div className="stat-row">
//                 <span>Total Expense</span>
//                 <span>$38,160</span>
//               </div>
//               <div className="stat-row">
//                 <span>Savings</span>
//                 <span>$47,832</span>
//               </div>
//             </div>
//           </section>

//           <section className="top-grid" style={{ marginTop: '4px' }}>
//             <div className="card" style={{ animationDelay: '0.18s' }}>
//               <div className="card-header">
//                 <div>
//                   <div className="card-title">Total Income</div>
//                   <div className="card-value">$85,992</div>
//                 </div>
//                 <span className="stat-pill">
//                   <span className="arrow">▲</span>
//                   +17%
//                 </span>
//               </div>
//               <div className="stat-row">
//                 <span>From salary, clients & more</span>
//                 <span className="muted">Last 30 days</span>
//               </div>
//             </div>

//             <div className="card" style={{ animationDelay: '0.24s' }}>
//               <div className="card-header">
//                 <div>
//                   <div className="card-title">Total Expense</div>
//                   <div className="card-value">$38,160</div>
//                 </div>
//                 <span className="stat-pill negative">
//                   <span className="arrow">▼</span>
//                   -44%
//                 </span>
//               </div>
//               <div className="stat-row">
//                 <span>Bills, shopping, subscriptions</span>
//                 <span className="muted">Last 30 days</span>
//               </div>
//             </div>
//           </section>

//           <section className="transactions">
//             <h2>
//               Recent Transactions
//               <span className="badge">Today & yesterday</span>
//             </h2>
//             <div className="transaction-list" style={{ animationDelay: '0.3s' }}>
//               {transactions.length === 0 ? (
//                 <div className="transaction empty">
//                   <div className="details">
//                     <span className="name">No recent transactions yet.</span>
//                     <span className="date">Your latest transfers will appear here.</span>
//                   </div>
//                 </div>
//               ) : (
//                 transactions.map((tx, i) => (
//                   <div key={i} className="transaction">
//                     <div className="transaction-left">
//                       <div className={`avatar ${tx.alt ? 'alt' : ''}`}>{tx.avatar}</div>
//                       <div className="details">
//                         <span className="name">{tx.name}</span>
//                         <span className="date">{tx.date}</span>
//                         <span className="date">Account: {tx.account}</span>
//                       </div>
//                     </div>
//                     <div className={`amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
//                       {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MyBankDashboard;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import './Dashboard.css';
import { maskAccountNumber } from '../utils/account';

const MyBankDashboard = ({ onLogout, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Custom view states for mobile interactions
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState('home'); // 'home', 'transfer', 'history', 'support', 'profile'

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return user || (stored ? JSON.parse(stored) : null);
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get(`${API_URL}/api/auth/me`, {
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

  // Navigation controller for desktop vs mobile actions
  const handleNavClick = (viewName) => {
    if (isMobile) {
      setActiveMobileView(viewName);
      window.scrollTo(0, 0); // Scroll smoothly to the top of the phone container
    }
  };

  return (
    <div className="dashboard">
      <div className={`overlay ${((sidebarOpen && isMobile) || overlayActive) ? 'active' : ''}`} onClick={closeOverlay} />

      {/* --- SIDEBAR DESKTOP VIEW --- */}
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

      {/* --- MAIN WORKSPACE --- */}
      <main className="main">
        <div className="main-inner">

          {/* USER GREETING LAYER (Always fixed at the absolute top) */}
          <header className="header">
            <div className="header-left">
              <button className="hamburger" onClick={toggleSidebar}>
                ☰
              </button>
              <div className="user-profile-summary">
                <h1>
                  Hello, {userData?.firstName || 'User'}
                  <span className="wave">👋</span>
                </h1>
                <p className="subheading">Account No: {accountNumber}</p>
                <p className="welcome-text">Welcome back. Here’s a quick look at your money today.</p>
              </div>
            </div>

            <div className="header-right">
              <div className="pill-balance" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>Balance:</span>
                <strong style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{visibleBalance}</strong>
              </div>

              <button className="btn btn-secondary" onClick={() => setShowBalance((prev) => !prev)}>
                {showBalance ? 'Hide' : 'Show'} Balance
              </button>

              {/* Dropdown triggered via Symbol Button click */}
              <div className="settings-dropdown-wrapper">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                >
                  <span>⚙️</span> Settings
                </button>
                {showSettingsDropdown && (
                  <div className="settings-list-popup">
                    <button onClick={() => { handleNavClick('profile'); setShowSettingsDropdown(false); }}>👤 View Profile</button>
                    <button onClick={() => { handleNavClick('support'); setShowSettingsDropdown(false); }}>💬 Help & Support</button>
                    <button onClick={() => { setIsDarkMode(!isDarkMode); setShowSettingsDropdown(false); }}>
                      {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <hr />
                    <button className="logout-action" onClick={onLogout}>⎋ Sign Out</button>
                  </div>
                )}
              </div>

              <button onClick={() => handleNavClick('transfer')} className="btn btn-primary">
                <span>➕</span> New Transfer
              </button>
            </div>
          </header>

          {/* DYNAMIC VIEW CONTAINER MATCHING SELECTED BUTTONS */}
          {(!isMobile || activeMobileView === 'home') && (
            <>
              {/* PRIMARY CARDS */}
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

              {/* INCOME / EXPENSE CARDS */}
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

              {/* RECENT TRANSACTIONS */}
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
            </>
          )}

          {/* TRANSFER LIST ACTIONS CONTAINER */}
          {isMobile && activeMobileView === 'transfer' && (
            <section className="mobile-view-fallback-card card">
              <h2>💸 Make a Transfer</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '8px 0 20px' }}>
                Select a safe channel option below to process immediate transactions.
              </p>
              <div className="mobile-action-list">
                <Link to="/payment" className="mobile-subaction-item">
                  <span>🏦</span> Transfer to Bank Account
                </Link>
                <Link to="/payment" className="mobile-subaction-item">
                  <span>📱</span> Send to Mobile Wallet / Phone
                </Link>
                <Link to="/payment" className="mobile-subaction-item">
                  <span>🔁</span> Internal Account Swap
                </Link>
              </div>
            </section>
          )}

          {/* HISTORICAL TRANSACTIONS COMPLETE CONTENT LISTING */}
          {isMobile && activeMobileView === 'history' && (
            <section className="transactions">
              <h2>📜 All Transaction Log History</h2>
              <div className="transaction-list" style={{ marginTop: '14px' }}>
                {transactions.map((tx, i) => (
                  <div key={i} className="transaction">
                    <div className="transaction-left">
                      <div className={`avatar ${tx.alt ? 'alt' : ''}`}>{tx.avatar}</div>
                      <div className="details">
                        <span className="name">{tx.name}</span>
                        <span className="date">{tx.date}</span>
                      </div>
                    </div>
                    <div className={`amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SUPPORT PAGE FALLBACK VIEWPLATE */}
          {isMobile && activeMobileView === 'support' && (
            <section className="mobile-view-fallback-card card">
              <h2>💬 Customer Help & Support</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '8px 0 20px' }}>
                We're online 24/7. Choose an option to speak with us.
              </p>
              <div className="mobile-action-list">
                <Link to="/support" className="mobile-subaction-item">
                  <span>❓</span> View FAQs & Solutions
                </Link>
                <a href="tel:000" className="mobile-subaction-item">
                  <span>📞</span> Call Care Center Line
                </a>
                <Link to="/support" className="mobile-subaction-item">
                  <span>✉️</span> File an official Support Ticket
                </Link>
              </div>
            </section>
          )}

          {/* ME / PROFILE SEGMENT */}
          {isMobile && activeMobileView === 'profile' && (
            <section className="mobile-view-fallback-card card">
              <h2>👤 My Profile Information</h2>
              <div className="profile-preview-block" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                  <small style={{ color: 'var(--text-muted)' }}>Full Name</small>
                  <p style={{ fontWeight: '600' }}>{userData?.firstName || 'User'} {userData?.lastName || ''}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
                  <small style={{ color: 'var(--text-muted)' }}>Account ID</small>
                  <p style={{ fontWeight: '600' }}>{accountNumber}</p>
                </div>
                <Link to="/profile" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                  Edit Advanced Profile Settings
                </Link>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* --- FIXED BOTTOM NAVIGATION TAB (OPAY HIGH FIDELITY LAYOUT) --- */}
      <div className="opay-bottom-nav">
        <button
          onClick={() => handleNavClick('home')}
          className={`opay-nav-item ${activeMobileView === 'home' ? 'active' : ''}`}
        >
          <span className="opay-nav-icon">🏠</span>
          <span className="opay-nav-text">Home</span>
        </button>

        <button
          onClick={() => handleNavClick('transfer')}
          className={`opay-nav-item ${activeMobileView === 'transfer' ? 'active' : ''}`}
        >
          <span className="opay-nav-icon">💸</span>
          <span className="opay-nav-text">Transfer</span>
        </button>

        <button
          onClick={() => handleNavClick('history')}
          className={`opay-nav-item ${activeMobileView === 'history' ? 'active' : ''}`}
        >
          <span className="opay-nav-icon">📜</span>
          <span className="opay-nav-text">History</span>
        </button>

        <button
          onClick={() => handleNavClick('support')}
          className={`opay-nav-item ${activeMobileView === 'support' ? 'active' : ''}`}
        >
          <span className="opay-nav-icon">💬</span>
          <span className="opay-nav-text">Support</span>
        </button>

        <button
          onClick={() => handleNavClick('profile')}
          className={`opay-nav-item ${activeMobileView === 'profile' ? 'active' : ''}`}
        >
          <span className="opay-nav-icon">👤</span>
          <span className="opay-nav-text">Me</span>
        </button>
      </div>
    </div>
  );
};

export default MyBankDashboard;