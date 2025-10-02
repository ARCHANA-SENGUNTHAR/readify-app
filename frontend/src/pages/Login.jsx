import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';  // ✅ import CSS

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/read');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={onSubmit}>
        <input 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={onChange} 
          placeholder="Email" 
          required 
          autoComplete="email"
        />
        <input 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={onChange} 
          placeholder="Password" 
          required 
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>
      <p className="login-footer">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
