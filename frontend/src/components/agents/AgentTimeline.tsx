import React, { useState, useEffect } from 'react';
import { Agent, AGENT_CONFIG, AgentStatus } from '@/types/agent.types';
import { cn } from '@/lib/utils';

interface AgentExecutionStatus {
  sessionId: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  startTime?: string;
  endTime?: string;
  progress: number;
  message?: string;
  error?: string;
}

interface AgentTimelineProps {
  agents: Agent[];
  sessionId?: string;
  className?: string;
  onStatusUpdate?: (agentId: string, status: AgentExecutionStatus) => void;
}

export function AgentTimeline({ agents, sessionId, className, onStatusUpdate }: AgentTimelineProps) {
  const [agentStatuses, setAgentStatuses] = useState<Map<string, AgentExecutionStatus>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  // Real-time status colors
  const statusColors = {
    waiting: 'bg-muted',
    pending: 'bg-yellow-100 border-yellow-300',
    running: 'bg-primary animate-pulse-glow',
    retrying: 'bg-orange-100 border-orange-300 animate-pulse',
    completed: 'bg-success',
    done: 'bg-success',
    error: 'bg-destructive',
    failed: 'bg-destructive',
  };

  // Line colors for connecting lines
  const lineColors = {
    waiting: 'bg-muted/30',
    pending: 'bg-yellow-300/50',
    running: 'bg-primary/50',
    retrying: 'bg-orange-300/50',
    completed: 'bg-success/50',
    done: 'bg-success/50',
    error: 'bg-destructive/50',
    failed: 'bg-destructive/50',
  };

  // WebSocket/SSE connection for real-time updates
  useEffect(() => {
    if (!sessionId) return;

    const connectToEventStream = () => {
      try {
        const eventSourceUrl = `/api/sessions/${sessionId}/events`;
        const es = new EventSource(eventSourceUrl);
        
        es.onopen = () => {
          console.log('Connected to agent status stream');
          setIsConnected(true);
        };

        es.onmessage = (event) => {
          try {
            const statusUpdate: AgentExecutionStatus = JSON.parse(event.data);
            
            if (statusUpdate.sessionId === sessionId) {
              setAgentStatuses(prev => new Map(prev.set(statusUpdate.agentId, statusUpdate)));
              onStatusUpdate?.(statusUpdate.agentId, statusUpdate);
            }
          } catch (error) {
            console.error('Error parsing status update:', error);
          }
        };

        es.onerror = (error) => {
          console.error('EventSource error:', error);
          setIsConnected(false);
          
          // Attempt to reconnect after a delay
          setTimeout(() => {
            es.close();
            connectToEventStream();
          }, 3000);
        };


        
        return () => {
          es.close();
        };
      } catch (error) {
        console.error('Failed to connect to event stream:', error);
        setIsConnected(false);
      }
    };

    const cleanup = connectToEventStream();
    
    return cleanup;
  }, [sessionId, onStatusUpdate]);

  // Safety check for empty or undefined agents array
  if (!agents || agents.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-4', className)}>
        <p className="text-sm text-muted-foreground">Initializing agents...</p>
        {isConnected && (
          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  // Get the most recent status for each agent
  const getAgentStatus = (agent: Agent): AgentExecutionStatus | null => {
    const status = agentStatuses.get(agent.id);
    return status || null;
  };

  // Determine the visual status based on both agent data and real-time status
  const getVisualStatus = (agent: Agent): AgentStatus => {
    const realtimeStatus = getAgentStatus(agent);
    
    if (realtimeStatus) {
      switch (realtimeStatus.status) {
        case 'pending':
          return 'waiting';
        case 'running':
          return 'running';
        case 'retrying':
          return 'running';
        case 'completed':
          return 'done';
        case 'failed':
          return 'error';
        default:
          break;
      }
    }
    
    // Fallback to agent's own status
    return agent.status || 'waiting';
  };

  // Get progress from real-time status
  const getProgress = (agent: Agent): number => {
    const realtimeStatus = getAgentStatus(agent);
    return realtimeStatus?.progress || 0;
  };

  // Get status message
  const getStatusMessage = (agent: Agent): string | undefined => {
    const realtimeStatus = getAgentStatus(agent);
    return realtimeStatus?.message;
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          )} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {sessionId && (
          <span className="text-xs text-muted-foreground font-mono">
            Session: {sessionId.substring(0, 8)}...
          </span>
        )}
      </div>

      {/* Agent Timeline */}
      <div className="flex items-center justify-between">
        {agents.map((agent, index) => {
          // Safely access agent config with proper fallback
          const config = agent?.type && AGENT_CONFIG[agent.type] 
            ? AGENT_CONFIG[agent.type]
            : {
                name: agent?.name || 'Unknown Agent',
                description: agent?.description || '',
                icon: '🤖',
              };
          
          const isLast = index === agents.length - 1;
          const visualStatus = getVisualStatus(agent) as keyof typeof statusColors;
          const progress = getProgress(agent);
          const statusMessage = getStatusMessage(agent);
          const realtimeStatus = getAgentStatus(agent);

          return (
            <React.Fragment key={agent.id}>
              <div className="flex flex-col items-center gap-2">
                {/* Agent Icon with Status Indicator */}
                <div className="relative">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full text-lg transition-all duration-300',
                      statusColors[visualStatus]
                    )}
                  >
                    {config.icon}
                  </div>
                  
                  {/* Progress Ring */}
                  {progress > 0 && progress < 100 && (
                    <div className="absolute -inset-1">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-200"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${2 * Math.PI * 10}`}
                          strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                          className={cn(
                            'transition-all duration-300',
                            visualStatus === 'running' ? 'text-primary' : 'text-gray-400'
                          )}
                        />
                      </svg>
                    </div>
                  )}
                  
                  {/* Error Indicator */}
                  {visualStatus === 'error' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">!</span>
                    </div>
                  )}
                  
                  {/* Retry Indicator */}
                  {visualStatus === 'running' && realtimeStatus?.status === 'retrying' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">↻</span>
                    </div>
                  )}
                </div>

                {/* Agent Name */}
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {config.name.split(' ')[0]}
                </span>

                {/* Status Message */}
                {statusMessage && (
                  <span className="text-xs text-muted-foreground text-center max-w-20 truncate">
                    {statusMessage}
                  </span>
                )}

                {/* Progress Percentage */}
                {progress > 0 && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-all duration-300',
                    visualStatus === 'done' || visualStatus === 'completed' ? lineColors.completed : lineColors.waiting
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Real-time Status Details */}
      {agentStatuses.size > 0 && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Real-time Status</h4>
          <div className="space-y-1">
            {Array.from(agentStatuses.entries()).map(([agentId, status]) => {
              const agent = agents.find(a => a.id === agentId);
              const config = agent?.type && AGENT_CONFIG[agent.type] 
                ? AGENT_CONFIG[agent.type]
                : { name: agent?.name || 'Unknown Agent', description: '', icon: '🤖' };

              return (
                <div key={agentId} className="flex items-center justify-between text-xs">
                  <span className="font-medium">{config.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-2 py-1 rounded text-white',
                      statusColors[status.status as keyof typeof statusColors] || 'bg-gray-500'
                    )}>
                      {status.status}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(status.progress)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
