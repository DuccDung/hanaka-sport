import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
} from "../services/authStorage";
import {
  connectRealtime,
  disconnectRealtime,
} from "../services/realtimeService";
import { sanitizeUserPayload } from "../services/userService";

const AuthContext = createContext(null);

function sanitizeSession(session) {
  return {
    accessToken: session?.accessToken || null,
    expiresAtUtc: session?.expiresAtUtc || null,
    user: sanitizeUserPayload(session?.user),
  };
}

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
          sanitizeSession(
            s || {
              accessToken: null,
              expiresAtUtc: null,
              user: null,
            },
          ) || {
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

  const setAuthSession = useCallback(async ({ accessToken, expiresAtUtc, user }) => {
    const nextSession = sanitizeSession({
      accessToken,
      expiresAtUtc,
      user,
    });

    await saveAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    await clearAuthSession();
    disconnectRealtime();

    setSession({
      accessToken: null,
      expiresAtUtc: null,
      user: null,
    });
  }, []);

  const contextValue = useMemo(
    () => ({ session, booting, setAuthSession, logout }),
    [session, booting, setAuthSession, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
