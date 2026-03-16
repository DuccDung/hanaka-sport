import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
} from "../services/authStorage";
import {
  connectRealtime,
  disconnectRealtime,
} from "../services/realtimeService";

const AuthContext = createContext(null);

function AppRealtimeBootstrap() {
  const { session } = useAuth();

  useEffect(() => {
    const token = session?.accessToken;

    if (token) {
      connectRealtime(token);
    } else {
      disconnectRealtime();
    }

    return () => {
      disconnectRealtime();
    };
  }, [session?.accessToken]);

  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState({
    accessToken: null,
    expiresAtUtc: null,
    user: null,
  });

  const [booting, setBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await getAuthSession();

        setSession(
          s || {
            accessToken: null,
            expiresAtUtc: null,
            user: null,
          },
        );
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const setAuthSession = async ({ accessToken, expiresAtUtc, user }) => {
    const nextSession = {
      accessToken,
      expiresAtUtc,
      user,
    };

    await saveAuthSession(nextSession);
    setSession(nextSession);
  };

  const logout = async () => {
    await clearAuthSession();
    disconnectRealtime();

    setSession({
      accessToken: null,
      expiresAtUtc: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ session, booting, setAuthSession, logout }}>
      <AppRealtimeBootstrap />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
