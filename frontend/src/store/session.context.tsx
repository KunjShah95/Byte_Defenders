import { useState, useCallback, ReactNode } from 'react';
import { Session, SessionInput } from '@/types/session.types';
import { sessionService } from '@/services/session.service';
import { SessionContext } from './session-context-base';

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
      const session = await sessionService.getSession(id);
      if (!session) throw new Error('Session not found');

      setCurrentSession(session);

      const updatedSession = await sessionService.runSession(id, session.input);

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
