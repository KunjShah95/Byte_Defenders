import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, USE_CASE_LABELS } from '@/types/session.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  className?: string;
}

export function SessionCard({ session, className }: SessionCardProps) {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-muted text-muted-foreground',
    running: 'bg-primary/20 text-primary',
    completed: 'bg-success/20 text-success',
    failed: 'bg-destructive/20 text-destructive',
  };

  const statusLabels = {
    pending: 'Pending',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card variant="glass" className={cn('transition-all hover:border-primary/30', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-mono truncate">{session.id}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{session.input.prompt}</CardDescription>
          </div>
          <span
            className={cn(
              'ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
              statusColors[session.status]
            )}
          >
            {statusLabels[session.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Use Case</p>
            <p className="text-sm font-medium">{USE_CASE_LABELS[session.input.useCase]}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Score</p>
            <p className="text-sm font-mono font-semibold text-primary">
              {session.result?.avgScore.toFixed(1) || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Iterations</p>
            <p className="text-sm font-mono font-medium">{session.result?.iterations || '—'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{formatDate(session.createdAt)}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/session/${session.id}`)}>
            View Details
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/${session.id}`)}>
            Re-Run
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
