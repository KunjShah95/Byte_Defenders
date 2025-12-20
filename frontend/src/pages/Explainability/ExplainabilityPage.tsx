import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/Tabs';
import { IdeaView } from '@/components/output/IdeaView';
import { CriticView } from '@/components/output/CriticView';
import { RefinerView } from '@/components/output/RefinerView';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Card, CardContent } from '@/components/common/Card';
import { AGENT_CONFIG } from '@/types/agent.types';

export default function ExplainabilityPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, isLoading } = useSession();

  useEffect(() => {
    if (sessionId && (!currentSession || currentSession.id !== sessionId)) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  if (isLoading || !currentSession) {
    return <PageLoader />;
  }

  const ideaAgent = currentSession.agents.find((a) => a.type === 'idea');
  const criticAgent = currentSession.agents.find((a) => a.type === 'critic');
  const refinerAgent = currentSession.agents.find((a) => a.type === 'refiner');
  const presenterAgent = currentSession.agents.find((a) => a.type === 'presenter');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Explainability View</h1>
          <p className="text-sm text-muted-foreground">
            Understand how each agent contributed to the final output
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/dashboard/${sessionId}`)}>
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate(`/result/${sessionId}`)}>
            View Results
          </Button>
        </div>
      </div>

      <Tabs defaultValue="idea">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="idea">
            {AGENT_CONFIG.idea.icon} Idea
          </TabsTrigger>
          <TabsTrigger value="critic">
            {AGENT_CONFIG.critic.icon} Critic
          </TabsTrigger>
          <TabsTrigger value="refiner">
            {AGENT_CONFIG.refiner.icon} Refiner
          </TabsTrigger>
          <TabsTrigger value="final">
            {AGENT_CONFIG.presenter.icon} Final
          </TabsTrigger>
        </TabsList>

        <TabsContent value="idea">
          {ideaAgent?.output ? (
            <IdeaView output={ideaAgent.output} />
          ) : (
            <EmptyState agent="Idea" />
          )}
        </TabsContent>

        <TabsContent value="critic">
          {criticAgent?.output ? (
            <CriticView output={criticAgent.output} />
          ) : (
            <EmptyState agent="Critic" />
          )}
        </TabsContent>

        <TabsContent value="refiner">
          {refinerAgent?.output ? (
            <RefinerView output={refinerAgent.output} />
          ) : (
            <EmptyState agent="Refiner" />
          )}
        </TabsContent>

        <TabsContent value="final">
          {presenterAgent?.output ? (
            <Card variant="glass">
              <CardContent className="pt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2">Presenter Output</h4>
                  <p className="text-sm text-foreground">{presenterAgent.output.content}</p>
                </div>
                {presenterAgent.output.structuredData && (
                  <div>
                    <h5 className="text-xs text-muted-foreground mb-2">Structured Data</h5>
                    <pre className="bg-secondary/50 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto">
                      {JSON.stringify(presenterAgent.output.structuredData, null, 2)}
                    </pre>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Final Score</span>
                  <span className="font-mono font-bold text-primary">
                    {presenterAgent.output.score?.toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState agent="Presenter" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ agent }: { agent: string }) {
  return (
    <Card variant="glass">
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">
          {agent} Agent has not produced output yet
        </p>
      </CardContent>
    </Card>
  );
}
