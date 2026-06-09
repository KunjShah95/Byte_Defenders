import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, CheckCircle2, Circle, ChevronRight,
  Shield, Eye, ArrowRight, Target, Lightbulb, Clock,
  Rocket, TestTube, Github, Server, Puzzle, Zap, Wrench
} from 'lucide-react';

const CRITICAL_ISSUES = [
  { id: 'port-mismatch', icon: Server, title: 'Port Mismatch', severity: 'critical' as const, description: 'README.md still documents port :3001 everywhere.', fix: 'Sync README port references to :3000, add .env.example with PORT=3000', impact: 'High — blocks all new contributors on first run', file: 'README.md' },
  { id: 'supabase-key', icon: Shield, title: 'Missing Supabase Service Role Key', severity: 'critical' as const, description: 'No .env.example exists. The SERVICE_ROLE_KEY is easy to miss.', fix: 'Create .env.example with all required env vars', impact: 'High — RLS bypass creates silent data integrity issues', file: '.env.example' },
  { id: 'explainability-view', icon: Eye, title: 'Broken Explainability View', severity: 'critical' as const, description: 'Always showing empty agents.', fix: 'Fix type definitions, deduplicate API calls', impact: 'Medium — feature is broken, extra API overhead', file: 'session.service.ts' },
];

const STRUCTURAL_GAPS = [
  { icon: TestTube, title: 'Zero Test Coverage', description: 'For a multi-agent AI system, any prompt change can silently break outputs.', severity: 'high' as const },
  { icon: Github, title: 'No CI Pipeline', description: 'No GitHub Actions or CI configuration exists.', severity: 'high' as const },
];

const ROADMAP_PHASES = [
  { id: 'phase-0', icon: Wrench, title: 'Phase 0 — Foundation Fixes', timeline: 'Today', effort: '< 2 hours', color: 'from-red-500/20 to-orange-500/20' as const, iconColor: 'text-red-400' as const, items: [{ label: 'Create .env.example', done: false }, { label: 'Sync port references to :3000', done: false }, { label: 'Add env validation on startup', done: false }] },
  { id: 'phase-1', icon: Zap, title: 'Phase 1 — SSE Streaming', timeline: 'This week', effort: '1-2 days', color: 'from-amber-500/20 to-yellow-500/20' as const, iconColor: 'text-amber-400' as const, items: [{ label: 'Stream each agent output as it completes', done: false }, { label: 'Turn 30-60s black box into live experience', done: false }] },
  { id: 'phase-2', icon: Rocket, title: 'Phase 2 — Test Coverage + CI', timeline: 'Next week', effort: '2-3 days', color: 'from-blue-500/20 to-cyan-500/20' as const, iconColor: 'text-blue-400' as const, items: [{ label: 'Mock AI calls for deterministic tests', done: false }, { label: 'Add Vitest + Supertest for API tests', done: false }, { label: 'Wire up GitHub Actions', done: false }] },
];

