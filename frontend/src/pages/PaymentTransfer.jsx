// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const PaymentTransfer = ({ user, onLogout }) => {
//   const [theme, setTheme] = useState('dark');
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 820);
//   const [step, setStep] = useState('form'); // form, waiting, success
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     recipient: '', bank: '', account: '', amount: '', type: '', reference: '', note: ''
//   });

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//     const handleResize = () => setSidebarOpen(window.innerWidth > 820);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [theme]);

//   const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleInitiate = (e) => {
//     e.preventDefault();
//     setStep('waiting');
//   };

//   const handleFinalConfirm = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       setStep('success');
//     }, 2000);
//   };

//   return (
//     <div className="dashboard">
//       <div className={`overlay ${sidebarOpen && window.innerWidth <= 820 ? 'active' : ''}`} onClick={toggleSidebar}></div>

//       {/* SIDEBAR */}
//       <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
//         <div>
//           <div className="logo">
//             <div className="logo-icon">MB</div>
//             <div className="logo-text">MyBank</div>
//           </div>
//           <nav>
//             <ul>
//               <li><Link to="/dashboard"><span className="icon">🏠</span><span>Overview</span></Link></li>
//               <li><Link to="/payment" className="active"><span className="icon">💸</span><span>Payment / Transfer</span></Link></li>
//               <li><Link to="/history"><span className="icon">📜</span><span>Transaction History</span></Link></li>
//               <li><Link to="/profile"><span className="icon">👤</span><span>Profile</span></Link></li>
//               <li><Link to="/support"><span className="icon">💬</span><span>Support</span></Link></li>
//             </ul>
//           </nav>
//         </div>

//         <div className="sidebar-footer">
//           <div className="theme-toggle-wrapper">
//             <div className="theme-toggle-label"><span>Theme Mode</span></div>
//             <div className="theme-switch" onClick={toggleTheme}>
//               <span>🌙</span>
//               <div className="switch-track"><div className="switch-thumb"></div></div>
//               <span>☀️</span>
//             </div>
//           </div>
//           <button className="signout" onClick={onLogout}>
//             <span className="icon">⎋</span><span>Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       <main className="main">
//         <div className="main-inner">
//           <header className="header">
//             <div className="header-left">
//               <button className="hamburger" onClick={toggleSidebar}>☰</button>
//               <div>
//                 <h1>Payment / Transfer</h1>
//                 <p>Send money securely to any bank account.</p>
//               </div>
//             </div>
//             <div className="header-right">
//               <div className="pill-balance">Available: <strong>$143,899.00</strong></div>
//               <button className="btn btn-secondary"><span>📄</span> Saved Beneficiaries</button>
//             </div>
//           </header>

//           {/* STEP 1: TRANSFER FORM */}
//           {step === 'form' && (
//             <section className="card">
//               <div className="card-title">Transfer Details</div>
//               <div className="card-subtitle">Fill in the recipient and amount.</div>

//               <form onSubmit={handleInitiate}>
//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label htmlFor="recipient">Recipient Name</label>
//                     <input type="text" id="recipient" placeholder="e.g. Jane Cooper" onChange={handleChange} required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="bank">Bank Name</label>
//                     <input type="text" id="bank" placeholder="e.g. GTBank" onChange={handleChange} required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="account">Account Number</label>
//                     <input type="text" id="account" placeholder="Enter account number" onChange={handleChange} required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="amount">Amount</label>
//                     <input type="number" id="amount" placeholder="e.g. 5000" onChange={handleChange} required />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="type">Transfer Type</label>
//                     <select id="type" onChange={handleChange} required>
//                       <option value="">Select type</option>
//                       <option>Local Transfer</option>
//                       <option>International Transfer</option>
//                       <option>Own Account</option>
//                     </select>
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="reference">Reference</label>
//                     <input type="text" id="reference" placeholder="e.g. Rent, School fees..." onChange={handleChange} required />
//                   </div>
//                 </div>

//                 <div className="form-group" style={{ marginTop: '14px' }}>
//                   <label htmlFor="note">Note (optional)</label>
//                   <textarea id="note" placeholder="Add a note for this transfer..." onChange={handleChange}></textarea>
//                 </div>

//                 <div className="form-footer">
//                   <button type="submit" className="btn btn-primary btn-full">
//                     <span>💸</span> Send Transfer
//                   </button>
//                 </div>
//               </form>
//             </section>
//           )}

//           {/* STEP 2: VERIFICATION */}
//           {step === 'waiting' && (
//             <section className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
//               <div className="card-title">Security Verification</div>
//               <div className="card-subtitle">Authorize your payment of ${formData.amount}</div>
//               <div style={{ padding: '30px 0' }}>
//                 <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Enter the payment code sent to your device.</p>
//                 <input type="text" className="form-group" style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', width: '200px', margin: '20px auto', background: 'rgba(255,255,255,0.05)' }} placeholder="******" maxLength="6" />
//               </div>
//               <div className="form-footer" style={{ justifyContent: 'center', gap: '12px' }}>
//                 <button className="btn btn-secondary" onClick={() => setStep('form')}>Cancel</button>
//                 <button className="btn btn-primary" onClick={handleFinalConfirm} disabled={loading}>
//                   {loading ? 'Processing...' : 'Verify & Confirm'}
//                 </button>
//               </div>
//             </section>
//           )}

