import React from 'react';
import { Agent, AGENT_CONFIG } from '@/types/agent.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { AgentLogs } from './AgentLogs';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
  const config = AGENT_CONFIG[agent.type];

  const statusColors = {
    waiting: 'status-dot-waiting',
    running: 'status-dot-running',
    done: 'status-dot-done',
    error: 'status-dot-error',
  };

  const statusLabels = {
    waiting: 'Waiting',
    running: 'Running',
    done: 'Done',
    error: 'Error',
  };

  const statusBadgeColors = {
    waiting: 'bg-muted text-muted-foreground',
    running: 'bg-primary/20 text-primary',
    done: 'bg-success/20 text-success',
    error: 'bg-destructive/20 text-destructive',
  };

  return (
    <Card
      variant="glass"
      className={cn(
        'flex flex-col transition-all duration-300',
        agent.status === 'running' && 'ring-1 ring-primary/50',
        agent.status === 'done' && 'ring-1 ring-success/30',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <CardTitle className="text-base">{config.name}</CardTitle>
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
              statusBadgeColors[agent.status]
            )}
          >
            <div className={cn('status-dot', statusColors[agent.status])} />
            {statusLabels[agent.status]}
          </div>
        </div>
        <CardDescription className="text-xs">{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <AgentLogs logs={agent.logs} isRunning={agent.status === 'running'} />
      </CardContent>
      {agent.output && agent.status === 'done' && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Score</span>
            <span className="font-mono font-semibold text-primary">{agent.output.score?.toFixed(1)}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
