import React from 'react';
import { SessionResult } from '@/types/session.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { toast } from 'sonner';

interface FinalOutputViewProps {
  result: SessionResult;
  onStartNew?: () => void;
}

export function FinalOutputView({ result, onStartNew }: FinalOutputViewProps) {
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    toast.success('JSON copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card variant="elevated" className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{result.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Overview</h4>
            <p className="text-foreground">{result.overview}</p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Key Points</h4>
            <ul className="space-y-2">
              {result.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg bg-success/10 p-4 border border-success/20">
            <h4 className="text-sm font-semibold text-success mb-2">Final Recommendation</h4>
            <p className="text-foreground">{result.recommendation}</p>
          </section>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Average Score</span>
                <span className="ml-2 font-mono font-bold text-primary">{result.avgScore.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Iterations</span>
                <span className="ml-2 font-mono font-bold text-foreground">{result.iterations}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={handleCopyJson}>
          Copy JSON
        </Button>
        {onStartNew && (
          <Button onClick={onStartNew}>
            Start New Session
          </Button>
        )}
      </div>
    </div>
  );
}
