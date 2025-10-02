import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';  // ✅ import CSS

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState("");

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      alert("Registration successful!");
      navigate('/');
    } catch (err) {
      console.error("Error during registration:", err);
      const backendMsg = err.msg || err.errors?.[0]?.msg || "Registration failed. Please try again.";
      setError(backendMsg);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={onSubmit}>
        <input name="name" value={form.name} onChange={onChange} placeholder="Name" required autoComplete="name" />
        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required autoComplete="email" />
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required autoComplete="new-password" />
        <select name="role" value={form.role} onChange={onChange}>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit">Sign up</button>
        {error && <p className="register-error">{error}</p>}
      </form>
      <p className="register-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
