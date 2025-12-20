import React, { useEffect, useRef } from 'react';
import { AgentLog } from '@/types/agent.types';
import { cn } from '@/lib/utils';

interface AgentLogsProps {
  logs: AgentLog[];
  isRunning?: boolean;
  maxHeight?: string;
}

export function AgentLogs({ logs, isRunning, maxHeight = '120px' }: AgentLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const logTypeColors = {
    info: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
  };

  if (logs.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-md bg-secondary/30 text-muted-foreground"
        style={{ height: maxHeight }}
      >
        <span className="text-xs">
          {isRunning ? 'Initializing...' : 'Waiting for execution'}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="overflow-y-auto rounded-md bg-secondary/30 scrollbar-thin"
      style={{ maxHeight }}
    >
      <div className="agent-log p-2">
        {logs.map((log, index) => (
          <div
            key={log.id}
            className={cn(
              'agent-log-entry',
              logTypeColors[log.type],
              index === logs.length - 1 && isRunning && 'animate-pulse'
            )}
          >
            <span className="text-muted-foreground/60">
              {new Date(log.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <span className="mx-2">→</span>
            <span>{log.message}</span>
          </div>
        ))}
        {isRunning && (
          <div className="agent-log-entry text-primary animate-pulse">
            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2" />
            Processing...
          </div>
        )}
      </div>
    </div>
  );
}
