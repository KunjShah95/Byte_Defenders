import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { AGENT_CONFIG } from '@/types/agent.types';
import { USE_CASE_LABELS } from '@/types/session.types';
import { cn } from '@/lib/utils';
import { ArrowLeft, RefreshCw, Bot, Brain, Target } from 'lucide-react';

const statusColors = { pending: 'bg-muted text-muted-foreground', running: 'bg-primary/20 text-primary', completed: 'bg-success/20 text-success', failed: 'bg-destructive/20 text-destructive' };

export default function SessionDetailsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, isLoading, error } = useSession();

  useEffect(() => { if (sessionId) loadSession(sessionId); }, [sessionId]); // eslint-disable-line

  if (isLoading) return <PageLoader />;

  if (error || !currentSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center backdrop-blur-sm">
          <h2 className="mb-2 text-xl font-semibold text-destructive">Session Not Found</h2>
          <p className="mb-6 text-sm text-muted-foreground">The session data is missing. Please start a new session.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/history')} className="border-white/10 bg-white/5 hover:bg-white/10">View History</Button>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">New Session</Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundBeams className="opacity-10" />
      <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Session Details</h1>
            <p className="font-mono text-xs text-muted-foreground">{currentSession.id}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/history')} className="border-white/10 bg-white/5 hover:bg-white/10"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
            <Button onClick={() => navigate(`/dashboard/${sessionId}`)} className="bg-primary hover:bg-primary/90"><RefreshCw className="mr-2 h-4 w-4" />Re-Run</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Metadata Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground"><Brain className="h-5 w-5 text-primary" />Session Metadata</h3>
            <div className="space-y-3">
              {[
                { label: 'Status', value: <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', statusColors[currentSession.status])}>{currentSession.status}</span> },
                { label: 'Use Case', value: <span className="text-sm font-medium">{USE_CASE_LABELS[currentSession.input.useCase]}</span> },
                { label: 'Explainability', value: <span className="text-sm font-medium">{currentSession.input.explainabilityMode ? 'Enabled' : 'Disabled'}</span> },
                { label: 'Created', value: <span className="text-sm">{formatDate(currentSession.createdAt)}</span> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  {item.value}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scores Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground"><Target className="h-5 w-5 text-primary" />Scores</h3>
            {currentSession.result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Score</span>
                  <span className="font-mono text-3xl font-bold text-primary">{currentSession.result.avgScore.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Iterations</span>
                  <span className="font-mono text-lg font-medium text-foreground">{currentSession.result.iterations}</span>
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground">No results available</p>}
          </motion.div>
        </div>

        {/* Prompt Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground"><Brain className="h-4 w-4 text-primary" />Input Prompt</h3>
          <p className="text-sm text-foreground">{currentSession.input.prompt}</p>
        </motion.div>

        {/* Agent Outputs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground"><Bot className="h-5 w-5 text-primary" />Agent Outputs</h3>
          <div className="space-y-4">
            {currentSession.agents.map((agent) => {
              const config = AGENT_CONFIG[agent.type] || { name: agent.name || 'Unknown', description: '', icon: '🤖' };
              return (
                <div key={agent.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="font-medium text-foreground">{config.name}</span>
                    {agent.output?.score && <span className="ml-auto font-mono text-sm text-primary">{agent.output.score.toFixed(1)}</span>}
                  </div>
                  {agent.output ? <p className="text-sm text-muted-foreground">{agent.output.content}</p> : <p className="text-sm italic text-muted-foreground">No output</p>}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
