import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getAuthSession,
  saveAuthSession,
  clearStoredAccountData,
} from "../services/authStorage";
import {
  connectRealtime,
  disconnectRealtime,
  clearRealtimeAccountState,
} from "../services/realtimeService";
import { sanitizeUserPayload } from "../services/userService";
import { logoutFromServer } from "../services/authApi";

const AuthContext = createContext(null);

function createEmptySession() {
  return {
    accessToken: null,
    expiresAtUtc: null,
    user: null,
  };
}

function sanitizeSession(session) {
  const accessToken = session?.accessToken || null;

  return {
    accessToken,
    expiresAtUtc: accessToken ? session?.expiresAtUtc || null : null,
    user: accessToken ? sanitizeUserPayload(session?.user) || null : null,
  };
}

async function persistSessionSnapshot(session) {
  if (session?.accessToken) {
    await saveAuthSession(session);
  } else {
    await clearStoredAccountData(session);
  }
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
  const [session, setSession] = useState(createEmptySession);

  const [booting, setBooting] = useState(true);
  const sessionWriteRef = useRef({
    id: 0,
    session: createEmptySession(),
  });

  useEffect(() => {
    const bootWriteId = sessionWriteRef.current.id;

    (async () => {
      try {
        const s = await getAuthSession();
        const nextSession = sanitizeSession(s || createEmptySession());

        if (sessionWriteRef.current.id === bootWriteId) {
          sessionWriteRef.current = {
            id: bootWriteId,
            session: nextSession,
          };
          setSession(nextSession);
        }
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const setAuthSession = useCallback(async ({
    accessToken,
    expiresAtUtc,
    user,
    replace = false,
  }) => {
    const nextSession = sanitizeSession({
      accessToken,
      expiresAtUtc,
      user,
    });

    if (
      nextSession.accessToken &&
      !replace &&
      sessionWriteRef.current.session?.accessToken !== nextSession.accessToken
    ) {
      return false;
    }

    const previousSession = sessionWriteRef.current.session;
    const writeId = sessionWriteRef.current.id + 1;

    sessionWriteRef.current = {
      id: writeId,
      session: nextSession,
    };

    if (!nextSession.accessToken) {
      setSession(createEmptySession());
      disconnectRealtime();

      await clearRealtimeAccountState();
      await clearStoredAccountData(previousSession);

      if (sessionWriteRef.current.id === writeId) {
        setSession(createEmptySession());
      } else {
        await persistSessionSnapshot(sessionWriteRef.current.session);
      }

      return true;
    }

    await saveAuthSession(nextSession);

    if (sessionWriteRef.current.id === writeId) {
      setSession(nextSession);
    } else {
      await persistSessionSnapshot(sessionWriteRef.current.session);
    }

    return true;
  }, []);

  const logout = useCallback(async () => {
    const previousSession = sessionWriteRef.current.session;
    const nextSession = createEmptySession();
    const writeId = sessionWriteRef.current.id + 1;

    sessionWriteRef.current = {
      id: writeId,
      session: nextSession,
    };

    setSession(nextSession);
    disconnectRealtime();

    logoutFromServer().catch(() => {});

    await clearRealtimeAccountState();
    await clearStoredAccountData(previousSession);

    if (sessionWriteRef.current.id === writeId) {
      setSession(createEmptySession());
    } else {
      await persistSessionSnapshot(sessionWriteRef.current.session);
    }
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
