import { useState, useCallback, ReactNode } from 'react';
import { Session, SessionInput, PaginationMeta } from '@/types/session.types';
import { sessionService } from '@/services/session.service';
import { SessionContext } from './session-context-base';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
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

  const loadAllSessions = useCallback(async (page?: number, limit?: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sessionService.getAllSessions(page, limit);
      setSessions(result.sessions);
      setPagination(result.pagination);
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
      // Build a temporary session with the input we have, then run the workflow
      const tempSession = currentSession;
      const input = tempSession?.input ?? { prompt: '', useCase: 'startup' as const, explainabilityMode: false };

      const updatedSession = await sessionService.runSession(id, input);
      setCurrentSession(updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run session');
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        sessions,
        pagination,
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
