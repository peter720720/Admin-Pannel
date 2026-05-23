import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

import MyBankDashboard from "./pages/Dashboard";
import PaymentTransfer from "./pages/PaymentTransfer";
import TransactionHistory from "./pages/TransactionHistory";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import AdminDashboard from "./AdminDashboard";
import UserLogin from "./UserLogin";
import Login from "./Login";

function App() {
  const normalizeRole = (role) => typeof role === 'string' ? role.trim().toLowerCase() : role;
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  const [adminToken, setAdminToken] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const [activeRole, setActiveRole] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const validateSession = async (token, expectedRole, setTokenState, setRoleState, setDataState, tokenKey, roleKey, dataKey) => {
    if (!token) return false;

    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = response.data.user;
      const role = normalizeRole(user?.role);

      if (role !== expectedRole) {
        throw new Error(`Expected role ${expectedRole} but got ${role}`);
      }

      setTokenState(token);
      setRoleState(role);
      setDataState(user);
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(roleKey, role);
      localStorage.setItem(dataKey, JSON.stringify(user));

      return true;
    } catch (err) {
      console.error(`Session validation failed for ${expectedRole}`, err);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(roleKey);
      localStorage.removeItem(dataKey);
      setTokenState(null);
      setRoleState(null);
      setDataState(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedActive = normalizeRole(localStorage.getItem('activeRole'));
      setActiveRole(storedActive);

      const storedUserToken = localStorage.getItem('userToken');
      const storedAdminToken = localStorage.getItem('adminToken');

      await Promise.all([
        validateSession(storedUserToken, 'user', setUserToken, setUserRole, setUserData, 'userToken', 'userRole', 'userData'),
        validateSession(storedAdminToken, 'admin', setAdminToken, setAdminRole, setAdminData, 'adminToken', 'adminRole', 'adminData')
      ]);

      setInitialized(true);
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('activeRole');
    setUserToken(null);
    setUserRole(null);
    setUserData(null);
    setActiveRole(null);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminData');
    localStorage.removeItem('activeRole');
    setAdminToken(null);
    setAdminRole(null);
    setAdminData(null);
    setActiveRole(null);
  };

  if (!initialized) {
    return null;
  }

  const homeRedirect = activeRole === 'admin' && adminToken
    ? '/admin-home'
    : userToken
      ? '/dashboard'
      : adminToken
        ? '/admin-home'
        : '/login';

  console.log('App render: pathname=', window.location.pathname, 'userToken=', userToken, 'userRole=', userRole, 'homeRedirect=', homeRedirect);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={homeRedirect} />} />

        <Route
          path="/login"
          element={
            userToken && userRole === 'user'
              ? <Navigate to="/dashboard" />
              : <UserLogin setToken={setUserToken} setRole={setUserRole} setData={setUserData} setActiveRole={setActiveRole} />
          }
        />

        <Route
          path="/admin-login"
          element={
            adminToken && adminRole === 'admin'
              ? <Navigate to="/admin-home" />
              : <Login setToken={setAdminToken} setRole={setAdminRole} setData={setAdminData} setActiveRole={setActiveRole} />
          }
        />

        <Route
          path="/admin-home"
          element={
            adminToken && adminRole === 'admin'
              ? <AdminDashboard onLogout={handleAdminLogout} />
              : <Navigate to="/admin-login" />
          }
        />

        <Route
          path="/dashboard"
          element={
            userToken && userRole === 'user'
              ? <MyBankDashboard onLogout={handleLogout} user={userData} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/payment"
          element={
            userToken && userRole === 'user'
              ? <PaymentTransfer onLogout={handleLogout} user={userData} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/history"
          element={
            userToken && userRole === 'user'
              ? <TransactionHistory onLogout={handleLogout} user={userData} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/profile"
          element={
            userToken && userRole === 'user'
              ? <Profile onLogout={handleLogout} user={userData} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/support"
          element={
            userToken && userRole === 'user'
              ? <Support onLogout={handleLogout} user={userData} />
              : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to={homeRedirect} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