//           {/* STEP 3: SUCCESS */}
//           {step === 'success' && (
//             <section className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
//               <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
//               <div className="card-title">Transfer Successful</div>
//               <div className="card-subtitle">Your funds are being sent to {formData.recipient}.</div>
//               <button className="btn btn-primary btn-full" style={{ marginTop: '20px' }} onClick={() => setStep('form')}>Back to Transfers</button>
//             </section>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PaymentTransfer;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';        // Global layout (Sidebar, Header)
import './PaymentTransfer.css'; // Specific form styles (Grid, Inputs)

const PaymentTransfer = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 820);
  const [step, setStep] = useState('form'); // Steps: 'form', 'waiting', 'success'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '', bank: '', account: '', amount: '', type: '', reference: '', note: ''
  });

  // Sync Light/Dark mode and responsive sidebar
  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
    const handleResize = () => setSidebarOpen(window.innerWidth > 820);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleInitiate = (e) => {
    e.preventDefault();
    setStep('waiting'); // Transitions to the "Waiting for Code" view
  };

  const handleFinalConfirm = () => {
    setLoading(true);
    // Simulate backend processing
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="dashboard">
      {/* Mobile Sidebar Overlay */}
      <div className={`overlay ${sidebarOpen && window.innerWidth <= 820 ? 'active' : ''}`} onClick={toggleSidebar}></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div>
          <div className="logo">
            <div className="logo-icon">MB</div>
            <div className="logo-text">MyBank</div>
          </div>
          <nav>
            <ul>
              <li><Link to="/dashboard"><span className="icon">🏠</span><span>Overview</span></Link></li>
              <li><Link to="/payment" className="active"><span className="icon">💸</span><span>Payment / Transfer</span></Link></li>
              <li><Link to="/history"><span className="icon">📜</span><span>Transaction History</span></Link></li>
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
            <span className="icon">⎋</span><span>Sign Out</span>
          </button>
          <div className="sidebar-meta">Secure • Encrypted • v1.0</div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main">
        <div className="main-inner">
          <div className="payment-content">
            <header className="header">
              <div className="header-left">
                <div>
                  <h1>Payment / Transfer</h1>
                  <p>Send money securely to any bank account.</p>
                </div>
              </div>
              <div className="header-right">
                <div className="pill-balance">
                  Available: <strong>${user?.balance?.toLocaleString() || '143,899.00'}</strong>
                </div>
                <button className="btn btn-secondary">
                  <span>📄</span> Saved Beneficiaries
                </button>
              </div>
            </header>

            {/* STEP 1: INITIAL TRANSFER FORM */}
            {step === 'form' && (
              <section className="card payment-card">
              <div className="card-title">Transfer Details</div>
              <div className="card-subtitle">Fill in the recipient and amount. You’ll confirm on the next step.</div>
              
              <form onSubmit={handleInitiate}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="recipient">Recipient Name</label>
                    <input type="text" id="recipient" placeholder="e.g. Jane Cooper" onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bank">Bank Name</label>
                    <input type="text" id="bank" placeholder="e.g. GTBank" onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="account">Account Number</label>
                    <input type="text" id="account" placeholder="Enter account number" onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" id="amount" placeholder="e.g. 5000" onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="type">Transfer Type</label>
                    <select id="type" onChange={handleChange} required>
                      <option value="">Select type</option>
                      <option>Local Transfer</option>
                      <option>International Transfer</option>
                      <option>Own Account</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reference">Reference</label>
                    <input type="text" id="reference" placeholder="e.g. Rent, School fees..." onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label htmlFor="note">Note (optional)</label>
                  <textarea id="note" placeholder="Add a note for this transfer..." onChange={handleChange}></textarea>
                </div>

                <div className="form-footer">
                  <small>Secure 256-bit encrypted transaction.</small>
                  <button type="submit" className="btn btn-primary btn-full">
                    <span>💸</span> Send Transfer
                  </button>
                </div>
              </form>
            </section>
          )}

            {/* STEP 2: SECURITY VERIFICATION (WAITING FOR CODE) */}
            {step === 'waiting' && (
              <section className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
                <div className="card-title">Security Verification</div>
                <div className="card-subtitle">Authorize your payment of ${formData.amount}</div>
                <div style={{ padding: '30px 0' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Enter the 6-digit payment code sent to your registered device.</p>
                  <input 
                    type="text" 
                    className="pin-input" 
                    placeholder="******" 
                    maxLength="6" 
                    style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '10px', width: '220px', margin: '20px auto', display: 'block' }}
                  />
                </div>
                <div className="form-footer" style={{ justifyContent: 'center', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => setStep('form')}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleFinalConfirm} disabled={loading}>
                    {loading ? 'Processing...' : 'Verify & Confirm'}
                  </button>
                </div>
              </section>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 'success' && (
              <section className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '40px auto' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
                <div className="card-title">Transfer Successful</div>
                <div className="card-subtitle">Your funds are being sent to <strong>{formData.recipient}</strong>.</div>
                <button className="btn btn-primary btn-full" style={{ marginTop: '20px' }} onClick={() => setStep('form')}>
                  Make Another Transfer
                </button>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentTransfer;
