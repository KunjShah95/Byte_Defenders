import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/use-session';
import { AgentCard } from '@/components/agents/AgentCard';
import { Button } from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { Agent, AgentType } from '@/types/agent.types';
import { cn } from '@/lib/utils';
import { API_BASE } from '@/services/api';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Sparkles, ChevronRight, ArrowRight, Brain, Zap } from 'lucide-react';

type LiveAgentStatus = { agentType: string; status: 'waiting' | 'running' | 'done'; step: number; message?: string };

interface AgentStartedEvent { type: 'agent:started'; sessionId: string; agent: string; agentType: string; step: number; timestamp: string; }
interface AgentCompletedEvent { type: string; sessionId: string; agent: string; agentType: string; output?: { output?: { text?: string }; duration?: number }; timestamp: string; }

const LIVE_AGENTS: { type: AgentType; icon: string; label: string; color: string }[] = [
  { type: 'idea', icon: '💡', label: 'Idea', color: 'from-blue-500/30 to-cyan-500/30' },
  { type: 'critic', icon: '🔍', label: 'Critic', color: 'from-amber-500/30 to-orange-500/30' },
  { type: 'refiner', icon: '✨', label: 'Refiner', color: 'from-emerald-500/30 to-teal-500/30' },
  { type: 'presenter', icon: '📊', label: 'Presenter', color: 'from-purple-500/30 to-pink-500/30' },
];

