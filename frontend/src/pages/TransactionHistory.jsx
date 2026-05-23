import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import './TransactionHistory.css';
import { maskAccountNumber } from '../utils/account';

const TransactionHistory = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 820);
  const [isMobile, setIsMobile] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [period, setPeriod] = useState('All time');

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

  const accountNumber = user?.accountNumber || user?.username || '0000000000';

  const transactions = (user?.transactions || [])
    .map((tx) => ({
      ...tx,
      date: tx.date ? new Date(tx.date).toLocaleString() : 'Unknown',
      ref: tx.reference || '#N/A',
      desc: tx.description || tx.type || 'No description',
      account: maskAccountNumber(tx.account || accountNumber)
    }));

  const filtered = transactions.filter(t =>
    (filterType === 'All' || t.type === filterType) &&
    (t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase()) ||
      t.account.toLowerCase().includes(search.toLowerCase()))
  );

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
              <li><Link to="/dashboard"><span className="icon">🏠</span><span>Overview</span></Link></li>
              <li><Link to="/payment"><span className="icon">💸</span><span>Payment / Transfer</span></Link></li>
              <li><Link to="/history" className="active"><span className="icon">📜</span><span>Transaction History</span></Link></li>
              <li><Link to="/profile"><span className="icon">👤</span><span>Profile</span></Link></li>
              <li><Link to="/support"><span className="icon">💬</span><span>Support</span></Link></li>
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
                <h1>Transaction History</h1>
                <p>All your transactions in one place — filter, search, and export.</p>
              </div>
            </div>
            <div className="header-right">
              <div className="pill-balance">Balance: <strong style={{ color: balance < 0 ? '#fca5a5' : undefined }}>{visibleBalance}</strong></div>
              <button className="btn btn-secondary" onClick={() => setShowBalance((prev) => !prev)}>
                {showBalance ? 'Hide' : 'Show'} Balance
              </button>
              <button className="btn btn-secondary">Export CSV</button>
              <button className="btn btn-primary active-filter">Advanced Filter</button>
            </div>
          </header>

          <section className="card">
            <div className="controls">
              <div className="control-group">
                <label>Search</label>
                <input type="text" placeholder="Search by description or reference" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="control-group">
                <label>Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option>All</option>
                  <option>Deposit</option>
                  <option>Withdrawal</option>
                  <option>Transfer</option>
                  <option>Payment</option>
                  <option>Refund</option>
                </select>
              </div>
              <div className="control-group">
                <label>Period</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option>All time</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This month</option>
                </select>
              </div>
              <button className="btn btn-secondary reset-button" type="button" onClick={() => { setSearch(''); setFilterType('All'); setPeriod('All time'); }}>
                Reset
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reference</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Account</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx, i) => (
                      <tr key={i}>
                        <td>{tx.date}</td>
                        <td className="text-muted">{tx.ref}</td>
                        <td>{tx.desc}</td>
                        <td>{tx.type}</td>
                        <td>{tx.account}</td>
                        <td className={`amount text-right ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                          {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