function SeverityBadge({ severity }: { severity: 'critical' | 'high' | 'medium' | 'low' }) {
  const styles = { critical: 'bg-red-500/15 text-red-400 border-red-500/30', high: 'bg-orange-500/15 text-orange-400 border-orange-500/30', medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', low: 'bg-green-500/15 text-green-400 border-green-500/30' };
  const icons = { critical: AlertTriangle, high: AlertTriangle, medium: Circle, low: CheckCircle2 };
  const Icon = icons[severity];
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider', styles[severity])}><Icon className="h-3 w-3" />{severity}</span>;
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="group">
      <div className={cn('absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100', color)} />
      <div className="relative rounded-2xl border border-white/5 bg-card/30 p-6 text-center backdrop-blur-sm transition-all duration-300 group-hover:border-primary/20 group-hover:scale-[1.02]">
        <div className={cn('mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br', color)}><Icon className="h-6 w-6 text-white" /></div>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function IssueCard({ issue, index }: { issue: typeof CRITICAL_ISSUES[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = issue.icon;
  return (
    <button onClick={() => setExpanded(!expanded)} className="group w-full rounded-2xl border border-white/5 bg-card/30 p-5 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/50">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20"><Icon className="h-5 w-5 text-red-400" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-3"><h3 className="text-sm font-semibold text-foreground">#{index + 1} — {issue.title}</h3><SeverityBadge severity={issue.severity} /></div>
          <p className="text-sm leading-relaxed text-muted-foreground">{issue.description}</p>
          <div className={cn('overflow-hidden transition-all duration-300', expanded ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
            <div className="space-y-3 border-t border-white/5 pt-3">
              <div><p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Recommended Fix</p><p className="text-sm text-foreground/90">{issue.fix}</p></div>
              <div className="flex items-center justify-between">
                <div><p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Impact</p><p className="text-sm text-warning">{issue.impact}</p></div>
                <div className="text-right"><p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">File</p><code className="text-xs font-mono text-primary">{issue.file}</code></div>
              </div>
            </div>
          </div>
        </div>
        <ChevronRight className={cn('mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200', expanded && 'rotate-90')} />
      </div>
    </button>
  );
}

function PhaseCard({ phase, index: _index }: { phase: typeof ROADMAP_PHASES[number]; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const Icon = phase.icon;
  const doneCount = phase.items.filter((i) => i.done).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/20">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-start gap-4 p-6">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br', phase.color)}><Icon className={cn('h-6 w-6', phase.iconColor)} /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-3"><h3 className="font-semibold text-foreground">{phase.title}</h3><span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{phase.timeline}</span></div>
          <div className="mt-1 flex items-center gap-4"><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{phase.effort}</div><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Target className="h-3 w-3" />{doneCount}/{phase.items.length} tasks</div></div>
        </div>
        <ChevronRight className={cn('mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200', expanded && 'rotate-90')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', expanded ? 'max-h-96' : 'max-h-0')}>
        <div className="space-y-3 px-6 pb-6">
          <div className="h-px bg-white/5" />
          {phase.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', item.done ? 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground/30')} />
              <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground/80')}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuditDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundBeams className="opacity-10" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-16 px-4 py-12">
        {/* Header */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20"><Target className="h-5 w-5 text-red-400" /></div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Audit Report</p>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl">Project Audit & <span className="text-gradient">Roadmap</span></h1>
            <p className="max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">Comprehensive analysis of the Byte Defenders multi-agent AI system. <span className="font-medium text-warning">3 critical issues</span> identified, <span className="font-medium text-orange-400">2 structural gaps</span>, and a phased plan.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
            <MetricCard label="Critical Issues" value="3" icon={AlertTriangle} color="from-red-500/20 to-orange-500/20" />
            <MetricCard label="Structural Gaps" value="2" icon={Puzzle} color="from-orange-500/20 to-yellow-500/20" />
            <MetricCard label="Roadmap Phases" value="3" icon={Rocket} color="from-blue-500/20 to-cyan-500/20" />
            <MetricCard label="Est. Total Effort" value="~40h" icon={Clock} color="from-purple-500/20 to-pink-500/20" />
          </div>
        </motion.section>

        {/* Critical Issues */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-red-400" /><h2 className="text-2xl font-bold text-foreground">Critical Issues</h2><span className="rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">Fix Immediately</span></div>
              <p className="mt-1 text-sm text-muted-foreground">These issues block contributors, break features, or introduce silent data integrity problems.</p>
            </div>
          </div>
          <div className="space-y-3">{CRITICAL_ISSUES.map((issue, index) => (<IssueCard key={issue.id} issue={issue} index={index} />))}</div>
        </motion.section>

        {/* Structural Gaps */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
          <div>
            <div className="mb-1 flex items-center gap-3"><Puzzle className="h-5 w-5 text-orange-400" /><h2 className="text-2xl font-bold text-foreground">Structural Gaps</h2><span className="rounded-full border border-orange-500/30 bg-orange-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-400">Risk Area</span></div>
            <p className="mt-1 text-sm text-muted-foreground">Missing foundational infrastructure that creates risk for the entire project.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {STRUCTURAL_GAPS.map((gap) => {
              const Icon = gap.icon;
              return (
                <div key={gap.title} className="rounded-2xl border border-white/5 bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-orange-400/30">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20"><Icon className="h-5 w-5 text-orange-400" /></div>
                  <h3 className="mb-1 font-semibold text-foreground">{gap.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{gap.description}</p>
                  <div className="flex items-center gap-2"><SeverityBadge severity={gap.severity} /><span className="text-xs text-muted-foreground">{gap.title === 'Zero Test Coverage' ? 'Any prompt change can break outputs' : 'Regressions go undetected'}</span></div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Roadmap */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-3"><Rocket className="h-5 w-5 text-primary" /><span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Remediation Plan</span></div>
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Prioritized Execution <span className="text-gradient">Roadmap</span></h2>
            <p className="text-sm text-muted-foreground">Ordered by impact and dependency.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-red-500/50 via-amber-500/50 to-blue-500/50 md:block" />
            <div className="relative space-y-6">
              {ROADMAP_PHASES.map((phase, index) => (
                <div key={phase.id} className="relative md:pl-20">
                  <div className="absolute left-0 top-6 hidden h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-card/30 md:flex"><span className="text-2xl font-bold text-primary">{index + 1}</span></div>
                  <PhaseCard phase={phase} index={index} />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/5 bg-card/30 p-4 backdrop-blur-sm">
              <Lightbulb className="h-5 w-5 text-primary" /><p className="text-sm text-muted-foreground">Total estimated effort: <span className="font-semibold text-foreground">~40 hours</span></p>
              <Button variant="ghost" size="sm" onClick={() => navigate('/create')} className="gap-2 text-muted-foreground hover:text-foreground">Start new session <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
