import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Session, SessionInput } from '@/types/session.types';
import { sessionService } from '@/services/session.service';

interface SessionContextType {
  currentSession: Session | null;
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  createSession: (input: SessionInput) => Promise<string>;
  loadSession: (id: string) => Promise<void>;
  loadAllSessions: () => Promise<void>;
  runSession: (id: string) => Promise<void>;
  clearError: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (input: SessionInput): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await sessionService.createSession(input);
      setCurrentSession(session);
      return session.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSession = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await sessionService.getSession(id);
      if (session) {
        setCurrentSession(session);
      } else {
        setError('Session not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAllSessions = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const allSessions = await sessionService.getAllSessions();
      setSessions(allSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runSession = useCallback(async (id: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      // 1. Ensure we have the latest session data (specifically input)
      const session = await sessionService.getSession(id);
      if (!session) throw new Error('Session not found');

      setCurrentSession(session);

      // 2. Run the workflow on the backend
      const updatedSession = await sessionService.runSession(id, session.input);

      // 3. Update state with result
      setCurrentSession(updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        sessions,
        isLoading,
        error,
        createSession,
        loadSession,
        loadAllSessions,
        runSession,
        clearError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
