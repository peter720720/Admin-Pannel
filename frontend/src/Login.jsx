import React, { useState } from 'react';
import axios from 'axios';
import API_URL from './api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken, setRole, setData, setActiveRole }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const showMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4500);
  };

  const normalizeRole = (role) => typeof role === 'string' ? role.trim().toLowerCase() : role;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminData');
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, { 
        identifier, 
        password 
      });
      
      const role = normalizeRole(res.data.user?.role || 'admin');
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminRole', role);
      localStorage.setItem('adminData', JSON.stringify(res.data.user));
      localStorage.setItem('activeRole', 'admin');
      setToken(res.data.token);
      setRole(role);
      setData(res.data.user);
      setActiveRole('admin');
      showMessage(res.data?.message || 'Logged in successfully!', 'success');
      setTimeout(() => navigate('/admin-home'), 700);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed";
      showMessage(message, 'error');
    }
  };

  return (
    <div className="login-container">
      {showAlert && (
        <div className={`toast-message ${alertType}`}>
          {alertMessage}
        </div>
      )}
      <div className="login-card">
        <h1 className="logo-text">MB MyBank</h1>
        <p className="subtitle">Admin Portal</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email or Username</label>
            <input 
              type="text" 
              placeholder="admin@mybank.com" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)} 
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="signin-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
