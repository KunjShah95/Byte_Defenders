import { createContext } from 'react';
import { Session, SessionInput, PaginationMeta } from '@/types/session.types';

export interface SessionContextType {
    currentSession: Session | null;
    sessions: Session[];
    isLoading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
    createSession: (input: SessionInput) => Promise<string>;
    loadSession: (id: string) => Promise<void>;
    loadAllSessions: (page?: number, limit?: number) => Promise<void>;
    runSession: (id: string) => Promise<void>;
    clearError: () => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);
