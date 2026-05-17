"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clearAuth, getStoredUser, getToken, setAuth } from "../lib/auth";
import { getMe, getErrorMessage, loginUser, registerUser } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setAuth(data.token, data.user);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    setAuth(data.token, data.user);
    setUser(data.user);
    return data;
  }, []);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      const stored = getStoredUser();

      if (!token) {
        setLoading(false);
        return;
      }

      setUser(stored);

      try {
        const profile = await getMe();
        setUser(profile);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { getErrorMessage };
