import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    authenticated: false,
    user: null,
  });

  const login = (user) => {
    setAuthState({
      authenticated: true,
      user: user,
    });
  };

  const logout = () => {
    setAuthState({
      authenticated: false,
      user: null,
    });
  };

  const value = {
    authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
