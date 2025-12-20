import React from 'react';
import { Session } from '@/types/session.types';
import { SessionCard } from './SessionCard';
import { cn } from '@/lib/utils';

interface SessionListProps {
  sessions: Session[];
  className?: string;
}

export function SessionList({ sessions, className }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-foreground">No Sessions Yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first session to see it here
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-2', className)}>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
