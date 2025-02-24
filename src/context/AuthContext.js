// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loadAuth, setLoadAuth] = useState(true);
  // Initialize auth state from localStorage if available
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  // Update localStorage whenever auth changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
    setLoadAuth(false);
  }, [auth]);

  // Function to handle login
  const login = (userData) => {
    setAuth(userData);
  };

  // Function to handle logout
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loadAuth,
        setLoadAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
