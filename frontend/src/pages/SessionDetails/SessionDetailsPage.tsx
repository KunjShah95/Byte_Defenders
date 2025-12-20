import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/store/session.context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { AGENT_CONFIG } from '@/types/agent.types';
import { USE_CASE_LABELS } from '@/types/session.types';
import { cn } from '@/lib/utils';

export default function SessionDetailsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, isLoading } = useSession();

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  if (isLoading || !currentSession) {
    return <PageLoader />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColors = {
    pending: 'bg-muted text-muted-foreground',
    running: 'bg-primary/20 text-primary',
    completed: 'bg-success/20 text-success',
    failed: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Session Details</h1>
          <p className="text-sm text-muted-foreground font-mono">{currentSession.id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/history')}>
            Back to History
          </Button>
          <Button onClick={() => navigate(`/dashboard/${sessionId}`)}>
            Re-Run Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base">Session Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                  statusColors[currentSession.status]
                )}
              >
                {currentSession.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Use Case</span>
              <span className="text-sm font-medium">
                {USE_CASE_LABELS[currentSession.input.useCase]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Explainability</span>
              <span className="text-sm font-medium">
                {currentSession.input.explainabilityMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">{formatDate(currentSession.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base">Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSession.result ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Score</span>
                  <span className="text-2xl font-mono font-bold text-primary">
                    {currentSession.result.avgScore.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Iterations</span>
                  <span className="text-sm font-mono font-medium">
                    {currentSession.result.iterations}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No results available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base">Input Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{currentSession.input.prompt}</p>
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base">Agent Outputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSession.agents.map((agent) => (
            <div key={agent.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <span>{AGENT_CONFIG[agent.type].icon}</span>
                <span className="font-medium">{AGENT_CONFIG[agent.type].name}</span>
                {agent.output?.score && (
                  <span className="ml-auto font-mono text-sm text-primary">
                    {agent.output.score.toFixed(1)}
                  </span>
                )}
              </div>
              {agent.output ? (
                <p className="text-sm text-muted-foreground">{agent.output.content}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No output</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
