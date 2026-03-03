import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
} from "../services/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState({
    accessToken: null,
    expiresAtUtc: null,
    user: null,
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await getAuthSession();
      setSession(s);
      setBooting(false);
    })();
  }, []);

  const setAuthSession = async ({ accessToken, expiresAtUtc, user }) => {
    await saveAuthSession({ accessToken, expiresAtUtc, user });
    setSession({ accessToken, expiresAtUtc, user });
  };

  const logout = async () => {
    await clearAuthSession();
    setSession({ accessToken: null, expiresAtUtc: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ session, booting, setAuthSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
