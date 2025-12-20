import React from 'react';
import { AgentOutput } from '@/types/agent.types';
import { Card, CardContent } from '@/components/common/Card';

interface RefinerViewProps {
  output: AgentOutput;
}

export function RefinerView({ output }: RefinerViewProps) {
  const data = output.structuredData as {
    improvements?: string[];
    beforeScore?: number;
    afterScore?: number;
    iterationsNeeded?: number;
  };

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardContent className="pt-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Refinement Summary</h4>
          <p className="text-sm text-foreground">{output.content}</p>
        </CardContent>
      </Card>

      {data?.improvements && (
        <Card variant="glass">
          <CardContent className="pt-4">
            <h5 className="text-xs font-semibold text-success mb-3">Improvements Made</h5>
            <ul className="space-y-2">
              {data.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-success">✓</span>
                  <span className="text-foreground">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {data && (data.beforeScore !== undefined || data.afterScore !== undefined) && (
        <Card variant="glass">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Before</p>
                <p className="text-2xl font-mono font-bold text-muted-foreground">
                  {data.beforeScore?.toFixed(1)}
                </p>
              </div>
              <div className="text-2xl text-success">→</div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">After</p>
                <p className="text-2xl font-mono font-bold text-success">
                  {data.afterScore?.toFixed(1)}
                </p>
              </div>
            </div>
            {data.iterationsNeeded !== undefined && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Completed in {data.iterationsNeeded} iterations
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Final Score</span>
        <span className="font-mono font-semibold text-success">{output.score?.toFixed(1)}</span>
      </div>
      {output.reasoning && (
        <p className="text-xs text-muted-foreground italic">{output.reasoning}</p>
      )}
    </div>
  );
}
