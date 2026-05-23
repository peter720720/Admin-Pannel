import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [transaction, setTransaction] = useState({ userId: '', type: 'Deposit', amount: '', description: '' });
    const [txSearch, setTxSearch] = useState('');
    const [txType, setTxType] = useState('All');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedType, setAppliedType] = useState('All');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [showAlert, setShowAlert] = useState(false);

    const showMessage = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4500);
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }
            const res = await axios.get(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedUsers = res.data.users || res.data;
            setUsers(fetchedUsers);
            const allTransactions = fetchedUsers.flatMap(u => (u.transactions || []).map(tx => ({
                ...tx,
                userId: u._id,
                userName: `${u.firstName} ${u.lastName}`.trim()
            })));
            setTransactions(allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            console.error('Error fetching users:', err.response?.data || err.message);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const parts = fullName.trim().split(' ');
            const fName = parts[0];
            const lName = parts.length > 1 ? parts.slice(1).join(' ') : '  ';

            await axios.post(`${API_URL}/api/admin/create-user`,
                { firstName: fName, lastName: lName, email, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showMessage('User created successfully!', 'success');
            setFullName(''); setEmail(''); setPassword('');
            await fetchUsers();
        } catch (err) {
            showMessage('Error: ' + (err.response?.data?.message || 'Failed to create user'), 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('User deleted successfully', 'success');
            await fetchUsers();
        } catch (err) {
            console.error('Delete error:', err.response?.data || err.message);
            showMessage(err.response?.data?.message || err.message || 'Failed to delete user', 'error');
        }
    };

    const handleQuickAdd = async (userId) => {
        if (!userId) {
            showMessage('Unable to identify this user. Please refresh and try again.', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(`${API_URL}/api/admin/adjust-balance`,
                { userId, amount: 100, type: 'add', description: 'Quick add $100' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showMessage(`Added $100 to ${response.data.userName || response.data.message || 'user'}. New balance: $${response.data.newBalance}`, 'success');
            fetchUsers();
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            showMessage(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add money', 'error');
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        if (!transaction.userId) {
            showMessage('Please choose a user before submitting the transaction.', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(`${API_URL}/api/admin/adjust-balance`, {
                userId: transaction.userId,
                amount: transaction.amount,
                type: transaction.type === 'Deposit' ? 'add' : 'deduct',
                description: transaction.description || `${transaction.type} by admin`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage(`Transaction Successful! ${response.data.userName || response.data.message || 'user'} new balance: $${response.data.newBalance}`, 'success');
            setTransaction({ userId: '', type: 'Deposit', amount: '', description: '' });
            fetchUsers();
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            showMessage(err.response?.data?.message || err.response?.data?.error || err.message || 'Transaction Failed', 'error');
        }
    };

    const applyTransactionFilter = () => {
        setAppliedSearch(txSearch);
        setAppliedType(txType);
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesType = appliedType === 'All' || tx.type === appliedType;
        const searchTerm = appliedSearch.trim().toLowerCase();
        const matchesSearch = !searchTerm ||
            tx.userName.toLowerCase().includes(searchTerm) ||
            tx.description.toLowerCase().includes(searchTerm) ||
            tx.reference.toLowerCase().includes(searchTerm);
        return matchesType && matchesSearch;
    });

    const globalStyle = { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };

    return (
        <div className="admin-dashboard-root" style={{
            ...globalStyle,
            backgroundColor: '#05070a',
            color: 'white',
            minHeight: '100vh',
            width: '100%',
            padding: '40px',
            boxSizing: 'border-box'
        }}>

            <style>{`
                .admin-dashboard-root { min-width: 0; }
                .toast-message {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 14px 18px;
                    border-radius: 999px;
                    font-size: 14px;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
                    opacity: 0.98;
                    z-index: 9999;
                }
                .toast-message.success { background: #22c55e; }
                .toast-message.error { background: #ef4444; }
                .admin-dashboard-panel { width: 100%; }
                .admin-dashboard-panel form { display: flex; flex-wrap: wrap; gap: 15px; }
                .admin-dashboard-panel .responsive-input { flex: 1 1 180px; min-width: 140px; }
                .admin-action-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
                .admin-table-wrapper { overflow-x: auto; }
                .admin-action-small { padding: 8px 12px; font-size: 0.85rem; }

                @media (max-width: 820px) {
                  .admin-dashboard-root { padding: 20px; }
                  .admin-dashboard-panel { padding: 15px; }
                  .admin-dashboard-panel .responsive-input { flex: 1 1 100%; min-width: 0; }
                  .admin-action-row { justify-content: flex-start; }
                  .admin-table-wrapper table { min-width: 700px; }
                }
            `}</style>

            {showAlert && (
                <div className={`toast-message ${alertType}`}>
                    {alertMessage}
                </div>
            )}

            <h2 style={{ color: '#6366f1', marginBottom: '30px' }}>Admin Panel</h2>

            <div className="admin-dashboard-panel" style={{ marginBottom: '50px', padding: '20px', backgroundColor: '#111827', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Create User</h3>
                <form onSubmit={handleCreateUser} className="admin-dashboard-form" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <input className="responsive-input" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} required />
                    <input className="responsive-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                    <input className="responsive-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
                    <button type="submit" style={btnStyle}>Create User</button>
                </form>
            </div>

            <h3 style={{ marginBottom: '20px' }}>User Management</h3>
            {/* <div className="admin-table-wrapper" style={{ marginBottom: '50px' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Account No</th>
                            <th style={thStyle}>Balance</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td style={tdStyle}>{(user.firstName + ' ' + (user.lastName || '')).trim()}</td>
                                <td style={tdStyle}>{user.email}</td>
                                <td style={{ ...tdStyle, color: '#10b981', fontWeight: 'bold' }}>${user.balance?.toLocaleString()}</td>
                                <td style={tdStyle}>
                                    <div className="admin-action-row">
                                        <button onClick={() => handleQuickAdd(user._id)} style={actionBtnStyle}>Add $100</button>
                                        <button onClick={() => handleDeleteUser(user._id)} style={{ ...actionBtnStyleSmall, backgroundColor: '#b91c1c' }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}


            <div className="admin-table-wrapper" style={{ marginBottom: '50px' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#1f2937' }}>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Account No</th>
                            <th style={thStyle}>Balance</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td style={tdStyle}>{(user.firstName + ' ' + (user.lastName || '')).trim()}</td>

                                <td style={tdStyle}>{user.email}</td>

                                <td style={{ ...tdStyle, color: '#10b981', fontWeight: 'bold' }}>
                                    {user.accountNumber || 'Not generated'}
                                </td>

                                <td style={{ ...tdStyle, color: '#10b981', fontWeight: 'bold' }}>
                                    ${user.balance?.toLocaleString()}
                                </td>

                                <td style={tdStyle}>
                                    <div className="admin-action-row">
                                        <button onClick={() => handleQuickAdd(user._id)} style={actionBtnStyle}>Add $100</button>
                                        <button onClick={() => handleDeleteUser(user._id)} style={{ ...actionBtnStyleSmall, backgroundColor: '#b91c1c' }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#111827', borderRadius: '8px', marginBottom: '50px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Create Transaction</h3>
                <form onSubmit={handleTransaction} className="admin-dashboard-form" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <select className="responsive-input" style={inputStyle} value={transaction.userId} onChange={e => setTransaction({ ...transaction, userId: e.target.value })} required>
                        <option value="">Select User</option>
                        {users.map(u => (
                            <option key={u._id} value={u._id}>
                                {(u.firstName + ' ' + (u.lastName || '')).trim()}
                            </option>
                        ))}
                    </select>
                    <select className="responsive-input" style={inputStyle} value={transaction.type} onChange={e => setTransaction({ ...transaction, type: e.target.value })}>
                        <option value="Deposit">Deposit</option>
                        <option value="Withdrawal">Withdrawal</option>
                    </select>
                    <input
                        className="responsive-input"
                        type="number"
                        placeholder="Amount"
                        inputMode="decimal"
                        style={amountInputStyle}
                        value={transaction.amount}
                        onChange={e => setTransaction({ ...transaction, amount: e.target.value })}
                        required
                    />
                    <input
                        className="responsive-input"
                        type="text"
                        placeholder="Description"
                        style={inputStyle}
                        value={transaction.description}
                        onChange={e => setTransaction({ ...transaction, description: e.target.value })}
                    />
                    <button type="submit" style={{ ...btnStyle, backgroundColor: '#10b981' }}>Submit Transaction</button>
                </form>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#111827', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Transaction History</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search by user, description, or ref"
                        value={txSearch}
                        onChange={e => setTxSearch(e.target.value)}
                        style={inputStyle}
                    />
                    <select style={inputStyle} value={txType} onChange={e => setTxType(e.target.value)}>
                        <option value="All">All Types</option>
                        <option value="Deposit">Deposit</option>
                        <option value="Withdrawal">Withdrawal</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Payment">Payment</option>
                        <option value="Refund">Refund</option>
                    </select>
                    <button type="button" onClick={applyTransactionFilter} style={{ ...btnStyle, backgroundColor: '#2563eb' }}>Apply Filter</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: '#1f2937' }}>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Type</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ ...tdStyle, textAlign: 'center' }}>No transactions found.</td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx, index) => (
                                    <tr key={`${tx.reference}-${index}`}>
                                        <td style={tdStyle}>{new Date(tx.date).toLocaleString()}</td>
                                        <td style={tdStyle}>{tx.userName}</td>
                                        <td style={tdStyle}>{tx.type}</td>
                                        <td style={{ ...tdStyle, color: tx.amount >= 0 ? '#10b981' : '#fca5a5' }}>
                                            {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                                        </td>
                                        <td style={tdStyle}>{tx.description}</td>
                                        <td style={tdStyle}>{tx.reference}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid #374151' };
const thStyle = { border: '1px solid #374151', padding: '15px', textAlign: 'left', color: '#9ca3af' };
const tdStyle = { border: '1px solid #374151', padding: '15px' };
const inputStyle = { padding: '12px', borderRadius: '4px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', flex: '1', minWidth: '140px', fontFamily: 'inherit' };
const amountInputStyle = { ...inputStyle, WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'textfield' };
const btnStyle = { padding: '12px 25px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' };
const actionBtnStyle = { padding: '8px 15px', backgroundColor: '#312e81', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' };
const actionBtnStyleSmall = { padding: '8px 12px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' };

export default AdminDashboard;
