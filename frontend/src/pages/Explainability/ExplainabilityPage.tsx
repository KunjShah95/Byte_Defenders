import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/use-session';
import { sessionService } from '@/services/session.service';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/Tabs';
import { IdeaView } from '@/components/output/IdeaView';
import { CriticView } from '@/components/output/CriticView';
import { RefinerView } from '@/components/output/RefinerView';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { AGENT_CONFIG, Agent } from '@/types/agent.types';
import { Brain, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

export default function ExplainabilityPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, isLoading } = useSession();

  const [explainAgents, setExplainAgents] = useState<Agent[] | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  useEffect(() => { if (sessionId && (!currentSession || currentSession.id !== sessionId)) loadSession(sessionId); }, [sessionId]); // eslint-disable-line

  useEffect(() => {
    if (!sessionId || currentSession?.status !== 'completed') return;
    let cancelled = false;
    setExplainLoading(true);
    sessionService.fetchSessionAgents(sessionId).then(agents => { if (!cancelled) { setExplainAgents(agents); setExplainLoading(false); } });
    return () => { cancelled = true; };
  }, [sessionId, currentSession?.status]);

  const agents = explainAgents ?? currentSession?.agents ?? [];
  const agentsResolved = explainLoading ? null : agents;
  const hasAnyOutput = agentsResolved ? agentsResolved.some(a => a.output) : false;

  if (isLoading && !currentSession) return <PageLoader />;

  const ideaAgent = agentsResolved?.find((a) => a.type === 'idea');
  const criticAgent = agentsResolved?.find((a) => a.type === 'critic');
  const refinerAgent = agentsResolved?.find((a) => a.type === 'refiner');
  const presenterAgent = agentsResolved?.find((a) => a.type === 'presenter');

  const EmptyState = ({ agent }: { agent: string }) => (
    <div className="rounded-2xl border border-white/5 bg-card/30 p-12 text-center backdrop-blur-sm">
      <p className="text-muted-foreground">{agent} Agent has not produced output yet</p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundBeams className="opacity-10" />
      <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><Brain className="h-6 w-6 text-primary" />Explainability View</h1>
            <p className="text-sm text-muted-foreground">Understand how each agent contributed to the final output</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(`/dashboard/${sessionId}`)} className="border-white/10 bg-white/5 hover:bg-white/10"><ArrowLeft className="mr-2 h-4 w-4" />Dashboard</Button>
            {currentSession?.status === 'completed' && (
              <Button onClick={() => navigate(`/result/${sessionId}`)} className="bg-primary hover:bg-primary/90"><Sparkles className="mr-2 h-4 w-4" />Results</Button>
            )}
          </div>
        </motion.div>

        {!currentSession?.status && (
          <div className="rounded-2xl border border-white/5 bg-card/30 p-12 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">Session not found.</p>
            <Button className="mt-4" onClick={() => navigate('/')}>Start New Session</Button>
          </div>
        )}

        {currentSession?.status && currentSession.status !== 'completed' && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            </div>
            <p className="mb-2 font-semibold text-foreground">Session In Progress</p>
            <p className="mb-6 text-sm text-muted-foreground">The agents are still processing. Explainability data will appear once complete.</p>
            <Button onClick={() => navigate(`/dashboard/${sessionId}`)}>Go to Dashboard</Button>
          </div>
        )}

        {currentSession?.status === 'completed' && explainLoading && (
          <div className="rounded-2xl border border-white/5 bg-card/30 p-12 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">Loading explainability data...</p>
          </div>
        )}

        {currentSession?.status === 'completed' && !explainLoading && !hasAnyOutput && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-sm">
            <p className="mb-2 font-semibold text-destructive">No Explainability Data Available</p>
            <p className="mb-4 text-sm text-muted-foreground">This session completed but no agent output data was found.</p>
            <Button onClick={() => navigate('/')}>Start New Session</Button>
          </div>
        )}

        {hasAnyOutput && (
          <Tabs defaultValue="idea">
            <TabsList className="w-full justify-start rounded-2xl border border-white/5 bg-card/30 p-1 backdrop-blur-sm">
              {[
                { value: 'idea', icon: AGENT_CONFIG.idea.icon, label: 'Idea', agent: ideaAgent },
                { value: 'critic', icon: AGENT_CONFIG.critic.icon, label: 'Critic', agent: criticAgent },
                { value: 'refiner', icon: AGENT_CONFIG.refiner.icon, label: 'Refiner', agent: refinerAgent },
                { value: 'final', icon: AGENT_CONFIG.presenter.icon, label: 'Final', agent: presenterAgent },
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground">
                  {tab.icon} {tab.label}
                  {tab.agent?.output && <span className="text-xs text-success">✓</span>}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="idea" className="mt-4">{ideaAgent?.output ? <IdeaView output={ideaAgent.output} /> : <EmptyState agent="Idea" />}</TabsContent>
            <TabsContent value="critic" className="mt-4">{criticAgent?.output ? <CriticView output={criticAgent.output} /> : <EmptyState agent="Critic" />}</TabsContent>
            <TabsContent value="refiner" className="mt-4">{refinerAgent?.output ? <RefinerView output={refinerAgent.output} /> : <EmptyState agent="Refiner" />}</TabsContent>
            <TabsContent value="final" className="mt-4">
              {presenterAgent?.output ? (
                <div className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-primary">Presenter Output</h4>
                      <p className="text-sm text-foreground">{presenterAgent.output.content}</p>
                    </div>
                    {presenterAgent.output.structuredData && (
                      <div>
                        <h5 className="mb-2 text-xs text-muted-foreground">Structured Data</h5>
                        <pre className="overflow-x-auto rounded-xl border border-white/5 bg-black/30 p-4 text-xs font-mono text-foreground">{JSON.stringify(presenterAgent.output.structuredData, null, 2)}</pre>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 text-sm">
                      <span className="text-muted-foreground">Final Score</span>
                      <span className="font-mono font-bold text-primary">{presenterAgent.output.score?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ) : <EmptyState agent="Presenter" />}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
