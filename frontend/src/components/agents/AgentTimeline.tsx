import React from 'react';
import { Agent, AGENT_CONFIG } from '@/types/agent.types';
import { cn } from '@/lib/utils';

interface AgentTimelineProps {
  agents: Agent[];
  className?: string;
}

export function AgentTimeline({ agents, className }: AgentTimelineProps) {
  const statusColors = {
    waiting: 'bg-muted',
    running: 'bg-primary animate-pulse-glow',
    done: 'bg-success',
    error: 'bg-destructive',
  };

  const lineColors = {
    waiting: 'bg-muted/30',
    running: 'bg-primary/50',
    done: 'bg-success/50',
    error: 'bg-destructive/50',
  };

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {agents.map((agent, index) => {
        const config = AGENT_CONFIG[agent.type];
        const isLast = index === agents.length - 1;

        return (
          <React.Fragment key={agent.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300',
                  statusColors[agent.status]
                )}
              >
                {config.icon}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{config.name.split(' ')[0]}</span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-2 transition-all duration-300',
                  agent.status === 'done' ? lineColors.done : lineColors.waiting
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
