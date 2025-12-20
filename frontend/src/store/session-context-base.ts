import { createContext } from 'react';
import { Session, SessionInput } from '@/types/session.types';

export interface SessionContextType {
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

export const SessionContext = createContext<SessionContextType | undefined>(undefined);
