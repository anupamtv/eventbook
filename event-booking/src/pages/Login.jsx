import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4200/login', { name, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', role);
      navigate(role === 'admin' ? '/admin-home' : '/home');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Enter Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary">Log In</button>
        </form>
        <p className="auth-switch">
          New user? <span onClick={() => navigate('/signup')}>Sign up here</span>
        </p>
      </div>
    </div>
  );
}
