import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/store/session.context';
import { UseCase, USE_CASE_LABELS } from '@/types/session.types';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';

export default function HomePage() {
  const navigate = useNavigate();
  const { createSession, runSession, isLoading, error } = useSession();

  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState<UseCase>('startup');
  const [explainabilityMode, setExplainabilityMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const sessionId = await createSession({
        prompt: prompt.trim(),
        useCase,
        explainabilityMode,
      });
      runSession(sessionId);
      navigate(`/dashboard/${sessionId}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            The Orchestra Studio - AI Agent System
          </h1>
          <p className="text-muted-foreground">
            Harness the power of collaborative AI agents to refine and elevate your ideas
          </p>
        </div>

        <Card variant="glass" className="backdrop-blur-md">
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
            <CardDescription>
              Describe your idea and let our agents collaborate to enhance it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-foreground mb-2">
                  Describe your idea or problem
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a sustainable food delivery platform that reduces environmental impact..."
                  className="w-full h-32 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="useCase" className="block text-sm font-medium text-foreground mb-2">
                  Use Case
                </label>
                <select
                  id="useCase"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value as UseCase)}
                  className="w-full h-10 px-4 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                >
                  {Object.entries(USE_CASE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="explainability"
                  checked={explainabilityMode}
                  onChange={(e) => setExplainabilityMode(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary focus:ring-offset-background"
                />
                <label htmlFor="explainability" className="text-sm text-foreground">
                  Enable Explainability Mode
                  <span className="block text-xs text-muted-foreground">
                    See detailed reasoning behind each agent's decisions
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                Generate with AI Agents
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Button variant="ghost" onClick={() => navigate('/history')}>
            View Session History →
          </Button>
        </div>
      </div>
    </div>
  );
}
