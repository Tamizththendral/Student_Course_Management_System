import React, { createContext, useContext, useState, useCallback } from "react";
import { registerUser, loginUser } from "../lib/api.js";

const SESSION_KEY = "edutrack_session";
const AuthContext = createContext(null);

function readSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const persist = useCallback((next) => {
    if (next) sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(SESSION_KEY);
    setSession(next);
  }, []);

  const register = useCallback(
    async ({ fullName, email, phone, password }) => {
      const { user, token } = await registerUser({ fullName, email, phone, password });
      persist({ user, token });
      return user;
    },
    [persist]
  );

  const login = useCallback(
    async ({ identifier, password }) => {
      const { user, token } = await loginUser({ identifier, password });
      persist({ user, token });
      return user;
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isLoggedIn: Boolean(session),
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
