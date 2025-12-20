import React from 'react';
import { AgentOutput } from '@/types/agent.types';
import { Card, CardContent } from '@/components/common/Card';
import { cn } from '@/lib/utils';

interface CriticViewProps {
  output: AgentOutput;
}

export function CriticView({ output }: CriticViewProps) {
  const data = output.structuredData as {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };

  const sections = [
    { key: 'strengths', label: 'Strengths', color: 'text-success', bgColor: 'bg-success/10' },
    { key: 'weaknesses', label: 'Weaknesses', color: 'text-destructive', bgColor: 'bg-destructive/10' },
    { key: 'opportunities', label: 'Opportunities', color: 'text-primary', bgColor: 'bg-primary/10' },
    { key: 'threats', label: 'Threats', color: 'text-warning', bgColor: 'bg-warning/10' },
  ];

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardContent className="pt-4">
          <h4 className="text-sm font-semibold text-primary mb-2">Critique Summary</h4>
          <p className="text-sm text-foreground">{output.content}</p>
        </CardContent>
      </Card>

      {data && (
        <div className="grid grid-cols-2 gap-3">
          {sections.map(({ key, label, color, bgColor }) => {
            const items = data[key as keyof typeof data];
            if (!items || items.length === 0) return null;

            return (
              <Card key={key} variant="glass" className="p-3">
                <h5 className={cn('text-xs font-semibold mb-2', color)}>{label}</h5>
                <ul className="space-y-1">
                  {items.map((item, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className={cn('mt-1 h-1.5 w-1.5 rounded-full shrink-0', bgColor.replace('/10', ''))} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
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
