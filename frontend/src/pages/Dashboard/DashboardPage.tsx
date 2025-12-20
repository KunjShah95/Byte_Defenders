import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/store/session.context';
import { AgentCard } from '@/components/agents/AgentCard';
import { AgentTimeline } from '@/components/agents/AgentTimeline';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Card, CardContent } from '@/components/common/Card';

export default function DashboardPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, runSession, isLoading, error } = useSession();

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId).then(() => {
        // We can't rely on currentSession here as it's from the closure
        // But we can rely on the fact that if we just loaded it and it's pending, we might want to run it.
        // NOTE: This might cause double-runs if not careful, but usually acceptable.
      });
    }
  }, [sessionId]);

  // Trigger execution if loaded session is pending and not already running
  useEffect(() => {
    if (currentSession && currentSession.status === 'pending' && !isLoading && !error) {
      // Only run if we are not already loading and no error
      runSession(currentSession.id);
    }
  }, [currentSession?.id, currentSession?.status]);

  if (isLoading && !currentSession) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 max-w-lg text-center">
          <h3 className="font-semibold mb-2">Error Occurred</h3>
          <p>{error}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => sessionId && runSession(sessionId)} variant="primary">Retry</Button>
          <Button onClick={() => navigate('/')} variant="outline">Go Home</Button>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold text-foreground mb-2">Session Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested session could not be loaded.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const isComplete = currentSession.status === 'completed';
  // Consider running if status is running OR if we are currently loading (waiting for runSession)
  // and the status is pending/active.
  const isRunning = currentSession.status === 'running' || (isLoading && currentSession.status === 'pending');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Dashboard</h1>
          <p className="text-sm text-muted-foreground font-mono">{currentSession.id}</p>
        </div>
        <div className="flex gap-3">
          {isComplete && (
            <>
              <Button variant="secondary" onClick={() => navigate(`/explainability/${sessionId}`)}>
                View Explainability
              </Button>
              <Button onClick={() => navigate(`/result/${sessionId}`)}>
                View Results
              </Button>
            </>
          )}
        </div>
      </div>

      <Card variant="glass">
        <CardContent className="py-4">
          <AgentTimeline agents={currentSession.agents} />
        </CardContent>
      </Card>

      <Card variant="glass" className="p-4">
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground text-sm">Prompt:</span>
          <p className="text-foreground text-sm flex-1">{currentSession.input.prompt}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentSession.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} className="min-h-[240px]" />
        ))}
      </div>

      {isRunning && (
        <div className="text-center text-sm text-muted-foreground py-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="font-medium text-primary">Orchestrating Agents...</span>
          </div>
          <p>This may take up to a minute depending on complexity.</p>
        </div>
      )}

      {isComplete && (
        <div className="text-center">
          <p className="text-success text-sm mb-4">All agents have completed their tasks</p>
          <Button onClick={() => navigate(`/result/${sessionId}`)}>
            View Final Results →
          </Button>
        </div>
      )}
    </div>
  );
}
