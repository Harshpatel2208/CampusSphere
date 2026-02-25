import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    // Store user without token in state
    setUser({
      user_id: userData.user_id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      student: userData.student || null,
    });
  };

  // Modified for demo/bypass mode
  useEffect(() => {
    // Automatically log in as 'brijesh' (the seeded student)
    setUser({
      user_id: 1,
      username: "brijesh",
      email: "brijesh@ldrp.ac.in",
      role: "Student",
      student: { student_id: 1 },
    });
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
