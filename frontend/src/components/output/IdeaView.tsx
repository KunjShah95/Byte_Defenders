import React from 'react';
import { AgentOutput } from '@/types/agent.types';
import { Card, CardContent } from '@/components/common/Card';

interface IdeaViewProps {
  output: AgentOutput;
}

export function IdeaView({ output }: IdeaViewProps) {
  const data = output.structuredData as {
    conceptName?: string;
    targetAudience?: string;
    uniqueValue?: string;
    implementationPath?: string[];
  };

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardContent className="pt-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Generated Concept</h4>
          <p className="text-sm text-foreground">{output.content}</p>
        </CardContent>
      </Card>

      {data && (
        <Card variant="glass">
          <CardContent className="pt-4 space-y-4">
            {data.conceptName && (
              <div>
                <span className="text-xs text-muted-foreground">Concept Name</span>
                <p className="text-sm font-semibold">{data.conceptName}</p>
              </div>
            )}
            {data.targetAudience && (
              <div>
                <span className="text-xs text-muted-foreground">Target Audience</span>
                <p className="text-sm">{data.targetAudience}</p>
              </div>
            )}
            {data.uniqueValue && (
              <div>
                <span className="text-xs text-muted-foreground">Unique Value</span>
                <p className="text-sm">{data.uniqueValue}</p>
              </div>
            )}
            {data.implementationPath && (
              <div>
                <span className="text-xs text-muted-foreground">Implementation Path</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.implementationPath.map((step, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      <span className="font-mono">{index + 1}</span>
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Score</span>
        <span className="font-mono font-semibold text-primary">{output.score?.toFixed(1)}</span>
      </div>
      {output.reasoning && (
        <p className="text-xs text-muted-foreground italic">{output.reasoning}</p>
      )}
    </div>
  );
}