export default function DashboardPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentSession, loadSession, runSession, isLoading, error } = useSession();

  const [liveStatuses, setLiveStatuses] = useState<LiveAgentStatus[]>(LIVE_AGENTS.map((a) => ({ agentType: a.type, status: 'waiting' as const, step: 0 })));
  const [liveOutputs, setLiveOutputs] = useState<Map<AgentType, string>>(new Map());
  const [sseConnected, setSseConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => { if (sessionId) loadSession(sessionId); }, [sessionId]); // eslint-disable-line
  useEffect(() => { if (currentSession && currentSession.status === 'pending' && !isLoading && !error) runSession(currentSession.id); }, [currentSession?.id, currentSession?.status]); // eslint-disable-line

  useEffect(() => {
    if (!sessionId) return;
    if (currentSession && currentSession.status !== 'pending' && currentSession.status !== 'running') return;

    const es = new EventSource(`${API_BASE}/events/subscribe?sessionId=${sessionId}`);
    eventSourceRef.current = es;
    es.onopen = () => setSseConnected(true);
    es.onmessage = (event) => {
      if (!event.data || event.data === ':heartbeat') return;
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'connected') return;
        const eventType = parsed.type || '';
        const payload = parsed.data || parsed;

        if (eventType === 'agent:started') {
          const msg = payload as AgentStartedEvent;
          setLiveStatuses((prev) => prev.map((s) => s.agentType === msg.agentType ? { ...s, status: 'running', step: msg.step, message: `${msg.agent} is working...` } : s));
        }
        if (eventType.endsWith(':completed') && eventType.startsWith('agent:')) {
          const msg = payload as AgentCompletedEvent;
          const agentType = msg.agentType as AgentType;
          setLiveStatuses((prev) => prev.map((s) => s.agentType === agentType ? { ...s, status: 'done', message: `${msg.agent} complete` } : s));
          if (msg.output?.output?.text) setLiveOutputs((prev) => new Map(prev).set(agentType, msg.output!.output!.text!));
        }
      } catch { /* ignore */ }
    };
    es.onerror = () => setSseConnected(false);
    return () => { es.close(); eventSourceRef.current = null; setSseConnected(false); };
  }, [sessionId, currentSession?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (currentSession?.status === 'completed') setLiveStatuses(LIVE_AGENTS.map((a) => ({ agentType: a.type, status: 'done' as const, step: 4, message: 'Complete' }))); }, [currentSession]);

  if (isLoading && !currentSession) return <PageLoader />;

  if (error) {
    const is404 = error.includes('404') || error.toLowerCase().includes('not found');
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-6">
        <div className="max-w-lg rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center backdrop-blur-sm">
          <h3 className="mb-2 font-semibold text-destructive">{is404 ? 'Session Expired' : 'Error Occurred'}</h3>
          <p className="text-sm text-muted-foreground">{is404 ? 'The session data is missing. Please start a new session.' : error}</p>
        </div>
        <div className="flex gap-4">
          {!is404 && <Button onClick={() => sessionId && runSession(sessionId)} variant="primary">Retry</Button>}
          <Button onClick={() => navigate('/')} variant="outline">Start New Session</Button>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Session Not Found</h2>
        <p className="mb-4 text-muted-foreground">The requested session could not be loaded.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const isComplete = currentSession.status === 'completed';
  const isRunning = currentSession.status === 'running' || (isLoading && currentSession.status === 'pending');

  const mergedAgents = currentSession.agents.length > 0
    ? currentSession.agents
    : LIVE_AGENTS.map((a) => ({
        id: a.type, type: a.type, name: a.label,
        status: (isRunning ? liveStatuses.find((s) => s.agentType === a.type)?.status : 'done') as 'waiting' | 'running' | 'done',
        output: liveOutputs.has(a.type) ? { content: liveOutputs.get(a.type)!, agentType: a.type, score: undefined } : undefined,
      } as Agent));

  const runningAgent = liveStatuses.find((s) => s.status === 'running');

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundBeams className="opacity-10" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 p-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="font-mono text-xs text-muted-foreground">{currentSession.id}</p>
          </div>
          <div className="flex items-center gap-3">
            {isRunning && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn('h-2 w-2 rounded-full', sseConnected ? 'bg-success animate-pulse' : 'bg-muted-foreground')} />
                {sseConnected ? 'Live' : 'Connecting...'}
              </span>
            )}
            {isComplete && (
              <>
                <Button variant="outline" onClick={() => navigate(`/explainability/${sessionId}`)} className="border-white/10 bg-white/5 hover:bg-white/10">View Explainability</Button>
                <Button onClick={() => navigate(`/result/${sessionId}`)} className="bg-primary hover:bg-primary/90">View Results</Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Agent Pipeline Visualization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-card/30 backdrop-blur-sm p-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {LIVE_AGENTS.map((agent, idx) => {
              const status = liveStatuses.find((s) => s.agentType === agent.type);
              const isActive = status?.status === 'running';
              const isDone = status?.status === 'done';

              return (
                <React.Fragment key={agent.type}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                      'flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-2xl transition-all duration-500',
                      isActive ? 'border-primary bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg shadow-primary/30 scale-110' : isDone ? 'border-success bg-success/10' : 'border-white/10 bg-card/50'
                    )}>
                      <span className={cn(isActive && 'animate-bounce')}>{agent.icon}</span>
                    </div>
                    <div className="text-center">
                      <p className={cn('text-sm font-medium transition-colors', isActive ? 'text-primary' : isDone ? 'text-success' : 'text-muted-foreground')}>{agent.label}</p>
                      {status?.message && <p className="mt-0.5 max-w-20 truncate text-[10px] text-muted-foreground">{status.message}</p>}
                    </div>
                  </div>
                  {idx < LIVE_AGENTS.length - 1 && (
                    <div className="hidden sm:flex items-center">
                      <div className={cn('h-0.5 w-8 md:w-16 transition-colors duration-500', isDone ? 'bg-success' : isActive ? 'bg-primary/50' : 'bg-white/10')} />
                      <ChevronRight className={cn('h-4 w-4 -ml-1 transition-colors', isDone ? 'text-success' : 'text-muted-foreground/30')} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Status message */}
          <div className="mt-6 text-center">
            {isRunning && (
              <div className="flex flex-col items-center gap-1">
                <p className="flex items-center gap-2 text-sm font-medium text-primary"><Zap className="h-4 w-4 animate-pulse" />{runningAgent ? runningAgent.message || 'Processing...' : 'Orchestrating Agents...'}</p>
                <p className="text-xs text-muted-foreground">This may take up to a minute depending on complexity.</p>
              </div>
            )}
            {isComplete && <p className="flex items-center justify-center gap-2 text-sm text-success"><Sparkles className="h-4 w-4" /> All agents have completed their tasks ✓</p>}
          </div>
        </motion.div>

        {/* Prompt Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/5 bg-card/30 backdrop-blur-sm p-6">
          <div className="flex items-start gap-3">
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prompt</span>
              <p className="mt-1 text-sm text-foreground">{currentSession.input.prompt}</p>
            </div>
          </div>
        </motion.div>

        {/* Agent Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mergedAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} className="min-h-[180px]" />
          ))}
        </motion.div>

        {isComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
            <Button onClick={() => navigate(`/result/${sessionId}`)} className="bg-primary hover:bg-primary/90">
              View Final Results <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
