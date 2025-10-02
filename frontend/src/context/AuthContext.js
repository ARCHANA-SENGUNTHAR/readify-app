// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Add register function
  const register = async (formData) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      const { token, user } = res.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return res.data;
    } catch (err) {
      // Throw error so frontend can catch it
      throw err.response?.data || { msg: "Registration failed" };
    }
  };

  const login = async (formData) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", formData);
    const { token, user } = res.data;
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
